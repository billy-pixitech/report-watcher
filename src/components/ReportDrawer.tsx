import { Sheet, SheetContent } from "@/components/ui/sheet";
import { StatusBadge, reportTone } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { RefreshCw, X } from "lucide-react";
import type { Report, ItemTone } from "@/lib/mock-data";

const itemTone: Record<ItemTone, { dot: string; text: string }> = {
  draft: { dot: "bg-warning", text: "text-warning-foreground" },
  final: { dot: "bg-success", text: "text-success-foreground" },
  failed: { dot: "bg-danger", text: "text-danger-foreground" },
};

function Meta({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground">{value}</div>
    </div>
  );
}

export function ReportDrawer({
  report,
  open,
  onOpenChange,
}: {
  report: Report | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[560px] gap-0 overflow-y-auto border-l border-border bg-background p-0 shadow-drawer sm:max-w-[560px] [&>button]:hidden"
      >
        {report ? (
          <>
            <div className="sticky top-0 z-10 border-b border-border bg-card px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">{report.title}</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {report.category} • {report.frequency}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs">
                    <RefreshCw className="size-3.5" />
                    Regenerate
                  </Button>
                  <button
                    onClick={() => onOpenChange(false)}
                    className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label="Close"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-4 gap-4">
                <Meta label="Frequency" value={report.frequency} />
                <Meta label="Period" value={<span className="tabular">{report.period}</span>} />
                <Meta
                  label="Status"
                  value={<StatusBadge tone={reportTone(report.status)} label={report.status} />}
                />
                <Meta label="Last Updated" value={<span className="tabular">{report.lastUpdatedFull}</span>} />
              </div>
            </div>

            <div className="space-y-8 px-6 py-6">
              <section>
                <h3 className="text-sm font-semibold text-foreground">Checklist</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Required data and prerequisites for report generation.
                </p>
                <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card shadow-card">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                        <th className="px-4 py-2.5 font-medium">Checklist</th>
                        <th className="px-4 py-2.5 font-medium">Status</th>
                        <th className="px-4 py-2.5 font-medium">Summary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.checklist.map((c) => (
                        <tr key={c.name} className="border-b border-border last:border-0">
                          <td className="whitespace-nowrap px-4 py-2.5 font-medium text-foreground">{c.name}</td>
                          <td className="px-4 py-2.5">
                            <StatusBadge
                              tone={c.status === "Failed" ? "danger" : reportTone(c.status)}
                              label={c.status}
                            />
                          </td>
                          <td className="px-4 py-2.5 text-muted-foreground">{c.summary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-foreground">Generated Items</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Artifacts and publishing results.</p>
                <div className="mt-3 space-y-2">
                  {report.generated.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
                      No items generated yet.
                    </div>
                  ) : (
                    report.generated.map((g) => (
                      <div
                        key={g.name}
                        className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3.5 shadow-card"
                      >
                        <span className="text-base leading-6">{g.icon}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-foreground">{g.name}</span>
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-medium ${itemTone[g.tone].text}`}
                            >
                              <span className={`size-1.5 rounded-full ${itemTone[g.tone].dot}`} />
                              {g.result}
                            </span>
                          </div>
                          {g.lines.map((l) => (
                            <div key={l} className="mt-1 truncate text-xs text-muted-foreground">
                              {l}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}