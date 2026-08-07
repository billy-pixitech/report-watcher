import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Report Monitoring" },
      { name: "description", content: "Sign in to the Report Monitoring operations console for reports and jobs." },
      { property: "og:title", content: "Sign in — Report Monitoring" },
      { property: "og:description", content: "Sign in to the Report Monitoring operations console." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Enter your username and password.");
      return;
    }
    signIn(username.trim());
    navigate({ to: "/", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-card">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="size-4" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-foreground">Report Monitoring</div>
            <div className="text-[11px] text-muted-foreground">CAHC</div>
          </div>
        </div>

        <h1 className="mt-6 text-lg font-semibold text-foreground">Sign in</h1>
        <p className="mt-1 text-xs text-muted-foreground">Use your operations account to continue.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-xs font-medium text-foreground">
              Username
            </label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ops.team"
              className="h-9 bg-surface text-sm"
              autoComplete="username"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-xs font-medium text-foreground">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-9 bg-surface text-sm"
              autoComplete="current-password"
            />
          </div>
          {error ? <p className="text-xs text-danger-foreground">{error}</p> : null}
          <Button type="submit" className="h-9 w-full text-sm">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
