import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "muted" | "info";

const toneClass: Record<Tone, string> = {
  success: "bg-success-soft text-success-foreground ring-success/20",
  warning: "bg-warning-soft text-warning-foreground ring-warning/25",
  danger: "bg-danger-soft text-danger-foreground ring-danger/20",
  info: "bg-info-soft text-primary ring-primary/20",
  muted: "bg-secondary text-muted-foreground ring-border",
};

const dotClass: Record<Tone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  muted: "bg-muted-foreground/50",
};

export function StatusBadge({
  tone,
  label,
  detail,
  className,
}: {
  tone: Tone;
  label: string;
  detail?: string;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
          toneClass[tone],
          className,
        )}
      >
        <span className={cn("size-1.5 rounded-full", dotClass[tone])} />
        {label}
      </span>
      {detail ? <span className="text-xs text-muted-foreground">• {detail}</span> : null}
    </span>
  );
}

export const reportTone: Record<string, Tone> = {
  Published: "success",
  Draft: "warning",
  Failed: "danger",
  "Not Started": "muted",
  Completed: "success",
  Pending: "muted",
  Healthy: "success",
  Warning: "warning",
};