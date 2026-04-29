# Architecture

**Analysis Date:** 2026-03-18

## Pattern Overview

**Overall:** Multi-tenant React SPA with centralized configuration management and dynamic site generation from Supabase.

**Key Characteristics:**
- Single-page application (SPA) built with React + React Router
- Multi-tenant architecture: one Vercel deployment serves multiple custom domains
- Configuration-driven UI rendering (sites stored in Supabase `sites` table)
- Context-based state management for site configuration
- Admin panel with protected routes using Supabase Auth
- Dynamic domain/site detection via hostname matching

## Layers

**Presentation Layer:**
- Purpose: Render dynamic UI components based on site configuration
- Location: `src/pages/`, `src/components/`
- Contains: Page components, UI components (shadcn/ui), feature components (Header, Footer, etc.)
- Depends on: SiteContext, UI library (Radix UI via shadcn), routing
- Used by: BrowserRouter in `src/App.tsx`

**State Management Layer:**
- Purpose: Manage shared site configuration and provide it to all components
- Location: `src/contexts/SiteContext.tsx`
- Contains: Context provider, site configuration state, deep merge utilities, SEO metadata injection
- Depends on: Supabase client
- Used by: All pages and components via `useSite()` hook

**Service Layer:**
- Purpose: Handle business logic and external service integration
- Location: `src/lib/`
- Contains: Supabase client initialization, domain management, fetch utilities with multitenancy filtering
- Depends on: Supabase SDK, external services (Vercel API via Edge Functions)
- Used by: Context, pages, admin components

**Routing Layer:**
- Purpose: Map URLs to components and handle navigation
- Location: `src/App.tsx`
- Contains: Route definitions for public pages and protected admin routes
- Depends on: React Router, components, ProtectedRoute wrapper
- Used by: Application entry point

**Admin Management Layer:**
- Purpose: Allow authenticated users to create, edit, and manage sites
- Location: `src/pages/admin/`, `src/pages/admin/components/`
- Contains: Dashboard, SiteEditor, admin components for editing configuration
- Depends on: Supabase Auth, domain service, configuration management
- Used by: Admin routes in App.tsx

## Data Flow

**Site Loading Flow:**

1. Application starts (`main.tsx` → `App.tsx`)
2. SiteProvider wraps entire app, calls `fetchConfig()` on mount
3. `fetchConfig()` queries Supabase RPC `get_site_by_domain` with current hostname
4. Supabase returns site configuration object or null
5. Configuration is deep-merged with skeleton template to fill missing properties
6. Config state is set, triggering CSS variable injection (colors) and SEO metadata updates
7. All components access config via `useSite()` hook

**Admin Edit Flow:**

1. Admin logs in via `/admin` → `AdminLogin` component
2. Supabase Auth session validated by `ProtectedRoute` wrapper
3. Admin navigates to Dashboard → lists all sites from `sites` table
4. Admin clicks edit → navigates to `/admin/editor/:id` → `SiteEditor` component
5. `SiteEditor` fetches site configuration from Supabase
6. User modifies configuration through specialized editors (CasesEditor, TeamEditor, etc.)
7. Changes accumulated in local state with `updateConfig(path, value)` method
8. User clicks save → full configuration object sent to Supabase via `sites.update()`
9. Success toast shows, dashboard can be refreshed to see changes

**Domain/Site Detection:**

1. User accesses URL with custom domain (e.g., `empresa.com.br`)
2. Browser requests sent to Vercel (which hosts the SPA)
3. `SiteContext.fetchConfig()` reads `window.location.hostname`
4. Query sent to Supabase: `get_site_by_domain(domain_name)` RPC
5. RPC queries `sites` table WHERE `domain = hostname`
6. Returns matching site's configuration or null
7. On localhost development, hardcoded fallback domain used: `ivaldopraddo.com`

**State Management:**

- Centralized in SiteContext: `config`, `loading`, `error`, `siteId`
- Mutations: Only in admin routes via direct Supabase updates or configuration editors
- Public pages are read-only (immutable access to config)
- Configuration changes persist immediately to Supabase

## Key Abstractions

**TemplateIvaldo (Configuration Schema):**
- Purpose: Defines all editable site properties (branding, content, SEO, etc.)
- Examples: `src/config/template-ivaldo.ts`, `fullIvaldoTemplate`, `skeletonTemplate`
- Pattern: TypeScript interface with nested objects; templates serve as defaults and type definitions
- Includes: SEO metadata, colors, company info, content sections (FAQ, team, cases), statistics

**SiteContext (Global Configuration Provider):**
- Purpose: Distribute site configuration throughout app without prop drilling
- Examples: Used in `Header.tsx`, `DetalheCaso.tsx`, all feature components
- Pattern: React Context + useContext hook; `useSite()` provides typed access
- Handles: Deep merging of configurations, CSS variable injection, SEO metadata updates

