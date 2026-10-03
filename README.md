# Unified Inbox View

Crie a interface visual (mockup funcional, front-end apenas, sem backend real) de um sistema de atendimento omnichannel — uma central de atendimento estilo Chatwoot/Zendesk, onde a equipe atende clientes de WhatsApp, Webchat e E-mail em uma única tela.

Use dados fictícios/mockados para preencher a interface (não precisa conectar em API real).

TELAS NECESSÁRIAS

1. Tela principal — Caixa de Entrada Unificada

- Layout de 3 colunas:

  a) Coluna esquerda: lista de conversas/tickets, com filtros por status (Aberto, Em Atendimento, Pendente, Resolvido, Não Resolvido) e por canal (ícone indicando se é WhatsApp, Webchat ou E-mail)

  b) Coluna central: a conversa aberta, com histórico de mensagens (bolhas de chat, estilo WhatsApp), campo de digitação embaixo, e um botão para adicionar "nota interna" (nota que só a equipe vê, não o cliente)

  c) Coluna direita: painel com dados do contato — nome, telefone, e-mail, empresa vinculada, e um bloco de "histórico de atendimentos anteriores" (lista simples de tickets antigos desse contato)

- No topo de cada ticket aberto, mostrar o status atual com uma tag colorida e um botão para trocar o status (dropdown: Aberto, Em Atendimento, Pendente, Resolvido, Não Resolvido) e um botão "Reabrir" quando o status for Resolvido ou Não Resolvido

2. Tela de Empresas

- Lista de empresas cadastradas (nome da empresa, quantidade de contatos vinculados)

- Ao clicar em uma empresa, mostrar os contatos (funcionários) vinculados a ela, com nome, telefone e e-mail de cada um

3. Tela de Contato individual

- Dados do contato (nome, telefone, e-mail, empresa)

- Histórico completo de tickets desse contato, com status de cada um

4. Tela de Administração (visão do Gestor)

- Lista de atendentes cadastrados

- Métricas simples em cards no topo: total de tickets abertos, em atendimento, pendentes, resolvidos, não resolvidos (números fictícios)

- Um gráfico simples de barras ou pizza mostrando a distribuição de tickets por status

ESTILO VISUAL

- Design limpo, moderno, estilo SaaS profissional

- Modo claro como padrão

- Cores neutras (branco, cinza) com uma cor de destaque (ex.: azul ou verde) para botões e tags de status

- Ícones para diferenciar os canais (WhatsApp, Webchat, E-mail) em cada conversa da lista

IMPORTANTE

Isso é apenas um mockup de interface para validação visual. Não é necessário implementar lógica de backend, autenticação real, ou integração com APIs externas — use dados de exemplo fixos na tela.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://techat.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4802fa08-866f-4fd3-94ce-5815fcf03412).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
