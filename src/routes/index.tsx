import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Building2,
  ChevronDown,
  Mail,
  MessageSquarePlus,
  MoreVertical,
  PanelRightClose,
  PanelRightOpen,
  Phone,
  RotateCcw,
  Search,
  Ticket as TicketIcon,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { ChannelIcon, Initials, StatusTag } from "@/components/atoms";
import { ChatTimeline, Composer } from "@/components/chat";
import {
  CompanyDialog,
  ContactDialog,
  MergeDialog,
  NewConversationDialog,
  TicketDrawer,
  TransferDialog,
  useTicketsOfCompany,
  useTicketsOfContact,
} from "@/components/panels";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/app-state";
import {
  CHANNELS,
  CHANNEL_LABEL,
  QUEUE_STATUSES,
  STATUS_LABEL,
  getCompany,
  getContact,
  type Channel,
  type TicketStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Caixa de entrada unificada — Techat" },
      {
        name: "description",
        content:
          "Atenda WhatsApp, Webchat e E-mail em uma única tela, com tickets, sessões e notas internas na mesma timeline.",
      },
      { property: "og:title", content: "Caixa de entrada unificada — Techat" },
      {
        property: "og:description",
        content:
          "Central de atendimento omnichannel B2B com fila unificada, tickets e contexto do cliente.",
      },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  const { conversations, tickets, messages, setStatus, reopen, markRead } = useApp();

  const [selectedId, setSelectedId] = useState(conversations[0]!.id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketStatus[]>([]);
  const [channelFilter, setChannelFilter] = useState<Channel[]>([]);
  const [contextOpen, setContextOpen] = useState(true);
  const [ticketDrawer, setTicketDrawer] = useState(false);
  const [mergeOpen, setMergeOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [newConversation, setNewConversation] = useState(false);

  const rows = useMemo(
    () =>
      conversations.map((cv) => {
        const contact = getContact(cv.contactId);
        const company = getCompany(contact.companyId);
        const ticket = tickets.find((t) => t.id === cv.activeTicketId)!;
        const last = [...messages]
          .reverse()
          .find((m) => m.conversationId === cv.id && m.kind !== "sistema");
        return { cv, contact, company, ticket, last };
      }),
    [conversations, tickets, messages],
  );

  const filtered = rows.filter(({ contact, company, ticket }) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      contact.name.toLowerCase().includes(q) ||
      (company?.name.toLowerCase().includes(q) ?? false) ||
      ticket.id.includes(q.replace("#", "")) ||
      ticket.subject.toLowerCase().includes(q);
    const matchStatus =
      statusFilter.length === 0 || statusFilter.includes(ticket.status);
    const matchChannel =
      channelFilter.length === 0 || channelFilter.includes(ticket.channel);
    return matchQ && matchStatus && matchChannel;
  });

  const current = rows.find((r) => r.cv.id === selectedId)!;
  const timeline = messages.filter((m) => m.conversationId === current.cv.id);
  const contactTickets = useTicketsOfContact(current.contact.id);
  const companyTickets = useTicketsOfCompany(current.contact.companyId);
  const closed =
    current.ticket.status === "resolvido" || current.ticket.status === "nao_resolvido";

  function toggle<T>(list: T[], value: T, set: (v: T[]) => void) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  return (
    <AppShell>
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* Coluna 1 — fila */}
        <section className="flex min-h-0 flex-col border-r border-border bg-surface">
          <div className="space-y-3 border-b border-border p-4">
            <div className="flex items-center gap-2">
              <div className="relative min-w-0 flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Contato, empresa ou #ticket"
                  className="h-9 w-full rounded-lg border border-input bg-background pl-8 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <Button
                size="icon"
                title="Nova conversa"
                onClick={() => setNewConversation(true)}
              >
                <MessageSquarePlus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUEUE_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => toggle(statusFilter, s, setStatusFilter)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                    statusFilter.includes(s)
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {CHANNELS.map((ch) => (
                <button
                  key={ch}
                  onClick={() => toggle(channelFilter, ch, setChannelFilter)}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] font-medium transition-colors",
                    channelFilter.includes(ch)
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border text-muted-foreground hover:bg-accent",
                  )}
                >
                  <ChannelIcon channel={ch} className="h-5 w-5 bg-transparent" />
                  <span className="truncate">{CHANNEL_LABEL[ch]}</span>
                </button>
              ))}
            </div>
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto">
            {filtered.map(({ cv, contact, company, ticket, last }) => (
              <li key={cv.id}>
                <button
                  onClick={() => {
                    setSelectedId(cv.id);
                    markRead(cv.id);
                  }}
                  className={cn(
                    "grid w-full grid-cols-[auto_minmax(0,1fr)_auto] gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent",
                    cv.id === selectedId && "bg-brand-soft/70",
                  )}
                >
                  <Initials name={contact.name} />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-sm font-medium">{contact.name}</span>
                      <ChannelIcon
                        channel={cv.channel}
                        className="h-4 w-4 bg-transparent"
                      />
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {company?.name ?? "Sem empresa vinculada"}
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {last?.kind === "nota" ? "Nota: " : ""}
                      {last?.text ?? "Sem mensagens"}
                    </span>
                    <span className="mt-1.5 flex items-center gap-1.5">
                      <StatusTag status={ticket.status} />
                      <span className="truncate text-[11px] text-muted-foreground">
                        #{ticket.id}
                      </span>
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-1.5">
                    <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                      {cv.lastActivity}
                    </span>
                    {cv.unread > 0 && (
                      <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1.5 text-[11px] font-semibold text-brand-foreground">
                        {cv.unread}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="p-6 text-center text-sm text-muted-foreground">
                Nenhuma conversa com esses filtros.
              </li>
            )}
          </ul>
        </section>

        {/* Coluna 2 + 3 */}
        <div
          className={cn(
            "grid min-h-0",
            contextOpen ? "xl:grid-cols-[minmax(0,1fr)_320px]" : "grid-cols-1",
          )}
        >
          <section className="flex min-h-0 flex-col">
            <header className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3 sm:px-6">
              <Initials name={current.contact.name} />
              <div className="min-w-0 flex-1 basis-40">
                <p className="truncate text-sm font-semibold">{current.contact.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {current.company?.name ?? "Visitante não identificado"}
                </p>
              </div>

              <button
                onClick={() => setTicketDrawer(true)}
                title="Trocar assunto ou criar ticket"
                className="inline-flex min-w-0 max-w-[280px] shrink items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
              >
                <TicketIcon className="h-3.5 w-3.5 shrink-0 text-brand" />
                <span className="truncate">
                  #{current.ticket.id} · {current.ticket.subject}
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center gap-1">
                    <StatusTag status={current.ticket.status} />
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Alterar status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {QUEUE_STATUSES.map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => setStatus(current.ticket.id, s)}
                    >
                      {STATUS_LABEL[s]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {closed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => reopen(current.ticket.id)}
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reabrir
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    title="Mais ações"
                    className="grid h-8 w-8 place-items-center rounded-lg border border-border hover:bg-accent"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setMergeOpen(true)}>
                    Mesclar ticket
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTransferOpen(true)}>
                    Transferir para outro atendente
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setContactOpen(true)}>
                    Ver ficha do contato
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={!current.company}
                    onClick={() => setCompanyOpen(true)}
                  >
                    Ver ficha da empresa
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                onClick={() => setContextOpen((v) => !v)}
                title={contextOpen ? "Ocultar contexto" : "Mostrar contexto"}
                className="hidden h-8 w-8 place-items-center rounded-lg border border-border hover:bg-accent xl:grid"
              >
                {contextOpen ? (
                  <PanelRightClose className="h-4 w-4" />
                ) : (
                  <PanelRightOpen className="h-4 w-4" />
                )}
              </button>
            </header>

            {current.ticket.status === "mesclado" && (
              <p className="border-b border-border bg-status-mesclado-soft px-6 py-2 text-xs text-status-mesclado">
                Este ticket foi mesclado no ticket #{current.ticket.mergedInto}.
              </p>
            )}
            {current.contact.unidentified && (
              <p className="flex items-center gap-2 border-b border-border bg-status-pendente-soft px-6 py-2 text-xs text-status-pendente">
                <AlertTriangle className="h-3.5 w-3.5" />
                Visitante não identificado — complete o cadastro e vincule a uma empresa.
              </p>
            )}
            {current.cv.emailSubject && (
              <p className="border-b border-border bg-muted/60 px-6 py-2 text-xs text-muted-foreground">
                Thread de e-mail: {current.cv.emailSubject}
              </p>
            )}

            <ChatTimeline items={timeline} />

            <Composer
              conversationId={current.cv.id}
              ticketId={current.ticket.id}
              channel={current.cv.channel}
              windowHoursLeft={current.cv.windowHoursLeft}
            />
          </section>

          {contextOpen && (
            <aside className="hidden min-h-0 flex-col gap-4 overflow-y-auto border-l border-border bg-surface p-4 xl:flex">
              <div>
                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Contato
                </h2>
                <p className="text-sm font-medium">{current.contact.name}</p>
                <p className="text-xs text-muted-foreground">{current.contact.role}</p>
                <p className="mt-2 flex items-center gap-2 text-xs">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{current.contact.phone}</span>
                </p>
                <p className="flex items-center gap-2 text-xs">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{current.contact.email}</span>
                </p>
                <button
                  onClick={() => setContactOpen(true)}
                  className="mt-2 text-xs font-medium text-brand hover:underline"
                >
                  Ver ficha completa
                </button>
              </div>

              <div className="border-t border-border pt-4">
                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Empresa
                </h2>
                {current.company ? (
                  <>
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">{current.company.name}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CNPJ {current.company.cnpj}
                    </p>
                    <button
                      onClick={() => setCompanyOpen(true)}
                      className="mt-2 text-xs font-medium text-brand hover:underline"
                    >
                      Ver empresa
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground">Não vinculada</p>
                )}
              </div>

              <div className="min-h-0 border-t border-border pt-4">
                <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Histórico
                </h2>
                <Tabs defaultValue="contato">
                  <TabsList className="w-full">
                    <TabsTrigger value="contato" className="flex-1 text-xs">
                      Deste contato
                    </TabsTrigger>
                    <TabsTrigger value="empresa" className="flex-1 text-xs">
                      Desta empresa
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="contato" className="space-y-1.5">
                    {contactTickets.map((t) => (
                      <HistoryItem
                        key={t.id}
                        id={t.id}
                        subject={t.subject}
                        channel={t.channel}
                        status={t.status}
                        date={t.openedAt}
                        onClick={() => {
                          const cv = conversations.find(
                            (c) => c.contactId === t.contactId,
                          );
                          if (cv) setSelectedId(cv.id);
                        }}
                      />
                    ))}
                  </TabsContent>
                  <TabsContent value="empresa" className="space-y-1.5">
                    {companyTickets.map((t) => (
                      <HistoryItem
                        key={t.id}
                        id={t.id}
                        subject={t.subject}
                        channel={t.channel}
                        status={t.status}
                        date={t.openedAt}
                        onClick={() => {
                          const cv = conversations.find(
                            (c) => c.contactId === t.contactId,
                          );
                          if (cv) setSelectedId(cv.id);
                        }}
                      />
                    ))}
                    {companyTickets.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Nenhum ticket da empresa.
                      </p>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </aside>
          )}
        </div>
      </div>

      <TicketDrawer
        conversationId={current.cv.id}
        contactId={current.contact.id}
        open={ticketDrawer}
        onOpenChange={setTicketDrawer}
      />
      <MergeDialog
        ticketId={current.ticket.id}
        open={mergeOpen}
        onOpenChange={setMergeOpen}
      />
      <TransferDialog
        ticketId={current.ticket.id}
        open={transferOpen}
        onOpenChange={setTransferOpen}
      />
      <ContactDialog
        contactId={current.contact.id}
        open={contactOpen}
        onOpenChange={setContactOpen}
      />
      <CompanyDialog
        companyId={current.contact.companyId}
        open={companyOpen}
        onOpenChange={setCompanyOpen}
      />
      <NewConversationDialog
        open={newConversation}
        onOpenChange={setNewConversation}
        onStarted={setSelectedId}
      />
    </AppShell>
  );
}

function HistoryItem({
  id,
  subject,
  channel,
  status,
  date,
  onClick,
}: {
  id: string;
  subject: string;
  channel: Channel;
  status: TicketStatus;
  date: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-lg border border-border p-2.5 text-left transition-colors hover:bg-accent"
    >
      <span className="flex items-center gap-2">
        <ChannelIcon channel={channel} className="h-5 w-5" />
        <span className="min-w-0 flex-1 truncate text-xs font-medium">
          #{id} · {subject}
        </span>
      </span>
      <span className="mt-1.5 flex items-center justify-between gap-2">
        <StatusTag status={status} />
        <span className="text-[11px] text-muted-foreground">{date}</span>
      </span>
    </button>
  );
}
