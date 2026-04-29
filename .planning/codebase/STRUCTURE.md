# Codebase Structure

**Analysis Date:** 2026-03-18

## Directory Layout

```
ivaldo/
├── src/
│   ├── components/               # React UI components
│   │   ├── ui/                  # shadcn/ui component library (60+ base components)
│   │   ├── admin components (Header, Footer, Hero, Chatbot, etc.)
│   ├── config/                  # Configuration and templates
│   │   └── template-ivaldo.ts   # Central template configuration (1155 lines)
│   ├── contexts/                # React Context providers
│   │   └── SiteContext.tsx      # Site configuration and loading logic
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-scroll-animation.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/                     # Utilities and services
│   │   ├── supabase.ts          # Supabase client initialization
│   │   ├── domainService.ts     # Domain/Vercel integration
│   │   └── supabaseFetch.ts
│   ├── pages/                   # Page components (route handlers)
│   │   ├── Index.tsx            # Homepage
│   │   ├── CategoryPage.tsx     # Dynamic category pages (230 lines)
│   │   ├── DetalheCaso.tsx      # Case/company detail page (353 lines)
│   │   ├── Artigo.tsx           # Article page
│   │   ├── Equipe.tsx           # Team page
│   │   ├── Contato.tsx          # Contact page
│   │   ├── NaMidia.tsx          # Media page
│   │   ├── Duvidas.tsx          # FAQ page
│   │   ├── Falencia.tsx         # Bankruptcy cases (DUPLICATE of CategoryPage)
│   │   ├── RecuperacaoJudicial.tsx    # Judicial recovery (DUPLICATE of CategoryPage)
│   │   ├── Litisconsorcio.tsx         # Consortia cases (DUPLICATE of CategoryPage)
│   │   ├── AdministracaoJudicial.tsx  # Judicial admin (DUPLICATE of CategoryPage)
│   │   ├── NotFound.tsx         # 404 page
│   │   └── admin/               # Admin pages
│   │       ├── AdminLogin.tsx   # Login page
│   │       ├── Dashboard.tsx    # Site management dashboard
│   │       ├── SiteEditor.tsx   # Site configuration editor (777 lines)
│   │       ├── CaseDetailsEditor.tsx  # Case details editor (612 lines)
│   │       └── components/      # Admin sub-components
│   │           ├── ArticlesEditor.tsx (420 lines)
│   │           ├── CasesEditor.tsx
│   │           ├── TeamEditor.tsx
│   │           ├── LeadsEditor.tsx (307 lines)
│   │           ├── FaqEditor.tsx
│   │           ├── CalendarEditor.tsx
│   │           ├── DocumentUploadEditor.tsx (275 lines)
│   │           ├── DocumentListEditor.tsx
│   │           ├── CreateSiteModal.tsx
│   │           ├── DeleteSiteModal.tsx
│   │           ├── DnsInstructionsModal.tsx
│   ├── utils/                   # Utility functions
│   │   ├── slugify.ts           # Company slug generation (handles collisions)
│   │   └── formatDate.ts
│   ├── App.tsx                  # Main app router and layout
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TypeScript configuration
├── eslint.config.js            # ESLint rules
└── package.json                # Dependencies
```

## Directory Purposes

**src/components/:**
- Contains all React UI components
- Includes 60+ shadcn/ui base components in `ui/` subdirectory
- Feature components: Header, Footer, Hero, Chatbot, TeamSection, Statistics, etc.
- Special component: `ProtectedRoute.tsx` handles admin authentication

**src/config/:**
- `template-ivaldo.ts` is the single source of truth for all template data
- Contains default values for SEO, colors, fonts, company info, team, FAQ, news categories, case types, companies, etc.
- 1155 lines total - large monolithic configuration file that should be modularized

**src/contexts/:**
- `SiteContext.tsx`: Provides global site configuration loaded from Supabase
- Handles domain-to-config lookup
- Manages color injection into CSS variables
- Manages SEO metadata updates
- 224 lines

**src/lib/:**
- `supabase.ts`: Initializes Supabase client with environment variables
- `domainService.ts`: Manages Vercel domain integration (DNS, add/remove domains)
- `supabaseFetch.ts`: Helper functions for Supabase queries
- `utils.ts`: General utility functions

**src/pages/:**
- Route components for public pages and admin interface
- Public routes: Index, CategoryPage, DetalheCaso, Artigo, Equipe, Contato, NaMidia, Duvidas, NotFound
- Admin routes under `admin/` subdirectory with protected access
- **MAJOR ISSUE**: RecuperacaoJudicial, Falencia, Litisconsorcio, AdministracaoJudicial are EXACT DUPLICATES of CategoryPage logic - should be removed

**src/utils/:**
- `slugify.ts`: Generates URL-safe slugs from company names, handles collision detection
- `formatDate.ts`: Date formatting utilities

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React app initialization with SiteProvider
- `src/App.tsx`: Router configuration with all routes defined
- `src/pages/Index.tsx`: Homepage

