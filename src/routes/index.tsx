import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Send,
  StickyNote,
  RotateCcw,
  ChevronDown,
  Paperclip,
  Smile,
  Building2,
  Mail,
  Phone,
  Check,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ChannelIcon, ChannelBadge, StatusTag, Initials } from "@/components/atoms";
import {
  tickets as seedTickets,
  STATUS_LABEL,
  STATUS_ORDER,
  CHANNEL_LABEL,
  getContact,
  getCompany,
  pastTickets,
  type Channel,
  type Message,
  type Ticket,
  type TicketStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caixa de Entrada Unificada — Central Omni" },
      {
        name: "description",
        content:
          "Central de atendimento omnichannel: WhatsApp, Webchat e E-mail em uma única caixa de entrada com notas internas e histórico do contato.",
      },
      { property: "og:title", content: "Caixa de Entrada Unificada — Central Omni" },
      {
        property: "og:description",
        content:
          "Atenda clientes de WhatsApp, Webchat e E-mail em uma única tela, com status, notas internas e ficha completa do contato.",
      },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  const [list, setList] = useState<Ticket[]>(seedTickets);
  const [activeId, setActiveId] = useState(seedTickets[0]!.id);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "todos">("todos");
  const [channelFilter, setChannelFilter] = useState<Channel | "todos">("todos");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [noteMode, setNoteMode] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const filtered = useMemo(
    () =>
      list.filter((t) => {
        const contact = getContact(t.contactId);
        const matchStatus = statusFilter === "todos" || t.status === statusFilter;
        const matchChannel = channelFilter === "todos" || t.channel === channelFilter;
        const matchQuery =
          query.trim() === "" ||
          [t.subject, t.id, contact.name].join(" ").toLowerCase().includes(query.toLowerCase());
        return matchStatus && matchChannel && matchQuery;
      }),
    [list, statusFilter, channelFilter, query],
  );

  const active = list.find((t) => t.id === activeId) ?? filtered[0] ?? list[0]!;
  const contact = getContact(active.contactId);
  const company = getCompany(contact.companyId);
  const history = pastTickets[contact.id] ?? [];

  const counts = useMemo(() => {
    const base: Record<string, number> = { todos: list.length };
    STATUS_ORDER.forEach((s) => (base[s] = list.filter((t) => t.status === s).length));
    return base;
  }, [list]);

  function updateActive(fn: (t: Ticket) => Ticket) {
    setList((prev) => prev.map((t) => (t.id === active.id ? fn(t) : t)));
  }

  function send() {
    if (!draft.trim()) return;
    const msg: Message = {
      id: crypto.randomUUID(),
      author: noteMode ? "nota" : "agente",
      authorName: "Luísa Campos",
      text: noteMode ? `Nota interna: ${draft.trim()}` : draft.trim(),
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    updateActive((t) => ({ ...t, messages: [...t.messages, msg], unread: 0 }));
    setDraft("");
  }

  const isClosed = active.status === "resolvido" || active.status === "nao_resolvido";

  return (
    <AppShell>
      <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)_320px]">
        {/* Coluna esquerda */}
        <section className="flex min-h-0 flex-col border-r border-border bg-surface">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Caixa de entrada</h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar conversa ou contato"
                className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-brand"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(["todos", ...STATUS_ORDER] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    statusFilter === s
                      ? "bg-brand text-brand-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {s === "todos" ? "Todos" : STATUS_LABEL[s]}{" "}
                  <span className="opacity-70">{counts[s]}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {(["todos", "whatsapp", "webchat", "email"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setChannelFilter(c)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-xs font-medium transition-colors",
                    channelFilter === c
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c !== "todos" && <ChannelIcon channel={c} className="h-5 w-5 bg-transparent" />}
                  {c === "todos" ? "Todos os canais" : CHANNEL_LABEL[c]}
                </button>
              ))}
            </div>
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto">
            {filtered.map((t) => {
              const c = getContact(t.contactId);
              const last = t.messages[t.messages.length - 1];
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveId(t.id)}
                    className={cn(
                      "flex w-full gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent",
                      t.id === active.id && "bg-brand-soft/70",
                    )}
                  >
                    <Initials name={c.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium">{c.name}</span>
                        <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
                          {t.updatedAt}
                        </span>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">{t.subject}</p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground/80">
                        {last?.text}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <ChannelIcon channel={t.channel} />
                        <StatusTag status={t.status} />
                        {t.unread > 0 && (
                          <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-semibold text-brand-foreground">
                            {t.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="px-4 py-10 text-center text-sm text-muted-foreground">
                Nenhuma conversa encontrada.
              </li>
            )}
          </ul>
        </section>

        {/* Coluna central */}
        <section className="flex min-h-0 flex-col bg-background">
          <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-surface px-5 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <Initials name={contact.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {contact.name}{" "}
                  <span className="font-normal text-muted-foreground">· {active.id}</span>
                </p>
                <p className="truncate text-xs text-muted-foreground">{active.subject}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ChannelBadge channel={active.channel} />
              <StatusTag status={active.status} />
              <div className="relative">
                <button
                  onClick={() => setStatusOpen((o) => !o)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium hover:bg-accent"
                >
                  Alterar status <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {statusOpen && (
                  <div className="absolute right-0 z-20 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
                    {STATUS_ORDER.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          updateActive((t) => ({ ...t, status: s }));
                          setStatusOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                      >
                        <span className="w-4">
                          {active.status === s && <Check className="h-4 w-4 text-brand" />}
                        </span>
                        {STATUS_LABEL[s]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {isClosed && (
                <button
                  onClick={() => updateActive((t) => ({ ...t, status: "em_atendimento" }))}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground hover:opacity-90"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reabrir
                </button>
              )}
            </div>
          </header>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-5">
            {active.messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>

          <footer className="border-t border-border bg-surface px-5 py-3">
            <div className="mb-2 flex items-center gap-2">
              <button
                onClick={() => setNoteMode(false)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium",
                  !noteMode ? "bg-brand-soft text-brand" : "text-muted-foreground hover:bg-accent",
                )}
              >
                Responder ao cliente
              </button>
              <button
                onClick={() => setNoteMode(true)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium",
                  noteMode
                    ? "bg-status-pendente-soft text-status-pendente"
                    : "text-muted-foreground hover:bg-accent",
                )}
              >
                <StickyNote className="h-3.5 w-3.5" /> Nota interna
              </button>
            </div>
            <div
              className={cn(
                "rounded-xl border p-2",
                noteMode ? "border-status-pendente bg-status-pendente-soft/40" : "border-border bg-background",
              )}
            >
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={2}
                placeholder={
                  noteMode
                    ? "Escreva uma nota visível apenas para a equipe…"
                    : "Escreva sua mensagem…"
                }
                className="w-full resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground"
              />
              <div className="flex items-center gap-1 px-1">
                <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className="rounded-md p-1.5 text-muted-foreground hover:bg-accent">
                  <Smile className="h-4 w-4" />
                </button>
                <span className="ml-auto text-[11px] text-muted-foreground">
                  {noteMode ? "Somente a equipe vê esta nota" : "Enter envia · Shift+Enter quebra linha"}
                </span>
                <button
                  onClick={send}
                  className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-brand-foreground hover:opacity-90"
                >
                  <Send className="h-3.5 w-3.5" /> {noteMode ? "Salvar nota" : "Enviar"}
                </button>
              </div>
            </div>
          </footer>
        </section>

        {/* Coluna direita */}
        <aside className="hidden min-h-0 flex-col overflow-y-auto border-l border-border bg-surface xl:flex">
          <div className="flex flex-col items-center gap-2 border-b border-border px-5 py-6 text-center">
            <Initials name={contact.name} className="h-14 w-14 text-base" />
            <p className="text-sm font-semibold">{contact.name}</p>
            <p className="text-xs text-muted-foreground">{contact.role}</p>
            <Link
              to="/contatos/$contactId"
              params={{ contactId: contact.id }}
              className="mt-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
            >
              Ver ficha completa
            </Link>
          </div>

          <div className="space-y-3 border-b border-border px-5 py-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Dados do contato
            </h3>
            <InfoRow icon={Phone} label="Telefone" value={contact.phone} />
            <InfoRow icon={Mail} label="E-mail" value={contact.email} />
            <InfoRow icon={Building2} label="Empresa" value={company.name} />
          </div>

          <div className="px-5 py-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Atendimentos anteriores
            </h3>
            <ul className="space-y-2">
              {history.map((h) => (
                <li key={h.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center gap-2">
                    <ChannelIcon channel={h.channel} />
                    <span className="truncate text-xs font-medium">{h.id}</span>
                    <span className="ml-auto text-[11px] text-muted-foreground">{h.date}</span>
                  </div>
                  <p className="mt-1.5 truncate text-xs text-muted-foreground">{h.subject}</p>
                  <StatusTag status={h.status} className="mt-2" />
                </li>
              ))}
              {history.length === 0 && (
                <li className="text-xs text-muted-foreground">Nenhum atendimento anterior.</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="truncate text-sm">{value}</p>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  if (message.author === "nota") {
    return (
      <div className="mx-auto max-w-[80%] rounded-xl border border-status-pendente/40 bg-status-pendente-soft px-4 py-2.5">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-status-pendente">
          <StickyNote className="h-3.5 w-3.5" /> Nota interna · {message.authorName}
        </p>
        <p className="mt-1 text-sm text-foreground">{message.text}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{message.time}</p>
      </div>
    );
  }
  const mine = message.author === "agente";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[72%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
          mine
            ? "rounded-br-sm bg-brand text-brand-foreground"
            : "rounded-bl-sm border border-border bg-surface text-foreground",
        )}
      >
        <p>{message.text}</p>
        <p
          className={cn(
            "mt-1 text-[11px]",
            mine ? "text-brand-foreground/70" : "text-muted-foreground",
          )}
        >
          {message.authorName} · {message.time}
        </p>
      </div>
    </div>
  );
}
