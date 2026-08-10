export type Channel = "whatsapp" | "webchat" | "email";
export type TicketStatus =
  | "aberto"
  | "em_atendimento"
  | "pendente"
  | "resolvido"
  | "nao_resolvido";

export const STATUS_LABEL: Record<TicketStatus, string> = {
  aberto: "Aberto",
  em_atendimento: "Em Atendimento",
  pendente: "Pendente",
  resolvido: "Resolvido",
  nao_resolvido: "Não Resolvido",
};

export const STATUS_ORDER: TicketStatus[] = [
  "aberto",
  "em_atendimento",
  "pendente",
  "resolvido",
  "nao_resolvido",
];

export const CHANNEL_LABEL: Record<Channel, string> = {
  whatsapp: "WhatsApp",
  webchat: "Webchat",
  email: "E-mail",
};

export type Company = {
  id: string;
  name: string;
  segment: string;
};

export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyId: string;
  role: string;
};

export type Message = {
  id: string;
  author: "cliente" | "agente" | "nota";
  authorName: string;
  text: string;
  time: string;
};

export type Ticket = {
  id: string;
  subject: string;
  contactId: string;
  channel: Channel;
  status: TicketStatus;
  agent: string;
  updatedAt: string;
  unread: number;
  messages: Message[];
};

export const companies: Company[] = [
  { id: "c1", name: "Vertex Logística", segment: "Transportes" },
  { id: "c2", name: "Auroria Cosméticos", segment: "Varejo" },
  { id: "c3", name: "Nortec Sistemas", segment: "Tecnologia" },
  { id: "c4", name: "Casa Bonita Móveis", segment: "Indústria" },
];

export const contacts: Contact[] = [
  {
    id: "p1",
    name: "Mariana Duarte",
    phone: "+55 65 99812-4471",
    email: "mariana.duarte@vertexlog.com.br",
    companyId: "c1",
    role: "Coordenadora de Frota",
  },
  {
    id: "p2",
    name: "Rafael Nogueira",
    phone: "+55 65 99134-8820",
    email: "rafael.nogueira@vertexlog.com.br",
    companyId: "c1",
    role: "Analista de Compras",
  },
  {
    id: "p3",
    name: "Beatriz Salles",
    phone: "+55 11 98822-1190",
    email: "bia.salles@auroria.com",
    companyId: "c2",
    role: "Gerente de E-commerce",
  },
  {
    id: "p4",
    name: "Otávio Prado",
    phone: "+55 11 97441-0032",
    email: "otavio.prado@auroria.com",
    companyId: "c2",
    role: "Financeiro",
  },
  {
    id: "p5",
    name: "Camila Ferraz",
    phone: "+55 41 99615-7788",
    email: "camila.ferraz@nortec.io",
    companyId: "c3",
    role: "Product Owner",
  },
  {
    id: "p6",
    name: "Henrique Lima",
    phone: "+55 41 98220-3311",
    email: "henrique.lima@nortec.io",
    companyId: "c3",
    role: "Suporte N2",
  },
  {
    id: "p7",
    name: "Sônia Bertolli",
    phone: "+55 47 99700-5566",
    email: "sonia@casabonitamoveis.com.br",
    companyId: "c4",
    role: "Diretora Comercial",
  },
];

export const agents = [
  {
    id: "a1",
    name: "Luísa Campos",
    email: "luisa@central.app",
    role: "Atendente",
    online: true,
    open: 6,
    resolvedToday: 14,
  },
  {
    id: "a2",
    name: "Diego Martins",
    email: "diego@central.app",
    role: "Atendente",
    online: true,
    open: 4,
    resolvedToday: 11,
  },
  {
    id: "a3",
    name: "Paula Rezende",
    email: "paula@central.app",
    role: "Supervisora",
    online: false,
    open: 2,
    resolvedToday: 8,
  },
  {
    id: "a4",
    name: "Marcos Vieira",
    email: "marcos@central.app",
    role: "Atendente",
    online: true,
    open: 5,
    resolvedToday: 6,
  },
  {
    id: "a5",
    name: "Tainá Oliveira",
    email: "taina@central.app",
    role: "Atendente Jr.",
    online: false,
    open: 1,
    resolvedToday: 3,
  },
];

