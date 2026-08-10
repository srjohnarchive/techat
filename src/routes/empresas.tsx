import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, ChevronRight, Mail, Phone, Users } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Initials } from "@/components/atoms";
import { companies, contacts } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/empresas")({
  head: () => ({
    meta: [
      { title: "Empresas e contatos vinculados — Central Omni" },
      {
        name: "description",
        content:
          "Empresas cadastradas na central de atendimento, com a quantidade de contatos vinculados e a ficha de cada funcionário.",
      },
      { property: "og:title", content: "Empresas e contatos vinculados — Central Omni" },
      {
        property: "og:description",
        content: "Veja as empresas atendidas e os contatos vinculados a cada uma.",
      },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const [selected, setSelected] = useState(companies[0]!.id);
  const company = companies.find((c) => c.id === selected)!;
  const list = contacts.filter((c) => c.companyId === selected);

  return (
    <AppShell>
      <PageHeader
        title="Empresas"
        subtitle={`${companies.length} empresas cadastradas`}
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[340px_minmax(0,1fr)]">
        <section className="border-r border-border bg-surface">
          <ul>
            {companies.map((c) => {
              const count = contacts.filter((p) => p.companyId === c.id).length;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setSelected(c.id)}
                    className={cn(
                      "flex w-full items-center gap-3 border-b border-border px-5 py-4 text-left transition-colors hover:bg-accent",
                      c.id === selected && "bg-brand-soft/70",
                    )}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{c.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {c.segment} · {count} contato{count !== 1 ? "s" : ""}
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="p-6">
          <div className="rounded-xl border border-border bg-surface p-5">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold">{company.name}</h2>
                <p className="truncate text-sm text-muted-foreground">{company.segment}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
                <Users className="h-3.5 w-3.5" /> {list.length} contatos
              </span>
            </div>
          </div>

          <h3 className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Contatos vinculados
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {list.map((p) => (
              <Link
                key={p.id}
                to="/contatos/$contactId"
                params={{ contactId: p.id }}
                className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-brand"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Initials name={p.name} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.role}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{p.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
