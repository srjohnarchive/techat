export type Channel = "whatsapp" | "webchat" | "email";

export type TicketStatus =
  | "aberto"
  | "em_atendimento"
  | "pendente"
  | "resolvido"
  | "nao_resolvido"
  | "mesclado";

export const STATUS_LABEL: Record<TicketStatus, string> = {
  aberto: "Aberto",
  em_atendimento: "Em Atendimento",
  pendente: "Pendente",
  resolvido: "Resolvido",
  nao_resolvido: "Não Resolvido",
  mesclado: "Mesclado",
};

/** Status que aparecem nas filas e nos filtros (Mesclado só em consulta). */
export const QUEUE_STATUSES: TicketStatus[] = [
  "aberto",
  "em_atendimento",
  "pendente",
  "resolvido",
  "nao_resolvido",
];

export const ALL_STATUSES: TicketStatus[] = [...QUEUE_STATUSES, "mesclado"];

export const CHANNEL_LABEL: Record<Channel, string> = {
  whatsapp: "WhatsApp",
  webchat: "Webchat",
  email: "E-mail",
};

export const CHANNELS: Channel[] = ["whatsapp", "webchat", "email"];

export type BusinessGroup = { id: string; name: string; erpSystem: string };

export const groups: BusinessGroup[] = [
  { id: "g1", name: "Grupo Vertex", erpSystem: "ERP Vertex · base única" },
  { id: "g2", name: "Holding Auroria", erpSystem: "ERP Auroria · multiempresa" },
];

export function getGroup(id: string | null | undefined) {
  return groups.find((g) => g.id === id);
}

export type Company = {
  id: string;
  groupId?: string | null | undefined;
  name: string;
  cnpj: string;
  segment: string;
  lastInteraction: string;
};

export type Contact = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  companyId: string | null;
  altPhone?: string | undefined;
  altEmail?: string | undefined;
  unidentified?: boolean | undefined;
};

export type Ticket = {
  id: string; // "1042"
  subject: string;
  contactId: string;
  channel: Channel;
  status: TicketStatus;
  agent: string;
  openedAt: string;
  closedAt?: string | undefined;
  updatedAt: string;
  waiting: string;
  kanbanColumn?: string | null | undefined;
  kind?: "ticket" | "tarefa" | undefined;
  priority?: "baixa" | "media" | "alta" | "urgente" | undefined;
  dueDate?: string | undefined;
  createdBy?: string | undefined;
  mergedInto?: string | undefined;
};

export type MessageKind = "cliente" | "agente" | "nota" | "sistema";

export type Message = {
  id: string;
  conversationId: string;
  ticketId: string | null;
  kind: MessageKind;
  authorName: string;
  text: string;
  time: string;
  delivery?: "enviada" | "entregue" | "lida" | undefined;
};

export type Conversation = {
  id: string;
  contactId: string;
  channel: Channel;
  activeTicketId: string;
  unread: number;
  lastActivity: string;
  /** Horas restantes da janela de 24h do WhatsApp. 0 = expirada. */
  windowHoursLeft?: number | undefined;
  emailSubject?: string | undefined;
};

export const companies: Company[] = [
  {
    id: "c1",
    groupId: "g1",
    name: "Vertex Logística",
    cnpj: "12.345.678/0001-90",
    segment: "Transportes",
    lastInteraction: "há 2 min",
  },
  {
    id: "c2",
    groupId: "g2",
    name: "Auroria Cosméticos",
    cnpj: "23.456.789/0001-70",
    segment: "Varejo",
    lastInteraction: "há 12 min",
  },
  {
    id: "c3",
    name: "Nortec Sistemas",
    cnpj: "34.567.890/0001-55",
    segment: "Tecnologia",
    lastInteraction: "há 2 h",
  },
  {
    id: "c4",
    groupId: "g1",
    name: "Casa Bonita Móveis",
    cnpj: "45.678.901/0001-32",
    segment: "Indústria",
    lastInteraction: "ontem",
  },
  {
    id: "c5",
    groupId: "g1",
    name: "Vertex Armazéns Filial MT",
    cnpj: "12.345.678/0002-71",
    segment: "Transportes",
    lastInteraction: "há 3 dias",
  },
  {
    id: "c6",
    groupId: "g2",
    name: "Auroria Distribuidora",
    cnpj: "23.456.789/0002-51",
    segment: "Atacado",
    lastInteraction: "semana passada",
  },
];

