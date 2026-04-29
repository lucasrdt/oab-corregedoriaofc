---
phase: 03-access-portal-internal-management
plan: 03
subsystem: portal-dashboards
tags: [react, supabase, react-hook-form, zod, tanstack-query, shadcn-ui, role-based-dashboards]

# Dependency graph
requires:
  - phase: 03-access-portal-internal-management
    plan: 02
    provides: AuthProvider, useAuth hook (session/role/subsectionId/loading/signOut), PortalRoute guard
  - phase: 03-access-portal-internal-management
    plan: 01
    provides: admin-create-user edge function deployed, user_roles table with RLS
  - phase: 01-identity-foundation
    provides: supabase client (src/lib/supabase.ts), AdminLayout sidebar pattern
provides:
  - PortalLayout — shared sidebar layout for all portal dashboards with role badge, email display, signOut
  - AdminDashboard — user list + create user form (admin-create-user edge function) + casos list + site config
  - DevDashboard — link to /admin/editor with info note
  - PresidenteDashboard — casos list (RLS filtered) with Novo Caso + Editar navigation
  - UserDashboard — read-only casos list (RLS filtered)
affects:
  - 03-04-caso-editor (presidente + admin routes ready, /portal/presidente/casos/:casoId placeholder in App.tsx)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - PortalLayout wraps all dashboard pages — single sidebar + header with role badge, eliminates code duplication
    - Admin sections rendered conditionally via activeItem state — single component, no nested routes per section
    - react-hook-form + zod for AdminDashboard create-user form with conditional subsection_id field visibility
    - useQuery for all data fetching in dashboards — consistent cache key naming (admin-user-roles, admin-casos, presidente-casos, user-casos)
    - RLS transparent filtering — UserDashboard and PresidenteDashboard share the same query structure; RLS handles scope at DB level

key-files:
  created:
    - src/pages/portal/PortalLayout.tsx
    - src/pages/portal/AdminDashboard.tsx
    - src/pages/portal/DevDashboard.tsx
    - src/pages/portal/PresidenteDashboard.tsx
    - src/pages/portal/UserDashboard.tsx
  modified:
    - src/App.tsx

key-decisions:
  - "PortalLayout uses useSidebar hook internally in PortalSidebar sub-component — same pattern as AdminLayout, required because useSidebar must be inside SidebarProvider"
  - "AdminDashboard sections (usuarios/casos/site) use conditional rendering via activeItem state rather than nested routes — avoids route complexity and matches plan spec"
  - "PortalRoute for presidente path uses allowedRoles=['presidente', 'admin'] — admin can also navigate to /portal/presidente/casos/:casoId to edit cases, consistent with plan spec"
  - "subsection_id field in create-user form hidden unless role is presidente or user — controlled by watch('role') from react-hook-form"

# Metrics
duration: 2min
completed: 2026-03-18
---

# Phase 3 Plan 03: Portal Dashboards + AdminDashboard User Management Summary

**Five role-specific portal dashboards with shared PortalLayout sidebar, role badge, and signOut; AdminDashboard calls admin-create-user edge function with react-hook-form+zod form for creating users and toggling active state**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T05:35:53Z
- **Completed:** 2026-03-18T05:37:53Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- PortalLayout: SidebarProvider + SidebarInset wrapping all portal pages; role-colored Badge (admin=destructive, dev=secondary, presidente=default, user=outline); email display; signOut button navigating to /portal; mobile-friendly via useSidebar setOpenMobile(false)
- AdminDashboard: user_roles table listing with truncated UUIDs and role badges; create user Dialog with react-hook-form+zod, conditional subsection_id field for presidente/user roles; calls supabase.functions.invoke('admin-create-user'); deactivate toggle via user_roles UPDATE; casos list with navigation to editor; site config card linking to /admin/editor
- DevDashboard: two nav items (site/conteudo), card with info note and button to /admin/editor
- PresidenteDashboard: useQuery fetching casos (RLS filters to own subsection automatically); card grid with Editar button per caso; Novo Caso button navigating to /portal/presidente/casos/new
- UserDashboard: same card grid pattern as PresidenteDashboard but read-only (no action buttons)
- App.tsx: all four placeholder divs replaced with real dashboard components; /portal/presidente/casos/:casoId route added as placeholder for plan 03-04; TypeScript passes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Criar PortalLayout e DevDashboard/UserDashboard** - `652733b` (feat)
2. **Task 2: Criar AdminDashboard (gestão de usuários) e PresidenteDashboard, atualizar App.tsx** - `a8ae627` (feat)

## Files Created/Modified

- `src/pages/portal/PortalLayout.tsx` — shared layout with SidebarProvider, role-colored Badge, email, signOut; PortalSidebar sub-component uses useSidebar for mobile close
- `src/pages/portal/AdminDashboard.tsx` — three sections (usuarios/casos/site); create user Dialog with react-hook-form+zod; admin-create-user edge function invocation; deactivate user via user_roles UPDATE
- `src/pages/portal/DevDashboard.tsx` — minimal dashboard with card linking to /admin/editor
- `src/pages/portal/PresidenteDashboard.tsx` — useQuery casos list (RLS auto-filtered), card grid, Novo Caso + Editar navigation
- `src/pages/portal/UserDashboard.tsx` — useQuery casos list (RLS auto-filtered), card grid, read-only (no action buttons)
- `src/App.tsx` — imports 4 new dashboard components, replaces placeholder divs, adds /portal/presidente/casos/:casoId route

## Decisions Made

- PortalLayout sub-component pattern for PortalSidebar: `useSidebar` must be used inside `SidebarProvider`, so the inner component that calls it must be rendered after SidebarProvider is established. Same pattern as AdminLayout.
- PresidenteDashboard route `allowedRoles={['presidente', 'admin']}`: The admin may need to access /portal/presidente/casos/:casoId (e.g., to edit a caso via the "Ver/Editar" link from AdminDashboard). This makes admin access to the caso editor possible without creating a separate admin-specific route.
- AdminDashboard sections via activeItem state: The plan specified sections as nav items rather than sub-routes. Conditional rendering (`{activeItem === 'usuarios' && <UsuariosSection />}`) is cleaner and avoids nested route complexity.
- subsection_id conditional visibility: Uses `watch('role')` from react-hook-form to show/hide the UUID field — only when role is `presidente` or `user`. If not needed, passes `null` to the edge function regardless of input value.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Plan's automated verification commands contain `!` characters that conflict with bash shell expansion when using `node -e`. Resolved using `--input-type=commonjs` with heredoc stdin — same workaround documented in 03-02 SUMMARY.

## Next Phase Readiness

- All four dashboard routes are live with real components
- PortalLayout ready to be reused by any future portal page
- /portal/presidente/casos/:casoId route is registered in App.tsx as placeholder — ready to be replaced in 03-04
- AdminDashboard "Ver/Editar" links in casos section point to /portal/presidente/casos/:id — will work once 03-04 implements the editor

---
*Phase: 03-access-portal-internal-management*
*Completed: 2026-03-18*
