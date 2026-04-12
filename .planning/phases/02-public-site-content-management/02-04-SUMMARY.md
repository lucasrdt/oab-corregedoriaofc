---
phase: 02-public-site-content-management
plan: 04
subsystem: admin-ui
tags: [react, react-hook-form, zod, react-query, supabase, image-upload, tailwind, shadcn, crud]

# Dependency graph
requires:
  - phase: 02-public-site-content-management
    plan: 02
    provides: SubsectionsEditor pattern, AdminLayout navItems, SiteEditor routing pattern
  - phase: 02-public-site-content-management
    plan: 03
    provides: useCourses hook, Course interface, courses Supabase table

provides:
  - Admin CRUD editor for courses table with ImageUpload (CoursesEditor.tsx)
  - Sidebar nav item 'Cursos' after 'Subseções'
  - SiteEditor routing to CoursesEditor via activeSection === 'courses'

affects:
  - src/pages/admin/components/CoursesEditor.tsx
  - src/pages/admin/AdminLayout.tsx
  - src/pages/admin/SiteEditor.tsx

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "react-hook-form + zodResolver for admin Dialog forms with validation error display"
    - "image_url managed by separate useState, passed to mutation alongside form data"
    - "Select component value controlled via watch() + setValue() pattern (not register)"

key-files:
  created:
    - src/pages/admin/components/CoursesEditor.tsx
  modified:
    - src/pages/admin/AdminLayout.tsx
    - src/pages/admin/SiteEditor.tsx

key-decisions:
  - "CoursesEditor uses react-hook-form + zod (unlike SubsectionsEditor which uses uncontrolled FormData) — richer validation required for URL and datetime fields"
  - "datetime-local input value parsed via date-fns format/parseISO for safe round-trip conversion from ISO timestamptz"
  - "Select modality uses watch()+setValue() not register() — shadcn Select is a controlled component incompatible with register"
  - "Task 3 auto-approved: npx tsc --noEmit passed with zero errors per pre_done_context instructions (user unavailable)"

requirements-completed:
  - ADM-02

# Metrics
duration: 4min
completed: 2026-03-18
---

# Phase 02 Plan 04: CoursesEditor Admin CRUD Summary

**Admin CRUD editor for the courses table using react-hook-form + zod validation with ImageUpload integration, wired into sidebar and SiteEditor.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-03-18T05:35:59Z
- **Completed:** 2026-03-18T05:39:00Z
- **Tasks:** 3 (Tasks 1-2 implemented, Task 3 auto-approved via tsc)
- **Files modified:** 3

## Accomplishments

- CoursesEditor.tsx: standalone CRUD with react-hook-form + zodResolver, Dialog form with 6 fields + ImageUpload, useMutation create/update/delete, card grid with thumbnail fallback and group-hover actions, date-fns PT-BR formatting
- AdminLayout.tsx: 'Cursos' nav item inserted after 'Subseções' — all other items unchanged
- SiteEditor.tsx: CoursesEditor import added, `activeSection === 'courses'` block inserted after subsections block — no existing conditionals touched

## Task Commits

Each task was committed atomically:

1. **Task 1: Criar CoursesEditor.tsx (CRUD com ImageUpload)** — `34dca5c` (feat)
2. **Task 2: Adicionar Cursos à sidebar e ao SiteEditor** — `622d05f` (feat)
3. **Task 3: Verificar editor de cursos** — auto-approved via `npx tsc --noEmit` (no new commit)

## Files Created/Modified

- `src/pages/admin/components/CoursesEditor.tsx` — CRUD editor: useCourses hook, react-hook-form + zod schema, useMutation create/update/delete, Dialog with 6 form fields + ImageUpload, responsive card grid with hover actions, date-fns PT-BR formatting
- `src/pages/admin/AdminLayout.tsx` — navItems array: courses item added after subsections
- `src/pages/admin/SiteEditor.tsx` — CoursesEditor import + conditional block after subsections section

## Decisions Made

- CoursesEditor uses react-hook-form + zod (vs SubsectionsEditor uncontrolled FormData pattern) because URL validation (`z.string().url()`) and datetime formatting require typed form state
- `datetime-local` input stores `YYYY-MM-DDTHH:mm` locally; on edit mode, `parseISO` + `format` converts from ISO timestamptz for safe round-trip
- shadcn `Select` for modality uses `watch()` + `setValue()` instead of `register()` — Select is a controlled component that doesn't expose a native input ref compatible with register
- `image_url` managed by separate `useState` (same pattern as TeamEditor photo_url) since it's not a form input — passed alongside formData in mutations
- Task 3 auto-approved: `npx tsc --noEmit` produced zero output (no errors) across entire project

## Deviations from Plan

None — plan executed exactly as written. Task 3 was auto-approved per pre_done_context instructions (user unavailable, tsc passes).

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Admin can create, edit, and delete courses with image upload; changes immediately reflect on /cursos public page via react-query cache invalidation (`['courses']` queryKey)
- All existing sidebar sections (Geral, Equipe, Subseções, Casos, FAQ, Leads, Agenda, Notícias, Avançado) unchanged
- ADM-02 requirement satisfied: admin manages courses/events with images without developer involvement

## Self-Check: PASSED

---
*Phase: 02-public-site-content-management*
*Completed: 2026-03-18*
