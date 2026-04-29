# Codebase Concerns

**Analysis Date:** 2026-03-18

## Tech Debt

**Hardcoded Domains in Configuration:**
- Issue: Multiple hardcoded domain references scattered across codebase make it difficult to support multi-tenancy and environment configuration
- Files:
  - `src/contexts/SiteContext.tsx:73` - Hardcoded default domain `'ivaldopraddo.com'` for localhost/dev mode
  - `src/config/template-ivaldo.ts` - Multiple hardcoded email addresses (`contato@ivaldopraddo.com`), phone, website, Instagram URLs
  - `vite.config.ts:13-17` - Hardcoded allowedHosts array: `['ivaldoprado.com', 'site1.com', 'site2.com']`
- Impact:
  - Cannot easily deploy to new domains without code changes
  - Dev mode always assumes ivaldopraddo.com domain
  - Build configuration tied to specific domains
  - Makes staging/testing with different domains difficult
- Fix approach:
  - Move domain configuration to environment variables (.env)
  - Create environment-specific config loading in SiteContext
  - Update vite.config.ts to read allowedHosts from env or remove the restriction
  - Keep template defaults generic (use "Empresa" instead of "Ivaldo Praddo" where possible)

**Large Monolithic Template File:**
- Issue: `src/config/template-ivaldo.ts` contains 1155 lines with all default configuration (SEO, colors, fonts, company info, addresses, social media, about section, benefits, team, FAQ, case types, companies, news categories, news articles, etc.)
- Files: `src/config/template-ivaldo.ts`
- Impact:
  - Difficult to navigate and maintain
  - Hard to locate specific configuration values
  - Changes require understanding entire file structure
  - Conflicts likely during merges
  - Makes adding new configuration options complex
- Fix approach:
  - Split into modular files:
    - `template/seo.ts` - SEO defaults
    - `template/colors.ts` - Color palette
    - `template/content.ts` - Company content (about, team, benefits)
    - `template/cases.ts` - Case types and default companies
    - `template/news.ts` - News categories and default articles
  - Create index file that re-exports all defaults
  - Update imports throughout codebase

**Edge Functions Marked for Removal:**
- Issue: Supabase Edge Functions are referenced but marked as deprecated/to-be-removed in architecture
- Files: `supabase/functions/` directory (deleted - marked with 'D' in git status)
- Current state:
  - File `supabase/functions/manage-domain/index.ts` deleted from tracking
  - Suggests Edge Functions were part of old architecture
  - Domain management now handled via direct Vercel API calls (see `src/lib/domainService.ts`)
- Impact:
  - Residual references may still exist
  - Migration incomplete if any code still tries to call Edge Functions
  - Database migrations also deleted (see `supabase/migrations/20250102_final_schema.sql`)
- Fix approach:
  - Audit all Supabase client calls to ensure no Edge Functions are invoked
  - Verify all functionality moved to direct Vercel API integration or client-side logic
  - Remove any commented-out Edge Function references

**Type Safety Issues:**
- Issue: TypeScript strict mode disabled to allow relaxed type checking throughout application
- Files: `tsconfig.json`
  - `noImplicitAny: false` - allows variables without type annotations
  - `noUnusedParameters: false` - unused parameters not flagged
  - `noUnusedLocals: false` - unused variables not flagged
  - `strictNullChecks: false` - null/undefined not properly checked
  - `allowJs: true` - mixes JS and TS
- Codebase: 233+ instances of `as any` type assertions in code
- Example from SiteContext.tsx:
  ```typescript
  const fetchedConfig = (siteData as any).config || {};
  const mergedConfig = deepMerge(skeletonTemplate, fetchedConfig) as TemplateIvaldo;
  ```
- Impact:
  - IDE cannot catch null reference errors before runtime
  - Type mismatches go undetected
  - Harder to refactor with confidence
  - Future maintainers cannot trust types
- Fix approach:
  - Gradually enable strict mode settings one at a time
  - Replace `as any` assertions with proper typing
  - Add return types to all functions
  - Add parameter types to all functions
  - Test thoroughly after each setting enabled

---

## Known Bugs

**Slug Collision Risk:**
- Symptoms: Two companies with identical names (after slug normalization) will both try to use the same URL slug, causing routing conflicts
- Files:
  - `src/utils/slugify.ts` - Implements collision detection
  - `src/pages/DetalheCaso.tsx:23` - Uses `getCompanySlug()` to find company
  - `src/App.tsx:70` - Catch-all route `/:slug` routes to DetalheCaso
