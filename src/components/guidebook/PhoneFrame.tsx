import { cn } from "@/lib/utils";

/** Realistic smartphone frame that wraps content like a device screen. */
export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[390px]",
        className,
      )}
    >
      {/* Device shadow / glow */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[4rem] bg-primary/10 blur-3xl" />

      {/* Outer bezel */}
      <div className="rounded-[3.25rem] border border-border/80 bg-foreground p-3 shadow-lift">
        {/* Inner screen */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-background">
          {/* Notch / dynamic island */}
          <div className="absolute top-3 left-1/2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-foreground" />

          {/* Status bar time / indicators placeholder */}
          <div className="absolute top-3 left-6 z-10 flex items-center gap-1 text-[11px] font-semibold text-background">
            <span>9:41</span>
          </div>
          <div className="absolute top-3 right-6 z-10 flex items-center gap-1 text-background">
            <SignalIcon className="size-3.5" />
            <WifiIcon className="size-3.5" />
            <BatteryIcon className="size-4" />
          </div>

          {/* Screen content */}
          <div className="h-[800px] overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 22h20V2L2 22z" />
    </svg>
  );
}

function WifiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 18c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-5.27-4.72l1.41 1.41C9.84 13.4 10.84 13 12 13s2.16.4 2.86 1.69l1.41-1.41C16.14 11.56 14.21 11 12 11s-4.14.56-5.27 2.28zM7.1 9.03l1.41 1.41C9.65 8.65 10.77 8 12 8s2.35.65 3.49 2.44l1.41-1.41C15.64 6.56 13.95 6 12 6s-3.64.56-5.9 3.03z" />
    </svg>
  );
}

function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 5H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm1 12H6V7h12v10zM21 9v6h-2V9h2z" />
    </svg>
  );
}
