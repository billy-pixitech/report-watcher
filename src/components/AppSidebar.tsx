import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Timer, Activity } from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jobs", label: "Jobs", icon: Timer },
] as const;

export function AppSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 flex w-60 flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Activity className="size-4" />
        </span>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-foreground">Report Monitoring</div>
          <div className="text-[11px] text-muted-foreground">CAHC</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
        <div className="px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          MAIN
        </div>
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent data-[status=active]:bg-sidebar-accent data-[status=active]:text-sidebar-accent-foreground"
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}