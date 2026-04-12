-- ============================================================
-- Subsections RLS: corrige política de escrita para admin-only
-- ============================================================

-- Remove a política de escrita genérica (qualquer autenticado)
DROP POLICY IF EXISTS "Auth write subsections" ON subsections;

-- Garante que leitura pública está presente
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'subsections' AND policyname = 'Public read subsections'
  ) THEN
    CREATE POLICY "Public read subsections"
      ON subsections FOR SELECT
      USING (true);
  END IF;
END $$;

-- Admin: acesso total (INSERT, UPDATE, DELETE)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'subsections' AND policyname = 'subsections_admin_all'
  ) THEN
    CREATE POLICY "subsections_admin_all"
      ON subsections FOR ALL
      USING (is_admin())
      WITH CHECK (is_admin());
  END IF;
END $$;
