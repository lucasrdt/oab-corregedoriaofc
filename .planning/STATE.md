---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: Completed 03-04-PLAN.md (CasoEditor CRUD with document upload — all tasks done)
last_updated: "2026-03-18T05:51:06.378Z"
last_activity: "2026-03-18 — Plan 01-01 complete: OAB-MA CSS variables + SiteContext static"
progress:
  total_phases: 3
  completed_phases: 3
  total_plans: 11
  completed_plans: 11
  percent: 100
---

---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: planning
stopped_at: Completed 01-01-PLAN.md (identity visual OAB-MA — checkpoint approved by user)
last_updated: "2026-03-18T04:33:56.019Z"
last_activity: "2026-03-18 — Plan 01-01 complete: OAB-MA CSS variables + SiteContext static"
progress:
  [██████████] 100%
  completed_phases: 0
  total_plans: 2
  completed_plans: 1
  percent: 50
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-18)

**Core value:** Qualquer pessoa acessa as informações da corregedoria e chega ao contato certo — colaboradores internos gerenciam o conteúdo do seu escopo sem depender de terceiros.
**Current focus:** Phase 1 - Identity & Foundation

## Current Position

Phase: 1 of 3 (Identity & Foundation)
Plan: 1 of 2 in current phase (01-01 COMPLETE)
Status: In progress
Last activity: 2026-03-18 — Plan 01-01 complete: OAB-MA CSS variables + SiteContext static

Progress: [█████░░░░░] 50%

## Performance Metrics

**Velocity:**
- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**
- Last 5 plans: -
- Trend: -

*Updated after each plan completion*
| Phase 01-identity-foundation P01 | 3 | 2 tasks | 3 files |
| Phase 01-identity-foundation P02 | 25 | 2 tasks | 9 files |
| Phase 01-identity-foundation P02 | 40 | 4 tasks | 10 files |
| Phase 02-public-site-content-management P01 | 2 | 4 tasks | 4 files |
| Phase 02-public-site-content-management P05 | 2 | 3 tasks | 1 files |
| Phase 03-access-portal-internal-management P01 | 2 | 2 tasks | 2 files |
| Phase 02-public-site-content-management P03 | 2 | 4 tasks | 3 files |
| Phase 02-public-site-content-management P02 | 1 | 2 tasks | 3 files |
| Phase 03-access-portal-internal-management P02 | 2 | 2 tasks | 4 files |
| Phase 02-public-site-content-management P04 | 4 | 2 tasks | 3 files |
| Phase 03-access-portal-internal-management P03 | 2 | 2 tasks | 6 files |
| Phase 03-access-portal-internal-management P04 | 2 | 2 tasks | 2 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Manter JSONB config em vez de tabelas específicas — menos refatoração
- [Init]: Roles via tabela `user_roles` + RLS — sem hardcode de roles no código
- [Init]: Subseções como seção dedicada — substitui caseTypes semanticamente
- [Init]: Site único — remover multi-tenant reduz complexidade
- [Phase 01-identity-foundation]: CSS variables hardcoded in :root — inline style injection removed to prevent specificity override
- [Phase 01-identity-foundation]: SiteContext fetchConfig replaced with static setConfig(fullIvaldoTemplate) — no RPC needed for single-tenant
- [Phase 01-identity-foundation]: Initial useState changed from skeletonTemplate to fullIvaldoTemplate — avoids flash of empty content
- [Phase 01-identity-foundation]: OAB_MA_SITE_ID usa import.meta.env.VITE_SITE_ID com fallback — requer VITE_SITE_ID no .env.local para Supabase real
- [Phase 01-identity-foundation]: AdminLayout recebe activeSection/onSectionChange como props — SiteEditor controla estado da seção ativa
- [Phase 01-identity-foundation]: useSidebar hook isolado em AdminSidebar interno — setOpenMobile(false) fecha drawer mobile ao clicar em nav item
- [Phase 01-identity-foundation]: dialog.tsx base atualizado globalmente com max-w-[95vw]+sm:max-w-lg — responsive modal sem alterar cada componente individualmente
- [Phase 01-identity-foundation]: CaseDetailsEditor migrado para OAB_MA_SITE_ID — siteId removido de useParams, navegação de volta para /admin/editor
- [Phase 02-public-site-content-management]: Subsecoes table created by orchestrator via MCP before plan — Task 0 checkpoint skipped
- [Phase 02-public-site-content-management]: Header dropdown removed entirely — Subsecoes replaces Casos/Empresas with a simple link
- [Phase 02-public-site-content-management]: Bucket site-assets criado como PUBLIC — leituras publicas sem autenticacao para logo/hero/equipe/cursos
- [Phase 02-public-site-content-management]: ImageUpload migrado para sonner toast e corrigido para respeitar React Rules of Hooks (useSite sem try/catch)
- [Phase 03-access-portal-internal-management]: SECURITY DEFINER functions is_admin() and get_user_subsection() break infinite recursion in user_roles RLS policies
- [Phase 03-access-portal-internal-management]: Service role key isolated to Edge Function via Deno.env.get — never exposed to frontend
- [Phase 03-access-portal-internal-management]: admin-create-user does atomic rollback: deleteUser if user_roles insert fails
- [Phase 02-public-site-content-management]: Past/upcoming split uses isPast(parseISO(course.date)) — no server-side filter, client handles both groups
- [Phase 02-public-site-content-management]: Cursos route added before /:slug catch-all to prevent routing conflict
- [Phase 02-public-site-content-management]: SubsectionsEditor uses no props — reads from Supabase directly via useSubsections, no config/updateConfig coupling
- [Phase 03-access-portal-internal-management]: AuthProvider scoped to portal subtree via layout Route — AdminLogin/ProtectedRoute remain independent and unchanged
- [Phase 03-access-portal-internal-management]: loading=true until both session AND role resolved — prevents premature redirect flash before role fetch completes
- [Phase 03-access-portal-internal-management]: PortalLogin re-fetches role after signInWithPassword independently — /portal is outside AuthProvider scope so useAuth() is unavailable there
- [Phase 02-public-site-content-management]: CoursesEditor uses react-hook-form + zod (not uncontrolled FormData) — URL and datetime validation require typed form state
- [Phase 03-access-portal-internal-management]: PortalLayout uses useSidebar in PortalSidebar sub-component — must render inside SidebarProvider, same pattern as AdminLayout
- [Phase 03-access-portal-internal-management]: AdminDashboard sections (usuarios/casos/site) use conditional rendering via activeItem — no nested routes needed
- [Phase 03-access-portal-internal-management]: PresidenteDashboard PortalRoute allowedRoles includes admin — admin can navigate to /portal/presidente/casos/:casoId to edit cases from AdminDashboard
- [Phase 03-access-portal-internal-management]: readonly mode derived from role=user inside CasoEditor — not from route; single component serves all three portal routes
- [Phase 03-access-portal-internal-management]: Null subsectionId guard on create: aborts INSERT with toast.error rather than silently sending null subsection_id to DB

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1]: Verificar quais componentes do shadcn/ui sobrescrevem as CSS variables — pode exigir override específico
- [Phase 2]: Supabase Storage com problemas conhecidos no fluxo atual — investigar antes de UPL-01..04
- [Phase 3]: RLS policies precisam ser testadas com usuários reais em cada role antes de considerar completo

## Session Continuity

Last session: 2026-03-18T05:43:11.679Z
Stopped at: Completed 03-04-PLAN.md (CasoEditor CRUD with document upload — all tasks done)
Resume file: None
