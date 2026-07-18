-- supabase/migrations/20260718_phase4_advogados.sql
-- versionamento da tabela public.advogados e hardening das políticas RLS

-- 1. Criação da tabela se não existir (para documentação local do repositório)
create table if not exists public.advogados (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  oab text not null,
  email text not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- 2. Habilitação de RLS
alter table public.advogados enable row level security;

-- 3. Limpeza de políticas existentes
drop policy if exists "Permitir leitura própria de advogados" on public.advogados;
drop policy if exists "Permitir inserção de advogado durante cadastro" on public.advogados;

-- 4. Criação das políticas de segurança estritas (Hardening)
-- SELECT: Apenas usuários autenticados e donos da própria linha de dados
create policy "Permitir leitura própria de advogados" on public.advogados
  for select
  to authenticated
  using (auth.uid() = id);

-- INSERT: Permite inserções públicas (incluindo anon/autenticados), mas com check estrito de que o ID inserido seja igual ao uid do usuário da sessão criada no auth.signUp()
create policy "Permitir inserção de advogado durante cadastro" on public.advogados
  for insert
  to public
  with check (auth.uid() = id);