export const contacts: Contact[] = [
  {
    id: "p1",
    name: "Mariana Duarte",
    role: "Coordenadora de Frota",
    phone: "+55 65 99812-4471",
    email: "mariana.duarte@vertexlog.com.br",
    companyId: "c1",
    altPhone: "+55 65 3025-7700",
  },
  {
    id: "p2",
    name: "Rafael Nogueira",
    role: "Analista de Compras",
    phone: "+55 65 99134-8820",
    email: "rafael.nogueira@vertexlog.com.br",
    companyId: "c1",
    altEmail: "compras@vertexlog.com.br",
  },
  {
    id: "p3",
    name: "Beatriz Salles",
    role: "Gerente de E-commerce",
    phone: "+55 11 98822-1190",
    email: "bia.salles@auroria.com",
    companyId: "c2",
  },
  {
    id: "p4",
    name: "Otávio Prado",
    role: "Financeiro",
    phone: "+55 11 97441-0032",
    email: "otavio.prado@auroria.com",
    companyId: "c2",
    altEmail: "financeiro@auroria.com",
  },
  {
    id: "p5",
    name: "Camila Ferraz",
    role: "Product Owner",
    phone: "+55 41 99615-7788",
    email: "camila.ferraz@nortec.io",
    companyId: "c3",
  },
  {
    id: "p6",
    name: "Henrique Lima",
    role: "Suporte N2",
    phone: "+55 41 98220-3311",
    email: "henrique.lima@nortec.io",
    companyId: "c3",
  },
  {
    id: "p7",
    name: "Sônia Bertolli",
    role: "Diretora Comercial",
    phone: "+55 47 99700-5566",
    email: "sonia@casabonitamoveis.com.br",
    companyId: "c4",
    altPhone: "+55 47 3344-2020",
  },
  {
    id: "p8",
    name: "Visitante não identificado",
    role: "Origem: site institucional",
    phone: "—",
    email: "—",
    companyId: null,
    unidentified: true,
  },
  {
    id: "p9",
    name: "Lucas Amaral",
    role: "Compras",
    phone: "+55 47 99101-4432",
    email: "lucas.amaral@casabonitamoveis.com.br",
    companyId: "c4",
  },
];

