# Phase 2: Public Site & Content Management - Research

**Researched:** 2026-03-18
**Domain:** React + Supabase — public pages, CRUD admin editors, Supabase Storage uploads
**Confidence:** HIGH

---

## Summary

Phase 2 converts the existing template-driven single-tenant site into a fully dynamic institutional
site for the OAB-MA Corregedoria. The two main tracks are: (a) building new public-facing pages
(`/subsecoes` and `/cursos`) that read from Supabase tables instead of the static template, and
(b) building CRUD editors in the admin panel so the corregedor staff can manage that content
without developer involvement.

The codebase already has all the UI primitives needed (shadcn/ui, Tailwind, AdminLayout with
sidebar, ImageUpload component, supabase client). The primary technical challenge is the
**data-source transition**: subsections and courses must be stored in dedicated Supabase tables
(not in the JSONB config), fetched with `@tanstack/react-query`, and written back through the
Supabase JS client. A second challenge is **Supabase Storage**: the existing `ImageUpload`
component uses `site-assets` bucket with a `siteId`-prefixed path, but the bucket may have
missing RLS policies or incorrect public-access settings, which has been flagged in STATE.md as a
known blocker.

The SiteContext is now static (no RPC calls) and does not need to be extended for Phase 2 data.
All new dynamic data lives in separate Supabase tables (`subsections`, `courses`) fetched
independently.

**Primary recommendation:** Create dedicated Supabase tables for subsections and courses, use
`@tanstack/react-query` for data fetching with `invalidateQueries` on mutations, reuse
`AdminLayout`+`TeamEditor` patterns for new editors, and audit/fix Supabase Storage bucket
policies before any upload work.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SUB-01 | Página `/subsecoes` exibe cards com: nome da cidade, corregedor(a), endereço, telefone e e-mail | New public page + Supabase table `subsections` |
| SUB-02 | Cards de subseções são gerenciados dinamicamente via painel admin (CRUD) | `SubsectionsEditor` component in admin sidebar |
| SUB-03 | Navegação do site: item "Subseções" substitui "Casos / Empresas" no Header | Modify `Header.tsx` nav items |
| CUR-01 | Página `/cursos` exibe catálogo com: imagem, título, descrição, data/hora, modalidade/local, link externo | New public page + Supabase table `courses` |
| CUR-02 | Cursos ordenados por data (mais próximos primeiro) | `ORDER BY date ASC` or client-side sort with `date-fns` |
| CUR-03 | Cursos passados visualmente distintos dos futuros | Compare course.date with `new Date()` — opacity or badge |
| ADM-01 | Editor de Subseções no admin: CRUD (cidade, corregedor, endereço, telefone, e-mail) | New `SubsectionsEditor.tsx` following `TeamEditor` pattern |
| ADM-02 | Editor de Cursos no admin: CRUD (título, descrição, data/hora, modalidade, local, link, imagem) | New `CoursesEditor.tsx` with `ImageUpload` |
| ADM-03 | Calendário, documentos globais e artigos continuam acessíveis a todos os roles | No regression — existing sections in `SiteEditor` stay intact |
| UPL-01 | Upload de imagens funcional no editor de equipe (Supabase Storage) | Fix Storage bucket policies (already partially implemented) |
| UPL-03 | Upload de imagem de cursos funcional (Supabase Storage) | Reuse `ImageUpload` with `bucket="site-assets"` or `"course-images"` |
| UPL-04 | Upload de logo/favicon/imagens do site funcional (Supabase Storage) | Same bucket fix — test and validate existing code path |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | ^2.86.0 (installed) | DB queries + Storage uploads | Already configured in `src/lib/supabase.ts` |
| @tanstack/react-query | ^5.83.0 (installed) | Data fetching, caching, mutations | Already in use via `QueryClientProvider` in `App.tsx` |
| react-router-dom | ^6.30.1 (installed) | Routes for new public pages | Already used; just add new `<Route>` entries |
| shadcn/ui (Radix + Tailwind) | see package.json | All UI components (Card, Dialog, Button…) | Entire component library already present |
| date-fns | ^3.6.0 (installed) | Date parsing, comparison, formatting | Already in repo; use `isPast`, `compareAsc`, `format` |
| lucide-react | ^0.462.0 (installed) | Icons in editor and public pages | Consistent with existing components |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sonner (toast) | ^1.7.4 (installed) | Success/error feedback after CRUD ops | Mutation success/error handlers — same as `TeamEditor` |
| react-hook-form + zod | installed | Form validation in editor dialogs | Use for `CoursesEditor` form (has more fields); `SubsectionsEditor` can use simple state |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Supabase tables | JSONB config blob | Tables enable proper query, ordering, and future RLS; JSONB blob requires full-config save on every change |
| react-query | useState + useEffect | react-query handles loading/error/refetch automatically; avoids manual state management |

