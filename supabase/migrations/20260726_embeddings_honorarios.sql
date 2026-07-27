-- supabase/migrations/20260726_embeddings_honorarios.sql
-- Fase 3 (continuacao): busca semantica (embeddings) como complemento a busca textual, pra
-- cobrir sinonimos e perguntas com contexto/narrativa - onde a busca por palavra-chave tem
-- teto estrutural (recall medido em ~73-77% no harness), porque a palavra procurada
-- simplesmente nao existe no texto do item quando o usuario troca "bens" por "patrimonio",
-- "casal" por "conjuges", etc. Embeddings comparam significado, nao palavras literais.
--
-- Modelo: voyage-3.5 (Voyage AI - recomendado pela Anthropic pra complementar o Claude, que nao
-- tem endpoint de embeddings proprio), dimensao 1024. Testado empiricamente contra voyage-law-2
-- (modelo especializado em direito, mas majoritariamente treinado em ingles) - voyage-3.5
-- venceu com folga em portugues juridico (contexto: 72.5% vs 65.0%, sinonimos: 81.7% vs 78.3%
-- no harness), confirmando que especializacao de dominio em ingles nao necessariamente
-- transfere bem pra portugues.

create extension if not exists vector;

alter table public.honorarios_itens add column if not exists embedding vector(1024);

-- ivfflat: bom custo-beneficio pra ~1000 vetores (hnsw so compensa em escalas bem maiores).
-- lists = raiz quadrada do numero de linhas (~31 pra 970 itens) e a heuristica padrao do pgvector.
create index if not exists honorarios_itens_embedding_idx
  on public.honorarios_itens
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 31);
