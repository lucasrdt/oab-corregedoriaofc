# Corregedoria Geral OAB-MA

## What This Is

Site institucional específico para a Corregedoria Geral da OAB-MA, convertido a partir de um template multi-tenant de gerador de sites. O sistema expõe informações públicas da corregedoria (equipe, subseções municipais, cursos, FAQ, notícias e contato) e oferece um portal de acesso com autenticação baseada em roles para gestão de conteúdo.

## Core Value

Qualquer pessoa deve conseguir acessar as informações da corregedoria e chegar ao contato correto — e colaboradores internos (admin, presidente de subseção, dev) devem conseguir gerenciar o conteúdo do seu escopo sem depender de terceiros.

## Requirements

### Validated

- ✓ Template React + Vite + TypeScript com Tailwind e shadcn/ui — existente
- ✓ Integração Supabase (auth, banco, storage) — existente
- ✓ Configuração dinâmica via `sites.config` JSONB — existente
- ✓ Painel admin com editores (equipe, artigos, FAQ, calendário, leads) — existente
- ✓ Página de equipe com cards — existente
- ✓ Página de FAQ — existente
- ✓ Página de contato com formulário de leads — existente
- ✓ Chatbot widget — existente
- ✓ Seção de estatísticas — existente
- ✓ Dados da OAB-MA inseridos no Supabase (cores, logo, equipe, FAQ, subseções) — existente

### Active

- [ ] Identidade visual OAB-MA aplicada rigorosamente (azul #0d53de, vermelho #e00b0b, UI padronizada)
- [ ] Remover lógica multi-tenant (dashboard de criação de sites) — site único
- [ ] Página de Subseções: substituir casos/empresas por cards de subseções municipais com endereço, corregedor, telefone e e-mail
- [ ] Editor de Subseções no painel admin (CRUD com campos específicos: cidade, corregedor, endereço, contato)
- [ ] Sistema de roles via Supabase (admin, presidente, dev) — sem hardcode
- [ ] Portal de Acesso: rota de login pública com redirecionamento por role após autenticação
- [ ] Dashboard role-based: admin vê tudo, presidente vê apenas sua subseção, dev vê configuração do site
- [ ] Página de Cursos: catálogo estático de cursos/eventos (título, descrição, data, link) gerenciado pelo admin
- [ ] Editor de Cursos no painel admin
- [ ] Upload de arquivos funcional (Supabase Storage) — corrigir e garantir estabilidade
- [ ] UI/UX aprimorado: padronização de espaçamento, border-radius, hierarquia tipográfica e densidade visual

### Out of Scope

- Sistema de matrícula em cursos — complexidade não justificada para v1 (divulgação apenas)
- Multi-tenant / criação de novos sites — este é um site único
- App mobile — web-first
- Sistema de chat em tempo real — WhatsApp já atende
- Notificações push — fora do escopo atual

## Context

**Codebase existente:** React 18 + Vite + TypeScript, Tailwind CSS, shadcn/ui, React Router v6, Supabase (auth + DB + storage), Sonner (toasts). Deploy na Vercel.

**Dados já configurados no Supabase:**
- Domínio: `www.corregedoriageraloabma.com.br` (projeto Supabase: `yutlthbgcwktknqxdswb`)
- Cores: primary `#0d53de`, secondary `#e00b0b`, background `#ffffff`
- 21 subseções municipais no MA (Açailândia até Timon) em `caseTypes`
- Equipe: 5 membros com fotos no Storage
- FAQ: 14 perguntas configuradas
- Logo e imagens hero/about já no Storage

**Problema de arquitetura atual:**
- A página de casos/empresas (`CategoryPage`, `DetalheCaso`) foi construída para administração judicial — precisa ser reproposta para subseções da OAB
- O Dashboard admin (`/admin/dashboard`) gerencia múltiplos sites — precisa ser simplificado para site único
- Não existe sistema de roles — só admin genérico via Supabase Auth

**Referência de UI:** `C:/Users/gusta/Downloads/claude-cookbooks-main` para padrões de UX. Identidade visual deve seguir estritamente as cores da OAB-MA.

## Constraints

- **Tech Stack:** Manter React + Vite + Supabase — não trocar framework
- **Auth:** Usar Supabase Auth com custom claims ou tabela de roles — sem hardcode de roles no código
- **Storage:** Supabase Storage para upload de arquivos (corrigir fluxo existente)
- **Dados:** Tudo dinâmico via `sites.config` JSONB — nenhuma informação da OAB hardcoded no frontend
- **Domínio:** `www.corregedoriageraloabma.com.br` (já configurado na Vercel)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Manter JSONB config em vez de tabelas específicas | Menos refatoração, aproveitamento do sistema atual | — Pending |
| Roles via tabela `user_roles` no Supabase + RLS | Supabase recomenda, escalável, sem hardcode | — Pending |
| Subseções como seção dedicada (não mais caseTypes) | Semântica correta, editor específico, UX melhor | — Pending |
| Site único (remover multi-tenant) | Cliente específico, reduz complexidade | — Pending |

---
*Last updated: 2026-03-18 after initialization*
