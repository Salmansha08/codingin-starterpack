import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export const Route = createFileRoute("/")({
  component: HomePage,
});

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  database: string;
}

function HomePage() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<HealthData>("/health")
      .then((res) => setHealth(res.data))
      .catch(() => setHealth(null))
      .finally(() => setLoading(false));
  }, []);

  function renderHealthStatus() {
    if (loading) {
      return (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Checking...
        </div>
      );
    }

    if (health) {
      return (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <StatusCard label="Status" value={health.status} ok />
          <StatusCard
            label="Database"
            value={health.database}
            ok={health.database === "ok"}
          />
          <StatusCard
            label="Uptime"
            value={`${Math.round(health.uptime)}s`}
            ok
          />
        </div>
      );
    }

    return (
      <div className="mt-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
        ❌ Cannot reach backend. Make sure NestJS is running on port 3000.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Hero */}
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
            Fullstack Starterpack
          </span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          React + Vite + TanStack Router + Tailwind + shadcn/ui + NestJS +
          Prisma
        </p>
      </div>

      {/* Health Check Status */}
      <div className="mt-12 rounded-xl border border-border bg-card p-8">
        <h2 className="text-lg font-semibold">🏥 Backend Health Check</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Verifying connection to NestJS backend via{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            /api/health
          </code>
        </p>

        {renderHealthStatus()}
      </div>

      {/* Quick Start */}
      <div className="mt-8 rounded-xl border border-border bg-card p-8">
        <h2 className="text-lg font-semibold">⚡ Quick Start</h2>
        <div className="mt-4 space-y-2 rounded-lg bg-secondary p-4 font-mono text-sm">
          <p>
            <span className="text-muted-foreground">$</span> npm run dev
          </p>
          <p className="text-muted-foreground">
            # Frontend: http://localhost:5173
          </p>
          <p className="text-muted-foreground">
            # Backend: http://localhost:3000/api
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusCard({
  label,
  value,
  ok,
}: Readonly<{
  label: string;
  value: string;
  ok: boolean;
}>) {
  return (
    <div className="rounded-lg border border-border p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-lg font-bold ${ok ? "text-emerald-500" : "text-destructive"}`}
      >
        {ok ? "✅" : "❌"} {value}
      </p>
    </div>
  );
}
