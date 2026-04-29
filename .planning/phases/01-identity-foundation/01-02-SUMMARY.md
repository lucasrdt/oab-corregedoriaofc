---
phase: 01-identity-foundation
plan: 02
subsystem: ui
tags: [react, shadcn-ui, sidebar, admin-panel, react-router, mobile, ux]

# Dependency graph
requires:
  - phase: 01-identity-foundation
    plan: 01
    provides: CSS variables OAB-MA aplicadas em :root, SiteContext simplificado com dados estáticos
provides:
  - AdminLayout com SidebarProvider + Sidebar shadcn/ui, 9 itens de navegação, mobile drawer
  - SiteEditor convertido de Tabs horizontais para seções renderizadas via sidebar
  - Dashboard simples sem lógica multi-tenant
  - App.tsx com rotas admin limpas e ProtectedRoute cobrindo todas as rotas autenticadas
  - CaseDetailsEditor migrado para OAB_MA_SITE_ID (sem useParams siteId)
  - Modais com max-h-[90vh], overflow-y-auto, max-w-[95vw] responsivo
  - Remoção completa de CreateSiteModal, DeleteSiteModal, DnsInstructionsModal, domainService
affects:
  - 02-identity-foundation
  - future admin feature plans

# Tech tracking
tech-stack:
  added: []
  patterns:
    - AdminLayout wrapping SiteEditor — sidebar provides navigation, children renders content
    - OAB_MA_SITE_ID constant via import.meta.env.VITE_SITE_ID — replaces useParams id everywhere
    - Conditional section rendering via activeSection state (not Tabs component)
    - useSidebar hook in AdminSidebar to close mobile Sheet on nav item click
    - Responsive dialog: max-w-[95vw] mobile, sm:max-w-lg desktop

key-files:
  created:
    - src/pages/admin/AdminLayout.tsx
  modified:
    - src/pages/admin/SiteEditor.tsx
    - src/pages/admin/Dashboard.tsx
    - src/pages/admin/CaseDetailsEditor.tsx
    - src/pages/admin/components/CasesEditor.tsx
    - src/pages/admin/components/TeamEditor.tsx
    - src/pages/admin/components/LeadsEditor.tsx
    - src/pages/admin/components/ArticlesEditor.tsx
    - src/components/ui/dialog.tsx
    - src/App.tsx
  deleted:
    - src/pages/admin/components/CreateSiteModal.tsx
    - src/pages/admin/components/DeleteSiteModal.tsx
    - src/pages/admin/components/DnsInstructionsModal.tsx
    - src/lib/domainService.ts

key-decisions:
  - "OAB_MA_SITE_ID usa import.meta.env.VITE_SITE_ID com fallback 'CONFIGURE_SITE_ID' — aplicado em SiteEditor e CaseDetailsEditor"
  - "AdminLayout recebe activeSection e onSectionChange como props — SiteEditor controla o estado da seção ativa"
  - "useSidebar hook isolado em AdminSidebar (componente interno) para acessar setOpenMobile sem violar as regras de hooks"
  - "dialog.tsx base atualizado com max-w-[95vw] + sm:max-w-lg para responsividade mobile sem alterar cada modal individualmente"
  - "CaseDetailsEditor migrado completamente para OAB_MA_SITE_ID — navegação de volta corrigida para /admin/editor"

patterns-established:
  - "Pattern: Section-based rendering — conteúdo renderizado condicionalmente por activeSection, não por rotas separadas"
  - "Pattern: Fixed siteId — OAB_MA_SITE_ID constante em vez de parâmetro de URL para site único"
  - "Pattern: Mobile-aware sidebar — useSidebar().setOpenMobile(false) chamado ao selecionar seção no mobile"

requirements-completed: [UI-04, UI-06]

# Metrics
duration: 40min
completed: 2026-03-18
---

# Phase 1 Plan 02: Admin Sidebar & Multi-tenant Removal Summary

**AdminLayout com sidebar shadcn/ui de 9 seções substituindo Tabs horizontais, remoção completa de 4 arquivos multi-tenant, e UX/UI improvements: mobile drawer, modal overflow protection, responsividade e rotas corretas em toda a área admin**

## Performance

- **Duration:** ~40 min
- **Started:** 2026-03-18T04:49:26Z
- **Completed:** 2026-03-18T05:30:00Z
- **Tasks:** 3 of 3 (Tasks 1-2 original + Task 3 checkpoint aprovado + improvements)
- **Files modified:** 9 modified, 1 created, 4 deleted

## Accomplishments

**Tarefas originais (Tasks 1-2):**
- Criou AdminLayout.tsx com SidebarProvider, Sidebar e 9 SidebarMenuButton items de navegação
- Converteu SiteEditor de 9 Tabs horizontais para seções renderizadas condicionalmente via activeSection state
- Substituiu useParams + id por constante OAB_MA_SITE_ID (import.meta.env.VITE_SITE_ID)
- Substituiu Dashboard multi-tenant por AdminHome simples com link para /admin/editor
- Deletou CreateSiteModal, DeleteSiteModal, DnsInstructionsModal, domainService — nenhum rastro multi-tenant
- Limpou App.tsx: rotas admin sem :siteId ou :id, rota /admin/cases/:caseId adicionada

