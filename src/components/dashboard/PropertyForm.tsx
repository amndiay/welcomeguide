import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyImage } from "@/components/dashboard/PropertyImage";
import { useAppCopy } from "@/hooks/use-app-copy";
import { supabase } from "@/integrations/supabase/client";
import type {
  PropertyInput,
  PropertyStatus,
  PropertyType,
} from "@/lib/properties.functions";
import { toast } from "sonner";

const TYPES: PropertyType[] = [
  "apartment",
  "villa",
  "house",
  "studio",
  "room",
  "other",
];
const STATUSES: PropertyStatus[] = ["draft", "active", "archived"];

export interface PropertyFormValues extends PropertyInput {}

export function PropertyForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<PropertyFormValues>;
  submitting?: boolean;
  onSubmit: (values: PropertyFormValues) => void;
  onCancel: () => void;
}) {
  const copy = useAppCopy();
  const [values, setValues] = useState<PropertyFormValues>({
    name: initial?.name ?? "",
    type: initial?.type ?? "apartment",
    address: initial?.address ?? "",
    city: initial?.city ?? "",
    country: initial?.country ?? "",
    description: initial?.description ?? "",
    coverImagePath: initial?.coverImagePath ?? null,
    phone: initial?.phone ?? "",
    whatsapp: initial?.whatsapp ?? "",
    wifiName: initial?.wifiName ?? "",
    wifiPassword: initial?.wifiPassword ?? "",
    checkinTime: initial?.checkinTime ?? "",
    checkoutTime: initial?.checkoutTime ?? "",
    status: initial?.status ?? "draft",
  });
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof PropertyFormValues>(
    key: K,
    value: PropertyFormValues[K],
  ) => setValues((previous) => ({ ...previous, [key]: value }));

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Session expirée");
      const extension = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage
        .from("property-images")
        .upload(path, file, { upsert: false });
      if (error) throw error;
      set("coverImagePath", path);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.errorGeneric);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
    >
      <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">{copy.properties.name}</Label>
          <Input
            id="name"
            required
            value={values.name}
            onChange={(event) => set("name", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>{copy.properties.type}</Label>
          <Select
            value={values.type ?? "apartment"}
            onValueChange={(value) => set("type", value as PropertyType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {copy.propertyTypes[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{copy.properties.status}</Label>
          <Select
            value={values.status ?? "draft"}
            onValueChange={(value) => set("status", value as PropertyStatus)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((status) => (
                <SelectItem key={status} value={status}>
                  {copy.status[status]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">{copy.properties.address}</Label>
          <Input
            id="address"
            value={values.address ?? ""}
            onChange={(event) => set("address", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{copy.properties.city}</Label>
          <Input
            id="city"
            value={values.city ?? ""}
            onChange={(event) => set("city", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">{copy.properties.country}</Label>
          <Input
            id="country"
            value={values.country ?? ""}
            onChange={(event) => set("country", event.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">{copy.properties.description}</Label>
          <Textarea
            id="description"
            rows={4}
            value={values.description ?? ""}
            onChange={(event) => set("description", event.target.value)}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="cover">{copy.properties.photo}</Label>
          <div className="flex items-center gap-4">
            <PropertyImage
              path={values.coverImagePath}
              alt={values.name || copy.properties.photo}
              className="size-20 shrink-0 rounded-2xl"
            />
            <div>
              <input
                id="cover"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                disabled={uploading}
                onClick={() => document.getElementById("cover")?.click()}
              >
                {uploading ? (
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                ) : (
                  <Upload className="mr-1.5 size-4" />
                )}
                {copy.properties.photo}
              </Button>
              <p className="mt-1 text-xs text-muted-foreground">
                {copy.properties.photoHint}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">{copy.properties.phone}</Label>
          <Input
            id="phone"
            value={values.phone ?? ""}
            onChange={(event) => set("phone", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">{copy.properties.whatsapp}</Label>
          <Input
            id="whatsapp"
            value={values.whatsapp ?? ""}
            onChange={(event) => set("whatsapp", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wifiName">{copy.properties.wifiName}</Label>
          <Input
            id="wifiName"
            value={values.wifiName ?? ""}
            onChange={(event) => set("wifiName", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="wifiPassword">{copy.properties.wifiPassword}</Label>
          <Input
            id="wifiPassword"
            value={values.wifiPassword ?? ""}
            onChange={(event) => set("wifiPassword", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkin">{copy.properties.checkin}</Label>
          <Input
            id="checkin"
            placeholder="15:00"
            value={values.checkinTime ?? ""}
            onChange={(event) => set("checkinTime", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkout">{copy.properties.checkout}</Label>
          <Input
            id="checkout"
            placeholder="11:00"
            value={values.checkoutTime ?? ""}
            onChange={(event) => set("checkoutTime", event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" className="rounded-full" disabled={submitting}>
          {submitting && <Loader2 className="mr-1.5 size-4 animate-spin" />}
          {copy.properties.save}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="rounded-full"
          onClick={onCancel}
        >
          {copy.properties.cancel}
        </Button>
      </div>
    </form>
  );
}
