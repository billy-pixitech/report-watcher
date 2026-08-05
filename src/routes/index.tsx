import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ReportDrawer } from "@/components/ReportDrawer";
import { StatusBadge, reportTone } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { kpis, reports, type Report } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Report Monitoring" },
      {
        name: "description",
        content:
          "Operational view of automated report generation for the current reporting period: status, checklists and last updates.",
      },
      { property: "og:title", content: "Dashboard — Report Monitoring" },
      {
        property: "og:description",
        content: "Operational view of automated report generation for the current reporting period.",
      },
    ],
  }),
  component: Dashboard,
});

const kpiAccent: Record<string, string> = {
  neutral: "text-foreground",
  success: "text-success-foreground",
  warning: "text-warning-foreground",
  danger: "text-danger-foreground",
  muted: "text-muted-foreground",
};

function Dashboard() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [frequency, setFrequency] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Report | null>(null);

  const rows = useMemo(
    () =>
      reports.filter(
        (r) =>
          (category === "all" || r.category === category) &&
          (frequency === "all" || r.frequency === frequency) &&
          (status === "all" || r.status === status) &&
          (r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.category.toLowerCase().includes(query.toLowerCase()) ||
            r.period.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, category, frequency, status],
  );

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Reporting period · 20 Jul – 02 Aug 2026</p>
          </div>
          <span className="tabular text-xs text-muted-foreground">Last refreshed 04 Aug 2026 09:45</span>
        </header>

        <div className="mx-auto max-w-[1320px] space-y-8 px-8 py-8">
          <section className="grid grid-cols-5 gap-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="text-xs font-medium text-muted-foreground">{k.label}</div>
                <div className={cn("tabular mt-2 text-3xl font-semibold", kpiAccent[k.tone])}>{k.value}</div>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-sm font-semibold text-foreground">Current Reports</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              All reports belonging to the current reporting period.
            </p>

            <div className="mt-4 rounded-xl border border-border bg-card shadow-card">
              <div className="flex items-center gap-3 border-b border-border px-4 py-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search reports"
                    className="h-9 bg-surface pl-9 text-sm"
                  />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 w-36 bg-surface text-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    <SelectItem value="EP">EP</SelectItem>
                    <SelectItem value="Physio">Physio</SelectItem>
                    <SelectItem value="POD">POD</SelectItem>
                    <SelectItem value="Psych">Psych</SelectItem>
                    <SelectItem value="PBI">PBI</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="h-9 w-40 bg-surface text-sm">
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All frequencies</SelectItem>
                    <SelectItem value="Fortnight">Fortnight</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-9 w-40 bg-surface text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <span className="ml-auto text-xs text-muted-foreground">{rows.length} reports</span>
              </div>

              <div className="max-h-[560px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-surface">
                    <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="border-b border-border px-4 py-2.5 font-medium">Report</th>
                      <th className="border-b border-border px-4 py-2.5 font-medium">Period</th>
                      <th className="border-b border-border px-4 py-2.5 font-medium">Status</th>
                      <th className="border-b border-border px-4 py-2.5 font-medium">Checks</th>
                      <th className="border-b border-border px-4 py-2.5 font-medium">Last Updated</th>
                      <th className="w-10 border-b border-border px-4 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className="group cursor-pointer border-b border-border last:border-0 hover:bg-surface"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{r.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.category === "PBI" ? "PBI" : "Performance"}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="text-foreground">{r.frequency}</div>
                          <div className="tabular text-xs text-muted-foreground">{r.period}</div>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge tone={reportTone(r.status)} label={r.status} />
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "tabular text-sm",
                              r.checklistDone === r.checklistTotal
                                ? "text-success-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {r.checklistDone} / {r.checklistTotal}
                          </span>
                        </td>
                        <td className="tabular whitespace-nowrap px-4 py-3 text-muted-foreground">{r.lastUpdated}</td>
                        <td className="px-4 py-3">
                          <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
                <span>
                  Showing 1–{rows.length} of {rows.length}
                </span>
                <div className="flex items-center gap-1">
                  <button className="rounded-md border border-border px-2.5 py-1 text-foreground/50" disabled>
                    Previous
                  </button>
                  <button className="rounded-md border border-border bg-secondary px-2.5 py-1 text-foreground">
                    1
                  </button>
                  <button className="rounded-md border border-border px-2.5 py-1 text-foreground/50" disabled>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <ReportDrawer report={selected} open={selected !== null} onOpenChange={(v) => !v && setSelected(null)} />
    </div>
  );
}