**Melhorias adicionais (pós-checkpoint):**
- Sidebar mobile: AdminSidebar usa useSidebar().setOpenMobile(false) para fechar drawer ao clicar em item — o shadcn/ui Sidebar já usa Sheet no mobile com isMobile hook, SidebarTrigger já é o hambúrguer
- Modais: dialog.tsx base ganhou max-w-[95vw] + overflow-hidden + sm:max-w-lg; TeamEditor e LeadsEditor ganharam max-h-[90vh] overflow-y-auto; ArticlesEditor categoria dialog corrigida
- Truncation: nav labels e botão header da sidebar com truncate + min-w-0 + flex-shrink-0
- Layout UX: AdminLayout usa h-screen overflow-hidden no wrapper, main content tem overflow-y-auto min-h-0, header tem flex-shrink-0, sidebar tem flex-shrink-0
- CaseDetailsEditor: migrado para OAB_MA_SITE_ID (sem useParams siteId), navegação de volta corrigida para /admin/editor, siteId={OAB_MA_SITE_ID} em todos os ImageUpload e DocumentUploadEditor
- CasesEditor: rotas de navegação corrigidas de /admin/editor/:siteId/cases/:id para /admin/cases/:id

## Task Commits

1. **Task 1: Criar AdminLayout com sidebar e converter SiteEditor de tabs para seções** - `510690a`
2. **Task 2: Remover multi-tenant — deletar arquivos, substituir Dashboard, limpar App.tsx** - `40807f0`
3. **Task 3: Checkpoint aprovado** - checkpoint verificado pelo usuário
4. **Improvements: UX/UI e correções de rotas** - `afbdad2`

## Files Created/Modified

- `src/pages/admin/AdminLayout.tsx` - Shell de layout com SidebarProvider, AdminSidebar interno (useSidebar), mobile close on nav click, h-screen layout, overflow-y-auto main
- `src/pages/admin/SiteEditor.tsx` - Convertido: sem useParams/Tabs, usa OAB_MA_SITE_ID, integra AdminLayout
- `src/pages/admin/Dashboard.tsx` - Substituído por AdminHome simples (logout + link para editor)
- `src/pages/admin/CaseDetailsEditor.tsx` - OAB_MA_SITE_ID em vez de siteId param, rotas corrigidas
- `src/pages/admin/components/CasesEditor.tsx` - Rotas de navegação corrigidas para /admin/cases/:id
- `src/pages/admin/components/TeamEditor.tsx` - Dialog com max-h-[90vh] overflow-y-auto
- `src/pages/admin/components/LeadsEditor.tsx` - Dialog com max-h-[90vh] overflow-y-auto
- `src/pages/admin/components/ArticlesEditor.tsx` - Category dialog com max-h-[90vh] overflow-y-auto
- `src/components/ui/dialog.tsx` - Base: max-w-[95vw] mobile + sm:max-w-lg + overflow-hidden
- `src/App.tsx` - Rotas admin limpas: /admin, /admin/dashboard, /admin/editor, /admin/cases/:caseId

**Deleted:**
- `src/pages/admin/components/CreateSiteModal.tsx`
- `src/pages/admin/components/DeleteSiteModal.tsx`
- `src/pages/admin/components/DnsInstructionsModal.tsx`
- `src/lib/domainService.ts`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] CasesEditor navegava para rota multi-tenant removida**
- **Found during:** Improvements phase
- **Issue:** `openEditPage` e `openNewPage` em CasesEditor ainda usavam `/admin/editor/${siteId}/cases/${id}` — rota que não existe mais
- **Fix:** Simplificado para `/admin/cases/${id}` e `/admin/cases/new`
- **Files modified:** `src/pages/admin/components/CasesEditor.tsx`
- **Commit:** `afbdad2`

**2. [Rule 1 - Bug] CaseDetailsEditor ainda usava siteId de useParams**
- **Found during:** Improvements phase
- **Issue:** Componente fazia `useParams()` para obter `siteId`, mas App.tsx não mais passa esse parâmetro na rota `/admin/cases/:caseId`. Navegação de volta apontava para `/admin/editor/${siteId}?tab=cases`
- **Fix:** Removido siteId de useParams, adicionado `OAB_MA_SITE_ID` constante; navegação de volta corrigida para `/admin/editor`; todos os DocumentUploadEditor e ImageUpload passam `OAB_MA_SITE_ID`
- **Files modified:** `src/pages/admin/CaseDetailsEditor.tsx`
- **Commit:** `afbdad2`

## Issues/Blockers

- VITE_SITE_ID não está configurado no .env — o editor exibirá 'CONFIGURE_SITE_ID' como siteId e a busca no Supabase falhará. O usuário precisa adicionar o UUID do site ao .env.local.

## User Setup Required

Para o SiteEditor e CaseDetailsEditor carregarem e salvarem dados reais do Supabase, adicionar ao `.env.local`:
```
VITE_SITE_ID=<uuid-do-site-oab-ma-no-supabase>
```
Para obter o UUID: acessar o Supabase dashboard > Table Editor > sites > copiar o `id` do registro da OAB-MA.

## Next Phase Readiness

- AdminLayout pronto para receber novas seções de nav sem alterar SiteEditor
- Sidebar mobile funcional via Sheet drawer com hambúrguer nativo (SidebarTrigger)
- Todos os modais protegidos contra overflow em mobile
- Rotas admin totalmente limpas e funcionais
- Blocker: VITE_SITE_ID precisa ser configurado para que o editor funcione completamente

## Self-Check: PASSED

- [x] AdminLayout.tsx exists with h-screen, overflow-hidden, overflow-y-auto, useSidebar
- [x] dialog.tsx has max-w-[95vw] and sm:max-w-lg
- [x] CaseDetailsEditor uses OAB_MA_SITE_ID (no siteId from params)
- [x] CasesEditor navigates to /admin/cases/:id
- [x] Build passes: `npm run build` exits 0 with no TypeScript errors
- [x] Commits exist: 510690a, 40807f0, afbdad2

---
*Phase: 01-identity-foundation*
*Completed: 2026-03-18*
