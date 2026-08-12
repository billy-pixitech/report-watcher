import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StatusBadge, reportTone } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  RefreshCw,
  X,
  FileText,
  FileSpreadsheet,
  Users,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import type { Report, ItemTone, ChecklistStatus, ReportJobStatus } from "@/lib/mock-data";
import { reportJobs } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const itemIcon: Record<string, typeof FileText> = {
  "Final Report": FileText,
  "Master Report": FileSpreadsheet,
  "Lead Reports": Users,
  "Power BI": BarChart3,
};

const itemTone: Record<ItemTone, { dot: string; text: string }> = {
  draft: { dot: "bg-warning", text: "text-warning-foreground" },
  final: { dot: "bg-success", text: "text-success-foreground" },
  failed: { dot: "bg-danger", text: "text-danger-foreground" },
};

const checkOrder: Record<ChecklistStatus, number> = { Failed: 0, Pending: 1, Completed: 2 };

const checkVisual: Record<ChecklistStatus, { Icon: typeof CheckCircle2; color: string }> = {
  Failed: { Icon: AlertCircle, color: "text-danger" },
  Pending: { Icon: Clock, color: "text-muted-foreground" },
  Completed: { Icon: CheckCircle2, color: "text-success" },
};

const jobTone: Record<ReportJobStatus, "success" | "warning" | "danger" | "muted" | "info"> = {
  Scheduled: "muted",
  Running: "info",
  Retrying: "warning",
  Success: "success",
  Failed: "danger",
};

const jobOrder: Record<ReportJobStatus, number> = {
  Failed: 0,
  Retrying: 1,
  Running: 2,
  Scheduled: 3,
  Success: 4,
};

export function ReportDrawer({
  report,
  open,
  onOpenChange,
}: {
  report: Report | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const checks = report ? [...report.checklist].sort((a, b) => checkOrder[a.status] - checkOrder[b.status]) : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-[560px] flex-col gap-0 overflow-hidden border-l border-border bg-background p-0 shadow-drawer sm:max-w-[560px] [&>button]:hidden"
      >
        {report ? (
          <>
            <div className="border-b border-border bg-card px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-foreground">{report.title}</h2>
                  <p className="tabular mt-1 text-xs text-muted-foreground">
                    {report.frequency} • {report.category === "PBI" ? "PBI" : "Performance"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatusBadge tone={reportTone(report.status)} label={report.status} />
                  <button
                    onClick={() => onOpenChange(false)}
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-border bg-surface px-3 py-2.5">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Period</div>
                  <div className="tabular mt-1 text-sm text-foreground">{report.period}</div>
                </div>
                <div
                  className={cn(
                    "rounded-lg border px-3 py-2.5",
                    report.checklistDone === report.checklistTotal
                      ? "border-success/50 bg-success-soft"
                      : report.checklistDone === 0
                        ? "border-border bg-surface"
                        : "border-warning/50 bg-warning-soft",
                  )}
                >
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Checks</div>
                  <div className="tabular mt-1 text-sm text-foreground">
                    {report.checklistDone} / {report.checklistTotal}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-surface px-3 py-2.5">
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    Last updated
                  </div>
                  <div className="tabular mt-1 text-sm text-foreground">{report.lastUpdatedFull}</div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
              <section>
                <h3 className="text-sm font-semibold text-foreground">Checks</h3>
                <ul className="mt-3 space-y-px overflow-hidden rounded-xl border border-border bg-card">
                  {checks.map((c) => {
                    const { Icon, color } = checkVisual[c.status];
                    const failed = c.status === "Failed";
                    return (
                      <li key={c.name} className="flex items-start gap-3 border-b border-border px-4 py-3 last:border-0">
                        <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} />
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-foreground">{c.name}</div>
                          <div className={`mt-0.5 text-xs ${failed ? "font-medium text-danger" : "text-muted-foreground"}`}>
                            {c.summary}
                          </div>
                        </div>
                      </li>
                    );
                  })}

                </ul>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-foreground">Deliverables</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Generated outputs for this report</p>
                <div className="mt-3 space-y-2">
                  {report.generated.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
                      No items generated yet.
                    </div>
                  ) : (
                    report.generated.map((g) => {
                      const Icon = itemIcon[g.name] ?? FileText;
                      const failed = g.tone === "failed";
                      return (
                        <a
                          key={g.name}
                          href={g.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3.5 transition-colors hover:border-foreground/20 hover:bg-surface"
                        >
                          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
                            <Icon className="size-3.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                                {g.name}
                                <ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                              </span>
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-medium ${itemTone[g.tone].text}`}
                              >
                                <span className={`size-1.5 rounded-full ${itemTone[g.tone].dot}`} />
                                {g.result}
                              </span>
                            </div>
                            {g.lines.map((l) => (
                              <div
                                key={l}
                                className={`mt-1 truncate text-xs ${failed ? "font-medium text-danger" : "text-muted-foreground"}`}
                              >
                                {l}
                              </div>
                            ))}
                          </div>
                        </a>
                      );
                    })

                  )}
                </div>
              </section>
            </div>

            <div className="border-t border-border bg-card px-6 py-4">
              <Button size="sm" className="h-9 w-full gap-1.5 text-xs">
                <RefreshCw className="size-3.5" />
                Regenerate
              </Button>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
