# External Integrations

**Analysis Date:** 2026-03-18

## APIs & External Services

**Vercel Domain Management:**
- Service: Vercel API (via Edge Functions)
- What it's used for: Add, remove, and verify custom domains for multi-tenant sites
- SDK/Client: Supabase Edge Functions (invokes `manage-domain` function)
- Auth: API key managed server-side in Edge Function
- Location: `src/lib/domainService.ts` - Functions `addDomainToVercel()`, `removeDomainFromVercel()`, `checkDomainStatus()`

## Data Storage

**Databases:**
- Supabase PostgreSQL
  - Connection: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars
  - Client: `@supabase/supabase-js` SDK
  - Tables accessed:
    - `sites` - Multi-tenant site configurations
    - `leads` - Contact form submissions (with Row Level Security by `site_id`)
    - Additional tables for site content (via generic `fetchSiteContent()` function in `supabaseFetch.ts`)
  - Multitenancy: RLS (Row Level Security) policies enforce `site_id` filtering
  - RPC Functions: `get_site_by_domain()` - Resolves domain to site configuration

**File Storage:**
- Supabase Storage (inferred from image upload components in `src/components/ui/image-upload.tsx`)
- Used for: Logo uploads, hero images, document uploads

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Supabase Auth
  - Implementation: Email/password authentication
  - Admin login endpoint: `src/pages/admin/AdminLogin.tsx`
  - Method: `supabase.auth.signInWithPassword()`
  - Session management: Built into Supabase client
  - Protected routes: `src/components/ProtectedRoute.tsx` guards admin pages

## Monitoring & Observability

**Error Tracking:**
- None detected (console.error used for local logging)

**Logs:**
- Console logging only - `console.error()` and `console.warn()` for debugging
- No external logging service integrated

## CI/CD & Deployment

**Hosting:**
- Vercel - Primary deployment platform
- Multi-domain support via custom domain routing

**CI Pipeline:**
- Not detected - No GitHub Actions, GitLab CI, or other CI service visible

**Domain/Subdomain Routing:**
- Dynamic domain resolution via `get_site_by_domain()` RPC
- Site configuration loads based on hostname or `?domain=` query parameter
- Dev mode: Falls back to `ivaldopraddo.com` for localhost testing

## Environment Configuration

**Required env vars:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous public key

**Optional env vars:**
- None identified beyond required Supabase credentials

**Secrets location:**
- `.env` file at project root (not committed to version control)
- Public key credentials only (no sensitive API keys in client-side code)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Supabase Edge Functions trigger: `manage-domain` function called via `supabase.functions.invoke()`
  - Endpoint: Supabase Edge Function (serverless compute)
  - Payload: `{ domain, action: 'add' | 'remove' | 'check' }`
  - Response: DNS records and domain verification status

## API Communication

**Data Operations:**
- Supabase Realtime (not actively used but available)
- Query patterns:
  - Direct table queries with filters: `.from('table').select().eq('site_id', siteId)`
  - RPC calls: `.rpc('get_site_by_domain', { domain_name })`
  - Insert operations: `.from('leads').insert([...])`
- No REST API layer - Client communicates directly with Supabase

**Edge Functions:**
- `manage-domain` - Handles Vercel domain provisioning
  - Input: Domain name and action (add/remove/check)
  - Output: DNS records (`aRecord`, `cnameRecord`), verification status

## Data Models (From Code Analysis)

**Sites Table:**
- `id` - UUID
- `name` - Site name
- `domain` - Custom domain
- `created_at` - Timestamp
- `domain_verified` - Boolean flag

**Leads Table:**
- `site_id` - UUID (foreign key, used for RLS filtering)
- `name` - Visitor name
- `email` - Visitor email
- `phone` - Contact phone
- `subject` - Message subject
- `message` - Message content
- `read` - Boolean read status

**Site Configuration (From `SiteContext`):**
- Loaded from Supabase `sites` table
- Includes template config: colors, fonts, content, contact info, images, social links
- Merged with skeleton template for defaults

---

*Integration audit: 2026-03-18*
