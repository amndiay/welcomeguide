import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageProvider";
import { BLOCK_DEF_MAP, type FieldDef } from "@/lib/guide-schema";

export type BlockContent = Record<string, unknown>;

interface Pair {
  label: string;
  value: string;
}
interface Rule {
  label: string;
  enabled: boolean;
}

/** Renders the form of a block, driven by its type definition. */
export function BlockFields({
  type,
  content,
  onChange,
}: {
  type: string;
  content: BlockContent;
  onChange: (next: BlockContent) => void;
}) {
  const { lang } = useLanguage();
  const def = BLOCK_DEF_MAP[type];
  if (!def) return null;

  const set = (key: string, value: unknown) => onChange({ ...content, [key]: value });

  return (
    <div className="space-y-4">
      {def.fields.map((field) => (
        <Field
          key={field.key}
          field={field}
          label={field.label[lang]}
          value={content[field.key]}
          onChange={(value) => set(field.key, value)}
        />
      ))}
    </div>
  );
}

function Field({
  field,
  label,
  value,
  onChange,
}: {
  field: FieldDef;
  label: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = `field-${field.key}`;

  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id}>{label}</Label>
        <Textarea
          id={id}
          rows={4}
          value={String(value ?? "")}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    );
  }

  if (field.type === "list") {
    const items = Array.isArray(value) ? (value as string[]) : [];
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(event) => {
                const next = [...items];
                next[index] = event.target.value;
                onChange(next);
              }}
            />
            <IconButton
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              icon={<Trash2 className="size-4" />}
            />
          </div>
        ))}
        <AddRow onClick={() => onChange([...items, ""])} />
      </div>
    );
  }

  if (field.type === "pairs") {
    const items = Array.isArray(value) ? (value as Pair[]) : [];
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {items.map((item, index) => (
          <div key={index} className="flex flex-col gap-2 rounded-xl bg-secondary/50 p-2">
            <div className="flex gap-2">
              <Input
                value={item?.label ?? ""}
                onChange={(event) => {
                  const next = [...items];
                  next[index] = { ...item, label: event.target.value };
                  onChange(next);
                }}
              />
              <IconButton
                onClick={() => onChange(items.filter((_, i) => i !== index))}
                icon={<Trash2 className="size-4" />}
              />
            </div>
            <Textarea
              rows={2}
              value={item?.value ?? ""}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...item, value: event.target.value };
                onChange(next);
              }}
            />
          </div>
        ))}
        <AddRow onClick={() => onChange([...items, { label: "", value: "" }])} />
      </div>
    );
  }

  if (field.type === "rules") {
    const items = Array.isArray(value) ? (value as Rule[]) : [];
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 rounded-xl bg-secondary/50 px-3 py-2"
          >
            <Switch
              checked={Boolean(item?.enabled)}
              onCheckedChange={(checked) => {
                const next = [...items];
                next[index] = { ...item, enabled: checked };
                onChange(next);
              }}
            />
            <Input
              className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              value={item?.label ?? ""}
              onChange={(event) => {
                const next = [...items];
                next[index] = { ...item, label: event.target.value };
                onChange(next);
              }}
            />
            <IconButton
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              icon={<Trash2 className="size-4" />}
            />
          </div>
        ))}
        <AddRow onClick={() => onChange([...items, { label: "", enabled: true }])} />
      </div>
    );
  }

  const inputType =
    field.type === "number"
      ? "number"
      : field.type === "tel"
        ? "tel"
        : field.type === "time"
          ? "time"
          : "text";

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={inputType}
        value={value == null ? "" : String(value)}
        placeholder={field.placeholder}
        onChange={(event) =>
          onChange(
            field.type === "number"
              ? event.target.value === ""
                ? null
                : Number(event.target.value)
              : event.target.value,
          )
        }
      />
    </div>
  );
}

function IconButton({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="shrink-0 rounded-xl text-muted-foreground"
      onClick={onClick}
    >
      {icon}
    </Button>
  );
}

function AddRow({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      className="rounded-full"
      onClick={onClick}
    >
      <Plus className="mr-1.5 size-3.5" />
      Ajouter
    </Button>
  );
}
