import { ImageUploadField } from "@/components/editor/ImageUploadField";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/i18n/LanguageProvider";
import { editorCopy } from "@/i18n/editorCopy";
import { mergeTheme, type GuideTheme } from "@/lib/guide-schema";

export interface TemplateOption {
  id: string;
  name: string;
  description: string | null;
  configuration: unknown;
}

export interface GuideSettings {
  title: string;
  cover_image_url: string | null;
  logo_url: string | null;
  welcome_message: string | null;
  host_name: string | null;
  host_avatar_url: string | null;
}

const CHOICES = {
  card_style: ["rounded", "soft", "sharp", "flat"],
  button_style: ["pill", "square", "outline"],
  cover_style: ["full", "banner", "portrait", "minimal"],
  nav_style: ["grid", "list"],
} as const;

const FONTS = ["Inter", "Cormorant Garamond", "Kaushan Script", "Georgia"];

/** Right-hand design panel: template, colors, fonts and branding. */
export function ThemePanel({
  theme,
  settings,
  templates,
  templateId,
  onThemeChange,
  onSettingsChange,
  onTemplateChange,
}: {
  theme: GuideTheme;
  settings: GuideSettings;
  templates: TemplateOption[];
  templateId: string | null;
  onThemeChange: (patch: Partial<GuideTheme>) => void;
  onSettingsChange: (patch: Partial<GuideSettings>) => void;
  onTemplateChange: (id: string, theme: GuideTheme) => void;
}) {
  const { lang } = useLanguage();
  const copy = editorCopy[lang];

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground">{copy.template}</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {templates.map((template) => {
            const config = (template.configuration ?? {}) as {
              key?: string;
              theme?: Partial<GuideTheme>;
            };
            const preview = mergeTheme({ ...config.theme, template: config.key });
            const selected = templateId === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => onTemplateChange(template.id, preview)}
                className={`rounded-2xl border p-3 text-left transition-colors ${selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}
              >
                <div className="mb-2 flex gap-1">
                  {[preview.primary, preview.accent, preview.background].map(
                    (color, colorIndex) => (
                      <span
                        key={`${template.id}-swatch-${colorIndex}`}
                        className="size-4 rounded-full border border-border"
                        style={{ background: color }}
                      />
                    ),
                  )}

                </div>
                <p className="text-sm font-semibold text-card-foreground">
                  {template.name}
                </p>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground">{copy.colors}</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <ColorField
            label={copy.primary}
            value={theme.primary}
            onChange={(primary) => onThemeChange({ primary })}
          />
          <ColorField
            label={copy.accent}
            value={theme.accent}
            onChange={(accent) => onThemeChange({ accent })}
          />
          <ColorField
            label={copy.background}
            value={theme.background}
            onChange={(background) => onThemeChange({ background })}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground">{copy.fonts}</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Titres"
            value={theme.heading_font}
            options={FONTS}
            onChange={(heading_font) => onThemeChange({ heading_font })}
          />
          <SelectField
            label="Texte"
            value={theme.body_font}
            options={FONTS}
            onChange={(body_font) => onThemeChange({ body_font })}
          />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <SelectField
          label={copy.cardStyle}
          value={theme.card_style}
          options={[...CHOICES.card_style]}
          onChange={(value) =>
            onThemeChange({ card_style: value as GuideTheme["card_style"] })
          }
        />
        <SelectField
          label={copy.buttonStyle}
          value={theme.button_style}
          options={[...CHOICES.button_style]}
          onChange={(value) =>
            onThemeChange({ button_style: value as GuideTheme["button_style"] })
          }
        />
        <SelectField
          label={copy.coverStyle}
          value={theme.cover_style}
          options={[...CHOICES.cover_style]}
          onChange={(value) =>
            onThemeChange({ cover_style: value as GuideTheme["cover_style"] })
          }
        />
        <SelectField
          label={copy.navStyle}
          value={theme.nav_style}
          options={[...CHOICES.nav_style]}
          onChange={(value) =>
            onThemeChange({ nav_style: value as GuideTheme["nav_style"] })
          }
        />
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-card-foreground">
          {copy.editorTab} — {copy.design}
        </h3>
        <div className="space-y-1.5">
          <Label htmlFor="guide-title">{copy.guideTitle}</Label>
          <Input
            id="guide-title"
            value={settings.title}
            onChange={(event) => onSettingsChange({ title: event.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="guide-welcome">{copy.welcomeMessage}</Label>
          <Textarea
            id="guide-welcome"
            rows={3}
            value={settings.welcome_message ?? ""}
            onChange={(event) =>
              onSettingsChange({ welcome_message: event.target.value })
            }
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ImageUploadField
            label={copy.coverImage}
            value={settings.cover_image_url}
            onChange={(cover_image_url) => onSettingsChange({ cover_image_url })}
          />
          <TextField
            label={copy.hostName}
            value={settings.host_name}
            onChange={(host_name) => onSettingsChange({ host_name })}
          />
          <ImageUploadField
            label={copy.hostAvatar}
            value={settings.host_avatar_url}
            onChange={(host_avatar_url) => onSettingsChange({ host_avatar_url })}
            round
          />
        </div>
      </section>
    </div>
  );
}

function ColorField({
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
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="size-9 cursor-pointer rounded-lg border border-border bg-transparent"
          aria-label={label}
        />
        <Input value={value} onChange={(event) => onChange(event.target.value)} />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
