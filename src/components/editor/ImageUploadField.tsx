import { useRef, useState } from "react";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const YEAR_IN_SECONDS = 60 * 60 * 24 * 365;

/** Upload field for guide visuals: stores a long-lived signed URL. */
export function ImageUploadField({
  label,
  value,
  onChange,
  round,
}: {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  round?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) throw new Error("Session expirée");
      const extension = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/guides/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage
        .from("property-images")
        .upload(path, file, { upsert: false });
      if (error) throw error;
      const { data: signed, error: signedError } = await supabase.storage
        .from("property-images")
        .createSignedUrl(path, YEAR_IN_SECONDS);
      if (signedError) throw signedError;
      onChange(signed.signedUrl);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload impossible");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div
          className={`flex size-16 shrink-0 items-center justify-center overflow-hidden border border-border bg-secondary text-muted-foreground ${round ? "rounded-full" : "rounded-xl"}`}
        >
          {value ? (
            <img src={value} alt={label} className="size-full object-cover" />
          ) : (
            <ImageIcon className="size-5" aria-hidden />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void handleUpload(file);
              event.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="mr-1.5 size-4 animate-spin" />
            ) : (
              <Upload className="mr-1.5 size-4" />
            )}
            {value ? "Remplacer" : "Importer"}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => onChange(null)}
            >
              <Trash2 className="mr-1.5 size-4" />
              Retirer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
