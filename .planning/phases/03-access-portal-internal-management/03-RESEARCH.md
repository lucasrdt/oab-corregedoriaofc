# Phase 3: Access Portal & Internal Management - Research

**Researched:** 2026-03-18
**Domain:** Supabase Auth RLS, Role-Based Access Control, React Router role-gating, Supabase Storage
**Confidence:** HIGH

---

## Summary

Phase 3 implements a multi-role portal where authenticated users see only the data belonging to their role and subsection. The four roles are `admin`, `dev`, `presidente`, and `user`. Security is enforced at the database layer via Supabase Row Level Security (RLS), not just in the frontend router — this is the critical architecture principle.

The current codebase has basic auth (Supabase email/password) and a `ProtectedRoute` that only checks "is authenticated". Phase 3 must extend this into a full role-aware system: a new `user_roles` table links `auth.users` to roles and subsections, RLS policies on new tables (`casos`, `subsection_casos`) enforce data isolation, and the React router tree is extended with a `/portal` login entry point plus role-specific dashboard routes.

Cases are currently stored in a JSONB blob inside the `sites` table (the `content.companies` field in `CaseDetailsEditor`). Phase 3 must either introduce a dedicated `casos` table (proper relational model, enables RLS) or apply RLS to the JSONB approach (not possible with column-level RLS — row-level only). **A dedicated `casos` table is mandatory for RLS to work.**

**Primary recommendation:** Create `user_roles` and `casos` tables with full RLS policies first (03-01), then build the portal UI in React, reusing `AdminLayout` for all authenticated dashboards.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| AUTH-01 | Tabela `user_roles` no Supabase com campos: user_id, role (admin/dev/presidente/user), subsection_id (nullable) | Supabase table + RLS — see Architecture Patterns |
| AUTH-02 | RLS policies garantem que cada role vê apenas os dados do seu escopo | Supabase RLS `auth.uid()` + `EXISTS` subquery pattern |
| AUTH-03 | Rota `/portal` com página de login pública | New React Router route, reuses existing AdminLogin UI pattern |
| AUTH-04 | Após login, usuário é redirecionado automaticamente ao dashboard correto conforme seu role | `useRole` hook fetches `user_roles` after session, routes by role value |
| AUTH-05 | Role `admin` tem acesso a tudo | RLS policy: admin bypasses all restrictions; UI shows full sidebar |
| AUTH-06 | Role `dev` tem acesso à configuração do site e ao painel de conteúdo global | RLS policy mirrors admin for site table; casos table blocked |
| AUTH-07 | Role `presidente` tem acesso à gestão dos casos da sua subseção específica | RLS: `user_roles.subsection_id = casos.subsection_id` |
| AUTH-08 | Role `user` pode visualizar casos da sua subseção (somente leitura) | RLS: same subsection check, SELECT only |
| AUTH-09 | Role `admin` pode criar, editar e desativar usuários e atribuir roles via painel | `supabase.auth.admin.*` calls via Edge Function (service_role key required) |
| CASO-01 | Casos de subseção são privados | RLS on `casos` table — no public SELECT policy |
| CASO-02 | `presidente` pode criar, editar e excluir casos da sua subseção | RLS INSERT/UPDATE/DELETE with subsection check |
| CASO-03 | `user` pode visualizar casos da sua subseção | RLS SELECT with subsection check |
| CASO-04 | `admin` pode visualizar e editar casos de qualquer subseção | RLS: role = 'admin' bypasses subsection filter |
| CASO-05 | Upload de documentos nos casos funcional via Supabase Storage | Reuse `DocumentUploadEditor` + `site-assets` bucket; add Storage policy for authenticated users |
| UPL-02 | Upload de documentos funcional nos casos de subseção | Same as CASO-05; path convention: `casos/{caso_id}/{filename}` |
</phase_requirements>

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | ^2.86.0 (installed) | Auth session, table queries, Storage uploads | Already in project; v2 API is stable |
| react-router-dom | ^6.30.1 (installed) | Nested protected routes per role | Already in project; v6 nested routes fit role gating naturally |
| react-hook-form | ^7.61.1 (installed) | Login form, case form validation | Already in project |
| zod | ^3.25.76 (installed) | Form schema validation | Already in project |
| @tanstack/react-query | ^5.83.0 (installed) | Server state for user role fetch, casos queries | Already in project |
| sonner | ^1.7.4 (installed) | Toast notifications for auth/upload feedback | Already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Supabase Edge Functions (Deno) | via Supabase CLI | Admin user management (service_role calls) | Required for AUTH-09 — creating users and assigning roles must happen server-side |
| shadcn/ui (sidebar, card, select) | existing | Portal dashboard layout, user management forms | Reuse `AdminLayout` pattern for all portal views |

