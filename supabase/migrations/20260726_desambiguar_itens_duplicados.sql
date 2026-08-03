-- supabase/migrations/20260726_desambiguar_itens_duplicados.sql
-- Fase 3 (continuacao): 21 nomes de item apareciam identicos em areas diferentes (ex:
-- "Usucapião" em Direito Agrario e Direito Civil), sem nenhuma palavra no texto do item
-- dizendo a qual area pertence - so a posicao no PDF original (o capitulo) desambiguava,
-- e isso se perde fora do documento. Acrescenta um qualificador curto no nome dos itens mais
-- especificos (a versao em "Advocacia Perante Tribunais"/area mais generica fica como esta,
-- servindo de base). Lista revisada e aprovada por quem redige a tabela oficial - nao e uma
-- suposicao nossa. Dois pares (3.2.5/21.3.1 "Recurso em sentido estrito" e 3.3.14/21.3.7
-- "Revisão Criminal") ficaram sem alteracao propositalmente: sao intrinsecamente de materia
-- criminal nas duas areas onde aparecem, entao pode ser duplicacao legitima da tabela, nao
-- ambiguidade - aguardando confirmacao separada.
--
-- Validado via harness (Fase 3): testando o caso mais claro em isolado ("Meu cliente e
-- produtor rural e quer entrar com usucapiao de uma area que ocupa ha 20 anos"), o item 6.4
-- ("Usucapião rural") passou a vir em 1o lugar com folga, batendo o homonimo de Direito Civil
-- que antes competia diretamente. Efeito confirmado caso a caso, mas nao move o recall medio
-- do dataset de forma visivel: so 3 dos 29 itens corrigidos aqui estavam na amostra de teste
-- de perguntas de contexto/sinonimos (a maioria dos itens ambiguos de Direito Agrario restantes
-- - ex: "Ações possessórias – móveis", "Do juízo arbitral" - nao tinham duplicata EXATA em
-- outra area, entao ficaram fora desta lista aprovada; sao um problema parecido mas mais dificil
-- de resolver do mesmo jeito, ainda em aberto).

update public.honorarios_itens set descricao = 'Ação anulatória de ato administrativo aeronáutico' where id = '5.10';
update public.honorarios_itens set descricao = 'Ação anulatória de ato administrativo de trânsito' where id = '28.2.1';
update public.honorarios_itens set descricao = 'Da ação monitória rural' where id = '6.11';
update public.honorarios_itens set descricao = 'Agravo de instrumento trabalhista' where id = '24.3.1';
update public.honorarios_itens set descricao = 'Apelação na Justiça Militar' where id = '22.18';
update public.honorarios_itens set descricao = 'Audiência de conciliação em ação de saúde' where id = '27.3.7';
update public.honorarios_itens set descricao = 'Audiência de conciliação em ação de família' where id = '16.24.23';
update public.honorarios_itens set descricao = 'Audiência de instrução em ação de saúde' where id = '27.3.9';
update public.honorarios_itens set descricao = 'Audiência de instrução em ação de família' where id = '16.24.25';
update public.honorarios_itens set descricao = 'Carta testemunhável criminal' where id = '21.3.5';
update public.honorarios_itens set descricao = 'Correição parcial criminal' where id = '21.3.6';
update public.honorarios_itens set descricao = 'Elaboração de memoriais trabalhistas' where id = '24.4.19';
update public.honorarios_itens set descricao = 'Embargos de declaração trabalhistas' where id = '24.4.10';
update public.honorarios_itens set descricao = 'Embargos de declaração criminais' where id = '21.3.3';
update public.honorarios_itens set descricao = 'Embargos infringentes na Justiça Militar' where id = '22.21';
update public.honorarios_itens set descricao = 'Embargos infringentes criminais' where id = '21.3.4';
update public.honorarios_itens set descricao = 'Execução de título extrajudicial bancário' where id = '9.18';
update public.honorarios_itens set descricao = 'Habeas Corpus eleitoral' where id = '14.4';
update public.honorarios_itens set descricao = 'Mandado de Segurança aeronáutico' where id = '5.11';
update public.honorarios_itens set descricao = 'Mandado de Segurança agrário' where id = '6.15';
update public.honorarios_itens set descricao = 'Mandado de Segurança trabalhista' where id = '24.4.22';
update public.honorarios_itens set descricao = 'Mandado de Segurança eleitoral' where id = '14.3';
update public.honorarios_itens set descricao = 'Pareceres em Direito Animalista' where id = '8.2.4';
update public.honorarios_itens set descricao = 'Reclamação na Justiça Militar' where id = '22.25';
update public.honorarios_itens set descricao = 'Recurso Extraordinário trabalhista' where id = '24.3.8';
update public.honorarios_itens set descricao = 'Recurso Extraordinário criminal' where id = '21.4.4';
update public.honorarios_itens set descricao = 'Sustentação Oral na Justiça Militar' where id = '22.20';
update public.honorarios_itens set descricao = 'Sustentação Oral previdenciária' where id = '26.2.9';
update public.honorarios_itens set descricao = 'Usucapião rural' where id = '6.4';
