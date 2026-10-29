import { useState } from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/i18n/LanguageProvider";
import { editorCopy } from "@/i18n/editorCopy";
import { RECOMMENDATION_CATEGORIES } from "@/lib/guide-schema";
import type { PreviewRecommendation } from "@/components/editor/GuidePreview";

export interface RecommendationDraft {
  id?: string;
  category: string;
  name: string;
  description: string;
  photo_url: string;
  address: string;
  latitude: string;
  longitude: string;
  phone: string;
  whatsapp: string;
  website: string;
  instagram: string;
}

const emptyDraft = (): RecommendationDraft => ({
  category: "restaurants",
  name: "",
  description: "",
  photo_url: "",
  address: "",
  latitude: "",
  longitude: "",
  phone: "",
  whatsapp: "",
  website: "",
  instagram: "",
});

const toDraft = (item: PreviewRecommendation): RecommendationDraft => ({
  id: item.id,
  category: item.category,
  name: item.name,
  description: item.description ?? "",
  photo_url: item.photo_url ?? "",
  address: item.address ?? "",
  latitude: item.latitude == null ? "" : String(item.latitude),
  longitude: item.longitude == null ? "" : String(item.longitude),
  phone: item.phone ?? "",
  whatsapp: item.whatsapp ?? "",
  website: item.website ?? "",
  instagram: item.instagram ?? "",
});

/** Local-guide recommendations attached to the property. */
export function RecommendationsPanel({
  recommendations,
  onSave,
  onDelete,
}: {
  recommendations: PreviewRecommendation[];
  onSave: (draft: RecommendationDraft) => void;
  onDelete: (id: string) => void;
}) {
  const { lang } = useLanguage();
  const copy = editorCopy[lang];
  const [draft, setDraft] = useState<RecommendationDraft | null>(null);

  const set = (patch: Partial<RecommendationDraft>) =>
    setDraft((current) => (current ? { ...current, ...patch } : current));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-card-foreground">
          {copy.recommendations}
        </h3>
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => setDraft(emptyDraft())}
        >
          <Plus className="mr-1.5 size-3.5" />
          {copy.addRecommendation}
        </Button>
      </div>

      {recommendations.length === 0 && !draft ? (
        <p className="rounded-2xl border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
          {copy.noRecommendations}
        </p>
      ) : null}

      <ul className="space-y-2">
        {recommendations.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            {item.photo_url ? (
              <img
                src={item.photo_url}
                alt=""
                className="size-12 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <MapPin className="size-4" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-card-foreground">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {RECOMMENDATION_CATEGORIES.find((c) => c.value === item.category)?.label[
                  lang
                ] ?? item.category}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 rounded-lg text-muted-foreground"
              onClick={() => setDraft(toDraft(item))}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 rounded-lg text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </li>
        ))}
      </ul>

      {draft ? (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{copy.category}</Label>
              <select
                value={draft.category}
                onChange={(event) => set({ category: event.target.value })}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
              >
                {RECOMMENDATION_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label[lang]}
                  </option>
                ))}
              </select>
            </div>
            <TextRow
              label={copy.name}
              value={draft.name}
              onChange={(name) => set({ name })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={draft.description}
              onChange={(event) => set({ description: event.target.value })}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <TextRow
              label="Photo (URL)"
              value={draft.photo_url}
              onChange={(photo_url) => set({ photo_url })}
            />
            <TextRow
              label="Adresse"
              value={draft.address}
              onChange={(address) => set({ address })}
            />
            <TextRow
              label="Latitude"
              value={draft.latitude}
              onChange={(latitude) => set({ latitude })}
            />
            <TextRow
              label="Longitude"
              value={draft.longitude}
              onChange={(longitude) => set({ longitude })}
            />
            <TextRow
              label="Téléphone"
              value={draft.phone}
              onChange={(phone) => set({ phone })}
            />
            <TextRow
              label="WhatsApp"
              value={draft.whatsapp}
              onChange={(whatsapp) => set({ whatsapp })}
            />
            <TextRow
              label={copy.website}
              value={draft.website}
              onChange={(website) => set({ website })}
            />
            <TextRow
              label="Instagram"
              value={draft.instagram}
              onChange={(instagram) => set({ instagram })}
            />
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="rounded-full"
              disabled={!draft.name.trim()}
              onClick={() => {
                onSave(draft);
                setDraft(null);
              }}
            >
              {copy.save}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="rounded-full"
              onClick={() => setDraft(null)}
            >
              {copy.cancel}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TextRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