- Trigger:
  1. Create company "ABC Empresa"
  2. Create another company "ABC Empresa" (identical name)
  3. Navigate to both slug URLs: `/abc-empresa` and `/abc-empresa-2`
  4. Verify correct company appears (index logic in slugify.ts should handle this)
- Current mitigation: `getCompanySlug()` adds numeric suffix for duplicates (e.g., `empresa-name-2`)
- Residual risk: Collision detection based on name only - ID-based collisions could still occur in edge cases

**Catch-all Route Fragility:**
- Symptoms: Generic `/:slug` route (App.tsx:70) handles three cases:
  1. Company/case detail pages
  2. Category pages (if slug matches caseType)
  3. 404 (if neither match)
  - Order matters: CategoryPage check happens second, so company named "recuperacao-judicial" would shadow the caseType
- Files:
  - `src/App.tsx:70` - Route definition
  - `src/pages/DetalheCaso.tsx:59-60` - Renders CategoryPage if slug is caseType
- Trigger: Create company with name that normalizes to existing caseType (e.g., company name "Recuperação Judicial")
- Workaround: Explicit route checking order prevents collision, but is implicit and fragile

**Auth Not Role-Based:**
- Symptoms: All authenticated users can edit all sites and all site content; no permission enforcement
- Files:
  - `src/components/ProtectedRoute.tsx` - Only checks if session exists, no roles
  - `src/pages/admin/AdminLogin.tsx` - Accepts email/password, doesn't check roles
  - `src/pages/admin/SiteEditor.tsx` - No validation that user owns this site
  - `src/pages/admin/Dashboard.tsx` - Shows all sites, no filtering by owner
- Impact:
  - User A can edit User B's sites and all their data
  - No audit trail of who made what changes
  - Multi-tenant system has no data isolation
- Trigger:
  1. Login as user@example.com
  2. Go to `/admin/editor/<any-site-id>`
  3. Can edit any site in the database
- Fix approach:
  - Add `user_id` column to `sites` table
  - Add `user_roles` table with (user_id, site_id, role) relationship
  - Update `ProtectedRoute` to check `user_roles` against current site
  - Update `Dashboard` to filter sites by user ownership
  - Update all admin pages to verify user has edit permission for that site

---

## Security Considerations

**Hardcoded Test Domain in Production Code:**
- Risk: Development domain fallback in production code exposes internal testing patterns
- Files: `src/contexts/SiteContext.tsx:73`
  ```typescript
  if (isLocalhost && !domainParam) {
    domain = 'ivaldopraddo.com';
    console.warn(`[DEV MODE] Usando domínio de teste: ${domain}`);
  }
  ```
- Current mitigation: Only triggered on localhost/127.0.0.1/192.168.x.x
- Residual risk: If someone can access with modified hosts file or proxy, falls back to ivaldopraddo.com
- Recommendations:
  - Remove this fallback or make it configurable via environment variable
  - Only use fallback in development environment (detect via NODE_ENV)
  - Add validation that domain param matches expected pattern

**Supabase RPC Trust:**
- Risk: No validation that RPC response contains expected fields before using them
- Files: `src/contexts/SiteContext.tsx:79-106`
  ```typescript
  const { data: sites, error: rpcError } = await supabase.rpc("get_site_by_domain", {
    domain_name: domain,
  });

  if (rpcError) {
    // ... error handling
  } else if (sites && sites.length > 0) {
    const siteData = sites[0];
    const fetchedConfig = (siteData as any).config || {};  // <-- No validation
  }
  ```
- Risk: RPC could return malformed data, injecting invalid config into state
- Recommendations:
  - Validate response shape using Zod or similar schema validator
  - Ensure `config` field is object before using
  - Verify required fields exist before merging with template

**Admin Data in Query String:**
- Risk: Domain parameter in URL query string could be manipulated
- Files: `src/contexts/SiteContext.tsx:66-67`
  ```typescript
  const searchParams = new URLSearchParams(window.location.search);
  const domainParam = searchParams.get('domain');
  ```
- Current behavior: Allows overriding domain via `?domain=attacker.com`
- Risk: User could trick another user into loading different site's config
- Recommendations:
  - Use query param only for specific, limited use cases (never for critical domain selection)
  - Prefer hostname-based multi-tenancy instead
  - If domain param needed, validate against whitelist of allowed domains
  - Add warning when using non-standard domain

**No CSRF Protection:**
- Risk: Admin forms may be vulnerable to CSRF if using simple sessions
- Files: All admin editor components (SiteEditor.tsx, CaseDetailsEditor.tsx, etc.)
- Current mitigation: Supabase session tokens typically include CSRF tokens, but not explicitly validated
- Recommendations:
  - Ensure all state-changing operations (POST, PUT, DELETE) include CSRF token
  - Use SameSite cookie attributes
  - Verify Supabase auth includes CSRF protections

