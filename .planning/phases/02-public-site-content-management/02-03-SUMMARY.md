---
phase: 02-public-site-content-management
plan: 03
subsystem: public-site
tags: [courses, react-query, supabase, date-fns, public-page]
dependency_graph:
  requires: [02-01]
  provides: [/cursos public page, useCourses hook, courses table read]
  affects: [src/App.tsx, src/hooks/useCourses.ts, src/pages/Cursos.tsx]
tech_stack:
  added: []
  patterns: [react-query useQuery, supabase .from().select().order(), date-fns isPast+format, shadcn Card+Button]
key_files:
  created:
    - src/hooks/useCourses.ts
    - src/pages/Cursos.tsx
  modified:
    - src/App.tsx
key_decisions:
  - "Past/upcoming split uses isPast(parseISO(course.date)) — no server-side filter, client handles both groups"
  - "Cursos route added before /:slug catch-all to prevent routing conflict"
  - "App.tsx /cursos route was already present in HEAD from a concurrent plan agent — no duplicate commit needed"
  - "Task 0 (courses table creation) pre-completed by orchestrator via Supabase MCP"
metrics:
  duration: "~2 minutes"
  completed_date: "2026-03-18"
  tasks_completed: 4
  files_changed: 3
requirements: [CUR-01, CUR-02, CUR-03]
---

# Phase 02 Plan 03: Cursos — Catálogo de Cursos Público Summary

**One-liner:** React-query hook + public /cursos page reading Supabase `courses` table, split into upcoming/past groups with `isPast` from date-fns, skeleton loading, empty state, and PT-BR formatted dates.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 0 | Criar tabela courses no Supabase Dashboard | pre-done by orchestrator | supabase dashboard |
| 1 | Hook useCourses e página Cursos.tsx | 5704302 | src/hooks/useCourses.ts, src/pages/Cursos.tsx |
| 2 | Registrar rota /cursos no App.tsx | in HEAD (6ba8510) | src/App.tsx |
| 3 | Verificar página /cursos | auto-approved (tsc pass) | — |

## What Was Built

### useCourses hook (`src/hooks/useCourses.ts`)
- Exports `Course` interface matching Supabase `courses` table schema
- `useCourses()` using `useQuery` from @tanstack/react-query v5
- queryKey `['courses']`, queryFn calls `supabase.from('courses').select('*').order('date', { ascending: true })`
- Throws on Supabase error

### Cursos page (`src/pages/Cursos.tsx`)
- Public page at `/cursos` with `<Header />` and `<Footer />`
- Loading state: grid of 4 `animate-pulse bg-muted rounded-xl h-64` skeleton cards
- Error state: "Erro ao carregar cursos. Tente novamente mais tarde."
- Empty state: "Nenhum curso disponível no momento."
- Filled state: two sections — "Próximos Cursos" (future) and "Cursos Realizados" (past)
- Past courses wrapped in `opacity-50 grayscale` div (CUR-03)
- Cards: image or BookOpen placeholder, title, description (line-clamp-3), PT-BR formatted date, modality+location with MapPin icon, "Inscrever-se" button link
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

### App.tsx route (`src/App.tsx`)
- `import Cursos from "./pages/Cursos"` added
- `<Route path="/cursos" element={<PageTransition><Cursos /></PageTransition>} />` positioned before `/:slug` catch-all

## Deviations from Plan

### Notes

**1. App.tsx already had /cursos route in HEAD**
- **Found during:** Task 2
- **Issue:** When attempting to commit App.tsx changes, git reported no diff — `src/App.tsx` line 18 and 61 already contained the Cursos import and route in the HEAD commit (6ba8510, feat(03-01)), placed there by a concurrent plan agent that had read the updated working tree.
- **Fix:** No action needed — route already registered correctly. No duplicate commit created.
- **Impact:** None. Route is present and correct.

**2. Task 0 pre-completed by orchestrator**
- The `courses` table with all columns and RLS policies was created via Supabase MCP before this executor was spawned. Treated as complete, no pause.

**3. Task 3 auto-approved via TypeScript check**
- User was unavailable. `npx tsc --noEmit` passed with zero errors across entire project. Auto-approved per pre_done_context instructions.

## Verification Results

- `npx tsc --noEmit` — PASSED (0 errors)
- Rota /cursos in App.tsx before /:slug — CONFIRMED (line 61)
- useCourses uses `order('date', { ascending: true })` — CONFIRMED (CUR-02)
- Past courses rendered with `opacity-50 grayscale` — CONFIRMED (CUR-03)

## Self-Check: PASSED
