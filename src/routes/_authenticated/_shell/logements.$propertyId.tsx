import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { BookOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  PropertyForm,
  type PropertyFormValues,
} from "@/components/dashboard/PropertyForm";
import { useAppCopy } from "@/hooks/use-app-copy";
import { deleteProperty, getProperty, updateProperty } from "@/lib/properties.functions";
import { createGuide } from "@/lib/guides.functions";

export const Route = createFileRoute("/_authenticated/_shell/logements/$propertyId")({
  head: () => ({
    meta: [{ title: "Modifier un logement — Dalal" }, { name: "robots", content: "noindex" }],
  }),
  component: EditPropertyPage,
});

function EditPropertyPage() {
  const copy = useAppCopy();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { propertyId } = useParams({
    from: "/_authenticated/_shell/logements/$propertyId",
  });

  const fetchProperty = useServerFn(getProperty);
  const update = useServerFn(updateProperty);
  const remove = useServerFn(deleteProperty);
  const addGuide = useServerFn(createGuide);

  const property = useQuery({
    queryKey: ["property", propertyId],
    queryFn: () => fetchProperty({ data: { id: propertyId } }),
  });

  const updateMutation = useMutation({
    mutationFn: (values: PropertyFormValues) =>
      update({ data: { ...values, id: propertyId } }),
    onSuccess: () => {
      toast.success(copy.properties.updated);
      void queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      void queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : copy.errorGeneric),
  });

  const deleteMutation = useMutation({
    mutationFn: () => remove({ data: { id: propertyId } }),
    onSuccess: () => {
      toast.success(copy.properties.deleted);
      void queryClient.invalidateQueries({ queryKey: ["properties"] });
      navigate({ to: "/logements" });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : copy.errorGeneric),
  });

  const guideMutation = useMutation({
    mutationFn: () => addGuide({ data: { propertyId } }),
    onSuccess: () => {
      toast.success(copy.properties.guideCreated);
      void queryClient.invalidateQueries({ queryKey: ["guides"] });
      navigate({ to: "/livrets" });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : copy.errorGeneric),
  });

  if (property.isLoading) {
    return <p className="text-sm text-muted-foreground">{copy.loading}</p>;
  }
  if (property.isError || !property.data) {
    return <p className="text-sm text-destructive">{copy.errorGeneric}</p>;
  }

  const data = property.data;

  return (
    <>
      <PageHeader
        title={data.name}
        description={copy.properties.editTitle}
        action={
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              disabled={guideMutation.isPending}
              onClick={() => guideMutation.mutate()}
            >
              <BookOpen className="mr-1.5 size-4" />
              {copy.dashboard.createGuide}
            </Button>
            <Button
              variant="ghost"
              className="rounded-full text-destructive hover:text-destructive"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (window.confirm(copy.properties.deleteConfirm)) {
                  deleteMutation.mutate();
                }
              }}
            >
              <Trash2 className="mr-1.5 size-4" />
              {copy.properties.delete}
            </Button>
          </div>
        }
      />

      <PropertyForm
        initial={{
          name: data.name,
          type: data.type,
          address: data.address,
          city: data.city,
          country: data.country,
          description: data.description,
          coverImagePath: data.cover_image_url,
          phone: data.phone,
          whatsapp: data.whatsapp,
          wifiName: data.wifi_name,
          wifiPassword: data.wifi_password,
          checkinTime: data.checkin_time,
          checkoutTime: data.checkout_time,
          status: data.status,
        }}
        submitting={updateMutation.isPending}
        onSubmit={(values) => updateMutation.mutate(values)}
        onCancel={() => navigate({ to: "/logements" })}
      />
    </>
  );
}
