# Technology Stack

**Analysis Date:** 2026-03-18

## Languages

**Primary:**
- TypeScript 5.8.3 - Application logic, components, configuration
- React 18.3.1 - UI framework

**Secondary:**
- CSS3 - Styling via Tailwind

## Runtime

**Environment:**
- Node.js (version not explicitly specified in lockfile, minimum inferred as 18+)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 18.3.1 - Frontend UI framework
- React Router DOM 6.30.1 - Client-side routing

**UI Component Library:**
- Radix UI (multiple packages) - Accessible component primitives (`@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-dropdown-menu`, etc.)
- shadcn/ui (via components in `src/components/ui/`) - Built-in UI components using Radix UI

**State Management:**
- React Context API - Global state via `SiteContext.tsx`
- React Hook Form 7.61.1 - Form state and validation

**Data Fetching:**
- TanStack React Query 5.83.0 - Query client setup in `App.tsx`, though direct Supabase client used in most pages
- Supabase Client JS SDK 2.86.0 - Direct database queries

**Build/Dev:**
- Vite 5.4.19 - Build tool and dev server
- @vitejs/plugin-react-swc 3.11.0 - SWC compiler for React

**Styling:**
- Tailwind CSS 3.4.17 - Utility-first CSS framework
- PostCSS 8.5.6 - CSS transformation
- Autoprefixer 10.4.21 - Vendor prefixing
- Tailwind Merge 2.6.0 - Utility conflict resolution
- Tailwindcss-animate 1.0.7 - Animation utilities

**Utilities:**
- Sonner 1.7.4 - Toast notifications
- Lucide React 0.462.0 - Icon library
- Zod 3.25.76 - Schema validation
- Date-fns 3.6.0 - Date manipulation
- Clsx 2.1.1 - Conditional className utility
- React Brazil Map 1.0.1 - Brazil state map visualization
- React Simple Maps 3.0.0 - Map component library
- D3-geo 3.1.1 - Geographic data library
- Recharts 2.15.4 - Chart library
- React Quill 2.0.0 - Rich text editor
- React Day Picker 8.10.1 - Date picker component
- Embla Carousel React 8.6.0 - Carousel library
- React Resizable Panels 2.1.9 - Resizable panel UI
- Input OTP 1.4.2 - OTP input component
- Vaul 0.9.9 - Drawer component
- Next Themes 0.3.0 - Theme provider (light/dark mode)
- Class Variance Authority 0.7.1 - Component variant management

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.86.0 - Supabase client for database operations, authentication, and Edge Functions
- `@tanstack/react-query` 5.83.0 - Query client configured but not heavily utilized; Supabase client calls are direct
- `react-hook-form` 7.61.1 - Form handling and validation
- `zod` 3.25.76 - Data schema validation

**Infrastructure:**
- `fastify` 5.6.2 - Installed but not used in visible client code; potentially for backend API or Supabase Edge Functions
- `sonner` 1.7.4 - Toast notification system

## Configuration

**Environment:**
- Vite environment variables via `import.meta.env`
- Required vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- `.env` file present at project root

**Build:**
- `vite.config.ts` - Main build config with:
  - React SWC plugin for compilation
  - Path alias: `@` → `./src`
  - Dev server host: `0.0.0.0`
  - Dev server port: `8080`
  - Allowed hosts: `ivaldoprado.com`, `site1.com`, `site2.com`
- `tsconfig.json` - TypeScript configuration with loose checking (`noImplicitAny: false`, `strictNullChecks: false`)
- `postcss.config.js` - PostCSS configuration (autoprefixer + Tailwind)
- `tailwind.config.ts` - Tailwind CSS customization with custom colors, animations, fonts
- `.eslintrc.js` - ESLint configuration
- `package.json` - Project metadata and scripts

## Platform Requirements

**Development:**
- Node.js 18+ (inferred)
- npm package manager
- Vite dev server runs on port 8080

**Production:**
- Vercel - Deployment target (referenced in `domainService.ts` for domain management)
- Multi-domain support via subdomains/custom domains

---

*Stack analysis: 2026-03-18*