### No New Dependencies Required
All libraries needed for Phase 3 are already installed. No `npm install` commands needed.

---

## Architecture Patterns

### Recommended Project Structure (additions)

```
src/
├── contexts/
│   └── AuthContext.tsx        # NEW: wraps Supabase session + role fetch
├── hooks/
│   └── useRole.ts             # NEW: returns { role, subsectionId, loading }
├── components/
│   └── PortalRoute.tsx        # NEW: replaces ProtectedRoute, adds role gating
├── pages/
│   ├── portal/
│   │   ├── PortalLogin.tsx    # NEW: /portal login page
│   │   ├── PortalLayout.tsx   # NEW: sidebar layout adapted for portal roles
│   │   ├── AdminDashboard.tsx # NEW: /portal/admin
│   │   ├── DevDashboard.tsx   # NEW: /portal/dev
│   │   ├── PresidenteDashboard.tsx  # NEW: /portal/presidente
│   │   └── UserDashboard.tsx  # NEW: /portal/user
│   └── admin/ (existing)      # Keep for existing admin/editor flow
└── (supabase/functions or edge functions for AUTH-09)
```

### Pattern 1: AuthContext — Session + Role in One Context

**What:** A React context that holds both the Supabase session and the user's role from `user_roles`. Single source of truth.

**When to use:** All authenticated pages consume this context via `useRole()` hook.

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Role = 'admin' | 'dev' | 'presidente' | 'user' | null;

