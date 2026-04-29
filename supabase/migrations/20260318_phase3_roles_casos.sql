-- ============================================================
-- Phase 3: user_roles + casos tables with RLS
-- ============================================================

-- Helper function: verifica se o usuário atual é admin
-- SECURITY DEFINER: roda sem RLS, evita recursão infinita
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$;

-- Helper function: retorna subsection_id do usuário atual
CREATE OR REPLACE FUNCTION get_user_subsection()
RETURNS uuid
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT subsection_id FROM user_roles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- ============================================================
-- Tabela: user_roles
-- ============================================================
CREATE TABLE IF NOT EXISTS user_roles (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          text NOT NULL CHECK (role IN ('admin', 'dev', 'presidente', 'user')),
  subsection_id uuid,  -- FK para subsecoes será adicionada na Fase 2 se tabela existir
  active        boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Usuário lê seu próprio registro
CREATE POLICY "user_roles_select_own"
  ON user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Admin lê todos os registros (usa função SECURITY DEFINER para evitar recursão)
CREATE POLICY "user_roles_select_admin"
  ON user_roles FOR SELECT
  USING (is_admin());

-- Somente admin pode inserir/atualizar/deletar
CREATE POLICY "user_roles_write_admin"
  ON user_roles FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- Tabela: casos
-- ============================================================
CREATE TABLE IF NOT EXISTS casos (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subsection_id      uuid NOT NULL,  -- ref a subsecoes(id) — FK adicionada após Fase 2
  nome               text NOT NULL,
  processo           text NOT NULL,
  comarca            text,
  uf                 char(2),
  vara               text,
  especialista       text,
  passivo            text,
  credores           integer DEFAULT 0,
  ajuizamento        date,
  deferimento        date,
  link_habilitacoes  text,
  documentos         jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE casos ENABLE ROW LEVEL SECURITY;

-- Admin: acesso total a todos os casos
CREATE POLICY "casos_admin_all"
  ON casos FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Presidente: acesso total apenas aos casos da sua subseção
CREATE POLICY "casos_presidente_all"
  ON casos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role = 'presidente'
        AND subsection_id = casos.subsection_id
        AND active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role = 'presidente'
        AND subsection_id = casos.subsection_id
        AND active = true
    )
  );

-- User: somente leitura na sua subseção
CREATE POLICY "casos_user_select"
  ON casos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role = 'user'
        AND subsection_id = casos.subsection_id
        AND active = true
    )
  );

-- ============================================================
-- Storage policies: bucket site-assets, path casos/*
-- ============================================================
-- Executar no dashboard Supabase (Storage > Policies) ou via SQL editor:

CREATE POLICY "authenticated_upload_casos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND name LIKE 'casos/%');

CREATE POLICY "authenticated_read_casos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'site-assets' AND name LIKE 'casos/%');

CREATE POLICY "authenticated_delete_casos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets' AND name LIKE 'casos/%');