**Installation:** No new packages required. All dependencies are already installed.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── pages/
│   ├── Subsecoes.tsx          # Public page — reads from Supabase
│   ├── Cursos.tsx             # Public page — reads from Supabase
│   └── admin/
│       └── components/
│           ├── SubsectionsEditor.tsx   # New — CRUD editor
│           └── CoursesEditor.tsx       # New — CRUD editor with ImageUpload
├── hooks/
│   ├── useSubsections.ts      # react-query hook for subsections
│   └── useCourses.ts          # react-query hook for courses
└── lib/
    └── supabase.ts            # Unchanged — reuse existing client
```

### Pattern 1: Public Page — Supabase Query via react-query

The existing `NaMidia.tsx` reads from `config.content.articles` (static template). New pages
must read from Supabase tables. Use `useQuery` directly in the page or in a custom hook.

**What:** Fetch rows from Supabase on mount, display loading skeleton while fetching.
**When to use:** All new public pages that need dynamic data from the database.

```typescript
// Source: @tanstack/react-query v5 docs + @supabase/supabase-js v2
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useSubsections() {
  return useQuery({
    queryKey: ['subsections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subsections')
        .select('*')
        .order('city', { ascending: true });
      if (error) throw error;
      return data;
    },
  });
}
```

### Pattern 2: Admin Editor — Mutation with Cache Invalidation

Follow the existing `TeamEditor` pattern. Mutations call `supabase.from().insert/update/delete`,
then invalidate the react-query cache so the public page and editor both refresh.

```typescript
// Source: @tanstack/react-query v5 docs
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useDeleteSubsection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('subsections').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subsections'] });
      toast.success('Subseção removida.');
    },
    onError: () => toast.error('Erro ao remover subseção.'),
  });
}
```

### Pattern 3: Course Date Distinction (Past vs Future)

CUR-03 requires past courses to be visually distinct. Use `date-fns/isPast` against the course
datetime field. Apply reduced opacity for past courses.

```typescript
// Source: date-fns v3 docs — isPast(date: Date | number): boolean
import { isPast, parseISO } from 'date-fns';

