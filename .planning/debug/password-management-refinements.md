---
status: awaiting_human_verify
trigger: "Refinar sistema de senhas: senha padrão Mudar@123, troca obrigatória no primeiro login, troca no perfil, reset pelo admin."
created: 2026-03-18T00:00:00Z
updated: 2026-03-18T02:00:00Z
---

## Current Focus

hypothesis: CONFIRMADO — Nenhuma das 4 funcionalidades existe. Plano completo elaborado abaixo.
test: Leitura completa de todos os arquivos relevantes
expecting: Implementação das 4 funcionalidades sem quebrar o sistema existente
next_action: Implementar conforme plano detalhado abaixo

## Symptoms

expected: |
  1. Novos usuários criados pelo admin sempre recebem senha padrão "Mudar@123"
  2. No primeiro login, modal obrigatório para trocar senha
  3. No perfil do usuário, opção de trocar senha a qualquer momento
  4. Admins têm botão para resetar senha de qualquer usuário para "Mudar@123"

actual: Sistema atual não tem nenhuma dessas funcionalidades implementadas

errors: Nenhum erro - é implementação nova/refinamento

reproduction: Verificar código atual de criação de usuários, login, perfil e admin dashboard

started: Nova implementação necessária

## Eliminated

- hypothesis: Sistema pode ter lógica de primeiro login em algum hook oculto
  evidence: Leitura completa de AuthContext.tsx, PortalLogin.tsx, PortalRoute.tsx — nenhuma referência a must_change_password, firstLogin, ou user_metadata
  timestamp: 2026-03-18T01:00:00Z

- hypothesis: Pode existir uma tela de perfil de usuário já implementada
  evidence: Leitura de UserDashboard.tsx, PresidenteDashboard.tsx, PortalLayout.tsx — nenhuma aba de perfil ou troca de senha
  timestamp: 2026-03-18T01:00:00Z

- hypothesis: O campo de senha no form de criar usuário pode ser removido apenas no front
  evidence: A Edge Function admin-create-user recebe password do body e o usa diretamente. Precisa ser alterada para ignorar password e usar a padrão.
  timestamp: 2026-03-18T01:00:00Z

## Evidence

- timestamp: 2026-03-18T01:00:00Z
  checked: supabase/functions/admin-create-user/index.ts
  found: |
    - Recebe { email, password, role, subsection_id } do body
    - Chama supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })
    - NÃO define user_metadata.must_change_password
    - NÃO tem endpoint para reset de senha
  implication: Precisa ser modificada para usar senha padrão fixa e definir must_change_password=true

- timestamp: 2026-03-18T01:00:00Z
  checked: src/pages/portal/AdminDashboard.tsx — UsuariosSection
  found: |
    - Form de criar usuário inclui campo "Senha" (Input type="password") obrigatório
    - Schema Zod exige password com mínimo 8 chars
    - Passa password para a Edge Function
    - Não tem botão de "Reset de senha" em nenhuma linha da tabela de usuários
  implication: |
    - Remover campo senha do form (admin não precisa mais inserir)
    - Remover validação de senha do schema
    - Adicionar botão "Resetar Senha" na tabela de usuários

- timestamp: 2026-03-18T01:00:00Z
  checked: src/pages/portal/PortalLogin.tsx
  found: |
    - Login padrão: signInWithPassword → fetch role → navigate para dashboard
    - Não verifica user_metadata.must_change_password após login
    - Não exibe nenhum modal de troca de senha
  implication: Após login bem-sucedido, verificar metadata e mostrar modal se necessário

- timestamp: 2026-03-18T01:00:00Z
  checked: src/contexts/AuthContext.tsx
  found: |
    - Expõe: session, role, subsectionId, loading, signOut
    - session.user.user_metadata está disponível via session
    - NÃO expõe must_change_password como campo direto
  implication: |
    - must_change_password pode ser lido de session.user.user_metadata
    - AuthContext pode ser expandido para expor mustChangePassword como boolean
    - OU PortalLogin pode ler diretamente da session após login

- timestamp: 2026-03-18T01:00:00Z
  checked: src/pages/portal/PortalLayout.tsx
  found: |
    - Header do portal mostra: badge de role, email do usuário, botão Sair
    - Usa useAuth() para session, role, signOut
    - Nenhum link/botão de "Meu Perfil" ou "Trocar Senha"
  implication: |
    - Adicionar botão "Meu Perfil" no header do PortalLayout
    - OU adicionar aba "Perfil" em cada dashboard