---

## Performance Bottlenecks

**No Pagination in Company/Case Lists:**
- Problem: CategoryPage and other listing pages load ALL companies matching filters into memory
- Files:
  - `src/pages/CategoryPage.tsx:44-46` - Loads all companies, filters in browser
  - `src/pages/RecuperacaoJudicial.tsx` - Same issue
  - `src/pages/Falencia.tsx` - Same issue
  - Similar pattern in all category pages
- Current approach:
  ```typescript
  const companiesOfType = (content.companies || []).filter(
    (c) => c && (c.caseType === caseType.id || c.caseType === caseType.slug)
  );
  ```
- Impact:
  - If company count reaches 1000+, UI becomes slow
  - No lazy loading or virtualization
  - All company data rendered as HTML (multiple tab sections)
  - Search/filter operations loop through all companies
- Improvement path:
  - Implement pagination on CategoryPage (limit 20-50 per page)
  - Use React virtualization library for large lists
  - Fetch paginated data from Supabase instead of all-at-once
  - Add infinite scroll or "Load More" button
  - Move filtering to server-side (Supabase query filters)

**Large Component Files:**
- Problem: Admin editor files are monolithic and perform many operations
- Files:
  - `src/pages/admin/SiteEditor.tsx` - 777 lines (general config, team, FAQ, cases, calendar, articles, leads)
  - `src/pages/admin/CaseDetailsEditor.tsx` - 612 lines (single case with many document types)
  - `src/pages/admin/components/ArticlesEditor.tsx` - 420 lines
  - `src/pages/admin/components/LeadsEditor.tsx` - 307 lines
- Impact:
  - Slow render times as components re-render on any state change
  - Difficult to add features without affecting whole component
  - Memory usage higher than necessary
- Improvement path:
  - Split admin components by feature (separate CasesEditor into own component)
  - Use React.memo() for child components that don't need frequent updates
  - Extract form handling into separate hooks
  - Implement virtualization for large lists in admin (LeadsEditor, etc.)

**Deep Merging Template on Every Load:**
- Problem: `deepMerge()` function called on every site config fetch to merge defaults with fetched config
- Files:
  - `src/contexts/SiteContext.tsx:91` - Called on RPC response
  - `src/pages/admin/SiteEditor.tsx:69` - Called when loading site for editing
  - Multiple other locations
- Current implementation:
  ```typescript
  const deepMerge = (target: any, source: any): any => {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target))
            Object.assign(output, { [key]: source[key] });
          else
            output[key] = deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  };
  ```
- Impact:
  - Recursive merge of large object trees is CPU-intensive
  - Called synchronously, blocks rendering
  - Duplicated in multiple files (SiteContext.tsx and SiteEditor.tsx)
- Improvement path:
  - Memoize merge result
  - Use library like `lodash.merge` or `immer` (smaller, optimized)
  - Cache template on client side
  - Avoid merging if fetched config already complete

**Color Conversion on Every Render:**
- Problem: Hex-to-HSL color conversion happens in useEffect but re-runs if config changes
- Files: `src/contexts/SiteContext.tsx:127-163`
- Current code:
  ```typescript
  const hexToHsl = (hex: string) => {
    // ... complex conversion logic
    // Called for primary and secondary colors
  };
  useEffect(() => {
    if (config.colors) {
      const hsl = hexToHsl(config.colors.primary);
      if (hsl) root.style.setProperty('--primary', hsl);
      // ... secondary color
    }
  }, [config]);
  ```
- Impact: Unnecessary recalculation if only non-color config changes
- Improvement path:
  - Separate color effect to only depend on `config.colors`
  - Move hexToHsl outside component for reusability
  - Cache color conversion result

---

## Fragile Areas

**Duplicate Category Pages:**
- Files:
  - `src/pages/RecuperacaoJudicial.tsx` (hardcoded id check: "recuperacao-judicial")
  - `src/pages/Falencia.tsx` (hardcoded id check: "falencia")
  - `src/pages/Litisconsorcio.tsx` (hardcoded id check: "litisconsorcio")
  - `src/pages/AdministracaoJudicial.tsx` (hardcoded id check: "administracao-judicial")
- Why fragile:
  - Each file contains ~100% duplicate code from CategoryPage.tsx
  - Any bug fix in CategoryPage must be replicated to 4 other files
  - Adding new filters requires changes in 5 places
  - If caseType slug changes, must update hardcoded id in page file
