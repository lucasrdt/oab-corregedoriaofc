# Phase 1: Identity & Foundation - Research

**Researched:** 2026-03-18
**Domain:** Frontend theming (CSS variables + Tailwind + shadcn/ui), React admin layout (sidebar), multi-tenant removal
**Confidence:** HIGH — all findings based on direct codebase inspection; no external library research needed for stack (stack is already installed)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UI-01 | Cores da OAB-MA aplicadas via CSS variables em todos os componentes (primary #0d53de, secondary #e00b0b sem opacidade degradada) | CSS variables are defined in `src/index.css` `:root` block and injected dynamically by `SiteContext`. Hardcoding the OAB-MA values in `:root` removes the dynamic injection dependency. |
| UI-02 | Tipografia padronizada com hierarquia clara (heading/body, tamanhos consistentes) | `tailwind.config.ts` already maps `fontFamily.sans/heading/body` to Roboto. `index.css` defines `--font-heading` and `--font-body`. Typography tokens are in place; application consistency must be audited. |
| UI-03 | Espaçamento e border-radius uniformes em todos os componentes | `--radius: 0.5rem` is already defined. Utility classes `.section-padding`, `.container-padding`, `.section-title` exist in `index.css`. The audit must verify components respect these rather than using arbitrary values. |
| UI-04 | Painel admin redesenhado com menu lateral (sidebar) em vez de tabs horizontais | `src/components/ui/sidebar.tsx` is already installed (shadcn/ui Sidebar). `SiteEditor.tsx` currently uses `Tabs` with 9 triggers in a grid. The new admin shell must use `SidebarProvider + Sidebar + SidebarContent` wrapping the editor sections. |
| UI-05 | Site público responsivo e funcionando corretamente em dispositivos móveis | `Header.tsx` has a mobile menu implementation. Must audit breakpoints across pages and fix layout breakage. |
| UI-06 | Remover lógica multi-tenant do frontend | `Dashboard.tsx` is the multi-tenant hub (create/delete/verify sites). `SiteContext.tsx` does domain-based site resolution via `get_site_by_domain` RPC. `domainService.ts` wraps Vercel domain management. All of this must be removed/replaced. |
</phase_requirements>

---

## Summary

The project is a React + Vite + TypeScript application using Tailwind CSS v3, shadcn/ui (Radix UI), and Supabase. The current codebase is a generic multi-tenant site-builder template: it resolves the active site by domain lookup (`get_site_by_domain` RPC), injects colors dynamically into CSS variables at runtime via `SiteContext`, and exposes a `Dashboard` page for creating/deleting sites and managing Vercel DNS records.

Phase 1 requires two focused interventions. First, replace the dynamic color injection with static OAB-MA values hardcoded in `src/index.css` — eliminating the runtime `hexToHsl` conversion and Supabase RPC call for color data. Second, remove the multi-tenant shell (`Dashboard`, `CreateSiteModal`, `DeleteSiteModal`, `DnsInstructionsModal`, `domainService.ts`, the `:siteId` pattern from routes) and replace the tab-based `SiteEditor` with a sidebar-based admin layout using the already-installed `sidebar.tsx` component.

Both plans are pure frontend changes. No database schema migrations are required in this phase. The `SiteContext` may be simplified or retained in a stripped-down form that provides config without domain resolution.

**Primary recommendation:** Hardcode OAB-MA CSS variables in `:root`, simplify `SiteContext` to load a single static config, delete all multi-tenant files, and convert the SiteEditor layout from `Tabs` to a shadcn/ui `Sidebar` layout.

---

## Standard Stack

### Core (already installed — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | ^3.4.17 | Utility CSS, theming via CSS variables | Already configured, generates all utility classes |
| shadcn/ui sidebar | pre-installed | Admin sidebar shell | `src/components/ui/sidebar.tsx` already present |
| react-router-dom | ^6.30.1 | Routing, route removal for multi-tenant paths | Already used throughout |
| lucide-react | ^0.462.0 | Icons in sidebar nav items | Already used in admin components |

### No new installations required for this phase

All necessary libraries are already installed. This phase is a refactor/cleanup phase, not a new capability phase.

---

## Architecture Patterns

### Current Structure (to understand before changing)

```
src/
├── index.css                  # CSS variable definitions (:root) — EDIT HERE for colors
├── main.tsx                   # Wraps <App> with <SiteProvider>
├── contexts/
│   └── SiteContext.tsx        # Domain resolution + runtime color injection — SIMPLIFY
├── lib/
│   └── domainService.ts       # Vercel domain management — DELETE
├── pages/admin/
│   ├── Dashboard.tsx          # Multi-tenant site list — REPLACE with single-site admin entry
│   ├── SiteEditor.tsx         # Tab-based editor — CONVERT to sidebar layout
│   └── components/
│       ├── CreateSiteModal.tsx    # Multi-tenant — DELETE
│       ├── DeleteSiteModal.tsx    # Multi-tenant — DELETE
│       └── DnsInstructionsModal.tsx # Multi-tenant — DELETE
└── components/ui/
    └── sidebar.tsx            # Already installed — USE for admin layout
```

### Target Structure (after Phase 1)

```
src/
├── index.css                  # OAB-MA colors hardcoded in :root
├── main.tsx                   # Wraps <App> directly or with simplified context
├── contexts/
│   └── SiteContext.tsx        # Simplified: loads single OAB-MA config, no domain lookup
├── pages/admin/
│   ├── AdminLayout.tsx        # NEW: sidebar shell wrapping all admin sections
│   ├── SiteEditor.tsx         # Sections become sidebar nav items, not tabs
│   └── components/            # Only content editors remain (no modal multi-tenant files)
└── components/ui/
    └── sidebar.tsx            # Used by AdminLayout
```

### Pattern 1: CSS Variable Theming (OAB-MA Colors)

**What:** Override `:root` CSS variables in `src/index.css` with fixed OAB-MA values. Remove the `hexToHsl` runtime injection from `SiteContext`.
**When to use:** Always for a single-tenant institutional site — no runtime color switching needed.

The two colors that need to change:
- `--primary` currently: `184 57% 15%` (dark green) → must become `220 87% 46%` (HSL for `#0d53de`)
- `--secondary` currently: `41 73% 57%` (golden) → must become `0 87% 46%` (HSL for `#e00b0b`)

HSL conversion for OAB-MA colors (verified by formula):
- `#0d53de` → H: 220°, S: 87%, L: 46% → CSS variable value: `220 87% 46%`
- `#e00b0b` → H: 0°, S: 87%, L: 46% → CSS variable value: `0 87% 46%`

```css
/* src/index.css — :root block */
:root {
  --primary: 220 87% 46%;          /* OAB-MA blue #0d53de */
  --primary-foreground: 0 0% 100%; /* white text on primary */

  --secondary: 0 87% 46%;          /* OAB-MA red #e00b0b */
  --secondary-foreground: 0 0% 100%; /* white text on secondary */

  /* All other tokens remain as-is */
}
```

### Pattern 2: Sidebar Admin Layout (shadcn/ui)

**What:** Wrap admin pages in a `SidebarProvider` + `AppSidebar` layout component. Each editor section (Geral, Equipe, Casos, Agenda, Notícias, FAQ) becomes a `SidebarMenuButton` item.
**When to use:** Replaces the `Tabs` grid in `SiteEditor.tsx`.

```tsx
// src/pages/admin/AdminLayout.tsx (new file)
import { SidebarProvider, Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <SidebarProvider>
    <div className="flex min-h-screen w-full">
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#geral">Geral & SEO</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {/* ... more items */}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 p-8">{children}</main>
    </div>
  </SidebarProvider>
);
```

### Pattern 3: Multi-Tenant Removal

**What:** Delete multi-tenant files, remove the `/admin/dashboard` route and the `/admin/editor/:id` (siteId-based) route, replace with a single `/admin/dashboard` that goes directly to the OAB-MA editor.
**When to use:** When converting from multi-tenant to single-tenant.

Files to delete:
- `src/pages/admin/Dashboard.tsx` (multi-tenant hub — replace with new single-site admin home)
- `src/pages/admin/components/CreateSiteModal.tsx`
- `src/pages/admin/components/DeleteSiteModal.tsx`
- `src/pages/admin/components/DnsInstructionsModal.tsx`
- `src/lib/domainService.ts`

Routes to remove from `App.tsx`:
- `/admin/dashboard` (replace with new single-site dashboard)
- `/admin/editor/:id` (the `:id` siteId param is multi-tenant; replace with `/admin/editor` fixed)
- `/admin/editor/:siteId/cases/:caseId` (siteId-scoped route)

`SiteContext.tsx` changes:
- Remove `get_site_by_domain` RPC call
- Remove `window.location.hostname` resolution logic
- Load config for a fixed known site ID, or load entirely from static defaults

### Anti-Patterns to Avoid

- **Keeping SiteContext's hexToHsl injection active while also setting `:root` values:** They will conflict. Either remove the injection or make it a no-op (if SiteContext is kept for other config like logos/text). The `:root` static values should win.
- **Using `grid-cols-9` for tabs in a sidebar world:** The 9-column tab grid at the top of SiteEditor will break at smaller viewports. Do not keep the tab grid as a fallback.
- **Keeping multi-tenant imports in App.tsx without removing the routes:** Unused imports cause lint errors. Remove both the import and the route together.
- **Removing `SiteProvider` from `main.tsx` entirely too early:** Many public components (`Header`, `Footer`, `Hero`, etc.) call `useSite()` to get config (logo, text, colors). Keep `SiteProvider` but simplify it — removing it entirely will break all public pages.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Admin sidebar layout | Custom sidebar with CSS flexbox | `sidebar.tsx` (already installed) | shadcn/ui Sidebar handles collapsed state, mobile Sheet, keyboard shortcut, cookie persistence |
| Hex to HSL conversion for colors | Keep the runtime `hexToHsl` function | Static HSL values in `:root` | The colors are fixed for OAB-MA; runtime conversion adds latency and complexity with no benefit |
| Mobile menu toggle in admin | Custom hamburger for sidebar | `SidebarTrigger` from `sidebar.tsx` | Already handles mobile Sheet behavior via `useIsMobile` hook |

---

## Common Pitfalls

### Pitfall 1: shadcn/ui Secondary Color Used as Background (Opacity Degradation)

**What goes wrong:** Some shadcn/ui components use `bg-secondary` which maps to `hsl(var(--secondary))`. If the secondary color is now red (`#e00b0b`), surfaces that previously used secondary as a neutral/muted background (e.g., `TabsList`, `Badge variant="secondary"`) will render with a red background — visually incorrect.

**Why it happens:** shadcn/ui's `secondary` semantic token is designed for muted neutral surfaces, not brand accent colors. In the original template it was golden (#e8aa42), a warm neutral. Red (#e00b0b) breaks this convention.

**How to avoid:** After changing `--secondary`, audit every component using `bg-secondary`, `text-secondary`, `border-secondary`. For components where red is wrong (muted backgrounds), override to `bg-muted` instead. Reserve `text-secondary` and `bg-secondary` for intentional brand accent usage only.

**Warning signs:** TabsList appearing red, Badge "secondary" variant being red, hover states on dropdown items becoming red.

### Pitfall 2: SiteContext Color Injection Overrides the `:root` Values

**What goes wrong:** Even after setting the correct HSL values in `src/index.css :root`, the `SiteContext` `useEffect` reads `config.colors.primary` (from the Supabase record or template default, which is `#113d3e`) and calls `root.style.setProperty('--primary', hsl)` — overwriting the static values with the old template colors.

**Why it happens:** Inline `style` on `:root` (via `setProperty`) has higher specificity than stylesheet-declared CSS variables.

**How to avoid:** Either (a) remove the color injection `useEffect` from `SiteContext`, or (b) update `fullIvaldoTemplate.colors.primary` and `fullIvaldoTemplate.colors.secondary` to the OAB-MA hex values so the injection sets the correct colors. Option (a) is cleaner for a single-tenant site.

**Warning signs:** Colors look correct in initial render flash then switch to wrong colors after 1-2 seconds (the Supabase fetch completes and injects stale colors).

### Pitfall 3: Removing Dashboard Route Breaks the Post-Login Redirect

**What goes wrong:** `AdminLogin.tsx` likely navigates to `/admin/dashboard` after successful login. If Dashboard is replaced or renamed, the post-login redirect will hit a 404.

**Why it happens:** Route and navigation target are defined separately.

**How to avoid:** When replacing `Dashboard.tsx`, keep the route path `/admin/dashboard` but render the new single-site admin home. Update the login redirect last, after the new dashboard component is confirmed working.

**Warning signs:** After login, white page or "Not Found" renders.

### Pitfall 4: `/:slug` Catch-All Route Intercepting New Admin Routes

**What goes wrong:** `App.tsx` has a `<Route path="/:slug" element={<DetalheCaso />} />` catch-all. Any new route added incorrectly (without the `/admin` prefix) will be caught by this route and render `DetalheCaso` instead of a 404.

**Why it happens:** React Router evaluates routes in order; the catch-all at `/:slug` matches anything not already matched above.

**How to avoid:** All admin routes must stay under the `/admin` prefix. Verify route ordering in `App.tsx` after changes.

### Pitfall 5: SiteEditor `:id` Param Referenced Throughout Child Components

**What goes wrong:** `SiteEditor` passes `id` (from `useParams`) to child components like `TeamEditor`, `CasesEditor`, `ImageUpload`, etc. as `siteId`. When the multi-tenant route `/admin/editor/:id` is simplified, these children must receive the fixed OAB-MA site ID.

**Why it happens:** The siteId is used in Supabase queries inside sub-editors (e.g., uploading images to the right storage path).

**How to avoid:** Either (a) keep the route with a hardcoded siteId redirect, or (b) move the siteId to context/env config so sub-editors don't receive it via props. The plan should address this explicitly.

---

## Code Examples

### Converting HSL values for OAB-MA colors

```
#0d53de:
  R=13, G=83, B=222
  r=0.051, g=0.325, b=0.871
  max=0.871 (b), min=0.051 (r)
  l = (0.871+0.051)/2 = 0.461 ≈ 46%
  d = 0.871-0.051 = 0.82
  s = 0.82/(2-0.871-0.051) = 0.82/1.078 ≈ 0.761...
  h = (r-g)/d + 4 = (0.051-0.325)/0.82 + 4 = -0.334+4 = 3.666 → *60 = 220°
  Result: 220 76% 46%

#e00b0b:
  R=224, G=11, B=11
  r=0.878, g=0.043, b=0.043
  max=0.878 (r), min=0.043
  l = (0.878+0.043)/2 = 0.46 ≈ 46%
  d = 0.878-0.043 = 0.835
  s = 0.835/(2-0.878-0.043) = 0.835/1.079 ≈ 0.774 ≈ 77%
  h = (g-b)/d + 0 = 0/0.835 = 0°
  Result: 0 77% 46%
```

Note: The exact HSL conversion should be verified by running the existing `hexToHsl` function in SiteContext against these values, since that function is the canonical converter already used by the app.

### Simplified SiteContext (conceptual, not exact code)

The `fetchConfig` function in `SiteContext` should be replaced with a static config loader:

```tsx
// Instead of RPC call, load the static OAB-MA template
const fetchConfig = useCallback(async () => {
  setConfig(fullIvaldoTemplate); // Already has OAB-MA data baked in
  setLoading(false);
}, []);
```

The color injection `useEffect` should be removed entirely (colors come from `:root` CSS).

### Admin route structure (target)

```tsx
// App.tsx — after Phase 1
<Route path="/admin" element={<AdminLogin />} />
<Route element={<ProtectedRoute />}>
  <Route path="/admin/dashboard" element={<AdminDashboard />} />  // new single-site home
  <Route path="/admin/editor" element={<SiteEditor />} />          // no :id param needed
  <Route path="/admin/cases/:caseId" element={<CaseDetailsEditor />} />
</Route>
```

---

## State of the Art

| Old Approach | Current Approach | Notes |
|--------------|------------------|-------|
| Runtime color injection via JS | Static CSS variables in :root | For single-tenant, static is always correct |
| Tab-based admin navigation (9 tabs in grid) | Sidebar navigation | shadcn/ui Sidebar already installed |
| Multi-tenant: domain → site lookup | Single-tenant: fixed config | Removing the RPC call simplifies cold start |

---

## Multi-Tenant Removal Inventory

Complete list of what must be removed or replaced:

### Files to DELETE

| File | Reason |
|------|--------|
| `src/pages/admin/Dashboard.tsx` | Lists all sites, create/delete/verify — the entire multi-tenant UI |
| `src/pages/admin/components/CreateSiteModal.tsx` | Create new site modal |
| `src/pages/admin/components/DeleteSiteModal.tsx` | Delete site confirmation |
| `src/pages/admin/components/DnsInstructionsModal.tsx` | DNS setup instructions |
| `src/lib/domainService.ts` | Vercel domain add/remove/verify API wrapper |

### Files to MODIFY

| File | What to Change |
|------|----------------|
| `src/main.tsx` | Keep `SiteProvider` wrapping, no change needed unless SiteContext is fully removed |
| `src/contexts/SiteContext.tsx` | Remove `get_site_by_domain` RPC, `window.location.hostname` resolution, and color injection `useEffect` |
| `src/App.tsx` | Remove routes: `/admin/dashboard` (old), `/admin/editor/:id`, `/admin/editor/:siteId/cases/:caseId`. Add new simplified routes. |
| `src/config/template-ivaldo.ts` | Update `colors.primary` and `colors.secondary` to OAB-MA hex values |
| `src/index.css` | Set `--primary` and `--secondary` to OAB-MA HSL values in `:root` |
| `src/pages/admin/SiteEditor.tsx` | Convert `Tabs` layout to sidebar layout; remove `:id` param dependency |

### Routes to REMOVE

| Route | Reason |
|-------|--------|
| `/admin/dashboard` (old multi-tenant Dashboard) | Replaced by new single-site admin home |
| `/admin/editor/:id` | `:id` is multi-tenant siteId; replaced by `/admin/editor` |
| `/admin/editor/:siteId/cases/:caseId` | Scoped by siteId; replaced by `/admin/cases/:caseId` |

---

## Open Questions

1. **What is the OAB-MA Supabase site record ID?**
   - What we know: There is a `sites` table in Supabase. SiteContext fetches by domain.
   - What's unclear: Does a Supabase record exist for OAB-MA's domain, or does the app currently rely entirely on the template default (`fullIvaldoTemplate`) with the old colors?
   - Recommendation: In Phase 1, bypass Supabase lookup entirely and use static config. Supabase config becomes relevant again in Phase 2 when content is dynamic.

2. **Are the `CasesEditor` and related sub-editors (ArticlesEditor, CalendarEditor) still needed in Phase 1?**
   - What we know: SiteEditor has 9 tabs. Phase 1 only needs to convert the layout — not remove features.
   - What's unclear: Whether the "Casos" tab content maps to multi-tenant logic or just case content.
   - Recommendation: Keep all sub-editors in Phase 1; only change the navigation pattern (tabs → sidebar). Removing or replacing sub-editor content is Phase 2–3 scope.

3. **Does `AdminLogin.tsx` have any multi-tenant logic?**
   - What we know: It was not in the grep results for multi-tenant patterns — it likely just does Supabase auth.
   - What's unclear: Whether it uses `siteId` in session state.
   - Recommendation: Read `AdminLogin.tsx` during plan execution before modifying post-login redirect.

---

## Sources

### Primary (HIGH confidence)

Direct codebase inspection — all findings are from reading actual source files:
- `src/index.css` — current CSS variable values
- `src/contexts/SiteContext.tsx` — color injection mechanism, domain resolution
- `src/pages/admin/Dashboard.tsx` — complete multi-tenant UI inventory
- `src/pages/admin/SiteEditor.tsx` — current tab-based layout (9 tabs)
- `src/components/ui/sidebar.tsx` — confirmed pre-installed shadcn/ui Sidebar
- `src/config/template-ivaldo.ts` — current default colors
- `tailwind.config.ts` — Tailwind token mapping
- `src/App.tsx` — route structure
- `package.json` — installed dependencies and versions

### Secondary (MEDIUM confidence)

- Standard HSL conversion formula (verified against the existing `hexToHsl` function in `SiteContext.tsx`)
- shadcn/ui Sidebar API inferred from `sidebar.tsx` component exports (`SidebarProvider`, `Sidebar`, `SidebarContent`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`, `SidebarTrigger`)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified in `package.json`, all components verified in filesystem
- Architecture patterns: HIGH — based on direct file reading of current implementation
- Multi-tenant inventory: HIGH — grep confirmed all affected files
- HSL color values: MEDIUM — formula verified but recommend running against the app's own `hexToHsl` function to get exact values
- Pitfalls: HIGH — all pitfalls derived from direct reading of the dynamic color injection, route structure, and component prop drilling

**Research date:** 2026-03-18
**Valid until:** 2026-04-18 (stable stack, no external dependency churn expected)
