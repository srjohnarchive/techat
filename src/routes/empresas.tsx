import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Building2, Pencil, Plus } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Initials, StatusTag } from "@/components/atoms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TicketTable } from "@/components/panels";
import { useApp } from "@/lib/app-state";
import { companies, contacts, getContact, getGroup, groups } from "@/lib/mock-data";

export const Route = createFileRoute("/empresas")({
  head: () => ({
    meta: [
      { title: "Empresas atendidas — Techat" },
      {
        name: "description",
        content:
          "Empresas cadastradas com CNPJ, contatos vinculados, tickets abertos e histórico consolidado de atendimentos.",
      },
      { property: "og:title", content: "Empresas atendidas — Techat" },
      {
        property: "og:description",
        content: "Veja empresas, contatos vinculados e o histórico de tickets de cada uma.",
      },
    ],
  }),
  component: CompaniesPage,
});

function CompaniesPage() {
  const { tickets } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("Nova empresa");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const sections = [
    ...groups.map((g) => ({ key: g.id, title: g.name, sub: g.erpSystem, items: companies.filter((c) => c.groupId === g.id) })),
    { key: "none", title: "Sem grupo empresarial", sub: "Empresas independentes", items: companies.filter((c) => !c.groupId) },
  ].filter((s) => s.items.length && (groupFilter === "all" || groupFilter === s.key));

  const company = companies.find((c) => c.id === selected);
  const people = contacts.filter((c) => c.companyId === selected);
  const companyTickets = tickets.filter(
    (t) => getContact(t.contactId).companyId === selected,
  );

  return (
    <AppShell>
      <PageHeader
        title="Empresas"
        subtitle={`${companies.length} empresas cadastradas`}
        action={
          <Button
            size="sm"
            onClick={() => {
              setFormTitle("Nova empresa");
              setFormOpen(true);
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Nova empresa
          </Button>
        }
      />
      <div className="min-h-0 flex-1 space-y-5 overflow-auto p-6">
        <div className="flex flex-wrap gap-2">
          {[{ id: "all", name: "Todos" }, ...groups, { id: "none", name: "Sem grupo" }].map((g) => (
            <button
              key={g.id}
              onClick={() => setGroupFilter(g.id)}
              className={`rounded-full border px-3 py-1 text-sm ${groupFilter === g.id ? "border-brand bg-brand-soft text-brand" : "border-border text-muted-foreground hover:bg-accent"}`}
            >
              {g.name}
            </button>
          ))}
        </div>
        {sections.map((sec) => (
        <section key={sec.key} className="space-y-2">
          <div>
            <h2 className="text-sm font-semibold">{sec.title} <span className="font-normal text-muted-foreground">· {sec.items.length} empresa(s)</span></h2>
            <p className="text-xs text-muted-foreground">{sec.sub}</p>
          </div>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">CNPJ</th>
                <th className="px-4 py-3 font-medium">Contatos</th>
                <th className="px-4 py-3 font-medium">Tickets abertos</th>
                <th className="px-4 py-3 font-medium">Última interação</th>
              </tr>
            </thead>
            <tbody>
              {sec.items.map((c) => {
                const count = contacts.filter((p) => p.companyId === c.id).length;
                const open = tickets.filter(
                  (t) =>
                    getContact(t.contactId).companyId === c.id &&
                    (t.status === "aberto" ||
                      t.status === "em_atendimento" ||
                      t.status === "pendente"),
                ).length;
                return (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c.id)}
                    className="cursor-pointer border-t border-border hover:bg-accent"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-medium">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {c.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{c.segment}</span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{c.cnpj}</td>
                    <td className="px-4 py-3">{count}</td>
                    <td className="px-4 py-3">{open}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {c.lastInteraction}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        </section>
        ))}
      </div>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{company?.name}</SheetTitle>
          </SheetHeader>
          {company && (
            <div className="space-y-4 px-4 pb-8">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3 text-sm">
                <div>
                  <p className="text-muted-foreground">CNPJ {company.cnpj}</p>
                  <p className="text-muted-foreground">{company.segment}</p>
                  <p className="text-muted-foreground">Grupo: {getGroup(company.groupId)?.name ?? "—"}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setFormTitle(`Editar ${company.name}`);
                    setFormOpen(true);
                  }}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar
                </Button>
              </div>

              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Contatos ({people.length})
              </h3>
              <ul className="space-y-2">
                {people.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3"
                  >
                    <Initials name={p.name} />
                    <div className="min-w-0 text-xs">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="truncate text-muted-foreground">{p.role}</p>
                      <p className="truncate text-muted-foreground">
                        {p.phone} · {p.email}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Histórico consolidado ({companyTickets.length})
              </h3>
              <TicketTable items={companyTickets} showContact />
              <p className="flex flex-wrap gap-1.5">
                {companyTickets.slice(0, 4).map((t) => (
                  <StatusTag key={t.id} status={t.status} />
                ))}
              </p>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{formTitle}</DialogTitle>
            <DialogDescription>
              Formulário de exemplo — os dados não são salvos neste mockup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Razão social" defaultValue={company?.name ?? ""} />
            <Input placeholder="CNPJ" defaultValue={company?.cnpj ?? ""} />
            <Input placeholder="Segmento" defaultValue={company?.segment ?? ""} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setFormOpen(false)}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
