import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  CURRENT_AGENT,
  conversations as seedConversations,
  kanbanColumns as seedColumns,
  messages as seedMessages,
  tickets as seedTickets,
  type Conversation,
  type KanbanColumn,
  type Message,
  type Ticket,
  type TicketStatus,
  STATUS_LABEL,
} from "./mock-data";

type AppState = {
  tickets: Ticket[];
  messages: Message[];
  conversations: Conversation[];
  columns: KanbanColumn[];
};

type AppActions = {
  setStatus: (ticketId: string, status: TicketStatus) => void;
  reopen: (ticketId: string) => void;
  mergeTicket: (sourceId: string, targetId: string) => void;
  switchActiveTicket: (conversationId: string, ticketId: string) => void;
  createTicket: (
    conversationId: string,
    contactId: string,
    subject: string,
  ) => string;
  sendMessage: (
    conversationId: string,
    ticketId: string,
    text: string,
    mode: "reply" | "note",
  ) => void;
  addTask: (input: {
    subject: string;
    contactId: string;
    agent: string;
    kind: "ticket" | "tarefa";
    priority: "baixa" | "media" | "alta" | "urgente";
    dueDate?: string;
    channel: Ticket["channel"];
  }) => string;
  transfer: (ticketId: string, agent: string) => void;
  markRead: (conversationId: string) => void;
  moveTicketToColumn: (ticketId: string, columnId: string | null) => void;
  addColumn: (title: string) => void;
  renameColumn: (id: string, title: string) => void;
  removeColumn: (id: string) => void;
  moveColumn: (id: string, dir: -1 | 1) => void;
};

const Ctx = createContext<(AppState & AppActions) | null>(null);

