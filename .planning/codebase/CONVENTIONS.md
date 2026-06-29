# Coding Conventions

**Analysis Date:** 2026-03-18

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `Header.tsx`, `ArticlesEditor.tsx`, `ProtectedRoute.tsx`)
- Hooks: `use-` prefix with kebab-case (e.g., `use-mobile.tsx`, `use-scroll-animation.tsx`, `use-toast.ts`)
- Utility/service files: camelCase (e.g., `slugify.ts`, `formatDate.ts`, `domainService.ts`)
- UI components from shadcn: kebab-case (e.g., `image-upload.tsx`, `accordion.tsx`)
- Config files: kebab-case (e.g., `template-ivaldo.ts`)
- Index files: `index.ts` or implicit re-exports via barrel files

**Functions:**
- Component functions: PascalCase for React components (const Header = () => {})
- Utility functions: camelCase (e.g., `generateBaseSlug()`, `getCompanySlug()`, `fetchSites()`, `handleCreateSite()`)
- Handler functions: prefix with `handle` (e.g., `handleFileChange()`, `handleSaveArticle()`, `handleCreateSite()`)
- Async operations: standard camelCase with async/await pattern
- Private/internal functions: no leading underscore convention observed; use module scope instead

**Variables:**
- State variables: camelCase (e.g., `mobileMenuOpen`, `isUploading`, `editingArticle`, `dnsInstructions`)
- State setters: automatically camelCase with `set` prefix (e.g., `setMobileMenuOpen()`, `setIsUploading()`)
- Boolean flags: prefix with `is`, `has`, `can`, or similar (e.g., `isUploading`, `isLocalhost`, `authenticated`, `loading`, `isDialogOpen`)
- Constants: UPPERCASE_SNAKE_CASE for module-level constants (e.g., `MOBILE_BREAKPOINT = 768`, `FALLBACK_CASOS`)
- Context/prop names: camelCase (e.g., `propSiteId`, `activeSiteId`, `contextSiteId`)

**Types:**
- Interface names: PascalCase with `Props` suffix for component props (e.g., `ImageUploadProps`, `ArticlesEditorProps`, `ProtectedRouteProps`)
- Type names: PascalCase (e.g., `SiteContextType`, `TemplateIvaldo`, `DomainResponse`)
- Domain models: PascalCase (e.g., `Site` interface in Dashboard.tsx)
- Generic type parameters: single uppercase letter or descriptive names (e.g., `T` for generic, `SiteContextType`)

## Code Style

**Formatting:**
- No explicit `.prettierrc` or `.editorconfig` found; relies on ESLint
- Indentation: 2 spaces (observed in all source files)
- Line endings: LF (standard for web projects)
- Semicolons: Present throughout; part of default TS/ESLint style
- Trailing commas: Used in multi-line objects and imports

**Linting:**
- Tool: ESLint with flat config (`eslint.config.js`)
- TypeScript: `typescript-eslint` integration
- React: React Hooks rules enabled via `eslint-plugin-react-hooks`
- Strictness: Relaxed for production (see below)

**ESLint Configuration (eslint.config.js):**
```javascript
extends: [js.configs.recommended, ...tseslint.configs.recommended]
plugins: {
  "react-hooks": reactHooks,
  "react-refresh": reactRefresh,
}
rules: {
  "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  "@typescript-eslint/no-unused-vars": "off",
}
```

**TypeScript Configuration (tsconfig.json):**
- `noImplicitAny: false` - allows implicit any types
- `noUnusedParameters: false` - does not error on unused parameters
- `noUnusedLocals: false` - does not error on unused local variables
- `strictNullChecks: false` - allows null/undefined without strict checking
- `skipLibCheck: true` - skips type checking of declaration files
- Path alias: `@/*` maps to `./src/*` for cleaner imports

## Import Organization

**Order:**
1. React and React-related libraries (react, react-dom, hooks from react)
2. Third-party libraries (react-router-dom, zustand, date-fns, etc.)
3. UI libraries (lucide-react for icons, shadcn components)
4. Internal context/services (SiteContext from @/contexts, supabase from @/lib)
5. Internal components and utilities (using @ alias)
6. Styles and assets (CSS imports if any)

**Examples from codebase:**
```typescript
// Header.tsx pattern
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSite } from "@/contexts/SiteContext";
import { Menu, X, ChevronDown } from "lucide-react";

// Admin component pattern
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
```

**Path Aliases:**
- `@/` - Points to `src/` root for absolute imports
- Enables cleaner, more maintainable import paths throughout the codebase
- Used consistently across all files (`@/contexts`, `@/components`, `@/lib`, `@/utils`, `@/hooks`, `@/config`)