- Safe modification:
  - Delete these 4 files entirely
  - Update App.tsx routes to remove specific routes
  - Rely solely on `/:slug` catch-all that redirects to CategoryPage
  - Test coverage: Would need to verify each caseType loads correctly via slug route
  - Alternative: Keep pages but make them simple wrappers that render `<CategoryPage />`

**Domain Resolution Logic:**
- Files: `src/contexts/SiteContext.tsx:59-120`
- Why fragile:
  - Complex hostname detection (localhost, 127.0.0.1, 192.168.x.x patterns)
  - Fallback to hardcoded domain if localhost without query param
  - Deep merge of config without validation
  - Multiple state setters in try-catch
- Safe modification:
  - Extract hostname detection into separate function with unit tests (but no test framework exists)
  - Extract RPC call into separate hook
  - Validate RPC response shape before using
  - Add explicit error states for different failure modes

**Tab Navigation with Dynamic Scrolling:**
- Files: `src/pages/DetalheCaso.tsx:18-55`
- Why fragile:
  - Manual scroll state management with ref and addEventListener
  - Resize listener added/removed on every render
  - Arrow button visibility depends on scrollLeft calculations
  - Timing-based setTimeout for scroll detection
- Current implementation:
  ```typescript
  const checkScroll = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);
  ```
- Safe modification:
  - Use React component library for scrollable tabs (e.g., react-scroll-tabs)
  - If custom: Extract into separate hook and test independently

---

## Code Duplication

**RecuperacaoJudicial, Falencia, Litisconsorcio, AdministracaoJudicial:**
- Problem: Four page files (RecuperacaoJudicial.tsx, Falencia.tsx, Litisconsorcio.tsx, AdministracaoJudicial.tsx) duplicate 95%+ of CategoryPage.tsx logic
- Each file has:
  - Identical imports
  - Identical state management (isExplanationOpen, searchTerm, selectedComarca, selectedUF)
  - Identical filter logic (just hardcoded caseType id changes)
  - Identical UI structure (breadcrumb, title, filters, company list)
- Files:
  - `src/pages/CategoryPage.tsx` (230 lines) - Dynamic version
  - `src/pages/RecuperacaoJudicial.tsx` (>200 lines) - Hardcoded to id="recuperacao-judicial"
  - `src/pages/Falencia.tsx` (>200 lines) - Hardcoded to id="falencia"
  - `src/pages/Litisconsorcio.tsx` (>200 lines) - Hardcoded to id="litisconsorcio"
  - `src/pages/AdministracaoJudicial.tsx` (>200 lines) - Hardcoded to id="administracao-judicial"
- Impact:
  - Maintenance burden: 5x the code to maintain
  - Bug fixes replicated across 5 files
  - Adding new feature (e.g., export to PDF) requires 5 edits
  - Inconsistencies can creep in between versions
- Fix approach:
  - Delete the 4 specific category pages
  - Update App.tsx to route `/recuperacao-judicial`, `/falencia`, etc. to `/:slug` catch-all
  - CategoryPage already handles slug routing and redirects to itself if needed
  - Test that each old URL still works correctly

**Deep Merge Utilities:**
- Problem: `deepMerge()` function duplicated in two locations
- Files:
  - `src/contexts/SiteContext.tsx:27-44` (defined)
  - `src/pages/admin/SiteEditor.tsx:36-55` (duplicated)
- Impact: Bug fixes need to be applied in both places
- Fix approach: Extract to `src/lib/utils.ts` or `src/utils/merge.ts` and import in both

**Slug Generation and Usage:**
- Problem: Company slug computation scattered across components
- Files:
  - `src/utils/slugify.ts` - Defines `getCompanySlug()`
  - `src/pages/DetalheCaso.tsx:23` - Uses it
  - `src/pages/CategoryPage.tsx` - Imports it but doesn't show usage
  - Other category pages - May have inline slug logic
- Impact: Slug computation could become inconsistent if not always using `getCompanySlug()`
- Fix approach: Audit all company link generation to ensure using `getCompanySlug()`

---

## Scaling Limits

**Max Companies Before Slugify Performance Degrades:**
- Current capacity: ~100 companies (safe), ~500 companies (slow), ~1000+ companies (unusable)
- Limit: `getCompanySlug()` function loops through all companies to find collisions
  - O(n) lookup per company, O(n²) for entire list
  - Collision detection filters and sorts array
- Current code:
  ```typescript
  const companiesWithSameBaseSlug = allCompanies.filter(c => generateBaseSlug(c.name) === baseSlug);
  const sortedCompanies = [...companiesWithSameBaseSlug].sort((a, b) => a.id - b.id);
  ```
