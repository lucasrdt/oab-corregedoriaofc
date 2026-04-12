---
status: fixing
trigger: "Fix all frontend refinements listed"
created: 2026-03-18T00:00:00Z
updated: 2026-03-18T00:00:00Z
---

## Current Focus

hypothesis: All 8 issues are independent UI/UX refinements with clear root causes
test: Apply each fix one at a time
expecting: All issues resolved after systematic changes
next_action: Apply all fixes in order

## Symptoms

expected: Polish frontend with 8 specific improvements
actual: Issues present as described in task
errors: None — cosmetic/functional gaps
reproduction: Visual inspection of portal pages and site
started: Current codebase state

## Eliminated

## Evidence

- timestamp: 2026-03-18T00:00:00Z
  checked: AdminDashboard.tsx navItems array
  found: id='site' has label='Configurações' — needs rename to 'Site'
  implication: Fix 1 — rename label

- timestamp: 2026-03-18T00:00:00Z
  checked: CasoEditor.tsx backPath and header
  found: ArrowLeft button exists — CasoEditor already has back button. PresidenteDashboard and UserDashboard lack back-to-site link. AdminDashboard/PresidenteDashboard/UserDashboard use sidebar nav (no need for back).
  implication: Fix 2 — CasoEditor already done; portal dashboards use sidebar, OK.

- timestamp: 2026-03-18T00:00:00Z
  checked: PortalLayout.tsx SidebarMenuButton
  found: isActive={activeItem === item.id} is already set — sidebar active state exists via Shadcn component
  implication: Fix 3 for sidebar is already handled. Header.tsx already uses text-primary for active. Both already have active styling.

- timestamp: 2026-03-18T00:00:00Z
  checked: App.tsx WhatsAppButton and Chatbot placement
  found: Both rendered globally in App.tsx outside route tree. WhatsAppButton already filters /admin but NOT /portal. Chatbot filters /admin but NOT /portal.
  implication: Fix 4 — update both components to also hide on /portal/* routes

- timestamp: 2026-03-18T00:00:00Z
  checked: SubsecoesSection in AdminDashboard.tsx
  found: Shows pill buttons (just city name). Needs full cards with corregedor + city + case count
  implication: Fix 5 — upgrade subsections display to cards

- timestamp: 2026-03-18T00:00:00Z
  checked: UsuariosSection subsection_id field
  found: Shows plain Input for UUID when role=presidente/user. Needs Select dropdown from subsections table
  implication: Fix 6 — add subsections query and replace Input with Select

- timestamp: 2026-03-18T00:00:00Z
  checked: Header.tsx "Entrar" link
  found: No border/box styling around the Entrar link — just plain text+icon
  implication: Fix 7 — add border box styling to Entrar button

- timestamp: 2026-03-18T00:00:00Z
  checked: App.tsx routes
  found: No /cursor route exists. Need to create page and add route.
  implication: Fix 8 — create Cursor.tsx page and register in App.tsx

## Resolution

root_cause: 8 independent UI/UX gaps in the codebase
fix: Apply targeted changes to each affected file
verification: pending
files_changed:
  - src/pages/portal/AdminDashboard.tsx (Fix 1, Fix 5, Fix 6)
  - src/components/WhatsAppButton.tsx (Fix 4)
  - src/components/Chatbot.tsx (Fix 4)
  - src/components/Header.tsx (Fix 7)
  - src/pages/Cursor.tsx (Fix 8, new file)
  - src/App.tsx (Fix 8)
