import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, RotateCcw } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ChannelBadge, StatusTag } from "@/components/atoms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/app-state";
import {
  ALL_STATUSES,
  CHANNELS,
  CHANNEL_LABEL,
  STATUS_LABEL,
  companies,
  contacts,
  getCompany,
  getContact,
  getGroup,
  groups,
  users,
} from "@/lib/mock-data";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios de atendimento — Techat" },
      {
        name: "description",
        content:
          "Relatórios de tickets e tarefas com filtros por atendente, grupo empresarial, empresa, contato, canal e status.",
      },
      { property: "og:title", content: "Relatórios de atendimento — Techat" },
      {
        property: "og:description",
        content: "Filtre e exporte tickets por atendente, grupo, empresa, cliente e canal.",
      },
    ],
  }),
  component: ReportsPage,
});

const ALL = "__all";
type Filters = {
  agent: string;
  group: string;
  company: string;
  contact: string;
  channel: string;
  status: string;
  kind: string;
  q: string;
};
const EMPTY: Filters = {
  agent: ALL,
  group: ALL,
  company: ALL,
  contact: ALL,
  channel: ALL,
  status: ALL,
  kind: ALL,
  q: "",
};

function ReportsPage() {
  const { tickets } = useApp();
  const [f, setF] = useState<Filters>(EMPTY);
  const set = (k: keyof Filters) => (v: string) =>
    setF((p) => {
      const n = { ...p, [k]: v };
      if (k === "group") { n.company = ALL; n.contact = ALL; }
      if (k === "company") n.contact = ALL;
      return n;
    });

  const companyOptions = companies.filter((c) => f.group === ALL || c.groupId === f.group);
  const contactOptions = contacts.filter((c) =>
    f.company !== ALL ? c.companyId === f.company : companyOptions.some((co) => co.id === c.companyId),
  );

  const rows = useMemo(
    () =>
      tickets.filter((t) => {
        const ct = getContact(t.contactId);
        const co = getCompany(ct.companyId);
        if (f.agent !== ALL && t.agent !== f.agent) return false;
        if (f.group !== ALL && co?.groupId !== f.group) return false;
        if (f.company !== ALL && co?.id !== f.company) return false;
        if (f.contact !== ALL && ct.id !== f.contact) return false;
        if (f.channel !== ALL && t.channel !== f.channel) return false;
        if (f.status !== ALL && t.status !== f.status) return false;
        if (f.kind !== ALL && (t.kind ?? "ticket") !== f.kind) return false;
        if (f.q && !`${t.id} ${t.subject}`.toLowerCase().includes(f.q.toLowerCase())) return false;
        return true;
      }),
    [tickets, f],
  );

  const open = rows.filter((t) => ["aberto", "em_atendimento", "pendente"].includes(t.status)).length;
  const resolved = rows.filter((t) => t.status === "resolvido").length;
  const byAgent = users.map((u) => ({
    name: u.name.split(" ")[0],
    total: rows.filter((t) => t.agent === u.name).length,
  }));

  function exportCsv() {
    const head = ["Ticket", "Tipo", "Assunto", "Status", "Canal", "Atendente", "Contato", "Empresa", "Grupo", "Abertura", "Encerramento"];
    const lines = rows.map((t) => {
      const ct = getContact(t.contactId);
      const co = getCompany(ct.companyId);
      return [t.id, t.kind ?? "ticket", t.subject, STATUS_LABEL[t.status], CHANNEL_LABEL[t.channel], t.agent, ct.name, co?.name ?? "", getGroup(co?.groupId)?.name ?? "", t.openedAt, t.closedAt ?? ""]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(";");
    });
    const blob = new Blob(["\ufeff" + [head.join(";"), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "relatorio-techat.csv";
    a.click();
  }

  return (
    <AppShell>
      <PageHeader
        title="Relatórios"
        subtitle={`${rows.length} de ${tickets.length} registros`}
        action={
          <Button size="sm" onClick={exportCsv}>
            <Download className="mr-1.5 h-4 w-4" /> Exportar CSV
          </Button>
        }
      />
      <div className="min-h-0 flex-1 space-y-5 overflow-auto p-6">
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface p-4 md:grid-cols-4 xl:grid-cols-8">
          <Input placeholder="Nº ou assunto" value={f.q} onChange={(e) => set("q")(e.target.value)} className="col-span-2 md:col-span-1" />
          <F label="Atendente" value={f.agent} onChange={set("agent")} options={users.map((u) => [u.name, u.name])} />
          <F label="Grupo" value={f.group} onChange={set("group")} options={groups.map((g) => [g.id, g.name])} />
          <F label="Empresa" value={f.company} onChange={set("company")} options={companyOptions.map((c) => [c.id, c.name])} />
          <F label="Contato" value={f.contact} onChange={set("contact")} options={contactOptions.map((c) => [c.id, c.name])} />
          <F label="Canal" value={f.channel} onChange={set("channel")} options={CHANNELS.map((c) => [c, CHANNEL_LABEL[c]])} />
          <F label="Status" value={f.status} onChange={set("status")} options={ALL_STATUSES.map((s) => [s, STATUS_LABEL[s]])} />
          <div className="flex gap-2">
            <F label="Tipo" value={f.kind} onChange={set("kind")} options={[["ticket", "Ticket"], ["tarefa", "Tarefa"]]} />
            <Button variant="ghost" size="icon" title="Limpar filtros" onClick={() => setF(EMPTY)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Kpi label="Total filtrado" value={rows.length} />
          <Kpi label="Em aberto" value={open} />
          <Kpi label="Resolvidos" value={resolved} />
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <h2 className="mb-3 text-sm font-semibold">Volume por atendente</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byAgent}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis allowDecimals={false} stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", color: "var(--foreground)" }} />
                <Bar dataKey="total" fill="var(--brand)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                {["Ticket", "Assunto", "Status", "Canal", "Atendente", "Contato / Empresa", "Grupo", "Abertura"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const ct = getContact(t.contactId);
                const co = getCompany(ct.companyId);
                return (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">
                      #{t.id}
                      {t.kind === "tarefa" && <span className="ml-1.5 rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground">tarefa</span>}
                    </td>
                    <td className="px-4 py-3">{t.subject}</td>
                    <td className="px-4 py-3"><StatusTag status={t.status} /></td>
                    <td className="px-4 py-3"><ChannelBadge channel={t.channel} /></td>
                    <td className="px-4 py-3">{t.agent}</td>
                    <td className="px-4 py-3">
                      <p>{ct.name}</p>
                      <p className="text-xs text-muted-foreground">{co?.name ?? "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{getGroup(co?.groupId)?.name ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.openedAt}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Nenhum registro com esses filtros.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

function F({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[][] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>{label}: todos</SelectItem>
        {options.map(([v, l]) => (
          <SelectItem key={v} value={v!}>{l}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}