export const tickets: Ticket[] = [
  {
    id: "1042",
    subject: "Erro na emissão de NF",
    contactId: "p1",
    channel: "whatsapp",
    status: "em_atendimento",
    agent: "Luísa Campos",
    openedAt: "10/08/2026",
    updatedAt: "há 2 min",
    waiting: "2 min",
  },
  {
    id: "1051",
    subject: "Rastreio da carga 88213 parado",
    contactId: "p1",
    channel: "whatsapp",
    status: "aberto",
    agent: "Não atribuído",
    openedAt: "11/08/2026",
    updatedAt: "há 25 min",
    waiting: "25 min",
  },
  {
    id: "1046",
    subject: "Ajuste de janela de coleta",
    contactId: "p1",
    channel: "whatsapp",
    status: "pendente",
    agent: "Luísa Campos",
    openedAt: "07/08/2026",
    updatedAt: "há 1 dia",
    waiting: "1 dia",
    kanbanColumn: "k1",
  },
  {
    id: "1049",
    subject: "Cotação de frete dedicado Cuiabá–Goiânia",
    contactId: "p2",
    channel: "email",
    status: "aberto",
    agent: "Não atribuído",
    openedAt: "09/08/2026",
    updatedAt: "há 3 dias",
    waiting: "3 dias",
    kanbanColumn: "k4",
  },
  {
    id: "1047",
    subject: "Erro no checkout com cupom AURORA10",
    contactId: "p3",
    channel: "webchat",
    status: "em_atendimento",
    agent: "Diego Martins",
    openedAt: "11/08/2026",
    updatedAt: "há 12 min",
    waiting: "12 min",
  },
  {
    id: "1038",
    subject: "Solicitação de segunda via",
    contactId: "p4",
    channel: "email",
    status: "pendente",
    agent: "Diego Martins",
    openedAt: "05/08/2026",
    updatedAt: "há 1 h",
    waiting: "1 h",
    kanbanColumn: "k2",
  },
  {
    id: "1040",
    subject: "Segunda via da nota fiscal de julho",
    contactId: "p4",
    channel: "email",
    status: "mesclado",
    agent: "Diego Martins",
    openedAt: "06/08/2026",
    closedAt: "06/08/2026",
    updatedAt: "há 5 dias",
    waiting: "—",
    mergedInto: "1038",
  },
  {
    id: "1044",
    subject: "Integração de API retornando 401",
    contactId: "p5",
    channel: "webchat",
    status: "pendente",
    agent: "Marcos Vieira",
    openedAt: "08/08/2026",
    updatedAt: "há 2 h",
    waiting: "2 h",
    kanbanColumn: "k3",
  },
  {
    id: "1035",
    subject: "Solicitação de treinamento da equipe",
    contactId: "p6",
    channel: "email",
    status: "resolvido",
    agent: "Paula Rezende",
    openedAt: "01/08/2026",
    closedAt: "03/08/2026",
    updatedAt: "ontem",
    waiting: "—",
  },
  {
    id: "1033",
    subject: "Acesso ao painel de logs",
    contactId: "p6",
    channel: "email",
    status: "resolvido",
    agent: "Paula Rezende",
    openedAt: "28/07/2026",
    closedAt: "30/07/2026",
    updatedAt: "há 12 dias",
    waiting: "—",
  },
  {
    id: "1029",
    subject: "Pedido 55210 entregue avariado",
    contactId: "p7",
    channel: "whatsapp",
    status: "nao_resolvido",
    agent: "Diego Martins",
    openedAt: "22/07/2026",
    closedAt: "26/07/2026",
    updatedAt: "há 2 dias",
    waiting: "—",
  },
  {
    id: "1052",
    subject: "Reagendamento de entrega da linha Nórdica",
    contactId: "p7",
    channel: "whatsapp",
    status: "aberto",
    agent: "Não atribuído",
    openedAt: "10/08/2026",
    updatedAt: "há 1 dia",
    waiting: "1 dia",
    kanbanColumn: "k1",
  },
  {
    id: "1031",
    subject: "Divergência na fatura de julho",
    contactId: "p9",
    channel: "whatsapp",
    status: "resolvido",
    agent: "Luísa Campos",
    openedAt: "24/07/2026",
    closedAt: "27/07/2026",
    updatedAt: "há 20 min",
    waiting: "—",
  },
  {
    id: "1050",
    subject: "Troca de peças do pedido 51100",
    contactId: "p9",
    channel: "whatsapp",
    status: "pendente",
    agent: "Luísa Campos",
    openedAt: "09/08/2026",
    updatedAt: "há 6 h",
    waiting: "6 h",
    kanbanColumn: "k4",
  },
  {
    id: "1053",
    subject: "Dúvida sobre planos e integração",
    contactId: "p8",
    channel: "webchat",
    status: "aberto",
    agent: "Não atribuído",
    openedAt: "11/08/2026",
    updatedAt: "há 4 min",
    waiting: "4 min",
  },
];

export const conversations: Conversation[] = [
  {
    id: "cv1",
    contactId: "p1",
    channel: "whatsapp",
    activeTicketId: "1042",
    unread: 2,
    lastActivity: "há 2 min",
    windowHoursLeft: 6,
  },
  {
    id: "cv2",
    contactId: "p3",
    channel: "webchat",
    activeTicketId: "1047",
    unread: 1,
    lastActivity: "há 12 min",
  },
  {
    id: "cv3",
    contactId: "p9",
    channel: "whatsapp",
    activeTicketId: "1031",
    unread: 1,
    lastActivity: "há 20 min",
    windowHoursLeft: 21,
  },
  {
    id: "cv4",
    contactId: "p4",
    channel: "email",
    activeTicketId: "1038",
    unread: 0,
    lastActivity: "há 1 h",
    emailSubject: "[#1038] Solicitação de segunda via",
  },
  {
    id: "cv5",
    contactId: "p8",
    channel: "webchat",
    activeTicketId: "1053",
    unread: 3,
    lastActivity: "há 4 min",
  },
  {
    id: "cv6",
    contactId: "p7",
    channel: "whatsapp",
    activeTicketId: "1052",
    unread: 0,
    lastActivity: "há 1 dia",
    windowHoursLeft: 0,
  },
  {
    id: "cv7",
    contactId: "p5",
    channel: "webchat",
    activeTicketId: "1044",
    unread: 0,
    lastActivity: "há 2 h",
  },
  {
    id: "cv8",
    contactId: "p2",
    channel: "email",
    activeTicketId: "1049",
    unread: 3,
    lastActivity: "há 3 dias",
    emailSubject: "[#1049] Cotação de frete dedicado",
  },
];

