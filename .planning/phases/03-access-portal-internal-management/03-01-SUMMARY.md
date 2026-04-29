---
phase: 03-access-portal-internal-management
plan: 01
subsystem: database
tags: [supabase, rls, postgres, row-level-security, edge-functions, deno, auth]

# Dependency graph
requires:
  - phase: 01-identity-foundation
    provides: supabase client setup and bucket site-assets convention
provides:
  - user_roles table with RLS and SECURITY DEFINER anti-recursion functions
  - casos table with multi-role RLS (admin/presidente/user)
  - Storage policies for casos/* path in site-assets bucket
  - admin-create-user Edge Function with service_role isolation and rollback
affects:
  - 03-access-portal-internal-management
  - any phase using casos table, user authentication, or admin user management

# Tech tracking
tech-stack:
  added: [Supabase RLS, Deno Edge Functions, supabase-js@2 service_role client]
  patterns:
    - SECURITY DEFINER functions to break RLS recursion in self-referencing tables
    - Edge Function auth gate pattern: verify Bearer token -> check user_roles -> execute admin action
    - Atomic user creation with rollback: createUser + insert user_roles, deleteUser on role failure

key-files:
  created:
    - supabase/migrations/20260318_phase3_roles_casos.sql
    - supabase/functions/admin-create-user/index.ts
  modified: []

key-decisions:
  - "SECURITY DEFINER functions is_admin() and get_user_subsection() break infinite recursion in user_roles RLS policies"
  - "Service role key isolated to Edge Function via Deno.env.get — never exposed to frontend"
  - "admin-create-user does atomic rollback: deleteUser if user_roles insert fails"
  - "email_confirm: true on createUser — bypasses email verification for admin-created accounts"
  - "subsection_id FK to subsecoes deferred — stored as plain uuid until Phase 2 table is available"
  - "Migration applied to Supabase via MCP by orchestrator — file artifact created for version control"

patterns-established:
  - "SECURITY DEFINER anti-recursion: any table with an admin policy that reads itself must use a helper function"
  - "Edge Function auth pattern: Authorization header -> getUser(token) -> check user_roles -> proceed"
  - "Storage path convention for casos: casos/{caso_id}/{timestamp}_{filename} in site-assets bucket"

requirements-completed: [AUTH-01, AUTH-02, CASO-01, CASO-02, CASO-03, CASO-04, CASO-05, UPL-02]

# Metrics
duration: 2min
completed: 2026-03-18
---

# Phase 3 Plan 01: user_roles + casos RLS foundation with admin Edge Function Summary

**PostgreSQL RLS with SECURITY DEFINER anti-recursion for user_roles/casos tables, plus Deno Edge Function for service_role-isolated admin user creation with atomic rollback**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-18T05:25:34Z
- **Completed:** 2026-03-18T05:27:19Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Tables `user_roles` and `casos` created with full RLS — policies covering admin, presidente, and user roles
- SECURITY DEFINER functions `is_admin()` and `get_user_subsection()` prevent infinite recursion in RLS policy evaluation
- Storage policies for `casos/*` path in `site-assets` bucket (upload, read, delete for authenticated users)
- `admin-create-user` Edge Function: verifies caller role via user_roles, creates user via service_role, inserts role atomically with rollback on failure

## Task Commits

Each task was committed atomically:

1. **Task 1: Criar migration SQL para user_roles e casos com RLS** - `6ba8510` (feat)
2. **Task 2: Criar Edge Function admin-create-user** - `bceed79` (feat)

## Files Created/Modified

- `supabase/migrations/20260318_phase3_roles_casos.sql` - Migration with user_roles, casos tables, RLS policies, SECURITY DEFINER helper functions, and storage policies
- `supabase/functions/admin-create-user/index.ts` - Deno Edge Function for admin-only user creation with service_role isolation

## Decisions Made

- SECURITY DEFINER pattern for `is_admin()`: admin policies on `user_roles` cannot SELECT from `user_roles` directly (infinite recursion). A SECURITY DEFINER function runs outside RLS context, breaking the cycle.
- Service role key access via `Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')` only — Supabase automatically injects this in deployed Edge Functions.
- Rollback strategy in Edge Function: if `user_roles.insert` fails after `auth.admin.createUser` succeeds, call `auth.admin.deleteUser` to avoid orphaned auth entries.
- `email_confirm: true` used in `createUser` — admin-created accounts are immediately active without requiring email confirmation.
- Migration was applied to Supabase project `yutlthbgcwktknqxdswb` via MCP by the orchestrator before this plan executed. The SQL file is committed for version control and reproducibility.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Node.js verification script required `.cjs` extension due to project `package.json` having `"type": "module"` — resolved by using `.cjs` extension for verification scripts.

## User Setup Required

The orchestrator will deploy the Edge Function via MCP after this plan completes. No additional manual setup required for the database migration (already applied).

## Next Phase Readiness

- `user_roles` and `casos` tables are live in Supabase with complete RLS
- `admin-create-user` Edge Function ready for deployment via MCP
- Next plans in Phase 3 can build login UI, admin portal pages, and casos management on this foundation
- Blocker: Edge Function deploy must complete before admin user creation UI can be tested end-to-end

---
*Phase: 03-access-portal-internal-management*
*Completed: 2026-03-18*