## Error Handling

**Patterns:**

1. **Try-Catch with Console Logging:**
```typescript
// From domainService.ts
try {
    const { data, error } = await supabase.functions.invoke('manage-domain', {
        body: { domain, action: 'add' }
    });

    if (error) {
        console.error('Error calling manage-domain function:', error);
        return { success: false, error: error.message || 'Erro ao adicionar domínio' };
    }
    return data as DomainResponse;
} catch (err) {
    console.error('Unexpected error adding domain:', err);
    return { success: false, error: 'Failed to add domain' };
}
```

2. **User-Facing Toast Notifications:**
```typescript
// From Dashboard.tsx
try {
    const { data, error } = await supabase.from('sites').select(...);
    if (error) throw error;
} catch (error: any) {
    toast.error('Erro ao carregar sites');
    console.error(error);
}
```

3. **Validation Errors:**
```typescript
// From image-upload.tsx
if (!file.type.startsWith('image/')) {
    toast({
        title: "Formato inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive"
    });
    return;
}
```

4. **Context Error Handling (Graceful Degradation):**
```typescript
// From image-upload.tsx - catches hook errors if outside provider
try {
    const { siteId } = useSite();
    contextSiteId = siteId;
} catch (e) {
    // Ignores error if not within Provider (e.g., isolated tests)
}
```

5. **Console Logging Levels:**
- `console.error()` - For errors and failures
- `console.warn()` - For warnings and non-critical issues
- `console.log()` - For debug info (e.g., "Tentando buscar o domínio no Supabase")

## Logging

**Framework:** console API (no dedicated logging library)

**Patterns:**
- Used in service functions for debugging database operations (`console.log` in SiteContext.tsx)
- Used in error handlers for debugging failures (`console.error` in domainService.ts)
- Development mode logging: `console.warn` with `[DEV MODE]` prefix (e.g., "Usando domínio de teste")
- No structured logging framework; relies on browser DevTools for inspection

**Examples:**
```typescript
console.warn(`[DEV MODE] Usando domínio de teste: ${domain}`);
console.log("Tentando buscar o domínio no Supabase:", domain);
console.error('Error fetching site config (RPC):', rpcError);
```

## Comments

**When to Comment:**
- Business logic explanations (e.g., "Encontra todas as empresas com o mesmo slug base")
- Section headers for organization in large files (e.g., "// PROVIDER", "// UTILS")
- Inline clarifications for non-obvious operations
- Not used for obvious code (e.g., "set loading to true" is omitted)

**JSDoc/TSDoc:**
- Used for service functions and utilities (primarily in `lib/` folder)
- Format: Standard JSDoc with `@param` and `@returns` tags
- Example from domainService.ts:
```typescript
/**
 * Adiciona um domínio ao projeto na Vercel via Edge Function
 * @param domain - O domínio a ser adicionado (ex: "empresa.com.br")
 * @returns Resposta com status e instruções de DNS
 */
export async function addDomainToVercel(domain: string): Promise<DomainResponse>
```

- Not universally applied; component JSDoc is sparse

**Portuguese Comments:**
- Codebase uses Portuguese for comments and user-facing strings
- Internal logic comments are minimal but leverage clear variable names

## Function Design

**Size:**
- Functions range from 10-50 lines typically
- Larger functions in admin editors (e.g., ArticlesEditor handles 200+ lines with UI rendering)
- No explicit maximum enforced; component-driven sizing

**Parameters:**
- Props passed via interface/type definitions (e.g., `ImageUploadProps`, `ProtectedRouteProps`)
- Destructuring from props is standard practice
- Optional props marked with `?` in interfaces
- Default values provided at function declaration level (e.g., `label = "Imagem"`)

**Return Values:**
- React components return JSX.Element or null (implicit)
- Service functions return typed objects or Promises (e.g., `Promise<DomainResponse>`)
- Event handlers return void
- Async operations return Promise-wrapped values
- No tuple returns observed; single object returns preferred

## Module Design

**Exports:**
- Default exports: used for React components and pages (e.g., `export default Header;`)
- Named exports: used for utilities, types, and services (e.g., `export async function addDomainToVercel()`)
- Mixed exports not observed; convention is consistent per file type

**Barrel Files:**
- Not used; imports use full paths (e.g., `@/components/ui/button` not `@/components/ui`)
- UI components in `src/components/ui/` are individual files
- No `index.ts` re-export pattern observed for grouping

**Module Dependencies:**
- One-way dependencies: pages use components, components use hooks and utils
- Circular dependencies avoided through directory structure
- Context at top level (SiteContext) for global state
- Service layer in `lib/` for external integrations

---

*Convention analysis: 2026-03-18*
