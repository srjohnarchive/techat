import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Settings2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Initials, StatusTag } from "@/components/atoms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/lib/app-state";
import {
  QUEUE_STATUSES,
  STATUS_LABEL,
  auditEvents,
  channelIntegrations,
  metrics,
  users,
} from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração e métricas — Techat" },
      {
        name: "description",
        content:
          "Visão do gestor: usuários, canais conectados, métricas de atendimento por status e canal e trilha de auditoria.",
      },
      { property: "og:title", content: "Administração e métricas — Techat" },
      {
        property: "og:description",
        content: "Gerencie usuários, canais e acompanhe as métricas do atendimento.",
      },
    ],
  }),
  component: AdminPage,
});

const statusColors: Record<string, string> = {
  aberto: "var(--status-aberto)",
  em_atendimento: "var(--status-atendimento)",
  pendente: "var(--status-pendente)",
  resolvido: "var(--status-resolvido)",
  nao_resolvido: "var(--status-negado)",
};

function AdminPage() {
  const { tickets } = useApp();
  const [userForm, setUserForm] = useState(false);
  const [channelForm, setChannelForm] = useState<string | null>(null);

  const byStatus = QUEUE_STATUSES.map((s) => ({
    key: s,
    label: STATUS_LABEL[s],
    total: tickets.filter((t) => t.status === s).length,
  }));

  return (
    <AppShell>
      <PageHeader title="Administração" subtitle="Visão do gestor" />
      <div className="min-h-0 flex-1 overflow-auto p-6">
        <Tabs defaultValue="metricas">
          <TabsList>
            <TabsTrigger value="usuarios">Usuários</TabsTrigger>
            <TabsTrigger value="canais">Canais</TabsTrigger>
            <TabsTrigger value="metricas">Métricas</TabsTrigger>
            <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
          </TabsList>

          <TabsContent value="usuarios">
            <div className="mb-3 flex justify-end">
              <Button size="sm" onClick={() => setUserForm(true)}>
                <Plus className="mr-1.5 h-4 w-4" /> Novo usuário
              </Button>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">E-mail</th>
                    <th className="px-4 py-3 font-medium">Perfil</th>
                    <th className="px-4 py-3 font-medium">Situação</th>
                    <th className="px-4 py-3 font-medium">Em andamento</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-2 font-medium">
                          <Initials name={u.name} className="h-7 w-7 text-[10px]" />
                          {u.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">{u.profile}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            u.active
                              ? "rounded-full bg-status-atendimento-soft px-2.5 py-1 text-xs font-medium text-status-atendimento"
                              : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                          }
                        >
                          {u.active ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{u.inProgress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="canais">
            <div className="grid gap-3 sm:grid-cols-2">
              {channelIntegrations.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {c.name}
                      {c.phase2 && (
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                          Fase 2
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {c.type} · {c.identifier}
                    </p>
                    <p
                      className={
                        c.connected
                          ? "mt-1 text-xs font-medium text-status-atendimento"
                          : "mt-1 text-xs font-medium text-status-negado"
                      }
                    >
                      {c.connected ? "Conectado" : "Desconectado"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={c.phase2}
                    onClick={() => setChannelForm(c.name)}
                  >
                    <Settings2 className="mr-1.5 h-3.5 w-3.5" /> Configurar
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metricas">
            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-5">
              {byStatus.map((s) => (
                <div key={s.key} className="rounded-xl border border-border bg-surface p-4">
                  <StatusTag status={s.key} />
                  <p className="mt-2 text-2xl font-semibold">{s.total}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Tempo médio de primeira resposta
                </p>
                <p className="mt-1 text-2xl font-semibold">{metrics.firstResponse}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Tempo médio de resolução
                </p>
                <p className="mt-1 text-2xl font-semibold">{metrics.resolution}</p>
              </div>
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-surface p-4">
                <h2 className="mb-3 text-sm font-semibold">Tickets por status</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={byStatus}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="label" fontSize={11} tickLine={false} />
                      <YAxis fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        {byStatus.map((s) => (
                          <Cell key={s.key} fill={statusColors[s.key]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-surface p-4">
                <h2 className="mb-3 text-sm font-semibold">Volume por canal</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics.byChannel}
                        dataKey="total"
                        nameKey="channel"
                        innerRadius={50}
                        outerRadius={90}
                        isAnimationActive={false}
                        label
                      >
                        {metrics.byChannel.map((c) => (
                          <Cell
                            key={c.channel}
                            fill={
                              c.channel === "WhatsApp"
                                ? "var(--chan-whatsapp)"
                                : c.channel === "Webchat"
                                  ? "var(--chan-webchat)"
                                  : "var(--chan-email)"
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="auditoria">
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 font-medium">Usuário</th>
                    <th className="px-4 py-3 font-medium">Ticket</th>
                    <th className="px-4 py-3 font-medium">Evento</th>
                    <th className="px-4 py-3 font-medium">Valor anterior</th>
                    <th className="px-4 py-3 font-medium">Novo valor</th>
                  </tr>
                </thead>
                <tbody>
                  {auditEvents.map((e) => (
                    <tr key={e.id} className="border-t border-border">
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {e.date}
                      </td>
                      <td className="px-4 py-3">{e.user}</td>
                      <td className="px-4 py-3 font-medium">{e.ticket}</td>
                      <td className="px-4 py-3">{e.type}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.from}</td>
                      <td className="px-4 py-3">{e.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={userForm} onOpenChange={setUserForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo usuário</DialogTitle>
            <DialogDescription>
              Formulário de exemplo — os dados não são salvos neste mockup.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Nome" />
            <Input placeholder="E-mail" />
            <Input placeholder="Perfil (Atendente / Administrador)" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserForm(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setUserForm(false)}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!channelForm} onOpenChange={(v) => !v && setChannelForm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar {channelForm}</DialogTitle>
            <DialogDescription>
              Credenciais fictícias apenas para demonstração.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Identificador" defaultValue="conta-demo" />
            <Input placeholder="Token de acesso" defaultValue="••••••••••••" />
            <Input placeholder="Webhook" defaultValue="https://exemplo.app/webhook" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChannelForm(null)}>
              Cancelar
            </Button>
            <Button onClick={() => setChannelForm(null)}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