- timestamp: 2026-03-18T01:00:00Z
  checked: src/pages/portal/UserDashboard.tsx + PresidenteDashboard.tsx
  found: |
    - navItems de cada dashboard são hardcoded
    - Nenhum possui aba de perfil
    - Padrão: { id: 'casos', label: '...' }
  implication: Adicionar navItem de perfil em todos os dashboards que usam PortalLayout

- timestamp: 2026-03-18T01:00:00Z
  checked: App.tsx — estrutura de rotas
  found: |
    - AuthProvider envolve apenas rotas /portal/*
    - PortalLogin está FORA do AuthProvider (Route path="/portal" sem wrapper)
    - AuthContext.session.user.user_metadata está acessível de dentro dos dashboards
  implication: Modal de troca de senha deve estar dentro do PortalLogin (antes do redirect) ou no PortalRoute

## Resolution

root_cause: |
  O sistema possui a infraestrutura base (Edge Function admin-create-user, AuthContext, PortalLayout)
  mas não implementa:
  1. Senha padrão automática (admin ainda digita senha manualmente)
  2. Flag must_change_password no user_metadata ao criar usuário
  3. Verificação e modal de troca obrigatória no primeiro login
  4. Aba de perfil com troca de senha nos dashboards
  5. Botão de reset de senha no AdminDashboard

fix: |
  1. admin-create-user: senha padrão Mudar@123 + user_metadata.must_change_password=true
  2. admin-reset-password: nova Edge Function para resetar senha de qualquer usuário
  3. ChangePasswordModal: novo componente com modo obrigatório (sem X de fechar) e voluntário
  4. ProfileSection: novo componente com info da conta + botão trocar senha
  5. dialog.tsx: adicionado prop hideCloseButton
  6. AdminDashboard: removido campo senha do form, adicionado info de senha padrão,
     botão RotateCcw para reset, aba "Meu Perfil"
  7. PortalLogin: verifica must_change_password após login e exibe modal obrigatório
  8. UserDashboard, PresidenteDashboard, DevDashboard: aba "Meu Perfil" adicionada

verification: Pendente validação humana
files_changed:
  - supabase/functions/admin-create-user/index.ts
  - supabase/functions/admin-reset-password/index.ts (NOVO)
  - src/components/ui/dialog.tsx
  - src/components/portal/ChangePasswordModal.tsx (NOVO)
  - src/components/portal/ProfileSection.tsx (NOVO)
  - src/pages/portal/AdminDashboard.tsx
  - src/pages/portal/PortalLogin.tsx
  - src/pages/portal/UserDashboard.tsx
  - src/pages/portal/PresidenteDashboard.tsx
  - src/pages/portal/DevDashboard.tsx

---

# PLANO DE IMPLEMENTAÇÃO DETALHADO

## Visão Geral da Arquitetura

### Como rastrear "primeiro login"
Supabase permite armazenar dados arbitrários em `user_metadata` (acessível pelo próprio usuário via `supabase.auth.updateUser`) e `app_metadata` (só alterável pela service role key via Admin API).

**Estratégia:** Usar `app_metadata.must_change_password = true` — definido pelo admin ao criar, só pode ser removido pela Edge Function (seguro), não pelo próprio usuário.

### Fluxo completo
```
Admin cria usuário
  → Edge Function: createUser(email, password="Mudar@123", app_metadata={must_change_password:true})
  → DB: insere em user_roles

Usuário faz login
  → PortalLogin.onSubmit: signInWithPassword
  → Verifica session.user.app_metadata.must_change_password
  → SE TRUE: exibe ChangePasswordModal (obrigatório, não pode fechar)
  → Modal chama supabase.auth.updateUser({ password: novaS enha })
  → Edge Function limpa app_metadata.must_change_password = false
  → Redireciona para dashboard

Em qualquer dashboard
  → PortalLayout tem botão "Meu Perfil" no header
  → Abre ProfileSection (Dialog ou aba)
  → Permite trocar senha a qualquer momento

Admin no AdminDashboard
  → Tabela de usuários tem botão "Resetar Senha"
  → Chama Edge Function admin-reset-password
  → Edge Function: updateUser(userId, { password:"Mudar@123", app_metadata:{must_change_password:true} })
```

---

## FRENTE 1: Edge Function admin-create-user (modificar)

**Arquivo:** `supabase/functions/admin-create-user/index.ts`

**Mudanças:**
1. Remover `password` do body recebido (ou ignorá-lo mesmo que enviado)
2. Usar senha padrão fixa `"Mudar@123"` no `createUser`
3. Adicionar `app_metadata: { must_change_password: true }` no `createUser`

```typescript
// ANTES:
const { email, password, role, subsection_id } = body;

if (!email || !password || !role) { ... }

const { data: { user: newUser }, error: createError } = await supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

// DEPOIS:
const { email, role, subsection_id } = body;

if (!email || !role) { ... }  // password removido da validação

const DEFAULT_PASSWORD = 'Mudar@123';

const { data: { user: newUser }, error: createError } = await supabaseAdmin.auth.admin.createUser({
  email,
  password: DEFAULT_PASSWORD,
  email_confirm: true,
  app_metadata: { must_change_password: true },
});
```

---

## FRENTE 2: Nova Edge Function admin-reset-password (criar)

**Arquivo:** `supabase/functions/admin-reset-password/index.ts`

**Propósito:** Resetar senha de um usuário para "Mudar@123" e marcar must_change_password=true.

**Lógica:**
1. Verificar que o caller é admin (igual ao admin-create-user)
2. Receber `{ user_id }` no body
3. Chamar `supabaseAdmin.auth.admin.updateUserById(user_id, { password: 'Mudar@123', app_metadata: { must_change_password: true } })`
4. Retornar sucesso

```typescript
// supabase/functions/admin-reset-password/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verificar que o caller é admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !caller) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: callerRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', caller.id)
      .eq('active', true)
      .single();

    if (callerRole?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: admin only' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Missing required field: user_id' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
      password: 'Mudar@123',
      app_metadata: { must_change_password: true },
    });

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

---

## FRENTE 3: Componente ChangePasswordModal (criar)

**Arquivo:** `src/components/portal/ChangePasswordModal.tsx`

**Propósito:** Modal que aparece no login quando must_change_password=true. Não pode ser fechado sem trocar a senha. Também reutilizado na aba de Perfil (mas ali pode ser fechado).

**Props:**
```typescript
interface ChangePasswordModalProps {
  open: boolean;
  onSuccess: () => void;
  onCancel?: () => void;  // undefined = modal obrigatório (não pode fechar)
  title?: string;
}
```

**Lógica:**
1. Form com: nova senha, confirmar nova senha
2. Validação Zod: min 8 chars, as duas iguais, não pode ser "Mudar@123"
3. `supabase.auth.updateUser({ password: novaS enha })`
4. Se onSuccess: após trocar, chama onSuccess()
5. Se not onCancel: DialogContent sem X de fechar (prop `onInteractOutside` bloqueado)

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const changePasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .refine((val) => val !== 'Mudar@123', {
      message: 'Escolha uma senha diferente da senha padrão',
    }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  open: boolean;
  onSuccess: () => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
}

const ChangePasswordModal = ({
  open,
  onSuccess,
  onCancel,
  title = 'Trocar Senha',
  description,
}: ChangePasswordModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (values: ChangePasswordForm) => {
    const { error } = await supabase.auth.updateUser({
      password: values.newPassword,
    });

    if (error) {
      toast.error('Erro ao trocar senha: ' + error.message);
      return;
    }

    toast.success('Senha alterada com sucesso!');
    reset();
    onSuccess();
  };

  const isMandatory = !onCancel;

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && onCancel) onCancel();
        // Se mandatory, não permite fechar
      }}
    >
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          if (isMandatory) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isMandatory) e.preventDefault();
        }}
        // Remove o X de fechar quando obrigatório
        {...(isMandatory ? { hideCloseButton: true } : {})}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          {isMandatory && (
            <DialogDescription className="text-amber-600 font-medium">
              Você deve trocar sua senha antes de continuar.
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="newPassword">Nova senha</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.newPassword && (
              <p className="text-xs text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword')}
              placeholder="Repita a nova senha"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar nova senha
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
```

**Nota sobre `hideCloseButton`:** O componente DialogContent do shadcn/ui por padrão renderiza um botão X. Para remover no modo obrigatório, a implementação precisa verificar como o DialogContent local está definido em `src/components/ui/dialog.tsx` e adicionar suporte ao prop `hideCloseButton`. Alternativa: usar CSS ou passar uma prop customizada.

---

## FRENTE 4: PortalLogin — verificar must_change_password após login

**Arquivo:** `src/pages/portal/PortalLogin.tsx`

**Mudanças no onSubmit:**

```typescript
// Adicionar import:
import ChangePasswordModal from '@/components/portal/ChangePasswordModal';

// Adicionar estado no componente:
const [showChangePassword, setShowChangePassword] = useState(false);
const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

// No onSubmit, após obter session e roleData:
const mustChange = session.user.app_metadata?.must_change_password === true;

if (mustChange) {
  setPendingRedirect(ROLE_DASHBOARDS[roleData.role]);
  setShowChangePassword(true);
  return; // Não redireciona ainda
}

navigate(ROLE_DASHBOARDS[roleData.role], { replace: true });

// Após o form, renderizar o modal:
{showChangePassword && pendingRedirect && (
  <ChangePasswordModal
    open={showChangePassword}
    title="Troca de Senha Obrigatória"
    onSuccess={() => {
      setShowChangePassword(false);
      navigate(pendingRedirect, { replace: true });
    }}
    // onCancel não passado = modal obrigatório
  />
)}
```

**Importante:** O `supabase.auth.updateUser` do ChangePasswordModal atualiza a senha no Supabase Auth, mas NÃO limpa o `app_metadata.must_change_password` (porque app_metadata só pode ser alterado pela service role). Duas opções:
- **Opção A (Simples):** Usar `user_metadata.must_change_password` em vez de `app_metadata`. User pode alterar user_metadata, o que é aceitável aqui pois o valor é apenas informativo para o próprio usuário.
- **Opção B (Segura):** Criar uma 3ª Edge Function `confirm-password-changed` que usa service role para limpar o flag.

**Decisão recomendada: Opção A** — usar `user_metadata.must_change_password`. Razão: o usuário já está autenticado e dentro do portal para fazer essa troca. Não há ganho de segurança real em impedir que o usuário limpe esse flag, já que a validação acontece na tela de login que ele já passou.

Portanto, nas Edge Functions `admin-create-user` e `admin-reset-password`, usar:
```typescript
// Em vez de app_metadata, usar user_metadata:
await supabaseAdmin.auth.admin.createUser({
  email,
  password: 'Mudar@123',
  email_confirm: true,
  user_metadata: { must_change_password: true },
});
```

E no PortalLogin verificar:
```typescript
const mustChange = session.user.user_metadata?.must_change_password === true;
```

E no ChangePasswordModal, após trocar senha com sucesso, limpar o flag:
```typescript
// Após supabase.auth.updateUser({ password })
await supabase.auth.updateUser({
  data: { must_change_password: false },
});
```

---

## FRENTE 5: ProfileSection — aba de perfil nos dashboards

**Arquivo:** `src/components/portal/ProfileSection.tsx`

**Propósito:** Componente de seção de perfil que pode ser usado como aba em qualquer dashboard.

```typescript
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KeyRound } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';

const ProfileSection = () => {
  const { session, role } = useAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const ROLE_LABELS: Record<string, string> = {
    admin: 'Administrador',
    dev: 'Desenvolvedor',
    presidente: 'Presidente de Subseção',
    user: 'Usuário',
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Meu Perfil</h2>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-sm">Informações da Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <p className="text-muted-foreground text-xs">E-mail</p>
            <p className="font-medium">{session?.user?.email}</p>
          </div>
          <div className="text-sm">
            <p className="text-muted-foreground text-xs">Papel</p>
            <p className="font-medium">{role ? (ROLE_LABELS[role] ?? role) : '—'}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-sm">Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowChangePassword(true)}
          >
            <KeyRound className="w-4 h-4" />
            Trocar Senha
          </Button>
        </CardContent>
      </Card>

      <ChangePasswordModal
        open={showChangePassword}
        onSuccess={() => setShowChangePassword(false)}
        onCancel={() => setShowChangePassword(false)}
      />
    </div>
  );
};

export default ProfileSection;
```

**Adicionar aba "Perfil" em cada dashboard:**

Nos arquivos `UserDashboard.tsx`, `PresidenteDashboard.tsx`, `AdminDashboard.tsx`, `DevDashboard.tsx`:

```typescript
// Adicionar ao navItems:
import { UserCircle } from 'lucide-react';

const navItems = [
  { id: 'casos', label: 'Casos da Subseção' },
  { id: 'perfil', label: 'Meu Perfil', icon: UserCircle },
];

// Adicionar ao render:
import ProfileSection from '@/components/portal/ProfileSection';

{activeItem === 'perfil' && <ProfileSection />}
```

---

## FRENTE 6: AdminDashboard — botão de reset de senha na tabela de usuários

**Arquivo:** `src/pages/portal/AdminDashboard.tsx`

**Mudanças:**

1. Remover campo senha do form de criar usuário:
```typescript
// Remover do schema:
const createUserSchema = z.object({
  email: z.string().email('E-mail inválido'),
  // REMOVER: password: z.string().min(8, ...)
  role: z.enum(['admin', 'dev', 'presidente', 'user'], { ... }),
  subsection_id: z.string().optional(),
});

// Remover do body enviado à Edge Function:
body: {
  email: values.email,
  // REMOVER: password: values.password,
  role: values.role,
  subsection_id: ...,
}
```

2. Remover o campo Input de senha do JSX do form.

3. Adicionar botão "Resetar Senha" na tabela:
```typescript
// No import de lucide-react, adicionar:
import { RotateCcw } from 'lucide-react';

// Nova função no UsuariosSection:
const handleResetPassword = async (userId: string) => {
  const { data, error } = await supabase.functions.invoke('admin-reset-password', {
    body: { user_id: userId },
  });

  if (error || data?.error) {
    toast.error('Erro ao resetar senha: ' + (data?.error ?? error?.message));
    return;
  }

  toast.success('Senha resetada para Mudar@123. O usuário deverá trocar no próximo login.');
};

// Na TableCell de ações (ao lado do UserX):
{u.active && (
  <>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleResetPassword(u.user_id)}
      title="Resetar senha para padrão"
    >
      <RotateCcw className="w-4 h-4 text-muted-foreground" />
    </Button>
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleDeactivate(u.id)}
      title="Desativar usuário"
    >
      <UserX className="w-4 h-4 text-muted-foreground" />
    </Button>
  </>
)}
```

---

## FRENTE 7: Dialog sem botão fechar (shadcn/ui)

**Arquivo:** `src/components/ui/dialog.tsx`

O DialogContent padrão do shadcn/ui tem um `DialogClose` hardcoded. Para suportar `hideCloseButton`, adicionar:

```typescript
// Na assinatura de DialogContent:
interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  hideCloseButton?: boolean;
}

const DialogContent = React.forwardRef<..., DialogContentProps>(
  ({ className, children, hideCloseButton = false, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content ref={ref} className={cn(...)} {...props}>
        {children}
        {!hideCloseButton && (
          <DialogClose className="absolute right-4 top-4 ...">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
```

---

## Ordem de Implementação Recomendada

1. **dialog.tsx** — adicionar `hideCloseButton` prop (base para o modal)
2. **ChangePasswordModal** — criar componente (depende do dialog.tsx)
3. **ProfileSection** — criar componente (depende do ChangePasswordModal)
4. **admin-create-user** (Edge Function) — senha padrão + must_change_password
5. **admin-reset-password** (Edge Function) — nova função
6. **AdminDashboard** — remover campo senha, adicionar reset button + aba perfil
7. **PortalLogin** — verificar must_change_password e mostrar modal
8. **UserDashboard** — adicionar aba perfil
9. **PresidenteDashboard** — adicionar aba perfil
10. **DevDashboard** — verificar estrutura e adicionar aba perfil

---

## Considerações de Segurança

- **user_metadata vs app_metadata:** Usar `user_metadata` para `must_change_password` é aceitável neste sistema pois:
  - O usuário não consegue burlar o bloqueio sem trocar a senha (o modal é obrigatório na tela de login)
  - Mesmo que um usuário experiente altere diretamente via SDK, ele ainda assim terá definido uma senha própria, o que é o objetivo
  - app_metadata exigiria uma Edge Function extra apenas para limpar o flag

- **Validação de senha "Mudar@123" não reutilizável:** A validação no Zod impede que o usuário coloque a senha padrão como nova senha, forçando uma senha real.

- **Email confirm automático:** A criação de usuários via Admin API já usa `email_confirm: true`, então usuários criados pelo admin não precisam verificar email.

- **A Edge Function admin-reset-password deve ser deployada** no Supabase com o mesmo processo da admin-create-user (supabase functions deploy admin-reset-password).