let mid = 0;
const m = (
  conversationId: string,
  ticketId: string | null,
  kind: MessageKind,
  authorName: string,
  text: string,
  time: string,
  delivery?: Message["delivery"],
): Message => ({
  id: `msg${++mid}`,
  conversationId,
  ticketId,
  kind,
  authorName,
  text,
  time,
  delivery,
});

export const messages: Message[] = [
  // cv1 — Mariana Duarte (WhatsApp): duas sessões, notas internas e marcadores
  m("cv1", "1046", "sistema", "", "Sessão iniciada — Ticket #1046 · Ajuste de janela de coleta", "07/08 · 09:10"),
  m("cv1", "1046", "cliente", "Mariana Duarte", "Bom dia! Conseguimos mudar a janela de coleta para 14h?", "09:10"),
  m("cv1", "1046", "agente", "Luísa Campos", "Bom dia, Mariana! Vou verificar com a operação e retorno.", "09:22", "lida"),
  m("cv1", "1046", "sistema", "", "Status alterado para Pendente por Luísa Campos", "07/08 · 09:25"),
  m("cv1", "1046", "sistema", "", "Sessão encerrada", "07/08 · 18:00"),
  m("cv1", "1042", "sistema", "", "Sessão iniciada — Ticket #1042 · Erro na emissão de NF", "10/08 · 13:58"),
  m("cv1", "1042", "cliente", "Mariana Duarte", "Oi! A emissão da NF do embarque 88213 está retornando erro.", "13:58"),
  m("cv1", "1042", "agente", "Luísa Campos", "Olá, Mariana! Já estou verificando com o fiscal, um instante.", "14:05", "lida"),
  m("cv1", "1042", "nota", "Luísa Campos", "Certificado digital da filial venceu ontem. Confirmar renovação com o Diego antes de responder.", "14:06"),
  m("cv1", "1042", "cliente", "Mariana Duarte", "Obrigada! O cliente final está cobrando a nota.", "14:11"),
  m("cv1", "1042", "cliente", "Mariana Duarte", "Consegue me dar um retorno ainda hoje?", "14:12"),

  // cv2 — Beatriz Salles (Webchat)
  m("cv2", "1047", "sistema", "", "Sessão iniciada — Ticket #1047 · Erro no checkout com cupom AURORA10", "11/08 · 13:48"),
  m("cv2", "1047", "cliente", "Beatriz Salles", "O cupom AURORA10 está retornando erro 500 no checkout.", "13:48"),
  m("cv2", "1047", "cliente", "Beatriz Salles", "Já testei em dois navegadores diferentes.", "13:52"),
  m("cv2", "1047", "agente", "Diego Martins", "Oi, Beatriz! Consigo reproduzir aqui. Escalando para o time de pagamentos.", "13:58", "entregue"),
  m("cv2", "1047", "nota", "Diego Martins", "Regra do cupom com data final inválida no painel. Ticket interno PAY-221.", "13:59"),

  // cv3 — Lucas Amaral (WhatsApp) — resolvido com nova mensagem
  m("cv3", "1031", "sistema", "", "Sessão iniciada — Ticket #1031 · Divergência na fatura de julho", "24/07 · 10:00"),
  m("cv3", "1031", "cliente", "Lucas Amaral", "A fatura de julho veio com valor divergente do pedido.", "10:00"),
  m("cv3", "1031", "agente", "Luísa Campos", "Verificamos e emitimos a nota corrigida, Lucas. Pode conferir?", "11:15", "lida"),
  m("cv3", "1031", "sistema", "", "Status alterado para Resolvido por Luísa Campos", "27/07 · 09:00"),
  m("cv3", "1031", "cliente", "Lucas Amaral", "Pessoal, a diferença apareceu de novo na fatura de agosto.", "há 20 min"),

  // cv4 — Otávio Prado (E-mail, thread agrupada)
  m("cv4", "1038", "sistema", "", "Sessão iniciada — Ticket #1038 · [#1038] Solicitação de segunda via", "05/08 · 11:20"),
  m("cv4", "1038", "cliente", "Otávio Prado", "Preciso da segunda via da NF de julho para fechar o mês.", "11:20"),
  m("cv4", "1038", "agente", "Diego Martins", "Solicitei ao setor fiscal, retorno até amanhã pela manhã.", "11:41", "entregue"),
  m("cv4", "1038", "nota", "Diego Martins", "Aguardando o financeiro (chamado interno FIS-334).", "11:42"),
  m("cv4", "1038", "sistema", "", "Ticket #1040 mesclado neste ticket por Diego Martins", "06/08 · 08:30"),

  // cv5 — visitante não identificado (Webchat)
  m("cv5", "1053", "sistema", "", "Sessão iniciada — Ticket #1053 · Dúvida sobre planos e integração", "11/08 · 11:40"),
  m("cv5", "1053", "cliente", "Visitante não identificado", "Olá, vocês têm integração com ERP Omie?", "11:40"),
  m("cv5", "1053", "cliente", "Visitante não identificado", "E qual o plano para 10 atendentes?", "11:42"),
  m("cv5", "1053", "cliente", "Visitante não identificado", "Consigo falar com alguém agora?", "11:44"),

  // cv6 — Sônia Bertolli (WhatsApp, janela expirada)
  m("cv6", "1029", "sistema", "", "Sessão iniciada — Ticket #1029 · Pedido 55210 entregue avariado", "22/07 · 10:04"),
  m("cv6", "1029", "cliente", "Sônia Bertolli", "O pedido 55210 chegou com as peças avariadas.", "10:04"),
  m("cv6", "1029", "agente", "Diego Martins", "Sinto muito, Sônia. Abrimos a ocorrência com a transportadora.", "10:20", "lida"),
  m("cv6", "1029", "cliente", "Sônia Bertolli", "A transportadora negou o reembolso. Vamos tratar pelo jurídico.", "17:45"),
  m("cv6", "1029", "sistema", "", "Status alterado para Não Resolvido por Diego Martins", "26/07 · 09:12"),
  m("cv6", "1029", "sistema", "", "Sessão encerrada", "26/07 · 09:12"),
  m("cv6", "1052", "sistema", "", "Sessão iniciada — Ticket #1052 · Reagendamento de entrega da linha Nórdica", "10/08 · 08:30"),
  m("cv6", "1052", "cliente", "Sônia Bertolli", "Precisamos reagendar a entrega da linha Nórdica para a próxima semana.", "08:30"),

  // cv7 — Camila Ferraz (Webchat)
  m("cv7", "1044", "sistema", "", "Sessão iniciada — Ticket #1044 · Integração de API retornando 401", "08/08 · 09:15"),
  m("cv7", "1044", "cliente", "Camila Ferraz", "Nossa integração começou a retornar 401 após a virada de chave.", "09:15"),
  m("cv7", "1044", "agente", "Marcos Vieira", "Gerei um novo token de produção, pode testar?", "09:33", "lida"),
  m("cv7", "1044", "nota", "Marcos Vieira", "Aguardando o fornecedor do gateway liberar o IP novo.", "09:40"),

  // cv8 — Rafael Nogueira (E-mail)
  m("cv8", "1049", "sistema", "", "Sessão iniciada — Ticket #1049 · [#1049] Cotação de frete dedicado", "09/08 · 08:10"),
  m("cv8", "1049", "cliente", "Rafael Nogueira", "Preciso de cotação para frete dedicado Cuiabá–Goiânia, 3x por semana.", "08:10"),
];

