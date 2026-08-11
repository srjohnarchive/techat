import { MessageSquare, Mail, Phone } from "lucide-react";
import type { Channel, TicketStatus } from "@/lib/mock-data";
import { STATUS_LABEL, CHANNEL_LABEL } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusStyles: Record<TicketStatus, string> = {
  aberto: "bg-status-aberto-soft text-status-aberto",
  em_atendimento: "bg-status-atendimento-soft text-status-atendimento",
  pendente: "bg-status-pendente-soft text-status-pendente",
  resolvido: "bg-status-resolvido-soft text-status-resolvido",
  nao_resolvido: "bg-status-negado-soft text-status-negado",
  mesclado: "bg-status-mesclado-soft text-status-mesclado",
};

export function StatusTag({
  status,
  className,
}: {
  status: TicketStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        statusStyles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  );
}

const channelStyles: Record<Channel, string> = {
  whatsapp: "text-chan-whatsapp",
  webchat: "text-chan-webchat",
  email: "text-chan-email",
};

const channelIcons: Record<Channel, typeof Mail> = {
  whatsapp: Phone,
  webchat: MessageSquare,
  email: Mail,
};

export function ChannelIcon({
  channel,
  className,
}: {
  channel: Channel;
  className?: string;
}) {
  const Icon = channelIcons[channel];
  return (
    <span
      title={CHANNEL_LABEL[channel]}
      aria-label={CHANNEL_LABEL[channel]}
      className={cn(
        "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted",
        channelStyles[channel],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

export function ChannelBadge({ channel }: { channel: Channel }) {
  const Icon = channelIcons[channel];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium",
        channelStyles[channel],
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {CHANNEL_LABEL[channel]}
    </span>
  );
}

export function Initials({ name, className }: { name: string; className?: string }) {
  const letters = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
  return (
    <span
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand",
        className,
      )}
    >
      {letters}
    </span>
  );
}