export const tickets: Ticket[] = [
  {
    id: "#4821",
    subject: "Rastreio da carga 88213 parado",
    contactId: "p1",
    channel: "whatsapp",
    status: "em_atendimento",
    agent: "Luísa Campos",
    updatedAt: "há 2 min",
    unread: 2,
    messages: [
      {
        id: "m1",
        author: "cliente",
        authorName: "Mariana Duarte",
        text: "Oi! O rastreio da carga 88213 está parado desde ontem à noite.",
        time: "14:02",
      },
      {
        id: "m2",
        author: "agente",
        authorName: "Luísa Campos",
        text: "Olá, Mariana! Já estou verificando com a base de Cuiabá, um instante.",
        time: "14:05",
      },
      {
        id: "m3",
        author: "nota",
        authorName: "Luísa Campos",
        text: "Nota interna: veículo em manutenção não programada. Confirmar novo ETA com o Diego.",
        time: "14:06",
      },
      {
        id: "m4",
        author: "cliente",
        authorName: "Mariana Duarte",
        text: "Obrigada! O cliente final está cobrando previsão de entrega.",
        time: "14:11",
      },
      {
        id: "m5",
        author: "cliente",
        authorName: "Mariana Duarte",
        text: "Consegue me dar um retorno ainda hoje?",
        time: "14:12",
      },
    ],
  },
  {
    id: "#4820",
    subject: "Erro no checkout com cupom AURORA10",
    contactId: "p3",
    channel: "webchat",
    status: "aberto",
    agent: "Não atribuído",
    updatedAt: "há 12 min",
    unread: 1,
    messages: [
      {
        id: "m1",
        author: "cliente",
        authorName: "Beatriz Salles",
        text: "O cupom AURORA10 está retornando erro 500 no checkout.",
        time: "13:48",
      },
      {
        id: "m2",
        author: "cliente",
        authorName: "Beatriz Salles",
        text: "Já testei em dois navegadores diferentes.",
        time: "13:52",
      },
    ],
  },
  {
    id: "#4818",
    subject: "Segunda via da nota fiscal de julho",
    contactId: "p4",
    channel: "email",
    status: "pendente",
    agent: "Diego Martins",
    updatedAt: "há 1 h",
    unread: 0,
    messages: [
      {
        id: "m1",
        author: "cliente",
        authorName: "Otávio Prado",
        text: "Preciso da segunda via da NF de julho para fechar o mês.",
        time: "11:20",
      },
      {
        id: "m2",
        author: "agente",
        authorName: "Diego Martins",
        text: "Solicitei ao setor fiscal, retorno até amanhã pela manhã.",
        time: "11:41",
      },
      {
        id: "m3",
        author: "nota",
        authorName: "Diego Martins",
        text: "Nota interna: aguardando retorno do fiscal (chamado interno FIS-334).",
        time: "11:42",
      },
    ],
  },
  {
    id: "#4815",
    subject: "Integração de API retornando 401",
    contactId: "p5",
    channel: "webchat",
    status: "em_atendimento",
    agent: "Marcos Vieira",
    updatedAt: "há 2 h",
    unread: 0,
    messages: [
      {
        id: "m1",
        author: "cliente",
        authorName: "Camila Ferraz",
        text: "Nossa integração começou a retornar 401 após a virada de chave.",
        time: "09:15",
      },
      {
        id: "m2",
        author: "agente",
        authorName: "Marcos Vieira",
        text: "Gerei um novo token para o ambiente de produção, pode testar?",
        time: "09:33",
      },
    ],
  },
  {
    id: "#4810",
    subject: "Solicitação de treinamento da equipe",
    contactId: "p6",
    channel: "email",
    status: "resolvido",
    agent: "Paula Rezende",
    updatedAt: "ontem",
    unread: 0,
    messages: [
      {
        id: "m1",
        author: "cliente",
        authorName: "Henrique Lima",
        text: "Gostaríamos de agendar um treinamento para o time de suporte.",
        time: "16:02",
      },
      {
        id: "m2",
        author: "agente",
        authorName: "Paula Rezende",
        text: "Agendado para dia 24, às 10h, com envio do material antes.",
        time: "16:30",
      },
    ],
  },
  {
    id: "#4803",
    subject: "Pedido 55210 entregue avariado",
    contactId: "p7",
    channel: "whatsapp",
    status: "nao_resolvido",
    agent: "Diego Martins",
    updatedAt: "há 2 dias",
    unread: 0,
    messages: [
      {
        id: "m1",
        author: "cliente",
        authorName: "Sônia Bertolli",
        text: "O pedido 55210 chegou com as peças avariadas.",
        time: "10:04",
      },
      {
        id: "m2",
        author: "agente",
        authorName: "Diego Martins",
        text: "Sinto muito. Abrimos a ocorrência com a transportadora.",
        time: "10:20",
      },
      {
        id: "m3",
        author: "cliente",
        authorName: "Sônia Bertolli",
        text: "A transportadora negou o reembolso. Vamos tratar pelo jurídico.",
        time: "17:45",
      },
    ],
  },
  {
    id: "#4799",
    subject: "Cotação de frete dedicado",
    contactId: "p2",
    channel: "email",
    status: "aberto",
    agent: "Não atribuído",
    updatedAt: "há 3 dias",
    unread: 3,
    messages: [
      {
        id: "m1",
        author: "cliente",
        authorName: "Rafael Nogueira",
        text: "Preciso de cotação para frete dedicado Cuiabá–Goiânia, 3x por semana.",
        time: "08:10",
      },
    ],
  },
];

