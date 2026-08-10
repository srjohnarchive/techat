import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Initials } from "@/components/atoms";
import { agents, statusMetrics, STATUS_LABEL, STATUS_ORDER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração e métricas da equipe — Central Omni" },
      {
        name: "description",
        content:
          "Painel do gestor: atendentes cadastrados, volume de tickets por status e distribuição do atendimento omnichannel.",
      },
      { property: "og:title", content: "Administração e métricas — Central Omni" },
      {
        property: "og:description",
        content: "Acompanhe atendentes, tickets abertos, pendentes e resolvidos em um só painel.",
      },
    ],
  }),
  component: AdminPage,
});

const chartColors: Record<string, string> = {
  aberto: "var(--status-aberto)",
  em_atendimento: "var(--status-atendimento)",
  pendente: "var(--status-pendente)",
  resolvido: "var(--status-resolvido)",
  nao_resolvido: "var(--status-negado)",
};

const cardStyles: Record<string, string> = {
  aberto: "text-status-aberto bg-status-aberto-soft",
  em_atendimento: "text-status-atendimento bg-status-atendimento-soft",
  pendente: "text-status-pendente bg-status-pendente-soft",
  resolvido: "text-status-resolvido bg-status-resolvido-soft",
  nao_resolvido: "text-status-negado bg-status-negado-soft",
};

function AdminPage() {
  const data = STATUS_ORDER.map((s) => ({
    key: s,
    name: STATUS_LABEL[s],
    total: statusMetrics[s],
  }));
  const totalGeral = data.reduce((acc, d) => acc + d.total, 0);

  return (
    <AppShell>
      <PageHeader title="Administração" subtitle="Visão do gestor · dados de exemplo" />
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {data.map((d) => (
            <div key={d.key} className="rounded-xl border border-border bg-surface p-4">
              <p className="truncate text-xs font-medium text-muted-foreground">{d.name}</p>
              <p className="mt-2 text-2xl font-semibold">{d.total}</p>
              <span
                className={cn(
                  "mt-3 inline-block rounded-full px-2.5 py-1 text-[11px] font-medium",
                  cardStyles[d.key],
                )}
              >
                {Math.round((d.total / totalGeral) * 100)}% do total
              </span>
            </div>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold">Tickets por status</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ left: -20 }}>
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    interval={0}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--accent)" }}
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {data.map((d) => (
                      <Cell key={d.key} fill={chartColors[d.key]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface p-5">
            <h2 className="text-sm font-semibold">Distribuição do volume</h2>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={2}
                    isAnimationActive={false}
                  >
                    {data.map((d) => (
                      <Cell key={d.key} fill={chartColors[d.key]} stroke="var(--surface)" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              {data.map((d) => (
                <span key={d.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: chartColors[d.key] }}
                  />
                  {d.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-sm font-semibold">Atendentes cadastrados</h2>
            <p className="text-xs text-muted-foreground">{agents.length} usuários na equipe</p>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Atendente</th>
                <th className="px-5 py-3 font-medium">Perfil</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Em aberto</th>
                <th className="px-5 py-3 font-medium">Resolvidos hoje</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((a) => (
                <tr key={a.id} className="border-t border-border">
                  <td className="px-5 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Initials name={a.name} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{a.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{a.role}</td>
                  <td className="px-5 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        a.online
                          ? "bg-status-resolvido-soft text-status-resolvido"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {a.online ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="px-5 py-3">{a.open}</td>
                  <td className="px-5 py-3">{a.resolvedToday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
