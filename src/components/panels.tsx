import { useMemo, useState } from "react";
import {
  Building2,
  Mail,
  Phone,
  Plus,
  Merge,
  UserPlus,
  MessageSquarePlus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChannelIcon, Initials, StatusTag } from "@/components/atoms";
import { useApp } from "@/lib/app-state";
import {
  CURRENT_AGENT,
  companies,
  contacts,
  getCompany,
  getContact,
  users,
  type Ticket,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function useTicketsOfContact(contactId: string) {
  const { tickets } = useApp();
  return useMemo(
    () => tickets.filter((t) => t.contactId === contactId),
    [tickets, contactId],
  );
}

export function useTicketsOfCompany(companyId: string | null | undefined) {
  const { tickets } = useApp();
  return useMemo(() => {
    if (!companyId) return [];
    const ids = contacts.filter((c) => c.companyId === companyId).map((c) => c.id);
    return tickets.filter((t) => ids.includes(t.contactId));
  }, [tickets, companyId]);
}

export function TicketTable({
  items,
  onSelect,
  showContact,
}: {
  items: Ticket[];
  onSelect?: (ticket: Ticket) => void;
  showContact?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 font-medium">Nº</th>
            {showContact && <th className="px-3 py-2 font-medium">Contato</th>}
            <th className="px-3 py-2 font-medium">Assunto</th>
            <th className="px-3 py-2 font-medium">Canal</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 font-medium">Abertura</th>
            <th className="px-3 py-2 font-medium">Encerramento</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr
              key={t.id}
              onClick={() => onSelect?.(t)}
              className={cn(
                "border-t border-border",
                onSelect && "cursor-pointer hover:bg-accent",
              )}
            >
              <td className="whitespace-nowrap px-3 py-2 font-medium">#{t.id}</td>
              {showContact && (
                <td className="px-3 py-2">{getContact(t.contactId).name}</td>
              )}
              <td className="max-w-0 px-3 py-2">
                <span className="block truncate">{t.subject}</span>
                {t.mergedInto && (
                  <span className="text-xs text-muted-foreground">
                    Mesclado no ticket #{t.mergedInto}
                  </span>
                )}
              </td>
              <td className="px-3 py-2">
                <ChannelIcon channel={t.channel} />
              </td>
              <td className="px-3 py-2">
                <StatusTag status={t.status} />
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                {t.openedAt}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-muted-foreground">
                {t.closedAt ?? "—"}
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">
                Nenhum ticket encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Field({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
      <div className="min-w-0">
        <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="truncate text-sm">{value}</dd>
      </div>
    </div>
  );
}

export function ContactDialog({
  contactId,
  open,
  onOpenChange,
}: {
  contactId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const contact = contactId ? getContact(contactId) : null;
  const items = useTicketsOfContact(contactId ?? "");
  const company = getCompany(contact?.companyId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        {contact && (
          <>
            <DialogHeader>
              <DialogTitle>{contact.name}</DialogTitle>
              <DialogDescription>
                {contact.role}
                {company ? ` · ${company.name}` : " · sem empresa vinculada"}
              </DialogDescription>
            </DialogHeader>
            <dl className="grid gap-3 sm:grid-cols-2">
              <Field icon={Phone} label="Telefone" value={contact.phone} />
              <Field icon={Mail} label="E-mail" value={contact.email} />
              {contact.altPhone && (
                <Field icon={Phone} label="Telefone adicional" value={contact.altPhone} />
              )}
              {contact.altEmail && (
                <Field icon={Mail} label="E-mail adicional" value={contact.altEmail} />
              )}
              <Field
                icon={Building2}
                label="Empresa"
                value={company ? `${company.name} · ${company.cnpj}` : "—"}
              />
            </dl>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Histórico de tickets ({items.length})
            </h3>
            <TicketTable items={items} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function CompanyDialog({
  companyId,
  open,
  onOpenChange,
}: {
  companyId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const company = getCompany(companyId);
  const items = useTicketsOfCompany(companyId);
  const people = contacts.filter((c) => c.companyId === companyId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
        {company && (
          <>
            <DialogHeader>
              <DialogTitle>{company.name}</DialogTitle>
              <DialogDescription>
                {company.segment} · CNPJ {company.cnpj}
              </DialogDescription>
            </DialogHeader>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Contatos vinculados ({people.length})
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {people.map((p) => (
                <div
                  key={p.id}
                  className="flex min-w-0 items-center gap-3 rounded-lg border border-border p-3"
                >
                  <Initials name={p.name} />
                  <div className="min-w-0 text-xs">
                    <p className="truncate text-sm font-medium">{p.name}</p>
                    <p className="truncate text-muted-foreground">{p.role}</p>
                    <p className="truncate text-muted-foreground">
                      {p.phone} · {p.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Histórico consolidado ({items.length})
            </h3>
            <TicketTable items={items} showContact />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function MergeDialog({
  ticketId,
  open,
  onOpenChange,
}: {
  ticketId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { tickets, mergeTicket } = useApp();
  const source = tickets.find((t) => t.id === ticketId);
  const [target, setTarget] = useState<string | null>(null);

  const candidates = tickets.filter(
    (t) =>
      t.id !== ticketId &&
      t.status !== "mesclado" &&
      t.contactId === source?.contactId,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Mesclar ticket</DialogTitle>
          <DialogDescription>
            O ticket #{source?.id} será marcado como Mesclado e sai das filas.
            Escolha o ticket de destino.
          </DialogDescription>
        </DialogHeader>
        <ul className="max-h-72 space-y-2 overflow-y-auto">
          {candidates.map((t) => (
            <li key={t.id}>
              <button
                onClick={() => setTarget(t.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                  target === t.id
                    ? "border-brand bg-brand-soft/60"
                    : "border-border hover:bg-accent",
                )}
              >
                <ChannelIcon channel={t.channel} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    #{t.id} · {t.subject}
                  </span>
                </span>
                <StatusTag status={t.status} />
              </button>
            </li>
          ))}
          {candidates.length === 0 && (
            <li className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              Nenhum outro ticket deste contato.
            </li>
          )}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={!target || !ticketId}
            onClick={() => {
              if (ticketId && target) mergeTicket(ticketId, target);
              setTarget(null);
              onOpenChange(false);
            }}
          >
            <Merge className="mr-1.5 h-4 w-4" /> Mesclar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function TransferDialog({
  ticketId,
  open,
  onOpenChange,
}: {
  ticketId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { transfer } = useApp();
  const [agent, setAgent] = useState(CURRENT_AGENT);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir atendimento</DialogTitle>
          <DialogDescription>
            Escolha o atendente responsável pelo ticket #{ticketId}.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2">
          {users
            .filter((u) => u.active)
            .map((u) => (
              <li key={u.id}>
                <button
                  onClick={() => setAgent(u.name)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left",
                    agent === u.name
                      ? "border-brand bg-brand-soft/60"
                      : "border-border hover:bg-accent",
                  )}
                >
                  <Initials name={u.name} />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{u.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {u.profile} · {u.inProgress} em andamento
                    </span>
                  </span>
                </button>
              </li>
            ))}
        </ul>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (ticketId) transfer(ticketId, agent);
              onOpenChange(false);
            }}
          >
            <UserPlus className="mr-1.5 h-4 w-4" /> Transferir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Drawer com os tickets do contato: troca de assunto ou criação de ticket. */
export function TicketDrawer({
  conversationId,
  contactId,
  open,
  onOpenChange,
}: {
  conversationId: string;
  contactId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { conversations, switchActiveTicket, createTicket } = useApp();
  const items = useTicketsOfContact(contactId);
  const active = conversations.find((c) => c.id === conversationId)?.activeTicketId;
  const [subject, setSubject] = useState("");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Tickets de {getContact(contactId).name}</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 px-4 pb-6">
          <p className="text-xs text-muted-foreground">
            A conversa é contínua. Ao trocar o assunto, a sessão atual é encerrada e uma
            nova sessão começa vinculada ao ticket escolhido.
          </p>
          <ul className="space-y-2">
            {items.map((t) => (
              <li key={t.id}>
                <button
                  disabled={t.status === "mesclado"}
                  onClick={() => {
                    switchActiveTicket(conversationId, t.id);
                    onOpenChange(false);
                  }}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-colors disabled:opacity-60",
                    t.id === active
                      ? "border-brand bg-brand-soft/60"
                      : "border-border hover:bg-accent",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      #{t.id} · {t.subject}
                    </span>
                    <StatusTag status={t.status} />
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {t.id === active ? "Sessão ativa" : `Atualizado ${t.updatedAt}`}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <div className="rounded-lg border border-dashed border-border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Criar novo ticket
            </p>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto do novo ticket"
            />
            <Button
              className="mt-2 w-full"
              disabled={!subject.trim()}
              onClick={() => {
                createTicket(conversationId, contactId, subject.trim());
                setSubject("");
                onOpenChange(false);
              }}
            >
              <Plus className="mr-1.5 h-4 w-4" /> Criar e usar
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Modal "Nova conversa": escolhe contato e o assunto do contato ativo. */
export function NewConversationDialog({
  open,
  onOpenChange,
  onStarted,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onStarted: (conversationId: string) => void;
}) {
  const { conversations, tickets, switchActiveTicket, createTicket, sendMessage } =
    useApp();
  const [contactId, setContactId] = useState(contacts[0]!.id);
  const [subject, setSubject] = useState("");

  const contact = getContact(contactId);
  const conversation = conversations.find((c) => c.contactId === contactId);
  const company = getCompany(contact.companyId);
  const contactTickets = tickets.filter(
    (t) => t.contactId === contactId && t.status !== "mesclado",
  );
  const companyTickets = tickets.filter((t) => {
    const c = getContact(t.contactId);
    return (
      c.companyId && c.companyId === contact.companyId && t.contactId !== contactId
    );
  });

  function start(ticketId: string, ticketSubject: string) {
    if (!conversation) return;
    switchActiveTicket(conversation.id, ticketId);
    sendMessage(
      conversation.id,
      ticketId,
      `Olá, ${contact.name.split(" ")[0]}. Estou retornando sobre o atendimento #${ticketId} — ${ticketSubject}.`,
      "reply",
    );
    onStarted(conversation.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sobre qual ticket você quer falar?</DialogTitle>
          <DialogDescription>
            Contato ativo iniciado pela equipe. A primeira mensagem já sai com o resumo
            do ticket.
          </DialogDescription>
        </DialogHeader>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Contato
          </p>
          <select
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {contacts
              .filter((c) => conversations.some((cv) => cv.contactId === c.id))
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {getCompany(c.companyId) ? `· ${getCompany(c.companyId)!.name}` : ""}
                </option>
              ))}
          </select>
        </div>

        <Tabs defaultValue="contato">
          <TabsList>
            <TabsTrigger value="contato">Tickets do contato</TabsTrigger>
            <TabsTrigger value="empresa">Tickets da empresa</TabsTrigger>
            <TabsTrigger value="novo">Criar novo ticket</TabsTrigger>
          </TabsList>
          <TabsContent value="contato" className="space-y-2">
            {contactTickets.map((t) => (
              <button
                key={t.id}
                onClick={() => start(t.id, t.subject)}
                className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-accent"
              >
                <ChannelIcon channel={t.channel} />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  #{t.id} · {t.subject}
                </span>
                <StatusTag status={t.status} />
              </button>
            ))}
          </TabsContent>
          <TabsContent value="empresa" className="space-y-2">
            <p className="text-xs text-muted-foreground">
              {company ? company.name : "Contato sem empresa vinculada"}
            </p>
            {companyTickets.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <ChannelIcon channel={t.channel} />
                <span className="min-w-0 flex-1 truncate text-sm">
                  #{t.id} · {t.subject}
                  <span className="block text-xs text-muted-foreground">
                    {getContact(t.contactId).name}
                  </span>
                </span>
                <StatusTag status={t.status} />
              </div>
            ))}
          </TabsContent>
          <TabsContent value="novo" className="space-y-2">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto do novo ticket"
            />
            <Button
              disabled={!subject.trim() || !conversation}
              onClick={() => {
                if (!conversation) return;
                const id = createTicket(conversation.id, contactId, subject.trim());
                sendMessage(
                  conversation.id,
                  id,
                  `Olá, ${contact.name.split(" ")[0]}. Estou entrando em contato sobre o atendimento #${id} — ${subject.trim()}.`,
                  "reply",
                );
                setSubject("");
                onStarted(conversation.id);
                onOpenChange(false);
              }}
            >
              <MessageSquarePlus className="mr-1.5 h-4 w-4" /> Criar e iniciar conversa
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export { companies };