const isPastCourse = isPast(parseISO(course.date));
// In JSX:
// <div className={`... ${isPastCourse ? 'opacity-50' : ''}`}>
```

### Pattern 4: Adding New Sections to AdminLayout Sidebar

`AdminLayout.tsx` reads `navItems` array defined inside the file. To add "Subseções" and "Cursos"
sections to the sidebar, add entries to that array and render the corresponding editor component
in `SiteEditor.tsx`'s section switch.

```typescript
// In AdminLayout.tsx — extend navItems:
const navItems = [
  { id: 'general',      label: 'Geral & SEO' },
  { id: 'content',      label: 'Quem Somos' },
  { id: 'team',         label: 'Equipe' },
  { id: 'subsections',  label: 'Subseções' },   // NEW
  { id: 'courses',      label: 'Cursos' },       // NEW
  { id: 'cases',        label: 'Casos' },
  // ...rest unchanged
];
```

### Pattern 5: Supabase Storage Upload (ImageUpload component)

The `ImageUpload` component already exists at `src/components/ui/image-upload.tsx`. It uploads
to the `site-assets` bucket with path `${siteId}/${randomId}.ext`. The component is functional
but the bucket must have the correct policies.

**Required Supabase Storage bucket settings:**
- Bucket `site-assets` must exist and be **public** (so `getPublicUrl` returns an accessible URL)
- RLS insert policy: allow authenticated users (or use service role for admin operations)
- The `siteId` prop must be passed — in admin context, use `OAB_MA_SITE_ID` constant already
  defined in `SiteEditor.tsx`

### Anti-Patterns to Avoid

- **Storing subsections/courses in JSONB config blob:** Requires saving the entire config on
  every CRUD operation, prevents proper date ordering, and makes future RLS scoping impossible.
- **Calling supabase directly in JSX render functions:** Always use hooks (`useQuery`, custom
  hooks) to avoid re-fetching on every render.
- **Hardcoding bucket names per editor:** Centralize bucket name as a constant; all uploads
  (team, courses, logo) use `"site-assets"` unless a separate bucket is specifically provisioned.
- **Blocking UI during upload:** The `ImageUpload` component already handles async upload state
  with a spinner — do not replace it with synchronous approaches.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image uploads | Custom fetch + FormData | Existing `ImageUpload` component | Already handles validation, 5MB limit, Supabase Storage path, error toasts |
| Date formatting | Manual string formatting | `date-fns` `format`, `isPast`, `parseISO` | Edge cases in locale, timezones, ISO vs BR date strings |
| Form validation | Manual if/else validators | `react-hook-form` + `zod` | Especially important for course form (8+ fields with date/url validation) |
| Loading/error state | `useState(loading, error)` | `useQuery` from react-query | Automatic retry, deduplication, background refresh |
| Toast notifications | Custom alert components | `sonner` `toast.success/error` | Already wired globally; consistent with rest of admin |
| Dialog/Modal | Custom modal overlay | `shadcn/ui Dialog` | Already used in `TeamEditor` — consistent UX |

---

## Common Pitfalls

### Pitfall 1: Supabase Storage — Public URL but Private Bucket

**What goes wrong:** Upload succeeds (HTTP 200) but the returned `publicUrl` returns 400/403 when
used as `<img src>`. Images appear broken in both admin and public site.
**Why it happens:** The bucket exists but is set to private, or is missing the RLS SELECT policy
for anonymous reads.
**How to avoid:** In Supabase Dashboard, verify `site-assets` bucket is set to Public, OR add an
explicit RLS policy: `ALLOW SELECT FOR ALL` on the bucket objects.
**Warning signs:** Upload succeeds but `<img>` shows broken icon; `getPublicUrl` returns a URL
that 403s in browser.

### Pitfall 2: Missing Supabase Tables — Schema Not Migrated

**What goes wrong:** `supabase.from('subsections').select('*')` returns error code `42P01`
(relation does not exist). The entire page breaks.
**Why it happens:** The tables `subsections` and `courses` don't exist yet — the project has no
migration files. The `supabase/` directory was deleted (visible in git status as deleted files).
**How to avoid:** Plan 02-01 (or a dedicated setup task) must create the tables via Supabase
Dashboard SQL editor or a new migration. Include schema creation as Wave 0 for every plan that
touches these tables.
**Warning signs:** Console shows Supabase error with `code: "42P01"`; react-query enters error
state on page load.

### Pitfall 3: Navigation Item "Casos / Empresas" Is Dropdown-Based

**What goes wrong:** SUB-03 says replace "Casos / Empresas" with "Subseções". The current
`Header.tsx` has a dropdown button (not a `<Link>`) for "Casos / Empresas". Naive replacement
could leave the mobile nav with a broken section or duplicate nav items.
**Why it happens:** "Casos / Empresas" is rendered as a `<button>` with `caseTypes` children.
"Subseções" is a single direct link `/subsecoes` — no dropdown needed.
**How to avoid:** Remove the entire dropdown block in both desktop nav and mobile nav. Replace
with a simple `<Link to="/subsecoes">Subseções</Link>`.
**Warning signs:** Desktop nav shows "Subseções" correctly but mobile nav still shows
"Casos / Empresas" section (separate mobile block at bottom of mobile menu).

### Pitfall 4: Date Sorting — ISO vs Brazilian Format

**What goes wrong:** Courses display in wrong order; `compareAsc` produces wrong results.
**Why it happens:** The existing codebase stores dates in mixed formats (BR: `dd/mm/yyyy`, ISO:
`yyyy-mm-dd`). The `NaMidia.tsx` page has a custom `parseDate` function to handle this. If the
`courses` table stores datetime as a PostgreSQL `timestamptz`, the client will receive ISO strings
— which parse correctly — but if text is stored, the same problem recurs.
**How to avoid:** Store course date in Supabase as `timestamptz` column type. On insert, always
send ISO format string. Use `parseISO` from `date-fns` on the client.
**Warning signs:** Courses appear in random or reversed order; `isPast` returns incorrect results.

### Pitfall 5: ADM-03 Regression — Existing Sections Must Remain Accessible

**What goes wrong:** Adding new sidebar items or refactoring `SiteEditor.tsx` breaks the existing
`activeSection` switch and the calendar/articles/FAQ editors stop rendering.
**Why it happens:** `SiteEditor.tsx` renders editors via an if/else or switch on `activeSection`.
If new cases are added incorrectly, the default case or existing cases break.
**How to avoid:** Add new cases to the switch/if-chain without modifying existing cases. Test by
clicking each existing nav item after implementing new ones.
**Warning signs:** Clicking "Agenda" or "Notícias" in admin sidebar renders blank content area.

---

## Code Examples

### Creating the `subsections` Table (SQL for Supabase Dashboard)

```sql
-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.subsections (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city        text NOT NULL,
  corregedor  text NOT NULL,
  address     text,
  phone       text,
  email       text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Enable RLS (public read for now; write restricted to authenticated)
ALTER TABLE public.subsections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.subsections FOR SELECT USING (true);
CREATE POLICY "Auth write" ON public.subsections FOR ALL USING (auth.role() = 'authenticated');
```

### Creating the `courses` Table (SQL for Supabase Dashboard)

```sql
CREATE TABLE IF NOT EXISTS public.courses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  date          timestamptz NOT NULL,
  modality      text,        -- "Presencial" | "Online" | "Híbrido"
  location      text,
  registration_link text,
  image_url     text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Auth write" ON public.courses FOR ALL USING (auth.role() = 'authenticated');
```

### Fetching and Ordering Courses (react-query hook)

```typescript
// src/hooks/useCourses.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('date', { ascending: true }); // CUR-02: nearest first
      if (error) throw error;
      return data;
    },
  });
}
```

### Past/Future Visual Distinction (CUR-03)

```typescript
// In Cursos.tsx
import { isPast, parseISO } from 'date-fns';

