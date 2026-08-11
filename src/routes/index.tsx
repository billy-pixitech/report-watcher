import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { ReportDrawer } from "@/components/ReportDrawer";
import { StatusBadge, reportTone } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cadences, kpis, reports, type Report, type Cadence } from "@/lib/mock-data";
import { LogoutButton } from "@/components/LogoutButton";
import { useAuth } from "@/hooks/use-auth";
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

const kpiBar: Record<string, string> = {
  neutral: "border-l-border",
  success: "border-l-success",
  warning: "border-l-warning",
  danger: "border-l-danger",
  muted: "border-l-muted",
};

function Dashboard() {
  const { ready, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState<Report | null>(null);

  const filtered = useMemo(
    () =>
      reports.filter(
        (r) =>
          (category === "all" || (r.category === "PBI" ? "PBI" : "Performance") === category) &&
          (status === "all" || r.status === status) &&
          (r.title.toLowerCase().includes(query.toLowerCase()) ||
            r.category.toLowerCase().includes(query.toLowerCase()) ||
            r.period.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, category, status],
  );

  const fortnightRows = filtered.filter((r) => r.frequency === "Fortnight");
  const monthlyRows = filtered.filter((r) => r.frequency === "Monthly");

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Monitor reports for the current reporting cycle</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="tabular text-xs text-muted-foreground">Administrator</span>
            <LogoutButton onClick={logout} />
          </div>
        </header>

        <div className="mx-auto max-w-[1320px] space-y-8 px-8 py-8">
          <section className="grid grid-cols-4 gap-4">
            {kpis.map((k) => (
              <div key={k.label} className={cn("rounded-xl border p-4 shadow-card", kpiCard[k.tone])}>
                <div className="text-xs font-medium text-muted-foreground">{k.label}</div>
                <div className={cn("tabular mt-2 text-3xl font-semibold", kpiAccent[k.tone])}>
                  {k.total ? `${k.value}/${k.total}` : k.value}
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Reporting Cadences</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">Previous, current and next run per reporting cycle.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {cadences.map((c) => (
                <CadenceCard key={c.frequency} cadence={c} />
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Current Reports</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">All reports for the active reporting periods.</p>
              </div>
              <div className="flex items-center gap-3">
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
                    <SelectItem value="PBI">PBI</SelectItem>
                    <SelectItem value="Performance">Performance</SelectItem>
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
              </div>
            </div>

            <ReportSection
              title="Fortnight Reports"
              subtitle="20 Jul – 02 Aug 2026"
              rows={fortnightRows}
              onSelect={setSelected}
            />
            <ReportSection
              title="Monthly Reports"
              subtitle="Jul 2026"
              rows={monthlyRows}
              onSelect={setSelected}
            />
          </section>
        </div>
      </main>

      <ReportDrawer report={selected} open={selected !== null} onOpenChange={(v) => !v && setSelected(null)} />
    </div>
  );
}

function ReportSection({
  title,
  subtitle,
  rows,
  onSelect,
}: {
  title: string;
  subtitle: string;
  rows: Report[];
  onSelect: (r: Report) => void;
}) {
  return <ReportSectionInner title={title} subtitle={subtitle} rows={rows} onSelect={onSelect} />;
}

function CadenceCard({ cadence }: { cadence: Cadence }) {
  const rows = [
    { label: "Previous Run", ...cadence.previous, tone: "muted" as const },
    { label: "Current Run", ...cadence.current, tone: "current" as const },
    { label: "Next Run", ...cadence.next, tone: "muted" as const },
  ];
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{cadence.frequency}</h3>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">Cycle</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        {rows.map((r) => (
          <div
            key={r.label}
            className={cn(
              "rounded-lg border p-3",
              r.tone === "current" ? "border-primary/40 bg-surface" : "border-border bg-surface/60",
            )}
          >
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{r.label}</div>
            <div className="tabular mt-1 text-sm font-medium text-foreground">{r.period}</div>
            <div className="tabular mt-0.5 text-xs text-muted-foreground">{r.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportSectionInner({
  title,
  subtitle,
  rows,
  onSelect,
}: {
  title: string;
  subtitle: string;
  rows: Report[];
  onSelect: (r: Report) => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="text-xs text-muted-foreground">{rows.length} reports</span>
      </div>

      <div className="max-h-[360px] overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-surface">
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="border-b border-border px-4 py-2.5 font-medium">Report</th>
              <th className="border-b border-border px-4 py-2.5 font-medium">Category</th>
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
                onClick={() => onSelect(r)}
                className="group cursor-pointer border-b border-border last:border-0 hover:bg-surface"
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-foreground">{r.title}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    {r.category === "PBI" ? "PBI" : "Performance"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={reportTone(r.status)} label={r.status} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "tabular text-sm",
                      r.checklistDone === r.checklistTotal ? "text-success-foreground" : "text-muted-foreground",
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
    </div>
  );
}