**ProtectedRoute (Authentication Guard):**
- Purpose: Restrict access to admin routes based on Supabase Auth session
- Examples: `src/components/ProtectedRoute.tsx`
- Pattern: Wrapper component that checks session, redirects unauthenticated users to `/admin`
- Used for: `/admin/dashboard`, `/admin/editor/:id`, `/admin/editor/:id/cases/:caseId`

**Domain Service (External Integration):**
- Purpose: Manage domain lifecycle (add/remove/check status) in Vercel via Supabase Edge Functions
- Examples: `src/lib/domainService.ts` exports `addDomainToVercel()`, `removeDomainFromVercel()`, `checkDomainStatus()`
- Pattern: Service functions wrapping Supabase `functions.invoke()` calls to Edge Function `manage-domain`
- Integrates: Dashboard site creation flow, DNS instruction formatting

**Editor Components (Admin CRUD):**
- Purpose: Provide UI for editing specific configuration sections
- Examples: `CasesEditor.tsx`, `TeamEditor.tsx`, `ArticlesEditor.tsx`, `FaqEditor.tsx`
- Pattern: Controlled components receiving config and updateConfig callback; form inputs update parent state
- Responsibility: Validate input, manage sub-editor dialogs, handle add/edit/delete operations

## Entry Points

**Public Website (`/`):**
- Location: `src/App.tsx` routes + `src/pages/Index.tsx`
- Triggers: User visits root domain
- Responsibilities: Render homepage with header, sections (about, statistics, cases, team, calendar), footer

**Admin Dashboard (`/admin/dashboard`):**
- Location: `src/pages/admin/Dashboard.tsx`
- Triggers: Authenticated admin user navigates to dashboard
- Responsibilities: List all sites, create new sites (with domain registration), delete sites, manage domain verification, view DNS instructions

**Site Editor (`/admin/editor/:id`):**
- Location: `src/pages/admin/SiteEditor.tsx`
- Triggers: Admin clicks "Edit" on a site from dashboard
- Responsibilities: Load site configuration, provide tabbed interface for editing different sections (general, team, cases, articles, calendar, FAQ, leads)

**Case Details Editor (`/admin/editor/:id/cases/:caseId`):**
- Location: `src/pages/admin/CaseDetailsEditor.tsx`
- Triggers: Admin clicks edit button on a case in CasesEditor
- Responsibilities: Edit individual case/company details, upload documents, manage rich text content

**Dynamic Case/Category Pages (`/:slug`):**
- Location: `src/pages/DetalheCaso.tsx`, `src/pages/CategoryPage.tsx`
- Triggers: User clicks on case or category link
- Responsibilities: Display case details (company information, processes, documents) or category page with filtered companies

## Error Handling

**Strategy:** Graceful degradation with fallback content and user feedback via toast notifications.

**Patterns:**
- Context initialization errors: SiteProvider displays error message or skeleton template, allows admin routes to continue
- Failed domain lookup: SiteContext sets error state, shows "Site não encontrado (404)" to public users
- Supabase RPC failures: Logged to console, error state in context, fallback to full template
- Admin operations: Sonner toast notifications for success/error feedback, user-facing error messages
- Authentication failures: ProtectedRoute redirects to login, loading spinner during session check
- Network errors: Catch blocks prevent app crash, errors logged, sensible defaults used

## Cross-Cutting Concerns

**Logging:**
- Development: Console.log/console.error throughout codebase for debugging (domain lookups, RPC calls, template merging)
- Admin operations: Toast notifications via Sonner library
- Error tracking: Console errors for Supabase failures, domain service issues

**Validation:**
- Domain format validation in `domainService.ts` using regex pattern
- Form validation in admin editor components (CasesEditor, TeamEditor, etc.)
- Supabase RLS policies enforce multitenancy: `fetchSiteContent()` utility requires site_id filter
- Type safety: Full TypeScript coverage with TemplateIvaldo interface

**Authentication:**
- Supabase Auth manages admin user sessions
- Session checked in ProtectedRoute component
- Auth state subscribed to in ProtectedRoute to handle token refresh
- Login redirect on auth failure
- No JWT decoding in frontend (relies on Supabase session management)

**Multitenancy:**
- Domain-to-site mapping: Supabase RPC `get_site_by_domain()` looks up by hostname
- Data isolation: RLS policies on `sites`, `leads`, and other tables ensure users see only their data
- Site ID propagation: Stored in SiteContext, passed to editors for context-aware updates
- Configuration per-site: Each site has independent config object stored in `sites.config` JSONB column

---

*Architecture analysis: 2026-03-18*