export type PastTicket = {
  id: string;
  subject: string;
  status: TicketStatus;
  channel: Channel;
  date: string;
};

export const pastTickets: Record<string, PastTicket[]> = {
  p1: [
    {
      id: "#4602",
      subject: "Ajuste de janela de coleta",
      status: "resolvido",
      channel: "whatsapp",
      date: "12/07/2026",
    },
    {
      id: "#4410",
      subject: "Divergência de peso na NF",
      status: "resolvido",
      channel: "email",
      date: "28/05/2026",
    },
    {
      id: "#4180",
      subject: "Atraso recorrente na rota 12",
      status: "nao_resolvido",
      channel: "whatsapp",
      date: "03/04/2026",
    },
  ],
  p2: [
    {
      id: "#4501",
      subject: "Renovação de contrato anual",
      status: "resolvido",
      channel: "email",
      date: "19/06/2026",
    },
  ],
  p3: [
    {
      id: "#4712",
      subject: "Lentidão na página de produto",
      status: "resolvido",
      channel: "webchat",
      date: "01/08/2026",
    },
    {
      id: "#4655",
      subject: "Erro ao exportar relatório",
      status: "pendente",
      channel: "webchat",
      date: "22/07/2026",
    },
  ],
  p4: [
    {
      id: "#4390",
      subject: "Boleto duplicado em maio",
      status: "resolvido",
      channel: "email",
      date: "14/05/2026",
    },
  ],
  p5: [
    {
      id: "#4740",
      subject: "Aumento de limite de requisições",
      status: "resolvido",
      channel: "webchat",
      date: "05/08/2026",
    },
    {
      id: "#4520",
      subject: "Webhook duplicando eventos",
      status: "nao_resolvido",
      channel: "email",
      date: "21/06/2026",
    },
  ],
  p6: [
    {
      id: "#4301",
      subject: "Acesso ao painel de logs",
      status: "resolvido",
      channel: "email",
      date: "30/04/2026",
    },
  ],
  p7: [
    {
      id: "#4222",
      subject: "Troca de peças do pedido 51100",
      status: "resolvido",
      channel: "whatsapp",
      date: "11/04/2026",
    },
    {
      id: "#4102",
      subject: "Prazo de entrega da linha Nórdica",
      status: "resolvido",
      channel: "email",
      date: "17/03/2026",
    },
  ],
};

export const statusMetrics: Record<TicketStatus, number> = {
  aberto: 38,
  em_atendimento: 21,
  pendente: 14,
  resolvido: 126,
  nao_resolvido: 9,
};

export function getContact(id: string) {
  return contacts.find((c) => c.id === id)!;
}

export function getCompany(id: string) {
  return companies.find((c) => c.id === id)!;
}

export function contactTickets(contactId: string) {
  const active = tickets
    .filter((t) => t.contactId === contactId)
    .map((t) => ({
      id: t.id,
      subject: t.subject,
      status: t.status,
      channel: t.channel,
      date: t.updatedAt,
    }));
  return [...active, ...(pastTickets[contactId] ?? [])];
}