- Scaling path:
  - Build slug index at startup instead of computing per-request
  - Use Map for O(1) slug lookups
  - For URL routing, pre-compute all slugs server-side

**Max Sites Before Dashboard Query Becomes Slow:**
- Current capacity: ~100 sites, ~500+ sites would require pagination
- Limit: `Dashboard` fetches all sites and renders them as list items
- Current code: `supabase.from('sites').select('id, name, domain, created_at').order('created_at')`
- No pagination implemented
- Scaling path:
  - Add pagination to Dashboard (show 20 per page)
  - Add search/filter for site names
  - Implement infinite scroll or "Load More"

**Max Admin Users Before Site Ownership Issues:**
- Current capacity: Unlimited but dangerous
- Problem: No role-based access, all users can edit all sites
- Scaling path:
  - Add site ownership (user_id to sites table)
  - Implement user roles (owner, editor, viewer)
  - Filter sites in Dashboard by user_id
  - Enforce permission checks in admin pages

---

## Test Coverage Gaps

**No Tests for Domain Resolution:**
- What's not tested: `SiteContext.fetchConfig()` function
  - Hostname to domain conversion
  - Supabase RPC call and response handling
  - Config merging with defaults
  - Color CSS variable injection
  - SEO metadata updates
- Files: `src/contexts/SiteContext.tsx`
- Risk: Refactoring this critical path could break multi-tenant domain resolution silently
- Priority: HIGH - this is core to app functionality

**No Tests for Slug Collision Resolution:**
- What's not tested: `getCompanySlug()` function
  - Duplicate name handling
  - Numeric suffix generation
  - Deterministic ordering by ID
  - Non-ASCII character normalization
- Files: `src/utils/slugify.ts`
- Risk: Company lookups could fail for edge cases (duplicate names, unicode, etc.)
- Priority: HIGH - used in critical routing path

**No Tests for Admin Authentication:**
- What's not tested: `ProtectedRoute.tsx`
  - Session detection
  - Redirect to /admin on no session
  - Permission enforcement (currently non-existent)
  - Role-based access (currently non-existent)
- Files: `src/components/ProtectedRoute.tsx`
- Risk: Unauthenticated users might access admin pages
- Priority: HIGH - security issue

**No Tests for Admin Form Submissions:**
- What's not tested: Any admin editor
  - `SiteEditor.tsx` - 777 lines, no tests
  - `CaseDetailsEditor.tsx` - 612 lines, no tests
  - All modal dialogs and form components
- Risk: Data corruption or loss if form handling breaks
- Priority: MEDIUM-HIGH

**No Tests for Responsive Design:**
- What's not tested: Layout at different breakpoints
  - Mobile (sm): <640px
  - Tablet (md): 640-1024px
  - Desktop (lg): 1024+px
- Files: All page and component files use Tailwind breakpoints
- Risk: Layout could break on different screen sizes
- Priority: MEDIUM - visual regression risk

**No Tests for Vercel Domain Integration:**
- What's not tested: `src/lib/domainService.ts`
  - Domain addition to Vercel
  - Domain removal from Vercel
  - DNS status checking
  - Error handling for API failures
- Risk: Domain management workflows could fail
- Priority: MEDIUM - affects site creation workflow

---

## Missing Critical Features

**Role-Based Access Control (RBAC):**
- Problem: All authenticated users have full admin access to all sites
- Current state: Only basic session check in `ProtectedRoute`
- Blocks:
  - Multi-tenant admin delegation (owner cannot limit editor permissions)
  - Audit logging (who changed what)
  - Data isolation between users
  - Team collaboration workflows

**Pagination for Large Datasets:**
- Problem: No pagination for companies in CategoryPage or sites in Dashboard
- Blocks:
  - Scaling beyond ~200 companies
  - Dashboard performance with 50+ sites
  - Mobile experience with long lists

**Error Recovery & Retry Logic:**
- Problem: Failed operations (Supabase queries, Vercel API calls) not automatically retried
- Current state: Simple try-catch with toast notification
- Blocks:
  - Resilience to temporary network failures
  - Improved user experience on slow connections

**Site Versioning / Change History:**
- Problem: No audit log of config changes
- Blocks:
  - Ability to recover from accidental deletions
  - Understanding when/why content changed
  - Compliance with data governance requirements

**Backup & Restore:**
- Problem: No backup mechanism for site configurations
- Blocks:
  - Disaster recovery
  - Safe testing of admin changes

---

*Concerns audit: 2026-03-18*
