---
phase: 03-access-portal-internal-management
plan: 02
subsystem: auth
tags: [react, supabase, react-hook-form, zod, react-router-dom, context-api, role-based-access]

# Dependency graph
requires:
  - phase: 03-access-portal-internal-management
    provides: user_roles table with RLS, is_admin() and get_user_subsection() SECURITY DEFINER functions
  - phase: 01-identity-foundation
    provides: supabase client (src/lib/supabase.ts)
provides:
  - AuthProvider + useAuth hook — session, role, subsectionId, loading, signOut
  - PortalRoute role guard — redirects unauthenticated to /portal, wrong-role to ROLE_DASHBOARDS[role]
  - PortalLogin page at /portal — react-hook-form+zod, role-based redirect, existing-session redirect
  - App.tsx portal route tree — /portal/admin, /portal/dev, /portal/presidente, /portal/user (placeholder dashboards)
affects:
  - 03-03-admin-portal
  - 03-04-user-portal
  - any component using useAuth() for role-aware rendering

# Tech tracking
tech-stack:
  added: [react-hook-form (already in deps), zod (already in deps), @hookform/resolvers (already in deps)]
  patterns:
    - AuthContext with race-condition-safe loading (true until session AND role both resolved)
    - PortalRoute as layout route — Outlet only rendered when role is in allowedRoles
    - AuthProvider scoped to portal subtree only — not global wrapper, /admin/* unaffected
    - ROLE_DASHBOARDS constant defined locally in each file that needs it (PortalLogin + PortalRoute)

key-files:
  created:
    - src/contexts/AuthContext.tsx
    - src/components/PortalRoute.tsx
    - src/pages/portal/PortalLogin.tsx
  modified:
    - src/App.tsx

key-decisions:
  - "AuthProvider scoped to portal subtree via layout Route — AdminLogin/ProtectedRoute remain independent and unchanged"
  - "loading=true until both session AND role resolved — prevents premature redirect flash before role fetch completes"
  - "maybeSingle() used for user_roles query — returns null instead of error when user has no role configured"
  - "PortalLogin re-fetches role after signInWithPassword instead of relying on AuthContext — context not available at /portal (outside AuthProvider scope)"

patterns-established:
  - "Role guard pattern: PortalRoute checks loading -> session -> allowedRoles in that order, each with its own redirect"
  - "ROLE_DASHBOARDS map defined as module-level const — single source of truth per file, consistent across guard and login"

requirements-completed: [AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07, AUTH-08]

# Metrics
duration: 2min
completed: 2026-03-18
---

# Phase 3 Plan 02: AuthContext + PortalRoute + PortalLogin Summary

**React auth infrastructure for portal: AuthContext with race-condition-safe loading, PortalRoute role guard with ROLE_DASHBOARDS redirect, and PortalLogin page using react-hook-form+zod wired into App.tsx portal subtree**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T05:31:49Z
- **Completed:** 2026-03-18T05:33:35Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- AuthContext provides session, role, subsectionId, loading, signOut — loading stays true until BOTH session and role are resolved, preventing race-condition redirects
- PortalRoute layout route guards any /portal/* path by role using ROLE_DASHBOARDS — spinner while loading, redirect to /portal if unauthenticated, redirect to correct dashboard if wrong role
- PortalLogin at /portal: react-hook-form+zod validation, humanized error for invalid credentials, "Contate o administrador" error for unconfigured users, existing-session redirect on mount
- App.tsx: /portal/* routes added with AuthProvider scoped to portal subtree only; all /admin/* routes untouched; TypeScript passes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Criar AuthContext e PortalRoute** - `20551a8` (feat)
2. **Task 2: Criar PortalLogin e adicionar rotas do portal em App.tsx** - `1d8c337` (feat)

## Files Created/Modified

- `src/contexts/AuthContext.tsx` - AuthProvider + useAuth hook; fetches role from user_roles with active=true filter; onAuthStateChange re-fetches role on session change
- `src/components/PortalRoute.tsx` - Role guard layout route; ROLE_DASHBOARDS map; loading spinner pattern matching ProtectedRoute
- `src/pages/portal/PortalLogin.tsx` - Public login page for portal; react-hook-form + zod; role-based redirect after login; existing-session redirect via useEffect
- `src/App.tsx` - Added portal routes with AuthProvider scoped to /portal/* subtree; /admin/* block untouched

## Decisions Made

- AuthProvider scoped to portal subtree (layout Route wrapping portal routes) rather than as global wrapper — ensures /admin/* routes continue using their own independent ProtectedRoute without AuthContext interference.
- PortalLogin re-fetches role independently after signInWithPassword rather than using AuthContext — because /portal is outside the AuthProvider scope, useAuth() is not available there.
- `maybeSingle()` used for user_roles SELECT — returns `null` on no match instead of throwing an error, so users without a configured role get a clean error message rather than a crash.
- `loading` initialized to `true` and only set `false` after both `getSession()` and `fetchRole()` complete — prevents PortalRoute from briefly showing redirect while role is still being fetched.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Node.js verification command with `!` in inline `-e` script failed due to bash shell expansion — resolved by using `--input-type=commonjs` with heredoc stdin instead.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- useAuth() hook ready for all portal dashboard pages (03-03, 03-04)
- PortalRoute ready to guard any /portal/* path — just pass allowedRoles prop
- Placeholder dashboards at /portal/admin, /portal/dev, /portal/presidente, /portal/user will be replaced in 03-03 and 03-04
- /portal login flow tested to type-check clean; end-to-end test requires live Supabase user_roles data

---
*Phase: 03-access-portal-internal-management*
*Completed: 2026-03-18*
