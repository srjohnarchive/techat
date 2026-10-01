import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Building2, Mail, Phone, Briefcase } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ChannelIcon, Initials } from "@/components/atoms";
import { Field, TicketTable, useTicketsOfContact } from "@/components/panels";
import { useApp } from "@/lib/app-state";
import { CHANNEL_LABEL, contacts, getCompany } from "@/lib/mock-data";

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
          { title: "Contato indisponível — Techat" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const company = getCompany(loaderData.contact.companyId);
    const title = `${loaderData.contact.name} — ficha do contato | Techat`;
    const description = `Dados, identificadores e histórico de atendimentos de ${loaderData.contact.name}${company ? `, da empresa ${company.name}` : ""}.`;
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
  const { conversations } = useApp();
  const company = getCompany(contact.companyId);
  const items = useTicketsOfContact(contact.id);
  const convs = conversations.filter((c) => c.contactId === contact.id);

  return (
    <AppShell>
      <PageHeader
        title={contact.name}
        subtitle={`${contact.role}${company ? ` · ${company.name}` : ""}`}
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
            <Field icon={Phone} label="Telefone" value={contact.phone} />
            <Field icon={Mail} label="E-mail" value={contact.email} />
            <Field
              icon={Building2}
              label="Empresa"
              value={company ? `${company.name} · ${company.cnpj}` : "Não vinculada"}
            />
            <Field
              icon={Briefcase}
              label="Segmento"
              value={company?.segment ?? "—"}
            />
          </dl>
          {company && (
            <Link
              to="/empresas"
              className="mt-3 inline-block text-xs font-medium text-brand hover:underline"
            >
              Ver empresa
            </Link>
          )}

          <h3 className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Identificadores adicionais
          </h3>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {contact.altPhone && <li>Telefone: {contact.altPhone}</li>}
            {contact.altEmail && <li>E-mail: {contact.altEmail}</li>}
            {!contact.altPhone && !contact.altEmail && <li>Nenhum cadastrado.</li>}
          </ul>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Histórico de tickets ({items.length})
            </h2>
            <TicketTable items={items} />
          </div>

          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Conversas por canal ({convs.length})
            </h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {convs.map((cv) => (
                <li
                  key={cv.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
                >
                  <ChannelIcon channel={cv.channel} />
                  <span className="min-w-0 flex-1 text-xs">
                    <span className="block text-sm font-medium">
                      {CHANNEL_LABEL[cv.channel]}
                    </span>
                    <span className="text-muted-foreground">
                      Ticket ativo #{cv.activeTicketId} · {cv.lastActivity}
                    </span>
                  </span>
                  <Link
                    to="/"
                    className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-accent"
                  >
                    Abrir
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
