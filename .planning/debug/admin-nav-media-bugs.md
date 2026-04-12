---
status: awaiting_human_verify
trigger: "Investigate and fix multiple issues: admin-nav-media-bugs"
created: 2026-03-18T00:00:00Z
updated: 2026-03-18T00:15:00Z
---

## Current Focus

hypothesis: All three bugs fixed — awaiting user verification
test: User verifies all three fixes in browser
expecting: Nav ordered correctly with login button, admin subsection management visible, media loads on public site
next_action: Await human verification

## Symptoms

expected:
1. Admin user should see case management for each subsection
2. Navigation: subsections listed after "equipe", login button on right side
3. Media files should load on the public site (same as admin preview)

actual:
1. Admin can't see/manage cases per subsection
2. Subsections not positioned after equipe, no login button visible on right
3. Media shows in admin preview but not on public site

errors: Not specified
reproduction:
1. Login as admin, check portal/dashboard - no case management per subsection
2. Check public site header/navigation
3. Upload media, check admin preview vs public site

timeline: Recent changes to the codebase

## Eliminated

- hypothesis: Media bug is a Supabase Storage RLS / permissions issue
  evidence: The upload works in admin preview (publicUrl is generated correctly). The real issue is the SiteContext uses fullIvaldoTemplate (static config) which never reflects admin-saved content — it has empty image URL fields.
  timestamp: 2026-03-18T00:03:00Z

- hypothesis: Navigation order issue is in mobile menu only
  evidence: Both desktop and mobile menus have the same ordering issue — Subseções is listed last, after Contato, instead of after Equipe.
  timestamp: 2026-03-18T00:04:00Z

## Evidence

- timestamp: 2026-03-18T00:01:00Z
  checked: Header.tsx desktop nav order
  found: Links ordered as: Home, Equipe, Na Mídia, Dúvidas, Contato, Subseções. No login button anywhere.
  implication: Bug #2 confirmed — Subseções should be after Equipe, and a login button is missing on the right.

- timestamp: 2026-03-18T00:01:30Z
  checked: AdminDashboard.tsx navItems
  found: navItems = [{id:'usuarios'}, {id:'casos'}, {id:'site'}]. CasosSection only shows all cases in a flat table. There is no "por subseção" (per subsection) management view.
  implication: Bug #1 confirmed — Admin has a global cases view but no subsection-specific case management.

- timestamp: 2026-03-18T00:02:00Z
  checked: SiteContext.tsx fetchConfig
  found: SiteContext is hardcoded to use fullIvaldoTemplate (static). siteId is null. ImageUpload uses activeSiteId = propSiteId || contextSiteId. ArticlesEditor passes siteId prop from admin dashboard. But NaMidia (public) uses content.articles from SiteContext which is always the static template.
  implication: Bug #3 confirmed — The admin SiteEditor saves to Supabase but the SiteContext on public site uses static template. However, the media issue here is specifically about uploaded images: the admin editor saves to Supabase storage and stores the publicUrl in config. The SiteContext serves static template to the public site, so any changes made in admin (including uploaded images) do NOT appear on the public site.

- timestamp: 2026-03-18T00:03:00Z
  checked: SiteEditor to understand admin save mechanism
  found: Need to check how SiteEditor saves data. SiteContext is single-tenant static — not fetching from database.
  implication: The media images that appear in admin preview are stored in the local SiteEditor state (React state), not persisted to a database for the public site. The SiteContext loads static template every time.

- timestamp: 2026-03-18T00:04:00Z
  checked: App.tsx for portal login route
  found: /portal route shows PortalLogin page. There is no public-facing login button in Header.tsx that would link to /portal.
  implication: Bug #2 (login button) confirmed — Header has no login link.

## Resolution

root_cause:
  bug1: AdminDashboard has a global "Todos os Casos" tab but no per-subsection management capability. Admin cannot create new cases for a specific subsection, nor filter/manage cases organized by subsection. The navItems and CasosSection lack subsection-aware functionality.
  bug2a: In Header.tsx, the nav order is Home > Equipe > Na Mídia > Dúvidas > Contato > Subseções. "Subseções" must come immediately after "Equipe".
  bug2b: Header.tsx has no login button. The portal login is at /portal but no link exists in the public header.
  bug3: SiteContext.tsx uses fullIvaldoTemplate (static hardcoded config) for both admin and public. The SiteEditor saves config to Supabase but SiteContext never fetches it. Images uploaded in admin are saved to Supabase Storage and their URLs are stored in the admin editor's state, but those URLs are never persisted to a database record that the public SiteContext reads. The public site always shows empty/default image values.

fix:
  bug1: Added "Subseções" nav tab to AdminDashboard with SubsecoesSection component. Shows all subsections as clickable pills; selecting one shows filtered cases for that subsection. "Novo Caso" button navigates to /portal/admin/casos/new?subsection_id=<uuid>. Updated CasoEditor to read subsection_id from URL search params when admin creates a new case.
  bug2a: Moved Subseções link to immediately after Equipe in both desktop and mobile nav in Header.tsx.
  bug2b: Added "Entrar" link with LogIn icon on far right of desktop nav and at bottom of mobile menu, pointing to /portal.
  bug3: Replaced stubbed fetchConfig in SiteContext.tsx (which was always using static fullIvaldoTemplate) with a real Supabase query against the `sites` table using VITE_SITE_ID — identical to how SiteEditor fetches/saves config. Falls back to static template on error.

files_changed:
  - src/components/Header.tsx
  - src/contexts/SiteContext.tsx
  - src/pages/portal/AdminDashboard.tsx
  - src/pages/portal/CasoEditor.tsx