export type KanbanColumn = { id: string; title: string };

export const kanbanColumns: KanbanColumn[] = [
  { id: "k1", title: "Aguardando cliente" },
  { id: "k2", title: "Aguardando Financeiro" },
  { id: "k3", title: "Aguardando fornecedor" },
  { id: "k4", title: "Retomar hoje" },
];

export const CURRENT_AGENT = "Luísa Campos";

export type User = {
  id: string;
  name: string;
  email: string;
  profile: "Atendente" | "Administrador";
  active: boolean;
  inProgress: number;
};

export const users: User[] = [
  { id: "a1", name: "Luísa Campos", email: "luisa@central.app", profile: "Atendente", active: true, inProgress: 6 },
  { id: "a2", name: "Diego Martins", email: "diego@central.app", profile: "Atendente", active: true, inProgress: 4 },
  { id: "a3", name: "Paula Rezende", email: "paula@central.app", profile: "Administrador", active: true, inProgress: 2 },
  { id: "a4", name: "Marcos Vieira", email: "marcos@central.app", profile: "Atendente", active: true, inProgress: 5 },
  { id: "a5", name: "Tainá Oliveira", email: "taina@central.app", profile: "Atendente", active: false, inProgress: 0 },
];

export type ChannelIntegration = {
  id: string;
  name: string;
  type: string;
  identifier: string;
  connected: boolean;
  phase2?: boolean | undefined;
};

