import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/app-state";
import {
  CHANNELS,
  CHANNEL_LABEL,
  CURRENT_AGENT,
  companies,
  contacts,
  users,
  type Channel,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Priority = "baixa" | "media" | "alta" | "urgente";

export function NewTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { addTask } = useApp();
  const [kind, setKind] = useState<"ticket" | "tarefa">("tarefa");
  const [subject, setSubject] = useState("");
  const [companyId, setCompanyId] = useState(companies[0]!.id);
  const [contactId, setContactId] = useState("");
  const [agent, setAgent] = useState(CURRENT_AGENT);
  const [priority, setPriority] = useState<Priority>("media");
  const [dueDate, setDueDate] = useState("");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [done, setDone] = useState<string | null>(null);

  const people = contacts.filter((c) => c.companyId === companyId);
  const effectiveContact = contactId || people[0]?.id || "";

  function submit() {
    if (!subject.trim() || !effectiveContact) return;
    const id = addTask({
      subject: subject.trim(),
      contactId: effectiveContact,
      agent,
      kind,
      priority,
      dueDate,
      channel,
    });
    setDone(id);
    setSubject("");
    setDueDate("");
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setDone(null);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo ticket ou tarefa</DialogTitle>
          <DialogDescription>
            Crie para você ou atribua a outra pessoa da equipe.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="rounded-lg border border-border bg-brand-soft p-4 text-sm">
            <p className="font-medium text-brand">#{done} criado com sucesso.</p>
            <p className="text-muted-foreground">
              Ele já aparece na Central de Pendências e nos Relatórios.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              {(["tarefa", "ticket"] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKind(k)}
                  className={cn(
                    "rounded-md py-1.5 text-sm font-medium capitalize",
                    kind === k ? "bg-surface shadow-sm" : "text-muted-foreground",
                  )}
                >
                  {k === "tarefa" ? "Tarefa interna" : "Ticket de cliente"}
                </button>
              ))}
            </div>
            <Input
              placeholder={kind === "tarefa" ? "Ex.: Ligar para confirmar implantação" : "Assunto do ticket"}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <Textarea placeholder="Descrição (opcional)" rows={2} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Empresa">
                <Select
                  value={companyId}
                  onValueChange={(v) => {
                    setCompanyId(v);
                    setContactId("");
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Contato">
                <Select value={effectiveContact} onValueChange={setContactId}>
                  <SelectTrigger><SelectValue placeholder="Sem contatos" /></SelectTrigger>
                  <SelectContent>
                    {people.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Responsável">
                <Select value={agent} onValueChange={setAgent}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {users.filter((u) => u.active).map((u) => (
                      <SelectItem key={u.id} value={u.name}>
                        {u.name === CURRENT_AGENT ? `${u.name} (eu)` : u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Prioridade">
                <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Prazo">
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </Field>
              <Field label="Canal">
                <Select value={channel} onValueChange={(v) => setChannel(v as Channel)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CHANNELS.map((c) => (
                      <SelectItem key={c} value={c}>{CHANNEL_LABEL[c]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </div>
        )}

        <DialogFooter>
          {done ? (
            <>
              <Button variant="outline" onClick={() => setDone(null)}>Criar outro</Button>
              <Button onClick={() => onOpenChange(false)}>Fechar</Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
              <Button onClick={submit} disabled={!subject.trim()}>Criar</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1 text-xs font-medium text-muted-foreground">
      <span>{label}</span>
      {children}
    </label>
  );
}