// Inside map of courses:
const past = isPast(parseISO(course.date));
// Apply to card wrapper:
// className={`... ${past ? 'opacity-50 grayscale' : ''}`}
// Or separate into two sections: upcoming / past (preferred for clarity)
```

### Extending AdminLayout navItems for New Sections

```typescript
// In AdminLayout.tsx — add to navItems array:
{ id: 'subsections', label: 'Subseções' },
{ id: 'courses',     label: 'Cursos' },
```

```typescript
// In SiteEditor.tsx — add to section render logic:
{activeSection === 'subsections' && (
  <SubsectionsEditor siteId={OAB_MA_SITE_ID} />
)}
{activeSection === 'courses' && (
  <CoursesEditor siteId={OAB_MA_SITE_ID} />
)}
```

### Registering New Public Routes in App.tsx

```typescript
// In App.tsx — add inside <Routes>:
import Subsecoes from "./pages/Subsecoes";
import Cursos from "./pages/Cursos";

<Route path="/subsecoes" element={<PageTransition><Subsecoes /></PageTransition>} />
<Route path="/cursos"    element={<PageTransition><Cursos /></PageTransition>} />
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Static JSONB config for all content | Dedicated Supabase tables for entity-specific data | Phase 2 boundary | Enables proper ordering, RLS in Phase 3, no full-config save on CRUD |
| "Casos / Empresas" dropdown nav | Direct link "Subseções" | Plan 02-01 | Cleaner nav, no dropdown children needed |
| Config-driven team data | Team data still in JSONB (no Phase 2 change) | N/A | TeamEditor stays as-is; only subsections/courses get tables |