let seq = 9000;
const nextId = (prefix: string) => `${prefix}${++seq}`;

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(seedTickets);
  const [messages, setMessages] = useState<Message[]>(seedMessages);
  const [conversations, setConversations] =
    useState<Conversation[]>(seedConversations);
  const [columns, setColumns] = useState<KanbanColumn[]>(seedColumns);

  const systemMessage = useCallback(
    (ticketId: string, text: string) => {
      setMessages((prev) => {
        const conv = seedConversations.find((c) => c.activeTicketId === ticketId);
        const conversationId =
          prev.find((m) => m.ticketId === ticketId)?.conversationId ?? conv?.id;
        if (!conversationId) return prev;
        return [
          ...prev,
          {
            id: nextId("msg"),
            conversationId,
            ticketId,
            kind: "sistema",
            authorName: "",
            text,
            time: "agora",
          },
        ];
      });
    },
    [],
  );

  const setStatus = useCallback(
    (ticketId: string, status: TicketStatus) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? {
                ...t,
                status,
                updatedAt: "agora",
                closedAt:
                  status === "resolvido" || status === "nao_resolvido"
                    ? "11/08/2026"
                    : undefined,
              }
            : t,
        ),
      );
      systemMessage(
        ticketId,
        `Status alterado para ${STATUS_LABEL[status]} por ${CURRENT_AGENT}`,
      );
    },
    [systemMessage],
  );

  const reopen = useCallback(
    (ticketId: string) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, status: "aberto", closedAt: undefined, updatedAt: "agora" }
            : t,
        ),
      );
      systemMessage(ticketId, `Ticket reaberto por ${CURRENT_AGENT}`);
    },
    [systemMessage],
  );

  const mergeTicket = useCallback(
    (sourceId: string, targetId: string) => {
      setTickets((prev) =>
        prev.map((t) =>
          t.id === sourceId
            ? {
                ...t,
                status: "mesclado",
                mergedInto: targetId,
                kanbanColumn: null,
                updatedAt: "agora",
              }
            : t,
        ),
      );
      setConversations((prev) =>
        prev.map((c) =>
          c.activeTicketId === sourceId ? { ...c, activeTicketId: targetId } : c,
        ),
      );
      systemMessage(
        targetId,
        `Ticket #${sourceId} mesclado neste ticket por ${CURRENT_AGENT}`,
      );
    },
    [systemMessage],
  );

  const switchActiveTicket = useCallback(
    (conversationId: string, ticketId: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, activeTicketId: ticketId } : c,
        ),
      );
      setTickets((current) => {
        const target = current.find((t) => t.id === ticketId);
        setMessages((prev) => [
          ...prev,
          {
            id: nextId("msg"),
            conversationId,
            ticketId: null,
            kind: "sistema",
            authorName: "",
            text: "Sessão encerrada",
            time: "agora",
          },
          {
            id: nextId("msg"),
            conversationId,
            ticketId,
            kind: "sistema",
            authorName: "",
            text: `Sessão iniciada — Ticket #${ticketId}${target ? ` · ${target.subject}` : ""}`,
            time: "agora",
          },
        ]);
        return current;
      });
    },
    [],
  );

  const createTicket = useCallback(
    (conversationId: string, contactId: string, subject: string) => {
      const id = String(1060 + Math.floor(Math.random() * 900));
      setTickets((prev) => {
        const channel =
          seedConversations.find((c) => c.id === conversationId)?.channel ??
          "webchat";
        const ticket: Ticket = {
          id,
          subject,
          contactId,
          channel,
          status: "aberto",
          agent: CURRENT_AGENT,
          openedAt: "11/08/2026",
          updatedAt: "agora",
          waiting: "agora",
          kanbanColumn: null,
        };
        return [ticket, ...prev];
      });
      switchActiveTicket(conversationId, id);
      return id;
    },
    [switchActiveTicket],
  );

  const sendMessage = useCallback(
    (
      conversationId: string,
      ticketId: string,
      text: string,
      mode: "reply" | "note",
    ) => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId("msg"),
          conversationId,
          ticketId,
          kind: mode === "note" ? "nota" : "agente",
          authorName: CURRENT_AGENT,
          text,
          time: "agora",
          ...(mode === "reply" ? { delivery: "enviada" as const } : {}),
        },
      ]);
    },
    [],
  );

  const addTask = useCallback<AppActions["addTask"]>((input) => {
    const id = String(2000 + Math.floor(Math.random() * 7000));
    setTickets((prev) => [
      {
        id,
        subject: input.subject,
        contactId: input.contactId,
        channel: input.channel,
        status: "aberto",
        agent: input.agent,
        openedAt: "01/10/2026",
        updatedAt: "agora",
        waiting: "agora",
        kanbanColumn: null,
        kind: input.kind,
        priority: input.priority,
        dueDate: input.dueDate || undefined,
        createdBy: CURRENT_AGENT,
      },
      ...prev,
    ]);
    return id;
  }, []);

  const transfer = useCallback(
    (ticketId: string, agent: string) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, agent, updatedAt: "agora" } : t)),
      );
      systemMessage(ticketId, `Ticket transferido para ${agent}`);
    },
    [systemMessage],
  );

  const markRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)),
    );
  }, []);

  const moveTicketToColumn = useCallback(
    (ticketId: string, columnId: string | null) => {
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, kanbanColumn: columnId } : t)),
      );
    },
    [],
  );

  const addColumn = useCallback((title: string) => {
    setColumns((prev) => [...prev, { id: nextId("col"), title }]);
  }, []);

  const renameColumn = useCallback((id: string, title: string) => {
    setColumns((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
  }, []);

  const removeColumn = useCallback((id: string) => {
    setColumns((prev) => prev.filter((c) => c.id !== id));
    setTickets((prev) =>
      prev.map((t) => (t.kanbanColumn === id ? { ...t, kanbanColumn: null } : t)),
    );
  }, []);

  const moveColumn = useCallback((id: string, dir: -1 | 1) => {
    setColumns((prev) => {
      const i = prev.findIndex((c) => c.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(i, 1);
      next.splice(j, 0, item!);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      tickets,
      messages,
      conversations,
      columns,
      setStatus,
      reopen,
      mergeTicket,
      switchActiveTicket,
      createTicket,
      sendMessage,
      addTask,
      transfer,
      markRead,
      moveTicketToColumn,
      addColumn,
      renameColumn,
      removeColumn,
      moveColumn,
    }),
    [
      tickets,
      messages,
      conversations,
      columns,
      setStatus,
      reopen,
      mergeTicket,
      switchActiveTicket,
      createTicket,
      sendMessage,
      addTask,
      transfer,
      markRead,
      moveTicketToColumn,
      addColumn,
      renameColumn,
      removeColumn,
      moveColumn,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp precisa estar dentro de AppStateProvider");
  return ctx;
}