interface AuthContextValue {
  session: any;
  role: Role;
  subsectionId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  session: null, role: null, subsectionId: null, loading: true
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<Role>(null);
  const [subsectionId, setSubsectionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchRole(session.user.id);
      else { setRole(null); setSubsectionId(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role, subsection_id')
      .eq('user_id', userId)
      .single();
    setRole(data?.role ?? null);
    setSubsectionId(data?.subsection_id ?? null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, role, subsectionId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

### Pattern 2: PortalRoute — Role-Gated React Router Guard

**What:** Replaces the current `ProtectedRoute` for portal routes. Redirects unauthenticated users to `/portal`, and authenticated users to the wrong dashboard if they hit an unauthorized route.

**When to use:** Wrap every `/portal/*` route.

```typescript
// src/components/PortalRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: '/portal/admin',
  dev: '/portal/dev',
  presidente: '/portal/presidente',
  user: '/portal/user',
};

interface PortalRouteProps {
  allowedRoles: string[];
}

const PortalRoute = ({ allowedRoles }: PortalRouteProps) => {
  const { session, role, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!session) return <Navigate to="/portal" replace />;
  if (!role || !allowedRoles.includes(role)) {
    // Redirect to their correct dashboard
    return <Navigate to={ROLE_DASHBOARDS[role ?? ''] ?? '/portal'} replace />;
  }

  return <Outlet />;
};
```

### Pattern 3: Role-Based Redirect After Login

**What:** After successful login, query `user_roles` and navigate to the correct dashboard.

**When to use:** `PortalLogin.tsx` — the `handleLogin` function.

```typescript
// Inside PortalLogin.tsx handleLogin
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) throw error;

const { data: { user } } = await supabase.auth.getUser();
const { data: roleData } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', user!.id)
  .single();

const destination = ROLE_DASHBOARDS[roleData?.role ?? ''] ?? '/portal';
navigate(destination, { replace: true });
```

### Pattern 4: Supabase RLS Policies for user_roles

**What:** Standard Supabase RLS pattern. `user_roles` is readable only by the owner and by admins.

**When to use:** Applied in the SQL migration for 03-01.

```sql
-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own role
CREATE POLICY "user_roles_select_own"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all roles
CREATE POLICY "user_roles_select_admin"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Only admins can insert/update/delete roles
CREATE POLICY "user_roles_admin_write"
  ON user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );
```

### Pattern 5: casos Table with Subsection-Scoped RLS

**What:** New `casos` table with RLS that enforces subsection isolation. The casos data that currently lives in JSONB (`content.companies`) must migrate here.

```sql
CREATE TABLE casos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subsection_id uuid NOT NULL REFERENCES subsecoes(id) ON DELETE CASCADE,
  nome        text NOT NULL,
  processo    text NOT NULL,
  comarca     text,
  uf          char(2),
  vara        text,
  especialista text,
  passivo     text,
  credores    integer DEFAULT 0,
  ajuizamento date,
  deferimento date,
  link_habilitacoes text,
  documentos  jsonb DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE casos ENABLE ROW LEVEL SECURITY;

-- Admin sees all
CREATE POLICY "casos_admin_all"
  ON casos FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Presidente: full access to their subsection
CREATE POLICY "casos_presidente_all"
  ON casos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role = 'presidente'
        AND subsection_id = casos.subsection_id
    )
  );

-- User: read-only their subsection
CREATE POLICY "casos_user_select"
  ON casos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role IN ('user')
        AND subsection_id = casos.subsection_id
    )
  );
```

### Pattern 6: Admin User Management via Edge Function

**What:** `supabase.auth.admin.createUser()` requires the service_role key, which must NEVER be in the frontend. Use a Supabase Edge Function as proxy.

**When to use:** `AdminDashboard.tsx` calls this function to create portal users.

```typescript
// supabase/functions/admin-create-user/index.ts (Deno)
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  // Verify caller is admin
  const authHeader = req.headers.get('Authorization');
  const { data: { user } } = await supabaseAdmin.auth.getUser(authHeader?.replace('Bearer ', ''));
  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('role').eq('user_id', user?.id).single();

  if (roleData?.role !== 'admin') {
    return new Response('Forbidden', { status: 403 });
  }

  const { email, password, role, subsection_id } = await req.json();
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email, password, email_confirm: true
  });

  if (error) return new Response(JSON.stringify({ error }), { status: 400 });

  // Insert role record
  await supabaseAdmin.from('user_roles').insert({
    user_id: data.user.id, role, subsection_id: subsection_id || null
  });

  return new Response(JSON.stringify({ user: data.user }), { status: 200 });
});
```

### App.tsx Route Structure for Phase 3

```tsx
// Add to App.tsx
<Route path="/portal" element={<PortalLogin />} />
<Route element={<AuthProvider />}>
  <Route element={<PortalRoute allowedRoles={['admin']} />}>
    <Route path="/portal/admin" element={<AdminDashboard />} />
  </Route>
  <Route element={<PortalRoute allowedRoles={['dev']} />}>
    <Route path="/portal/dev" element={<DevDashboard />} />
  </Route>
  <Route element={<PortalRoute allowedRoles={['presidente']} />}>
    <Route path="/portal/presidente" element={<PresidenteDashboard />} />
    <Route path="/portal/presidente/casos/:casoId" element={<CasoEditor />} />
  </Route>
  <Route element={<PortalRoute allowedRoles={['user']} />}>
    <Route path="/portal/user" element={<UserDashboard />} />
  </Route>
</Route>
```

### Anti-Patterns to Avoid

- **Role checks only in the frontend:** Never. RLS at the database is the actual security layer. Frontend guards are UX only.
- **Using service_role key in the browser:** The service_role key bypasses ALL RLS. Never expose it in frontend code or .env files committed to git.
- **Recursive RLS policies on user_roles:** A policy on `user_roles` that queries `user_roles` to check if the caller is admin creates infinite recursion in Supabase. Use `auth.jwt() -> 'role'` claim or a security-definer function to break the cycle.
- **Keeping casos in JSONB on sites table:** No RLS can scope individual companies inside a JSONB column. A dedicated `casos` table is required for row-level isolation.
- **Redirecting to /admin after portal login:** The existing `ProtectedRoute` redirects unauthenticated users to `/admin`. Portal users go to `/portal`. Keep the two authentication flows separate.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Row-level data isolation | Custom middleware filtering arrays | Supabase RLS policies | RLS runs at query time in PostgreSQL; no way to accidentally bypass it in app code |
| Session persistence | Custom localStorage auth state | `supabase.auth.onAuthStateChange` | SDK handles token refresh, expiry, and cross-tab sync |
| Admin user creation | Direct `supabase.auth.admin` calls from frontend | Supabase Edge Function | service_role key must never reach the browser |
| Role checking per component | Prop-drilling role strings everywhere | `AuthContext` + `useAuth()` hook | Single source of truth, no prop drilling |
| File upload to Storage | Custom multipart fetch | Existing `DocumentUploadEditor` component | Already handles upload, progress, errors, and public URL generation |

**Key insight:** Supabase RLS is the authoritative access control layer. All frontend role checks are UX conveniences that degrade gracefully because the database will reject unauthorized queries regardless.

---

## Common Pitfalls

### Pitfall 1: Infinite Recursion in user_roles RLS
**What goes wrong:** Policy on `user_roles` queries `user_roles` to check admin status — Supabase throws `infinite recursion detected` error.
**Why it happens:** RLS policy evaluation itself triggers another SELECT on the same table, which triggers the policy again.
**How to avoid:** Use a `SECURITY DEFINER` function that runs without RLS to check role, then call it in policies.
```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Use in other tables' policies:
-- USING (is_admin() OR subsection_id = get_user_subsection())
```
**Warning signs:** Any `user_roles` query returns a 500 or timeout when RLS is enabled.

### Pitfall 2: Race Condition Between Session and Role Fetch
**What goes wrong:** User logs in, gets redirected before `user_roles` fetch completes — role is null, `PortalRoute` redirects back to `/portal`.
**Why it happens:** `onAuthStateChange` fires immediately on login, before the extra `user_roles` query completes.
**How to avoid:** Keep `loading: true` until BOTH session AND role are resolved. Show a spinner. Only then render routes.
**Warning signs:** Flash of redirect to `/portal` immediately after login.

### Pitfall 3: `user_roles` Row Missing for New Users
**What goes wrong:** User is in `auth.users` but has no row in `user_roles`. Role fetch returns null. App shows broken state.
**Why it happens:** Admin created user via Supabase dashboard without inserting into `user_roles`.
**How to avoid:** The Edge Function that creates users always inserts `user_roles` atomically. Add a fallback UI state: "Seu acesso ainda não foi configurado. Contate o administrador."
**Warning signs:** `fetchRole` returns `data: null` for a valid session.

### Pitfall 4: Storage Bucket Policies Block Portal Users
**What goes wrong:** `presidente` uploads a document — Supabase Storage returns 403.
**Why it happens:** The `site-assets` bucket only has policies for the original admin flow.
**How to avoid:** Add Storage policy allowing authenticated users to INSERT into `casos/*` path:
```sql
-- In Supabase Storage policies (bucket: site-assets)
-- Allow authenticated users to upload to casos/
CREATE POLICY "authenticated_upload_casos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-assets' AND name LIKE 'casos/%');

CREATE POLICY "authenticated_read_casos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'site-assets' AND name LIKE 'casos/%');
```
**Warning signs:** Upload works in admin flow but fails in portal flow.

### Pitfall 5: Existing /admin Routes Broken by AuthProvider Wrapper
**What goes wrong:** Wrapping the entire app in `AuthProvider` and the existing `/admin` routes stop working because `ProtectedRoute` doesn't use `AuthContext`.
**Why it happens:** `ProtectedRoute` has its own `supabase.auth.getSession()` call; no conflict, but if `AuthProvider` is placed as a parent of BrowserRouter it causes issues.
**How to avoid:** Place `AuthProvider` inside `BrowserRouter`, scoped only to portal routes. Existing `/admin` routes continue using the existing `ProtectedRoute` unchanged.
**Warning signs:** `/admin/dashboard` redirects to `/portal` after the change.

---

## Code Examples

### Fetch User Role After Login
```typescript
// Source: Supabase JS v2 docs — supabase.from().select()
const { data, error } = await supabase
  .from('user_roles')
  .select('role, subsection_id')
  .eq('user_id', userId)
  .single();
// data: { role: 'presidente', subsection_id: 'uuid...' }
```

### Get Casos for Current User's Subsection (RLS handles filtering automatically)
```typescript
// Source: Supabase RLS — query returns only rows the policy allows
const { data: casos } = await supabase
  .from('casos')
  .select('*')
  .order('created_at', { ascending: false });
// presidente only gets their subsection's casos; admin gets all
```

### Call Edge Function to Create User (AUTH-09)
```typescript
// Source: @supabase/supabase-js v2 — supabase.functions.invoke()
const { data, error } = await supabase.functions.invoke('admin-create-user', {
  body: {
    email: 'novo@oab-ma.com',
    password: 'temp-password-123',
    role: 'presidente',
    subsection_id: selectedSubsectionId,
  },
});
```

### Reuse DocumentUploadEditor for casos
```typescript
// Existing component — just change the path convention
<DocumentUploadEditor
  title="Documentos do Caso"
  siteId={OAB_MA_SITE_ID}
  documents={caso.documentos?.principais || []}
  onChange={docs => updateDocumentos('principais', docs)}
  bucket="site-assets"
  // Files will be stored at: {siteId}/cases/{timestamp}_{filename}
/>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate auth library (JWT decode) | Supabase Auth built-in session management | Supabase v2 (2022) | No manual JWT handling needed |
| Supabase RLS with `auth.role()` claim | `auth.uid()` + `user_roles` table lookup | Ongoing best practice | More flexible than JWT claims for dynamic role changes |
| `supabase.auth.user()` (v1) | `supabase.auth.getUser()` async (v2) | Supabase v2 breaking change | Must use async version; sync version removed |

**Deprecated/outdated:**
- `supabase.auth.user()` (synchronous): removed in v2. Use `supabase.auth.getUser()` or `supabase.auth.getSession()`.
- `supabase.auth.session()`: removed in v2. Use `supabase.auth.getSession()`.
- Custom JWT roles via `auth.role()` claim: still available but brittle — role changes require new tokens. `user_roles` table approach is preferred.

---

## Open Questions

1. **Does a `subsecoes` table already exist in Supabase?**
   - What we know: Phase 2 creates subsections; Phase 3 references `subsection_id` as a FK to that table.
   - What's unclear: The exact table name and UUID column — Phase 2 research/plan will define this.
   - Recommendation: Plan 03-01 must wait for Phase 2's `subsecoes` table to exist, OR define `subsection_id` as `text` initially and add FK after Phase 2.

2. **Should the existing `CaseDetailsEditor` (/admin/cases/:caseId) be kept or retired?**
   - What we know: It stores cases in JSONB on `sites.config`. Phase 3 moves cases to a dedicated `casos` table.
   - What's unclear: Whether the admin should also have a portal-based case editor or use the old JSONB one.
   - Recommendation: Retire the JSONB-based case flow. Admin in the portal will use the same `casos` table as presidentes. Old `/admin/cases/:caseId` route can be removed or redirected.

3. **Should `dev` role see cases at all?**
   - What we know: AUTH-06 says `dev` has access to site configuration and global content panel. CASO-01 says cases are private.
   - What's unclear: Whether `dev` is blocked from `casos` entirely or gets read-only access.
   - Recommendation: Based on AUTH-06 scope ("site config + global content"), `dev` does NOT see `casos`. No SELECT policy for `dev` on the `casos` table.

---

## Sources

### Primary (HIGH confidence)
- Supabase JS v2 installed at `^2.86.0` — verified from `package.json`
- Existing `ProtectedRoute.tsx` — shows current auth pattern (`supabase.auth.getSession`, `onAuthStateChange`)
- Existing `DocumentUploadEditor.tsx` — shows Storage upload pattern using `site-assets` bucket
- Existing `AdminLayout.tsx` + `AdminLogin.tsx` — UI patterns to extend for portal

### Secondary (MEDIUM confidence)
- Supabase RLS infinite recursion: documented pattern in Supabase community — use `SECURITY DEFINER` function as workaround
- Supabase Edge Functions for service_role calls: established pattern per Supabase docs (service_role must stay server-side)

### Tertiary (LOW confidence — validate during implementation)
- Storage policy SQL syntax for path prefix matching (`name LIKE 'casos/%'`) — verify exact Supabase Storage policy DSL during 03-01

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries already installed, versions confirmed from package.json
- Architecture: HIGH — based on direct codebase inspection; patterns extend existing working code
- RLS patterns: HIGH — Supabase RLS fundamentals are stable and well-documented; specific policy syntax should be validated against live Supabase dashboard during 03-01
- Pitfalls: HIGH — all are based on documented Supabase v2 behaviors and observed codebase structure

**Research date:** 2026-03-18
**Valid until:** 2026-05-18 (Supabase JS v2 is stable; RLS behavior is stable)
