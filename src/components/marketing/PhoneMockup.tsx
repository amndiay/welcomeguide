import { Wifi, KeyRound, MapPin, DoorOpen, QrCode } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageProvider";

/** Realistic smartphone frame showing a Dalal guidebook. */
export function PhoneMockup() {
  const { t } = useLanguage();

  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      <div className="pointer-events-none absolute -inset-10 -z-10 rounded-full bg-primary/15 blur-3xl" />
      <div className="rounded-[2.75rem] border border-border bg-foreground/90 p-2.5 shadow-lift">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-background">
          <div className="absolute top-2 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/90" />

          <div className="gradient-primary px-5 pt-10 pb-8">
            <p className="text-[11px] font-medium tracking-wide text-primary-foreground/75 uppercase">
              {t.mockup.label}
            </p>
            <p className="mt-1 text-lg font-semibold text-primary-foreground">
              Villa Teranga
            </p>
            <p className="text-xs text-primary-foreground/80">
              {t.mockup.city}
            </p>
          </div>

          <div className="space-y-2.5 px-4 py-4">
            <Row icon={Wifi} title={t.mockup.wifi} value="Villa-Teranga-5G" />
            <Row
              icon={KeyRound}
              title={t.mockup.arrival}
              value={t.mockup.arrivalValue}
            />
            <Row
              icon={MapPin}
              title={t.mockup.localGuide}
              value={t.mockup.localGuideValue}
            />
            <Row
              icon={DoorOpen}
              title={t.mockup.departure}
              value={t.mockup.departureValue}
            />

            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-dashed border-primary/40 bg-primary-soft p-3">
              <QrCode className="size-8 text-primary-deep" />
              <p className="text-[11px] leading-snug text-primary-deep">
                {t.mockup.qr}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  title,
  value,
}: {
  icon: typeof Wifi;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
      <span className="flex size-8 items-center justify-center rounded-xl bg-secondary text-primary">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{title}</p>
        <p className="truncate text-xs font-semibold text-card-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}
