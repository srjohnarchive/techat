import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { GripVertical, Info, LayoutGrid, List, Plus, Trash2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ChannelIcon, StatusTag } from "@/components/atoms";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useApp } from "@/lib/app-state";
import {
  CHANNELS,
  CHANNEL_LABEL,
  CURRENT_AGENT,
  QUEUE_STATUSES,
  STATUS_LABEL,
  companies,
  getCompany,
  getContact,
  type Channel,
  type Ticket,
  type TicketStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pendencias")({
  head: () => ({
    meta: [
      { title: "Central de pendências — Techat" },
      {
        name: "description",
        content:
          "Gestão assíncrona dos tickets abertos e pendentes em lista ou kanban pessoal, sem alterar o status oficial.",
      },
      { property: "og:title", content: "Central de pendências — Techat" },
      {
        property: "og:description",
        content: "Organize os tickets pendentes em colunas personalizadas ou em lista.",
      },
    ],
  }),
  component: PendenciasPage,
});

type SortKey = "id" | "contact" | "company" | "subject" | "status" | "agent" | "waiting";

function PendenciasPage() {
  const {
    tickets,
    columns,
    moveTicketToColumn,
    addColumn,
    renameColumn,
    removeColumn,
    moveColumn,
  } = useApp();

  const [view, setView] = useState<"kanban" | "lista">("kanban");
  const [scope, setScope] = useState<"meus" | "todos">("todos");
  const [statusFilter, setStatusFilter] = useState<TicketStatus[]>([]);
  const [channelFilter, setChannelFilter] = useState<Channel[]>([]);
  const [companyFilter, setCompanyFilter] = useState("");
  const [sort, setSort] = useState<SortKey>("id");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const base = useMemo(
    () =>
      tickets.filter((t) => {
        if (t.status === "mesclado") return false;
        if (scope === "meus" && t.agent !== CURRENT_AGENT) return false;
        if (statusFilter.length && !statusFilter.includes(t.status)) return false;
        if (channelFilter.length && !channelFilter.includes(t.channel)) return false;
        if (companyFilter) {
          const c = getContact(t.contactId);
          if (c.companyId !== companyFilter) return false;
        }
        return true;
      }),
    [tickets, scope, statusFilter, channelFilter, companyFilter],
  );

  const pending = base.filter((t) => t.status === "aberto" || t.status === "pendente");

  const sorted = [...pending].sort((a, b) => {
    const val = (t: Ticket) =>
      sort === "id"
        ? t.id
        : sort === "contact"
          ? getContact(t.contactId).name
          : sort === "company"
            ? (getCompany(getContact(t.contactId).companyId)?.name ?? "")
            : sort === "subject"
              ? t.subject
              : sort === "status"
                ? STATUS_LABEL[t.status]
                : sort === "agent"
                  ? t.agent
                  : t.waiting;
    return val(a).localeCompare(val(b));
  });

  function toggle<T>(list: T[], v: T, set: (x: T[]) => void) {
    set(list.includes(v) ? list.filter((i) => i !== v) : [...list, v]);
  }

  return (
    <AppShell>
      <PageHeader
        title="Central de pendências"
        subtitle={`${pending.length} tickets aguardando ação`}
        action={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-lg border border-border p-0.5">
              {(["meus", "todos"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setScope(s)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium",
                    scope === s
                      ? "bg-brand text-brand-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s === "meus" ? "Meus tickets" : "Todos os tickets"}
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-lg border border-border p-0.5">
              <button
                onClick={() => setView("lista")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
                  view === "lista"
                    ? "bg-brand text-brand-foreground"
                    : "text-muted-foreground",
                )}
              >
                <List className="h-3.5 w-3.5" /> Lista
              </button>
              <button
                onClick={() => setView("kanban")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
                  view === "kanban"
                    ? "bg-brand text-brand-foreground"
                    : "text-muted-foreground",
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Kanban
              </button>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addColumn("Nova coluna")}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Nova coluna
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-6 py-3">
        {QUEUE_STATUSES.filter((s) => s === "aberto" || s === "pendente").map((s) => (
          <button
            key={s}
            onClick={() => toggle(statusFilter, s, setStatusFilter)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium",
              statusFilter.includes(s)
                ? "border-brand bg-brand-soft text-brand"
                : "border-border text-muted-foreground hover:bg-accent",
            )}
          >
            {STATUS_LABEL[s]}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        {CHANNELS.map((ch) => (
          <button
            key={ch}
            onClick={() => toggle(channelFilter, ch, setChannelFilter)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-[11px] font-medium",
              channelFilter.includes(ch)
                ? "border-brand bg-brand-soft text-brand"
                : "border-border text-muted-foreground hover:bg-accent",
            )}
          >
            {CHANNEL_LABEL[ch]}
          </button>
        ))}
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="ml-auto h-8 rounded-md border border-input bg-background px-2 text-xs"
        >
          <option value="">Todas as empresas</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {view === "kanban" ? (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <p className="mb-4 inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            As colunas são a sua organização pessoal — mover um cartão não altera o
            status oficial do ticket.
          </p>
          <div className="flex gap-4">
            {columns.map((col, i) => {
              const cards = pending.filter((t) => t.kanbanColumn === col.id);
              return (
                <div
                  key={col.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragging) moveTicketToColumn(dragging, col.id);
                    setDragging(null);
                  }}
                  className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-surface"
                >
                  <div className="flex items-center gap-1 border-b border-border px-3 py-2">
                    <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <input
                      value={col.title}
                      onChange={(e) => renameColumn(col.id, e.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                    />
                    <span className="rounded-full bg-muted px-2 text-[11px] text-muted-foreground">
                      {cards.length}
                    </span>
                    <button
                      title="Mover para a esquerda"
                      onClick={() => moveColumn(col.id, -1)}
                      disabled={i === 0}
                      className="px-1 text-xs text-muted-foreground disabled:opacity-30"
                    >
                      ←
                    </button>
                    <button
                      title="Mover para a direita"
                      onClick={() => moveColumn(col.id, 1)}
                      disabled={i === columns.length - 1}
                      className="px-1 text-xs text-muted-foreground disabled:opacity-30"
                    >
                      →
                    </button>
                    <button
                      title="Excluir coluna"
                      onClick={() => removeColumn(col.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex min-h-32 flex-col gap-2 p-2">
                    {cards.map((t) => (
                      <article
                        key={t.id}
                        draggable
                        onDragStart={() => setDragging(t.id)}
                        onClick={() => setSelected(t)}
                        className="cursor-grab rounded-lg border border-border bg-background p-3 active:cursor-grabbing"
                      >
                        <p className="truncate text-sm font-medium">
                          #{t.id} · {t.subject}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {getContact(t.contactId).name} ·{" "}
                          {getCompany(getContact(t.contactId).companyId)?.name ?? "—"}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <ChannelIcon channel={t.channel} className="h-5 w-5" />
                          <StatusTag status={t.status} />
                          <span className="ml-auto text-[11px] text-muted-foreground">
                            {t.updatedAt}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragging) moveTicketToColumn(dragging, null);
                setDragging(null);
              }}
              className="flex w-72 shrink-0 flex-col rounded-xl border border-dashed border-border bg-surface/60"
            >
              <div className="border-b border-border px-3 py-2 text-sm font-semibold text-muted-foreground">
                Sem coluna
              </div>
              <div className="flex min-h-32 flex-col gap-2 p-2">
                {pending
                  .filter((t) => !t.kanbanColumn)
                  .map((t) => (
                    <article
                      key={t.id}
                      draggable
                      onDragStart={() => setDragging(t.id)}
                      onClick={() => setSelected(t)}
                      className="cursor-grab rounded-lg border border-border bg-background p-3"
                    >
                      <p className="truncate text-sm font-medium">
                        #{t.id} · {t.subject}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {getContact(t.contactId).name}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <ChannelIcon channel={t.channel} className="h-5 w-5" />
                        <StatusTag status={t.status} />
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto p-6">
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  {(
                    [
                      ["id", "Nº"],
                      ["contact", "Contato"],
                      ["company", "Empresa"],
                      ["subject", "Assunto"],
                      ["status", "Status"],
                      ["agent", "Responsável"],
                      ["waiting", "Tempo em espera"],
                    ] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <th key={key} className="px-3 py-2 font-medium">
                      <button onClick={() => setSort(key)} className="hover:underline">
                        {label}
                      </button>
                    </th>
                  ))}
                  <th className="px-3 py-2 font-medium">Canal</th>
                  <th className="px-3 py-2 font-medium">Atualização</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelected(t)}
                    className="cursor-pointer border-t border-border hover:bg-accent"
                  >
                    <td className="px-3 py-2 font-medium">#{t.id}</td>
                    <td className="px-3 py-2">{getContact(t.contactId).name}</td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {getCompany(getContact(t.contactId).companyId)?.name ?? "—"}
                    </td>
                    <td className="max-w-0 px-3 py-2">
                      <span className="block truncate">{t.subject}</span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusTag status={t.status} />
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{t.agent}</td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                      {t.waiting}
                    </td>
                    <td className="px-3 py-2">
                      <ChannelIcon channel={t.channel} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                      {t.updatedAt}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {selected ? `#${selected.id} · ${selected.subject}` : ""}
            </SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="space-y-3 px-4 pb-6 text-sm">
              <p className="text-muted-foreground">
                {getContact(selected.contactId).name} ·{" "}
                {getCompany(getContact(selected.contactId).companyId)?.name ?? "—"}
              </p>
              <div className="flex items-center gap-2">
                <StatusTag status={selected.status} />
                <ChannelIcon channel={selected.channel} />
              </div>
              <dl className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <dt className="text-muted-foreground">Responsável</dt>
                  <dd>{selected.agent}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Aberto em</dt>
                  <dd>{selected.openedAt}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Em espera</dt>
                  <dd>{selected.waiting}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Coluna</dt>
                  <dd>
                    {columns.find((c) => c.id === selected.kanbanColumn)?.title ??
                      "Sem coluna"}
                  </dd>
                </div>
              </dl>
              <Button asChild className="w-full">
                <a href="/">Abrir conversa</a>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}
