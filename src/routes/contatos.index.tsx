import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Initials } from "@/components/atoms";
import { contacts, getCompany } from "@/lib/mock-data";

export const Route = createFileRoute("/contatos/")({
  head: () => ({
    meta: [
      { title: "Contatos dos clientes — Central Omni" },
      {
        name: "description",
        content:
          "Lista de contatos atendidos, com cargo, empresa vinculada, telefone e e-mail para consulta rápida.",
      },
      { property: "og:title", content: "Contatos dos clientes — Central Omni" },
      {
        property: "og:description",
        content: "Consulte os contatos atendidos e abra a ficha completa de cada um.",
      },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  const [q, setQ] = useState("");
  const list = contacts.filter((c) => {
    const term = q.trim().toLowerCase();
    if (!term) return true;
    const company = getCompany(c.companyId);
    return (
      c.name.toLowerCase().includes(term) ||
      (company?.name.toLowerCase().includes(term) ?? false)
    );
  });

  return (
    <AppShell>
      <PageHeader title="Contatos" subtitle={`${contacts.length} contatos cadastrados`} />
      <div className="min-h-0 flex-1 overflow-auto p-6">
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar contato ou empresa"
            className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((c) => {
            const company = getCompany(c.companyId);
            return (
              <Link
                key={c.id}
                to="/contatos/$contactId"
                params={{ contactId: c.id }}
                className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-brand"
              >
                <Initials name={c.name} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{c.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{c.role}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {company?.name ?? "Sem empresa vinculada"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
