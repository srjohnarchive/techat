import { Link, useRouterState } from "@tanstack/react-router";
import { Inbox, Building2, Users, BarChart3, Headset, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { Initials } from "@/components/atoms";

const nav = [
  { to: "/", label: "Caixa de Entrada", icon: Inbox, exact: true },
  { to: "/pendencias", label: "Pendências", icon: ListChecks, exact: false },
  { to: "/empresas", label: "Empresas", icon: Building2, exact: false },
  { to: "/contatos", label: "Contatos", icon: Users, exact: false },
  { to: "/admin", label: "Administração", icon: BarChart3, exact: false },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <aside className="flex w-16 shrink-0 flex-col items-center gap-2 border-r border-border bg-sidebar py-4 lg:w-60 lg:items-stretch lg:px-3">
        <div className="mb-4 flex items-center gap-2 px-1 lg:px-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand text-brand-foreground">
            <Headset className="h-5 w-5" />
          </span>
          <span className="hidden min-w-0 flex-col lg:flex">
            <span className="truncate text-sm font-semibold">Central Omni</span>
            <span className="truncate text-xs text-muted-foreground">Atendimento</span>
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                title={item.label}
                className={cn(
                  "flex items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors lg:justify-start lg:px-3",
                  active
                    ? "bg-brand-soft text-brand"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 border-t border-border pt-3 lg:px-1">
          <Initials name="Luísa Campos" />
          <span className="hidden min-w-0 flex-col lg:flex">
            <span className="truncate text-sm font-medium">Luísa Campos</span>
            <span className="truncate text-xs text-muted-foreground">Atendente</span>
          </span>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-surface px-6 py-4">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold">{title}</h1>
        {subtitle && (
          <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {action}
    </header>
  );
}
