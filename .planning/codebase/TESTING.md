# Testing Patterns

**Analysis Date:** 2026-03-18

## Critical Finding: NO AUTOMATED TESTING

**Status:** No test framework installed or configured. Zero test files found in codebase.

- No Jest, Vitest, or other test runner configured
- No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files exist
- No `jest.config.js`, `vitest.config.ts`, or similar configuration
- No testing dependencies in `package.json` (no @testing-library, no test runners)

**Impact:** All quality assurance relies entirely on manual testing. No automated regression protection, no CI/CD test gates.

## Test Framework

**Runner:**
- Not detected

**Assertion Library:**
- Not detected

**Test File Organization:**
- No test files exist in codebase

## Manual Testing Practices

Based on codebase examination, testing appears to be manual only:

**Browser-based Testing:**
- Local development via Vite dev server on `http://localhost:8080`
- Manual navigation through pages
- Browser DevTools console for error checking

**Admin Testing Flow (Inferred):**
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:8080/admin`
3. Login with Supabase credentials
4. Manually test each admin editor section:
   - SiteEditor.tsx (general site config, team, FAQ, etc.)
   - CaseDetailsEditor.tsx (case/company details)
   - Various editor components (articles, calendar, leads, documents, etc.)
5. Verify Supabase data changes appear in database
6. Test domain management through Vercel API integration

**Public Page Testing (Inferred):**
1. Navigate to homepage and verify layout/colors load
2. Test category pages (Recuperacao Judicial, Falencia, etc.)
3. Test case detail pages via slug lookup
4. Test search/filter functionality
5. Check responsive design on mobile
6. Verify SEO metadata in page `<head>`

**Data Flow Testing (Inferred):**
1. Verify domain lookup works in `SiteContext.fetchConfig()`
2. Check that Supabase RPC returns correct site config
3. Verify color injection into CSS variables works
4. Check that default template merges with fetched config correctly

## Code Quality Patterns Observed

**Error Handling:**
- Try-catch blocks used but with generic error messages
- `error: any` types catch all, no specific error typing (233+ instances of `any` type usage)
- Example from SiteContext.tsx:
  ```typescript
  catch (err) {
    console.error('Unexpected error fetching site config:', err);
    setError('Failed to load site configuration (Unexpected Error)');
    setConfig(skeletonTemplate);
  }
  ```

**Console Logging:**
- Used for debugging instead of structured logging
- Example from SiteContext.tsx:
  ```typescript
  console.warn(`[DEV MODE] Usando domínio de teste: ${domain}`);
  console.log("Tentando buscar o domínio no Supabase:", domain);
  ```

**Type Safety:**
- TypeScript enabled but with relaxed settings:
  - `noImplicitAny: false` - allows implicit any types
  - `noUnusedParameters: false` - unused params allowed
  - `skipLibCheck: true` - skips type checking in node_modules
  - `allowJs: true` - allows mixed JS/TS
  - `noUnusedLocals: false` - unused local vars allowed
  - `strictNullChecks: false` - null/undefined not strictly checked
- Heavy use of `as any` type assertions throughout codebase (233+ instances)

**React Hook Rules:**
- Hooks properly called at component top level (observed in ComponentPage, DetalheCaso, etc.)
- Dependencies arrays used correctly in useEffect
- Example from DetalheCaso.tsx:
  ```typescript
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);
  ```

**State Management:**
- useState for local component state
- React Context (SiteContext) for global configuration state
- React Query (@tanstack/react-query) imported but no usage patterns found in main app
- No Redux, Zustand, or other state machines

## Component Testing Patterns (No Automated Tests)

**What Would Need Testing (But Currently Doesn't):**

**Unit-level concerns (DetalheCaso.tsx example):**
- `getCompanySlug()` function correctly identifies companies by slug
- Tab scrolling arrow visibility logic (`showLeftArrow`, `showRightArrow`)
- Filter state management (search, comarca, UF selection)
- Breadcrumb navigation link generation

**Integration concerns:**
- `SiteContext` loads correct config from Supabase based on domain
- Deep merge of default template with fetched config
- Color variable injection into CSS
- Admin routes properly protected by `ProtectedRoute.tsx`
- Domain verification flow through Vercel integration

**UI concerns:**
- Responsive layout breaks at different breakpoints (md, lg, xl)
- Modal dialogs open/close correctly
- Form submissions update database
- Error toasts display when operations fail

## Slug Collision Detection (Manual Testing Required)

**Function:** `getCompanySlug()` in `src/utils/slugify.ts`
```typescript
export function getCompanySlug(company: { id: number; name: string }, allCompanies: { id: number; name: string }[]): string {
  const baseSlug = generateBaseSlug(company.name);

  // Find all companies with the exact same base slug
  const companiesWithSameBaseSlug = allCompanies.filter(c => generateBaseSlug(c.name) === baseSlug);

  if (companiesWithSameBaseSlug.length <= 1) {
    return baseSlug;
  }

  // Sort identical companies by ID to ensure deterministic numbering
  const sortedCompanies = [...companiesWithSameBaseSlug].sort((a, b) => a.id - b.id);

  const index = sortedCompanies.findIndex(c => c.id === company.id);

  if (index === 0) {
    return baseSlug;
  }

  return `${baseSlug}-${index + 1}`;
}
```

**Manual testing approach:**
1. Create two companies with identical names
2. Verify first gets plain slug: `empresa-name`
3. Verify second gets numbered slug: `empresa-name-2`
4. Navigate to both URLs directly
5. Verify correct company appears on each page

## Testing Gaps & Risks

**Critical gaps:**
- No tests for domain-to-site lookup (RPC call in SiteContext.tsx)
- No tests for slug collision resolution
- No tests for admin authentication/authorization
- No tests for admin form submissions
- No tests for Supabase data modifications
- No tests for Vercel domain integration
- No tests for responsive layouts

**Risk areas requiring manual verification:**
- Database schema changes don't break existing queries
- Supabase migrations execute without errors
- Color injection works on different browsers
- SEO metadata updates correctly
- Admin pages only accessible when authenticated
- Admin users can only edit their own sites (currently no site ownership enforcement)

## Monitoring in Production

**Error Detection:**
- `console.error()` logs in try-catch blocks
- Browser console would show errors
- No error tracking service configured (Sentry, LogRocket, etc.)
- No structured logging service

**Performance:**
- No performance monitoring
- React Query could enable request deduplication and caching if configured properly

---

*Testing analysis: 2026-03-18*
