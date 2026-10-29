import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { PageHeader } from "@/components/dashboard/PageHeader";
import {
  PropertyForm,
  type PropertyFormValues,
} from "@/components/dashboard/PropertyForm";
import { useAppCopy } from "@/hooks/use-app-copy";
import { createProperty } from "@/lib/properties.functions";

export const Route = createFileRoute("/_authenticated/_shell/logements/nouveau")({
  head: () => ({
    meta: [{ title: "Nouveau logement — Dalal" }, { name: "robots", content: "noindex" }],
  }),
  component: NewPropertyPage,
});

function NewPropertyPage() {
  const copy = useAppCopy();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const create = useServerFn(createProperty);

  const mutation = useMutation({
    mutationFn: (values: PropertyFormValues) => create({ data: values }),
    onSuccess: (result) => {
      toast.success(copy.properties.created);
      void queryClient.invalidateQueries({ queryKey: ["properties"] });
      void queryClient.invalidateQueries({ queryKey: ["stats"] });
      navigate({ to: "/logements/$propertyId", params: { propertyId: result.id } });
    },
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : copy.errorGeneric),
  });

  return (
    <>
      <PageHeader title={copy.properties.newTitle} description={copy.properties.subtitle} />
      <PropertyForm
        submitting={mutation.isPending}
        onSubmit={(values) => mutation.mutate(values)}
        onCancel={() => navigate({ to: "/logements" })}
      />
    </>
  );
}
