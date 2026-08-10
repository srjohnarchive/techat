import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, Building2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Initials } from "@/components/atoms";
import { contacts, getCompany } from "@/lib/mock-data";

export const Route = createFileRoute("/contatos/")({
  head: () => ({
    meta: [
      { title: "Contatos atendidos — Central Omni" },
      {
        name: "description",
        content:
          "Lista de contatos atendidos pela central omnichannel, com telefone, e-mail e empresa vinculada.",
      },
      { property: "og:title", content: "Contatos atendidos — Central Omni" },
      {
        property: "og:description",
        content: "Consulte todos os contatos, suas empresas e o histórico de tickets.",
      },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  return (
    <AppShell>
      <PageHeader title="Contatos" subtitle={`${contacts.length} contatos cadastrados`} />
      <div className="min-h-0 flex-1 overflow-y-auto p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {contacts.map((p) => (
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
                  <Building2 className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{getCompany(p.companyId).name}</span>
                </p>
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
      </div>
    </AppShell>
  );
}
