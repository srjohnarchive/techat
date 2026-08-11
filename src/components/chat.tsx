import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  Clock,
  Lock,
  Paperclip,
  Send,
  Sparkles,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Initials } from "@/components/atoms";
import { useApp } from "@/lib/app-state";
import type { Channel, Message } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function ChatTimeline({ items }: { items: Message[] }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [items.length]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-background px-4 py-5 sm:px-6">
      {items.map((msg) => {
        if (msg.kind === "sistema") {
          return (
            <div key={msg.id} className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-border" />
              <span className="whitespace-nowrap text-[11px] text-muted-foreground">
                {msg.text} · {msg.time}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
          );
        }

        if (msg.kind === "nota") {
          return (
            <div key={msg.id} className="flex justify-center">
              <div className="w-full max-w-[85%] rounded-xl border border-note-border bg-note-soft px-4 py-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-note">
                  <Lock className="h-3 w-3" /> Nota interna — visível apenas para a
                  equipe
                </p>
                <p className="mt-1.5 text-sm text-foreground">{msg.text}</p>
                <p className="mt-1 text-[11px] text-note">
                  {msg.authorName} · {msg.time}
                </p>
              </div>
            </div>
          );
        }

        const mine = msg.kind === "agente";
        return (
          <div
            key={msg.id}
            className={cn("flex items-end gap-2", mine && "flex-row-reverse")}
          >
            <Initials name={msg.authorName} className="h-7 w-7 text-[10px]" />
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm",
                mine
                  ? "rounded-br-sm bg-brand text-brand-foreground"
                  : "rounded-bl-sm border border-border bg-surface",
              )}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <p
                className={cn(
                  "mt-1 flex items-center justify-end gap-1 text-[10px]",
                  mine ? "text-brand-foreground/80" : "text-muted-foreground",
                )}
              >
                {msg.time}
                {mine &&
                  (msg.delivery === "lida" ? (
                    <CheckCheck className="h-3 w-3" />
                  ) : msg.delivery === "entregue" ? (
                    <CheckCheck className="h-3 w-3 opacity-70" />
                  ) : (
                    <Check className="h-3 w-3 opacity-70" />
                  ))}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}

const quickReplies = [
  "Olá! Já estou verificando e retorno em instantes.",
  "Poderia confirmar o número do pedido, por favor?",
  "Obrigado pelo contato! Posso ajudar em mais algo?",
];

export function Composer({
  conversationId,
  ticketId,
  channel,
  windowHoursLeft,
}: {
  conversationId: string;
  ticketId: string;
  channel: Channel;
  windowHoursLeft?: number | undefined;
}) {
  const { sendMessage } = useApp();
  const [mode, setMode] = useState<"reply" | "note">("reply");
  const [text, setText] = useState("");
  const [showQuick, setShowQuick] = useState(false);

  const expired = channel === "whatsapp" && windowHoursLeft === 0;
  const blocked = expired && mode === "reply";

  function submit() {
    if (!text.trim() || blocked) return;
    sendMessage(conversationId, ticketId, text.trim(), mode);
    setText("");
  }

  return (
    <div
      className={cn(
        "border-t px-4 py-3 sm:px-6",
        mode === "note" ? "border-note-border bg-note-soft" : "border-border bg-surface",
      )}
    >
      {channel === "whatsapp" && (
        <div
          className={cn(
            "mb-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
            expired
              ? "bg-status-negado-soft text-status-negado"
              : "bg-status-atendimento-soft text-status-atendimento",
          )}
        >
          <Clock className="h-3 w-3" />
          {expired
            ? "Janela de 24h expirada — envio livre bloqueado"
            : `Janela de 24h: ${windowHoursLeft}h restantes`}
        </div>
      )}

      <div className="mb-2 inline-flex rounded-lg border border-border bg-background p-0.5">
        <button
          onClick={() => setMode("reply")}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            mode === "reply"
              ? "bg-brand text-brand-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Responder ao cliente
        </button>
        <button
          onClick={() => setMode("note")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            mode === "note"
              ? "bg-note text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Lock className="h-3 w-3" /> Nota interna
        </button>
      </div>

      {showQuick && (
        <div className="mb-2 flex flex-wrap gap-2">
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => {
                setText(q);
                setShowQuick(false);
              }}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs hover:bg-accent"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {blocked ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-background px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Fora da janela de 24h. Só é possível iniciar com um template aprovado.
          </p>
          <Button
            onClick={() =>
              sendMessage(
                conversationId,
                ticketId,
                "[Template] Olá! Retomando seu atendimento, podemos seguir por aqui?",
                "reply",
              )
            }
          >
            <Sparkles className="mr-1.5 h-4 w-4" /> Enviar template
          </Button>
        </div>
      ) : (
        <div className="flex items-end gap-2">
          <button
            title="Anexar arquivo"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            title="Respostas rápidas"
            onClick={() => setShowQuick((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-accent"
          >
            <StickyNote className="h-4 w-4" />
          </button>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder={
              mode === "note"
                ? "Escreva uma nota interna (o cliente não vê)"
                : "Escreva sua resposta ao cliente"
            }
            className={cn(
              "min-h-9 flex-1 resize-none rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring",
              mode === "note"
                ? "border-note-border bg-background"
                : "border-input bg-background",
            )}
          />
          <Button
            onClick={submit}
            className={cn(mode === "note" && "bg-note text-background hover:bg-note/90")}
          >
            <Send className="mr-1.5 h-4 w-4" />
            {mode === "note" ? "Salvar nota" : "Enviar"}
          </Button>
        </div>
      )}
    </div>
  );
}
