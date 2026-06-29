# Roadmap: Corregedoria Geral OAB-MA

## Overview

Conversão de um template multi-tenant genérico em site institucional específico para a Corregedoria Geral da OAB-MA. O trabalho acontece em três fases: primeiro, colocar a identidade visual correta e remover a lógica multi-tenant; segundo, construir o conteúdo público completo (subseções, cursos) com painel de gestão e uploads funcionais; terceiro, implementar o sistema de roles e o portal interno de casos por subseção.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Identity & Foundation** - Identidade visual OAB-MA aplicada, multi-tenant removido, site visualmente correto (completed 2026-03-18)
- [x] **Phase 2: Public Site & Content Management** - Páginas públicas de subseções e cursos funcionais com painel admin e uploads (completed 2026-03-18)
- [x] **Phase 3: Access Portal & Internal Management** - Sistema de roles, portal de acesso e gestão de casos por subseção (completed 2026-03-18)

## Phase Details

### Phase 1: Identity & Foundation
**Goal**: O site exibe a identidade visual da OAB-MA corretamente e não contém resquícios de lógica multi-tenant
**Depends on**: Nothing (first phase)
**Requirements**: UI-01, UI-02, UI-03, UI-04, UI-05, UI-06
**Success Criteria** (what must be TRUE):
  1. Todas as telas do site público e do painel admin exibem as cores primária (#0d53de) e secundária (#e00b0b) sem degradação ou opacidade incorreta
  2. O painel admin possui menu lateral (sidebar) em vez de tabs horizontais, com navegação clara entre seções
  3. Não existe nenhuma rota, botão ou opção relacionada a criação ou troca de múltiplos sites no frontend
  4. O site público renderiza corretamente em telas móveis (menu, cards e formulários não quebram layout)
  5. Tipografia, espaçamentos e border-radius são uniformes em todos os componentes do site público e do admin
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Aplicar CSS variables OAB-MA em :root, simplificar SiteContext (remover RPC + injeção dinâmica de cores)
- [x] 01-02-PLAN.md — Criar AdminLayout com sidebar, converter SiteEditor de tabs para sidebar, remover multi-tenant completo

### Phase 2: Public Site & Content Management
**Goal**: Visitantes acessam páginas de subseções e cursos com informações atualizadas, e o admin gerencia esse conteúdo com uploads funcionais
**Depends on**: Phase 1
**Requirements**: SUB-01, SUB-02, SUB-03, CUR-01, CUR-02, CUR-03, ADM-01, ADM-02, ADM-03, UPL-01, UPL-03, UPL-04
**Success Criteria** (what must be TRUE):
  1. A página `/subsecoes` exibe cards de todas as subseções municipais com cidade, corregedor(a), endereço, telefone e e-mail, e o item "Subseções" aparece na navegação do site substituindo o item anterior
  2. A página `/cursos` exibe cursos ordenados por data, com cursos passados visualmente distintos dos futuros
  3. O admin consegue criar, editar e excluir subseções no painel, e as mudanças aparecem imediatamente no site público
  4. O admin consegue criar, editar e excluir cursos no painel com upload de imagem funcional via Supabase Storage
  5. Upload de imagens funciona para equipe, cursos e logo/favicon do site sem erros
**Plans**: 5 plans

Plans:
- [ ] 02-01-PLAN.md — Criar tabela subsections, página pública /subsecoes com cards e atualizar Header (SUB-01, SUB-03)
- [ ] 02-02-PLAN.md — Construir SubsectionsEditor no painel admin, adicionar à sidebar (SUB-02, ADM-01, ADM-03)
- [ ] 02-03-PLAN.md — Criar tabela courses, página pública /cursos com ordenação e distinção visual passado/futuro (CUR-01, CUR-02, CUR-03)
- [ ] 02-04-PLAN.md — Construir CoursesEditor no painel admin com ImageUpload (ADM-02)
- [ ] 02-05-PLAN.md — Diagnosticar e corrigir Supabase Storage para uploads de equipe, cursos e logo/favicon (UPL-01, UPL-03, UPL-04)

### Phase 3: Access Portal & Internal Management
**Goal**: Usuários autenticados acessam dashboards e dados conforme seu role, e presidentes de subseção gerenciam casos da sua subseção sem depender do admin
**Depends on**: Phase 2
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07, AUTH-08, AUTH-09, CASO-01, CASO-02, CASO-03, CASO-04, CASO-05, UPL-02
**Success Criteria** (what must be TRUE):
  1. Após login em `/portal`, o usuário é redirecionado automaticamente ao dashboard correto conforme seu role (admin, dev, presidente ou user)
  2. O admin consegue criar usuários, atribuir roles e vincular presidentes a subseções específicas via painel
  3. O presidente vê e gerencia apenas os casos da sua subseção; não consegue ver casos de outras subseções
  4. O user vê apenas os casos da sua subseção (somente leitura) e não acessa dados de outras subseções
  5. Documentos nos casos são enviados e recuperados via Supabase Storage sem erros
**Plans**: 4 plans

Plans:
- [ ] 03-01-PLAN.md — Criar migration SQL user_roles + casos com RLS completo, Edge Function admin-create-user (AUTH-01, AUTH-02, CASO-01..05, UPL-02)
- [ ] 03-02-PLAN.md — AuthContext + PortalRoute + PortalLogin + rotas /portal/* em App.tsx (AUTH-03, AUTH-04, AUTH-05..08)
- [ ] 03-03-PLAN.md — PortalLayout + 4 dashboards por role + gestão de usuários no AdminDashboard (AUTH-05..09)
- [ ] 03-04-PLAN.md — CasoEditor CRUD + upload de documentos + checkpoint de validação humana (CASO-01..05, UPL-02)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Identity & Foundation | 2/2 | Complete   | 2026-03-18 |
| 2. Public Site & Content Management | 4/5 | Complete    | 2026-03-18 |
| 3. Access Portal & Internal Management | 4/4 | Complete    | 2026-03-18 |
