import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Building2, Mail, Phone, Briefcase } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ChannelIcon, StatusTag, Initials } from "@/components/atoms";
import { contacts, getCompany, contactTickets } from "@/lib/mock-data";

export const Route = createFileRoute("/contatos/$contactId")({
  loader: ({ params }) => {
    const contact = contacts.find((c) => c.id === params.contactId);
    if (!contact) throw notFound();
    return { contact };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Contato indisponível — Central Omni" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.contact.name} — ficha do contato | Central Omni`;
    const description = `Dados e histórico completo de atendimentos de ${loaderData.contact.name}, da empresa ${getCompany(loaderData.contact.companyId).name}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ContactDetail,
});

function ContactDetail() {
  const { contact } = Route.useLoaderData();
  const company = getCompany(contact.companyId);
  const tickets = contactTickets(contact.id);

  return (
    <AppShell>
      <PageHeader
        title={contact.name}
        subtitle={`${contact.role} · ${company.name}`}
        action={
          <Link
            to="/contatos"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar
          </Link>
        }
      />
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[340px_minmax(0,1fr)]">
        <section className="h-fit rounded-xl border border-border bg-surface p-5">
          <div className="flex flex-col items-center gap-2 text-center">
            <Initials name={contact.name} className="h-16 w-16 text-lg" />
            <p className="text-base font-semibold">{contact.name}</p>
            <p className="text-xs text-muted-foreground">{contact.role}</p>
          </div>
          <dl className="mt-5 space-y-3">
            <Row icon={Phone} label="Telefone" value={contact.phone} />
            <Row icon={Mail} label="E-mail" value={contact.email} />
            <Row icon={Building2} label="Empresa" value={company.name} />
            <Row icon={Briefcase} label="Segmento" value={company.segment} />
          </dl>
        </section>

        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Histórico de tickets ({tickets.length})
          </h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Ticket</th>
                  <th className="px-4 py-3 font-medium">Assunto</th>
                  <th className="px-4 py-3 font-medium">Canal</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{t.id}</td>
                    <td className="max-w-0 px-4 py-3">
                      <span className="block truncate">{t.subject}</span>
                    </td>
                    <td className="px-4 py-3">
                      <ChannelIcon channel={t.channel} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusTag status={t.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {t.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Row({
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
        <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
        <dd className="truncate text-sm">{value}</dd>
      </div>
    </div>
  );
}