**Deprecated/outdated:**
- **`caseTypes` dropdown in Header:** Removed as part of SUB-03 — "Subseções" replaces it as a simple link.
- **Storing dynamic listing data in `fullIvaldoTemplate` JSONB:** Acceptable for team (small, rarely changes), not acceptable for subsections and courses (variable count, need date ordering).

---

## Open Questions

1. **Supabase Storage bucket status**
   - What we know: `ImageUpload` component is implemented; uploads go to `site-assets` bucket;
     STATE.md flags "problemas conhecidos no fluxo atual".
   - What's unclear: Whether the bucket exists in the live project, whether it is public, and
     which specific error is occurring (RLS policy, missing bucket, CORS, or network).
   - Recommendation: Plan 02-05 must begin with a diagnostic step — attempt a test upload and
     inspect the exact Supabase error response before writing any code. Fix policy/bucket first.

2. **Admin authentication scope for CRUD operations**
   - What we know: Phase 3 implements full role-based auth. Phase 2 runs before Phase 3.
   - What's unclear: Whether the current admin login (`/admin`) provides an authenticated
     Supabase session that satisfies the `auth.role() = 'authenticated'` RLS policy.
   - Recommendation: Check `AdminLogin.tsx` — if it uses `supabase.auth.signInWithPassword`,
     the session is available and RLS write policies will work. If it's a custom password check
     (not Supabase Auth), write policies cannot rely on `auth.role()` and must be set to
     `USING (true)` for now (or use service role key, which carries security implications).

3. **Supabase tables — existing migrations deleted**
   - What we know: Git status shows `supabase/migrations/20250102_final_schema.sql` was deleted.
     The `supabase/` directory no longer exists locally.
   - What's unclear: Whether the tables from that migration still exist in the live Supabase
     project (they may have been applied before deletion).
   - Recommendation: Before creating `subsections` and `courses` tables, verify in the Supabase
     Dashboard what tables already exist. Avoid duplicate CREATE TABLE statements.

---

## Sources

### Primary (HIGH confidence)

- Supabase JS v2 official docs — `from().select/insert/update/delete`, Storage API, `getPublicUrl`
- @tanstack/react-query v5 official docs — `useQuery`, `useMutation`, `invalidateQueries`
- date-fns v3 official docs — `isPast`, `parseISO`, `format`, `compareAsc`
- Direct source inspection: `src/components/ui/image-upload.tsx`, `src/pages/admin/components/TeamEditor.tsx`, `src/pages/admin/AdminLayout.tsx`, `src/contexts/SiteContext.tsx`, `src/components/Header.tsx`, `src/App.tsx`

### Secondary (MEDIUM confidence)

- STATE.md blocker note: "Supabase Storage com problemas conhecidos no fluxo atual" — confirmed by reading `image-upload.tsx` which is implemented but untested in production context.
- Git status: `supabase/migrations/20250102_final_schema.sql` deleted — confirms no local migration files remain.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries are already installed and in use; no new dependencies needed
- Architecture: HIGH — patterns derived directly from existing code (`TeamEditor`, `NaMidia`, `AdminLayout`)
- Pitfalls: HIGH for nav/regression pitfalls (direct code inspection); MEDIUM for Storage issues (exact error unknown until diagnostics run)
- Database schema: MEDIUM — proposed schema is standard; actual live schema state needs Dashboard verification

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable stack; Supabase and react-query are not fast-moving)