export const channelIntegrations: ChannelIntegration[] = [
  { id: "i1", name: "WhatsApp Business", type: "WhatsApp", identifier: "+55 65 3025-7000", connected: true },
  { id: "i2", name: "Webchat do site", type: "Webchat", identifier: "widget-central-omni", connected: true },
  { id: "i3", name: "Caixa de suporte", type: "E-mail", identifier: "suporte@central.app", connected: true },
  { id: "i4", name: "Caixa comercial", type: "E-mail", identifier: "comercial@central.app", connected: false },
  { id: "i5", name: "Instagram Direct", type: "Instagram", identifier: "@centralomni", connected: false, phase2: true },
];

export type AuditEvent = {
  id: string;
  date: string;
  user: string;
  ticket: string;
  type: string;
  from: string;
  to: string;
};

export const auditEvents: AuditEvent[] = [
  { id: "e1", date: "11/08/2026 14:06", user: "Luísa Campos", ticket: "#1042", type: "Mudança de status", from: "Aberto", to: "Em Atendimento" },
  { id: "e2", date: "11/08/2026 13:58", user: "Diego Martins", ticket: "#1047", type: "Transferência", from: "Não atribuído", to: "Diego Martins" },
  { id: "e3", date: "06/08/2026 08:30", user: "Diego Martins", ticket: "#1040", type: "Mesclagem", from: "Aberto", to: "Mesclado em #1038" },
  { id: "e4", date: "05/08/2026 11:42", user: "Diego Martins", ticket: "#1038", type: "Mudança de status", from: "Em Atendimento", to: "Pendente" },
  { id: "e5", date: "27/07/2026 09:00", user: "Luísa Campos", ticket: "#1031", type: "Mudança de status", from: "Em Atendimento", to: "Resolvido" },
  { id: "e6", date: "26/07/2026 09:12", user: "Diego Martins", ticket: "#1029", type: "Mudança de status", from: "Pendente", to: "Não Resolvido" },
  { id: "e7", date: "20/07/2026 15:22", user: "Paula Rezende", ticket: "#1021", type: "Reabertura", from: "Resolvido", to: "Aberto" },
  { id: "e8", date: "18/07/2026 10:05", user: "Marcos Vieira", ticket: "#1018", type: "Transferência", from: "Tainá Oliveira", to: "Marcos Vieira" },
];

export const metrics = {
  firstResponse: "4 min 12 s",
  resolution: "6 h 38 min",
  byChannel: [
    { channel: "WhatsApp", total: 142 },
    { channel: "Webchat", total: 87 },
    { channel: "E-mail", total: 64 },
  ],
};

export function getCompany(id: string | null | undefined) {
  return companies.find((c) => c.id === id);
}

export function getContact(id: string) {
  return contacts.find((c) => c.id === id)!;
}

export function companyOfContact(contactId: string) {
  return getCompany(getContact(contactId).companyId);
}
