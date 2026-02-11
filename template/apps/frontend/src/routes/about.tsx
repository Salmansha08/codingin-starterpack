import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">About</h1>
      <p className="mt-4 text-muted-foreground">
        This project was scaffolded with{" "}
        <strong className="text-foreground">codingin-starterpack</strong> — a
        fullstack React + NestJS monorepo starter.
      </p>

      <div className="mt-8 space-y-6">
        <TechSection
          title="🎨 Frontend"
          items={[
            "React 19 with TypeScript",
            "Vite for blazing-fast development",
            "TanStack Router for type-safe routing",
            "Tailwind CSS v4 for styling",
            "shadcn/ui for UI components",
            "Zod for schema validation",
            "Axios for API calls",
          ]}
        />

        <TechSection
          title="⚙️ Backend"
          items={[
            "NestJS for a scalable server",
            "Prisma ORM for database access",
            "Class-validator for DTO validation",
            "Serve Static for production frontend serving",
            "ConfigModule for environment management",
          ]}
        />

        <TechSection
          title="📦 Monorepo"
          items={[
            "npm workspaces",
            "Shared TypeScript types",
            "Single-port production deployment",
            "Concurrent dev servers",
          ]}
        />
      </div>
    </div>
  );
}

function TechSection({
  title,
  items,
}: Readonly<{ title: string; items: string[] }>) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <span className="text-primary">›</span> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
