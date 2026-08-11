# Central Omni — mockup completo (v2)

Evolução do mockup atual para o modelo B2B com separação **Conversa × Ticket × Sessão**, navegação por modais/drawers e a nova Central de Pendências. Tudo continua front-end puro, com estado em memória.

## Modelo de dados mockado (reescrita de `src/lib/mock-data.ts`)

- **Empresas** (4+): nome, CNPJ, segmento, última interação.
- **Contatos** (2–4 por empresa): cargo, telefone/e-mail principais + identificadores extras (2º telefone, 2º e-mail).
- **Conversas**: uma thread perpétua por contato+canal, com janela de 24h (WhatsApp) e flag de visitante não identificado (Webchat).
- **Tickets** (~15): número, assunto, status, canal, responsável, aberturas/encerramentos, coluna do Kanban, ticket de destino quando Mesclado.
- **Mensagens**: tipo `cliente | agente | nota | sistema`, vinculadas a uma sessão (ticket), com horário e status de entrega.
- Status: Aberto, Em Atendimento, Pendente, Resolvido, Não Resolvido, **Mesclado** (novo; fora das filas).
- Casos obrigatórios incluídos: contato com 2 tickets abertos, pendente em "Aguardando Financeiro", resolvido com nova mensagem, ticket mesclado, WhatsApp com janela expirada, thread de e-mail `[#1038] …`, webchat anônimo, conversa com notas internas e marcadores de sessão.

## Estado global em memória

Um `AppStateProvider` (React context + `useState`) no root guarda tickets, mensagens, colunas do Kanban e conversas, expondo ações: mudar status, reabrir, mesclar, trocar assunto (insere marcadores "Sessão encerrada"/"Sessão iniciada"), enviar mensagem/nota, mover cartão, criar/renomear/reordenar/excluir coluna. Sem persistência.

## Telas

**1. Caixa de Entrada (`/`)** — 3 colunas.
- Esquerda: busca (contato, empresa, nº do ticket), filtros de status e canal, itens com contato, empresa, ícone do canal, prévia, tempo e badge de não lidas.
- Centro: cabeçalho em linha única com contato/empresa, badge do ticket ativo clicável (drawer com tickets do contato + criar novo/trocar assunto), tag de status com dropdown, botão Reabrir condicional, menu "···" (mesclar, transferir, ficha do contato, ficha da empresa). Timeline com bolhas esquerda/direita, notas âmbar com cadeado e marcadores de sistema centralizados. Rodapé com alternância explícita Responder/Nota interna (muda cor do campo e do botão), anexo, respostas rápidas e indicador da janela de 24h com bloqueio + "Enviar template".
- Direita: colapsável, blocos Contato, Empresa e Histórico com abas "Deste contato" / "Desta empresa"; links abrem modais.
- Botão "Nova conversa" com modal "Sobre qual ticket você quer falar?" que injeta a mensagem automática de retorno.

**2. Central de Pendências (`/pendencias`)** — nova rota.
- Barra: escopo Meus/Todos, alternância Lista/Kanban, filtros status/canal/empresa, "Nova coluna".
- Kanban com drag and drop (`@dnd-kit`), colunas editáveis, cartões com ticket, contato, empresa, canal, tag de status oficial e tempo; aviso visível de que a coluna é organização pessoal e não muda o status.
- Lista: tabela ordenável; clique na linha abre drawer com resumo + "Abrir conversa".

**3. Empresas (`/empresas`)** — tabela densa (nome, CNPJ, contatos, tickets abertos, última interação); clique abre drawer com ficha, contatos e histórico consolidado; modais "Nova empresa" e "Editar".

**4. Contato (`/contatos/$contactId`)** — dados + identificadores adicionais, link para a empresa, tabela de histórico com datas de abertura/encerramento e lista de conversas por canal com botão para abrir.

**5. Administração (`/admin`)** — abas Usuários, Canais (inclui Instagram desativado "Fase 2", modal Configurar), Métricas (cards de status + TMPR/TMR, gráficos por status e por canal) e Auditoria (tabela de eventos com valor anterior/novo).

## Detalhes técnicos

- Nova dependência: `@dnd-kit/core` + `@dnd-kit/sortable` para o Kanban. `recharts` já está no projeto.
- Componentes shadcn já disponíveis: Dialog (modais), Sheet (drawers), Tabs, DropdownMenu, Select, Table.
- Novo token de status `mesclado` (cinza neutro) em `src/styles.css`; demais cores mantidas conforme especificado.
- Componentes novos em `src/components/`: `ticket-drawer`, `merge-dialog`, `contact-dialog`, `company-dialog`, `new-conversation-dialog`, `kanban-board`, `message-composer`, `chat-timeline`.
- Cada rota mantém `head()` próprio com título/descrição em português.
- Coluna direita colapsa automaticamente abaixo de ~1100px de largura.
