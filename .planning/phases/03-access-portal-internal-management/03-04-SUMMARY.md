---
phase: 03-access-portal-internal-management
plan: 04
subsystem: caso-editor
tags: [react, supabase, typescript, document-upload, role-based-access, crud]

# Dependency graph
requires:
  - phase: 03-access-portal-internal-management
    plan: 03
    provides: PortalLayout, PresidenteDashboard, UserDashboard, AdminDashboard with navigation links to /portal/presidente/casos/:casoId
  - phase: 03-access-portal-internal-management
    plan: 02
    provides: AuthProvider, useAuth hook (session/role/subsectionId/loading/signOut)
  - phase: 03-access-portal-internal-management
    plan: 01
    provides: casos table with RLS, site-assets bucket
provides:
  - CasoEditor — portal CRUD editor for casos with document upload; readonly for role=user
affects:
  - src/App.tsx (all portal caso routes now live)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CasoEditor uses useAuth() for role/subsectionId — readonly derived from role=user, subsection_id for INSERT
    - Supabase RLS enforces access at DB level — same component works for presidente (own subsection) and admin (any subsection)
    - DocumentUploadEditor reused from admin panel with bucket=site-assets — uploads go to {siteId}/cases/{timestamp}_{filename}
    - Accordion pattern for document sections — same UX as CaseDetailsEditor in admin panel
    - Null guard on subsectionId before INSERT — toast.error if presidente has no subsection configured

key-files:
  created:
    - src/pages/portal/CasoEditor.tsx
  modified:
    - src/App.tsx

key-decisions:
  - "readonly mode derived from role=user inside CasoEditor — not from route; single component serves all three routes"
  - "backPath logic: admin -> /portal/admin, presidente -> /portal/presidente, default -> /portal; navigates after successful create/delete"
  - "handleSave uses INSERT for casoId=new with subsection_id from AuthContext; UPDATE .eq('id', casoId) for existing — updated_at explicit ISO string"
  - "Null subsectionId guard on create: aborts with user-friendly toast rather than silently sending null to DB"
  - "Admin caso route /portal/admin/casos/:casoId placed inside allowedRoles=['admin'] PortalRoute — not inside presidente route"

# Metrics
duration: 2min
completed: 2026-03-18
---

# Phase 3 Plan 04: CasoEditor CRUD with Document Upload Summary

**CasoEditor portal component with full Supabase CRUD (INSERT/UPDATE/DELETE on casos table), DocumentUploadEditor in 6 accordion sections, and readonly mode for role=user; three portal routes (presidente, admin, user) added to App.tsx**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T05:40:31Z
- **Completed:** 2026-03-18T05:42:39Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- CasoEditor.tsx (608 lines): sticky header with back navigation, save and delete buttons (hidden in readonly); Card 1 "Informações do Caso" with all process fields (nome, processo, comarca, UF, vara, especialista, passivo, credores, link_habilitacoes); Card 2 "Datas" with date inputs; Card 3 "Documentos" with 6 accordion sections using DocumentUploadEditor; floating FAB for mobile save
- Supabase operations: INSERT on create (casoId='new') with subsection_id from AuthContext; UPDATE with updated_at on edit; DELETE with confirm dialog; all navigate to role-appropriate dashboard on success
- readonly mode: role=user shows yellow info banner, hides all action buttons, disables all inputs, DocumentUploadEditor sections visible for read-only viewing
- Null guard: if subsectionId is null when creating, shows toast.error and returns without insert
- App.tsx: CasoEditor import added; placeholder div replaced at /portal/presidente/casos/:casoId; /portal/admin/casos/:casoId inside admin PortalRoute; /portal/user/casos/:casoId inside user PortalRoute
- TypeScript: `npx tsc --noEmit` passes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Criar CasoEditor com CRUD completo e upload de documentos** - `cb15908` (feat)
2. **Task 2: Atualizar App.tsx e adicionar rotas de casos para admin e user** - `a6e4663` (feat)

## Files Created/Modified

- `src/pages/portal/CasoEditor.tsx` — portal caso editor with INSERT/UPDATE/DELETE, role-based readonly, 6 document accordion sections with DocumentUploadEditor, null subsectionId guard
- `src/App.tsx` — CasoEditor import added; placeholder replaced; 3 routes registered (presidente, admin, user)

## Decisions Made

- readonly derived from `role === 'user'` inside the component — single CasoEditor handles all three routes without needing route-specific props
- backPath computed from role: admin -> /portal/admin, presidente -> /portal/presidente, default -> /portal — ensures correct navigation after save/delete/back
- Admin route placed inside `allowedRoles={['admin']}` PortalRoute block, separate from presidente block — cleaner separation even though admin can also access /portal/presidente/casos/:casoId via the existing PresidenteDashboard route
- `updated_at: new Date().toISOString()` sent explicitly on UPDATE — relies on DB column accepting string, consistent with the pattern in the plan spec

## Deviations from Plan

None - plan executed exactly as written.

## Checkpoint: Auto-Approved

The `checkpoint:human-verify` task was auto-approved per execution context. Verification performed:
- `npx tsc --noEmit` — PASSED, zero TypeScript errors
- CasoEditor.tsx file contents verified for all required keys: useAuth, DocumentUploadEditor, subsection_id, casoId, handleSave, handleDelete, readonly, VITE_SITE_ID
- App.tsx verified for all required patterns: CasoEditor import, 3 caso routes, no placeholder div, AdminLogin route intact

## Self-Check: PASSED

All claimed artifacts exist and commits are verified:
- `src/pages/portal/CasoEditor.tsx` — FOUND
- `src/App.tsx` — FOUND (modified)
- commit cb15908 — feat(03-04): create CasoEditor
- commit a6e4663 — feat(03-04): update App.tsx

---
*Phase: 03-access-portal-internal-management*
*Completed: 2026-03-18*