**Configuration:**
- `src/config/template-ivaldo.ts`: All hardcoded template defaults (email, phone, colors, FAQ, companies)
- `vite.config.ts`: Build and server configuration (includes hardcoded domains in allowedHosts)
- `tsconfig.json`: TypeScript compiler options (many strict checks disabled)

**Core Logic:**
- `src/contexts/SiteContext.tsx`: Global state management and domain resolution
- `src/pages/CategoryPage.tsx`: Dynamic category page logic (should be reused by others)
- `src/pages/DetalheCaso.tsx`: Case detail page with tab navigation

**Admin:**
- `src/pages/admin/Dashboard.tsx`: Manages sites and domain verification
- `src/pages/admin/SiteEditor.tsx`: Main site editor (777 lines)
- `src/pages/admin/CaseDetailsEditor.tsx`: Case/company editor (612 lines)
- `src/components/ProtectedRoute.tsx`: Route protection (checks Supabase session)

**Styling & UI:**
- `src/index.css`: Global Tailwind CSS definitions
- `src/components/ui/`: shadcn/ui component library (60+ components)

## Naming Conventions

**Files:**
- PascalCase for React components: `Header.tsx`, `CategoryPage.tsx`, `AdminLogin.tsx`
- kebab-case for hooks and utilities: `use-scroll-animation.tsx`, `template-ivaldo.ts`, `domain-service.ts` (inconsistently applied)
- lowercase for base UI components from shadcn: `button.tsx`, `card.tsx`, `input.tsx`

**Directories:**
- lowercase: `components/`, `pages/`, `utils/`, `lib/`, `config/`, `hooks/`, `contexts/`
- Feature subdirectories use lowercase: `ui/`, `admin/`

**Components:**
- Large feature components in `src/components/` root: `Header.tsx`, `Footer.tsx`, `Chatbot.tsx`
- UI library components in `src/components/ui/`
- Page-level components in `src/pages/`
- Admin-specific components in `src/pages/admin/components/`

**Functions:**
- camelCase: `getCompanySlug()`, `generateBaseSlug()`, `deepMerge()`, `fetchConfig()`
- React hooks use `use` prefix: `useScrollAnimation()`, `useSite()`, `useMobile()`, `useToast()`

**Variables:**
- camelCase: `config`, `loading`, `siteId`, `searchTerm`, `selectedComarca`
- useState variables: `const [isVisible, setIsVisible] = useState(false)`

**Types:**
- PascalCase interfaces: `SiteContextType`, `TemplateIvaldo`, `Site`, `DnsInstructions`
- Prefixed with descriptive nouns: `SiteContextType`, `TemplateIvaldo`

## Where to Add New Code

**New Feature (e.g., calendar integration):**
- Primary component: `src/components/CalendarSection.tsx` (already exists, 310 lines)
- Admin editor: `src/pages/admin/components/CalendarEditor.tsx` (already exists)
- Config schema: Add to `src/config/template-ivaldo.ts` content object
- Context hooks: If global state needed, use/extend `src/contexts/SiteContext.tsx`

**New Public Page:**
- Create file in `src/pages/NewPageName.tsx`
- Import and add Route in `src/App.tsx`
- Link in navigation components (Header, Footer)
- Add page-specific data to `src/config/template-ivaldo.ts` if needed

**New Admin Component:**
- Create file in `src/pages/admin/components/FeatureEditor.tsx`
- Import in relevant admin page (`SiteEditor.tsx`, `Dashboard.tsx`, `CaseDetailsEditor.tsx`)
- Add Tab or section in admin interface

**Utilities:**
- Simple functions: `src/utils/newUtil.ts`
- Services/integrations: `src/lib/newService.ts`
- Custom hooks: `src/hooks/useNewHook.tsx`

**Base UI Components:**
- Do not modify existing `src/components/ui/` components (from shadcn/ui)
- Create new wrapper components in `src/components/` if additional functionality needed
- Example: `src/components/CustomInput.tsx` wrapping `src/components/ui/input.tsx`

## Special Directories

**src/components/ui/:**
- Purpose: shadcn/ui component library (60+ pre-built components)
- Generated: Yes (from shadcn CLI)
- Committed: Yes (components are modified per project needs)
- Do NOT delete or heavily modify - these are shared, stable UI building blocks

**public/:**
- Purpose: Static assets (images, videos, logos)
- Example: `public/videos/hero-background.mp4`
- Not version-controlled: Images/videos not committed (use CDN URLs instead)

**Admin Routes (Protected):**
- All routes under `/admin` require Supabase session
- `ProtectedRoute.tsx` component checks session before rendering
- If not authenticated, redirects to `/admin` login page
- No role-based access control (all authenticated users see all admin features) - SECURITY CONCERN

**Dynamic Routes:**
- `/:slug` is a catch-all route that routes to either:
  1. A case/company detail page via `DetalheCaso.tsx`
  2. A category page (if slug matches caseType) via `CategoryPage.tsx`
  3. 404 if neither match
- This creates routing fragility and slug collision risks

---

*Structure analysis: 2026-03-18*
