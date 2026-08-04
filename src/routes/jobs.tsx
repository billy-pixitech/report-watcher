import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { StatusBadge, reportTone } from "@/components/StatusBadge";
import { jobs, type JobStatus } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Scheduled Jobs — Report Monitoring" },
      {
        name: "description",
        content: "Monitor scheduled background jobs: last run, next run and health status for the Operations team.",
      },
      { property: "og:title", content: "Scheduled Jobs — Report Monitoring" },
      {
        property: "og:description",
        content: "Monitor scheduled background jobs: last run, next run and health status.",
      },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<JobStatus | "all">("all");

  const rows = useMemo(
    () =>
      jobs.filter(
        (j) =>
          (status === "all" || j.status === status) &&
          (j.name.toLowerCase().includes(query.toLowerCase()) ||
            j.description.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, status],
  );

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-60">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-8">
          <div>
            <h1 className="text-sm font-semibold text-foreground">Jobs</h1>
            <p className="text-xs text-muted-foreground">Scheduled background jobs</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>6 healthy</span>
            <span className="text-warning-foreground">1 warning</span>
            <span className="text-danger-foreground">1 failed</span>
          </div>
        </header>

        <div className="mx-auto max-w-[1320px] px-8 py-8">
          <div className="rounded-xl border border-border bg-card shadow-card">
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search jobs"
                  className="h-9 bg-surface pl-9 text-sm"
                />
              </div>
              <Select value={status} onValueChange={(v) => setStatus(v as JobStatus | "all")}>
                <SelectTrigger className="h-9 w-44 bg-surface text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Healthy">Healthy</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <span className="ml-auto text-xs text-muted-foreground">{rows.length} jobs</span>
            </div>

            <div className="max-h-[620px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10 bg-surface">
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="border-b border-border px-4 py-2.5 font-medium">Job Name</th>
                    <th className="border-b border-border px-4 py-2.5 font-medium">Description</th>
                    <th className="border-b border-border px-4 py-2.5 font-medium">Last Run</th>
                    <th className="border-b border-border px-4 py-2.5 font-medium">Next Run</th>
                    <th className="border-b border-border px-4 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((j) => (
                    <tr key={j.name} className="border-b border-border last:border-0 hover:bg-surface">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-foreground">{j.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{j.description}</td>
                      <td className="tabular whitespace-nowrap px-4 py-3 text-muted-foreground">{j.lastRun}</td>
                      <td className="tabular whitespace-nowrap px-4 py-3 text-muted-foreground">{j.nextRun}</td>
                      <td className="px-4 py-3">
                        <StatusBadge tone={reportTone(j.status)} label={j.status} detail={j.reason} />
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
                <button className="rounded-md border border-border bg-secondary px-2.5 py-1 text-foreground">1</button>
                <button className="rounded-md border border-border px-2.5 py-1 text-foreground/50" disabled>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}