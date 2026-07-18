// supabase/functions/claude-honorarios/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Você é um assistente jurídico especializado da OAB-MA (Ordem dos Advogados do Brasil — Seccional Maranhão).

Seu papel é responder dúvidas de advogados inscritos na OAB-MA sobre honorários advocatícios, com base exclusivamente na Tabela de Honorários Mínimos OAB-MA 2026.

## REGRAS OBRIGATÓRIAS

1. Responda SEMPRE em português do Brasil, com linguagem formal e objetiva.
2. Cite SEMPRE o número do indicativo (ex: item 2.1, item 16.3) ao informar um valor.
3. Quando houver percentual E valor mínimo, informe os dois e explique que vale o maior.
4. Quando o item tiver situações (a, b, c), apresente todas as opções ao advogado.
5. Quando houver observação de acréscimo, informe claramente.
6. NUNCA invente valores. Se não encontrar o item na tabela, diga que não foi localizado e oriente a consultar o documento oficial.
7. Sempre finalize com: "Os valores são mínimos conforme a Tabela OAB-MA 2026. Confirme no documento oficial antes de formalizar contratos."

## TABELA DE HONORÁRIOS MÍNIMOS OAB-MA 2026


## Atividades Jurídicas Avulsas
[1.1] CONSULTA/REUNIÃO
  - a) No escritório. pessoalmente ou por qualquer meio eletrônico: R$ 500,00
  - b) Em local externo (distinto do escritório): R$ 700,00
  - c) Com exames de documentos: R$ 1.000,00 | OBS: Fora do horário de expediente: acrescenta-se R$ 150,00
[1.2] Hora técnica | R$ 500,00
[1.3] Pareceres | R$ 3.006,90
[1.4] Memoriais | R$ 2.860,22
[1.5] Petição ou requerimento avulso | R$ 1.183,90
[1.6] Acompanhamento de cliente a órgão administrativo ou judiciário | R$ 880,07
[1.7] Exame de autos de processo em ór- gãos administrativos ou judiciários | R$ 880,07
[1.8] Diligência ou acompanhamento de cliente junto a Delegacia de Polícia Obs.: fora do horário comercial, acrescen- ta-se R$ 240,00 | R$ 880,07
[1.9] Cobrança amigável | 10.0%
[1.10] Intervenção para solução de conflito extrajudicial amigável | 10.0%
[1.11] CORRESPONDÊNCIA   Fotocópia/digitalização de até 100 folhas | R$ 157,16
[1.11.1] Fotocópia/digitalização de mais de 100 folhas | R$ 0,20 | OBS: Acrescenta-se R$ 0,20 por folha acima de 100.
[1.11.2] Protocolo (por ato) | R$ 157,16
[1.11.3] Audiência conciliatória (presencial ou virtual) | R$ 377,17
[1.11.4] Audiência de instrução e julgamento (presencial ou virtual) | R$ 607,67
[1.12.1] Diária profissional - independente- mente das despesas de transporte, alimentação e estadia (mínimo) | R$ 1.152,47
[1.13.1] A diária profissional - independente- mente das despesas de transporte, alimentação e estadia (mínimo) | R$ 2.147,79
[1.13.2] Deslocamento | R$ 565,76
[1.14.1] Na comarca, para citação, notifica- ção, interpelação ou exames periciais | R$ 1.204,86
[1.14.2] Na comarca, para depoimento pesso- al ou inquirição de testemunhas | R$ 1.718,23

## Juizados Especiais Estaduais e Federais
[2.1] Inicial ou contestação, e audiência | 20.0%
[2.2] Atuação em 2ª instância | 10.0%
[2.3] Sustentação oral perante Turmas Recursais | 10.0%

## Advocacia Perante Tribunais
[3.1.1] Interposição | 5.0%
[3.1.2] Contrarrazões | 5.0%
[3.2.1] Apelação | R$ 5.175,64
[3.2.2] Interposição ou contrariedade | R$ 5.175,64
[3.2.3] Carta testemunhável | R$ 3.457,41
[3.2.4] Agravo em execução | R$ 3.845,06
[3.2.5] Recurso em sentido estrito | R$ 5.175,64
[3.2.6] Habeas Corpus | R$ 7.512,01
[3.3.1] Elaboração de memoriais | R$ 3.457,41
[3.3.2] Sustentação Oral em Tribunal local (presencial ou virtual) | R$ 3.876,49
[3.3.3] Sustentação Oral em Tribunal de ou- tro Estado (presencial ou virtual) | R$ 7.690,12
[3.3.4] Sustentação Oral nos Tribunais Supe- riores (presencial ou virtual) | R$ 8.287,31
[3.3.5] Acompanhamento de recurso | R$ 3.006,90
[3.3.6] Embargos de declaração | R$ 3.560,00
[3.3.7] Embargos infringentes | R$ 3.845,06
[3.3.8] Embargos de divergência | R$ 3.845,06
[3.3.9] Agravo de instrumento | R$ 6.110,00
[3.3.10] Agravo regimental | 5.0%
[3.3.11] Recurso adesivo | R$ 3.845,06
[3.3.12] Recurso ordinário | R$ 6.181,43
[3.3.13] Recurso Especial e Extraordinário | R$ 10.686,54
[3.3.14] Revisão Criminal | R$ 7.690,12
[3.3.15] Reclamação | R$ 4.683,22
[3.3.16] Correição Parcial | R$ 7.690,12
[3.3.17] Agravo Contra Denegação de Segui- mento de Recurso Especial | R$ 7.690,12
[3.3.18] Contrarrazões no agravo contra de- negação de seguimento de Recurso Especial | R$ 7.690,12
[3.3.19] Agravo Contra Denegação de Segui- mento de Recurso Extraordinário | R$ 7.690,12
[3.3.20] Contrarrazões no Agravo Contra De- negação de Seguimento de Recurso Extraordinário | R$ 7.690,12
[3.3.21] Mandado de Segurança | R$ 7.690,12
[3.3.22] Incidente de Resolução de Deman- das Repetitivas | R$ 7.690,12
[3.3.23] Incidente de Assunção de Compe- tência | R$ 7.690,12
[3.3.24] Incidente de Arguição de Declara- ção de Inconstitucionalidade | R$ 6.181,43

## Direito Administrativo
[4.1] Defesa administrativa/Recurso pe- rante órgãos extrajudiciais | 10.0%
[4.2] Impugnação/Recurso contra edital de concurso público | R$ 3.771,72
[4.3] Acompanhamento em processo admi- nistrativo disciplinar | R$ 4.190,80
[4.4] Acompanhamento em sindicância | R$ 2.095,40
[4.5] Medidas cautelares administrativas | R$ 3.143,10
[4.6] Atuação perante conselhos profissio- nais | 10.0%
[4.7] Defesa administrativa/Recurso ad- ministrativo em órgãos de defesa do consumidor | 20.0%
[4.8] Procedimento especial – Mandado de Injunção | R$ 7.333,90
[4.9] Advocacia Trabalhista para servido- res públicos | 20.0%
[4.10] Licitações e contratos públicos | 20.0%
[4.11] Acompanhamento de sessões e pra- zos em processo licitatório eletrônico | 20,0% | mínimo R$ 3.500,00
[4.12] Acompanhamento de sessões e pra- zos em processo licitatório presencial | 1,5% | mínimo R$ 1.500,00
[4.13] Acompanhamento em reuniões que envolvam processos licitatórios junto a órgãos públicos | R$ 800,00
[4.14] Petição intermediária em processo licitatório | 1,0% | mínimo R$ 1.500,00
[4.15] Organização de documentos de cre- denciamento, proposta e habilitação para a licitação | 2,0% | mínimo R$ 3.000,00
[4.16] Parecer de edital de licitação | 3,0% | mínimo R$ 2.500,00
[4.17] Parecer sobre contrato público e ter- mo aditivo | 2,5% | mínimo R$ 3.000,00
[4.18] Impugnação de edital | 3,0% | mínimo R$ 3.000,00
[4.19] Recurso ou contrarrazões em proces- so licitatório | 3.0%
[4.20] Análise e/ou pedido de reequilíbrio fi- nanceiro de contrato público perante o ente contratante | 5.0%
[4.21] Cobrança extrajudicial por inadim- plência de contrato público | 5.0%
[4.22] Propositura de defesa prévia/recurso em processo administrativo | 15.0%
[4.23] Propositura de representação em pro- cesso administrativo | 15.0%
[4.24] Propositura de pedido de reconside- ração em processo administrativo | 15.0%
[4.25] Elaboração de quesitos em processo administrativo/judicial | 5.0%
[4.26] Impugnação à perícia em processo administrativo/judicial | 15.0%
[4.27] Representação ou cautelar perante os tribunais de contas | 10.0%
[4.28] Defesa em procedimentos perante os tribunais de contas | 10.0%
[4.29] Processo de execução de contrato público | 10.0%
[4.30] Assessoria em portais de licitações (para atualização de cadastros e certidões) | R$ 1.571,55
[4.31] Elaboração de resposta a ofício e noti- ficação extrajudicial (simples) | R$ 314,31
[4.32] Elaboração de resposta a ofício e noti- ficação extrajudicial (complexo) | R$ 1.047,70
[4.33] Consultoria para empresa em tema de licitação | R$ 5.238,50
[4.34] Defesa/Recurso em ações de impro- bidade, Ação Civil Pública e ações populares | 10.0%

## Direito Aeronáutico
[5.1] Defesa administrativa em auto de infração | 10.0%
[5.2] Recurso administrativo em auto de infração 1ª instância | 10.0%
[5.3] Recurso administrativo em auto de infração 2ª instância | 10.0%
[5.4] Recursos internos | 10.0%
[5.5] Acompanhamentos em audiências | R$ 2.200,17
[5.6] Acompanhamento de procedimento de importação de aeronaves | R$ 15.715,50
[5.7] Análise/elaboração contratual - compra e venda de aeronaves | R$ 5.238,50
[5.8] Análise contratual – contratos internacionais | R$ 7.333,90
[5.9] Processo de transferência/averbação no RAB | R$ 4.190,80
[5.10] Ação anulatória de ato administrativo | 20.0%
[5.11] Mandado de Segurança | R$ 8.905,45
[5.12] Processo de homologação de pistas de pouso e decolagem | R$ 15.715,50

## Direito Agrário
[6.1] Ações possessórias – móveis | R$ 3.216,44
[6.2] Ações possessórias – imóveis (interdito proibitório, manutenção e reintegração). | R$ 5.615,67
[6.3] Nunciação de obra nova | R$ 4.976,58
[6.4] Usucapião | R$ 5.615,67
[6.5] Divisão e demarcação | R$ 4.976,58
[6.6] Embargos de terceiro | R$ 5.615,67
[6.7] Habilitação | R$ 4.012,69
[6.8] Restauração de autos | R$ 4.012,69
[6.9] Das vendas a crédito com reserva de domínio | R$ 4.012,69
[6.10] Do juízo arbitral | R$ 4.976,58
[6.11] Da ação monitória | R$ 2.849,74
[6.12] Desapropriação direta | R$ 5.689,01
[6.13] Desapropriação indireta | R$ 9.628,36
[6.14] Ação de constituição, extinção de usufruto ou fideicomisso | R$ 4.274,62
[6.15] Mandado de Segurança | R$ 6.422,40
[6.16] Ação ordinária de despejo | R$ 4.976,58
[6.17] Atos/acompanhamento despejo/rein- tegração | R$ 3.216,44

## Direito Ambiental
[7.1.2] Defesa prévia | 10.0%
[7.1.3] Recurso | 10.0%
[7.1.4] Acompanhamento em audiência | 3.0%
[7.1.5] Atuação ou acompanhamento em procedimentos de licenciamento ou certificação ambiental. | R$ 8.591,14
[7.1.6] Visita de campo | R$ 1.257,24
[7.1.7] Análise dos aspectos ambientais do contrato | 10.0%
[7.2.1] Defesa em Inquérito Civil | R$ 6.286,20
[7.2.2] Atuação em Processo Civil (1ª instância) | 20.0%
[7.2.3] Atuação em Ação Civil Pública (1ª instância) | 10.0%
[7.2.4] Atuação em audiência isolada para coleta de provas | R$ 3.143,10
[7.2.5] Atuação isolada em termo de ajusta- mento de conduta | R$ 4.714,65
[7.2.6] Acompanhamento em estudos am- bientais | 15.0%
[7.2.7] Parecer sobre interpretação de nor- mas ambientais, sobre projeto am- biental ou sobre qualquer tipo de lançamento realizado contra o inte- ressado | 5.0%
[7.2.8] Atuação em procedimento extrajudi- cial cujo objeto seja crime ambiental | R$ 6.286,20
[7.2.9] Atuação em processo judicial cujo objeto seja crime ambiental | R$ 8.381,60

## Direito Animalista
[8.1.1] Defesa de auto de infração | 10.0%
[8.1.2] Manifestações em geral | 10.0%
[8.2.1] Elaboração de estatuto e/ou regi- mento | R$ 7.260,56
[8.2.2] Integrar como presidente da comissão de conselho municipal e/ou estadual e/ou nacional de proteção animal | R$ 3.834,58
[8.2.3] Assessoria de comissão de conselho de proteção animal – a hora | R$ 1.278,19
[8.2.4] Pareceres | R$ 4.358,43
[8.3.1] Reconhecimento e/ou dissolução de união estável com pedido de guarda unilateral de animal não humano | R$ 1.000,00 | OBS: Acrescenta-se R$ 1.000,00 ao ato correspondente na tabela.
[8.3.2] Reconhecimento e/ou dissolução de união estável com pedido de guarda compartilhada de animal não humano | R$ 1.700,00 | OBS: Acrescenta-se R$ 1.700,00 ao ato correspondente na tabela.
[8.3.3] Divórcio com pedido de guarda unila- teral de animal não humano | R$ 1.000,00 | OBS: Acrescenta-se R$ 1.000,00 ao ato correspondente na tabela.
[8.3.4] Divórcio com pedido de guarda com- partilhada de animal não humano | R$ 1.700,00 | OBS: Acrescenta-se R$ 1.700,00 ao ato correspondente na tabela.
[8.3.5] Alimentos | R$ 1.000,00 | OBS: Acrescenta-se R$ 1.000,00 ao ato correspondente na tabela.

## Direito Bancário
[9.1] Parecer Jurídico/Legal Opinion acer- ca do regulatório referente ao Banco Central e seus órgãos e autarquias | R$ 3.143,10
[9.2] Consultoria para estruturação, cria- ção de Fintechs, Instituições de Pa- gamentos e outras de Pequeno Porte incluindo Adequação conforme regu- lações do Banco Central | R$ 104.770,00
[9.3] Consultoria, criação e assessoramen- to de Empresa Simples de Crédito (LC 167/2019) | R$ 52.385,00
[9.4] Consultoria e elaboração de atos constitutivos de cooperativas de crédito, instituições de microcrédito, instituições de seguro e resseguro | R$ 10.477,00
[9.5] Embargos do executado, monitórios e/ ou defesas do devedor, crédito rural ou não | R$ 6.286,20
[9.6] Assessoria mensal para instituições financeiras | R$ 5.238,50
[9.7] Assessoria para constituição de Fun- dos de Investimento, FIAGRO, FIDIC e outros | R$ 104.770,00
[9.8] Consultoria em Blockchain, Bitcoins, Tokenização de ativos, NFT e demais relacionados | R$ 52.385,00
[9.9] Ações judiciais relacionadas a finan- ciamentos imobiliários | R$ 5.238,50
[9.10] Embargos do Executado, monitórios e/ ou defesas do devedor, crédito rural ou não | R$ 6.286,20
[9.11] Ações indenizatórias (cobrança in- devida, venda casada, negativação indevida, cartão de crédito não solici- tado, entre outras) | R$ 3.143,10
[9.12] Ação Revisional | R$ 5.238,50
[9.13] Acompanhamento de cliente em reu- nião com gerentes/negociações | R$ 1.047,70
[9.14] Parecer jurídico sobre contrato ban- cário | R$ 3.143,10
[9.15] Negociação extrajudicial junto à insti- tuição financeira | R$ 5.238,50
[9.16] Defesa e atuação em Ação Civil Pública | R$ 10.477,00
[9.17] Defesa em ações indenizatórias (co- brança indevida, negativação indevi- da, cartão de crédito não solicitado, entre outras) | R$ 4.190,80
[9.18] Execução de título extrajudicial | R$ 5.238,50

## Direito Civil
[10.1.1] Notificação, interpelação e protesto | R$ 2.242,08
[10.1.2] Antecedentes | 5.0%
[10.1.3] Se formulado pedido principal | 10.0%
[10.2.1] Sem valor declarado | R$ 3.735,05
[10.2.2] Com valor declarado | 10.0%
[10.2.3] Acréscimo por litisconsorte | R$ 1.498,21
[10.3.1] Execução de título extrajudicial | 10.0%
[10.3.2] Cumprimento de sentença | 10.0%
[10.4.1] Embargos à execução | 10.0%
[10.4.2] Exceção de pré-executividade | 10.0%
[10.5.1] Divisão ou demarcação | 10.0%
[10.5.2] Cumuladas | 10.0%
[10.5.3] Usucapião | 10.0%
[10.5.4] Desapropriação | 10.0%
[10.5.5] Reivindicatória | 10.0%
[10.5.6] Ações petitórias | 10.0%
[10.5.7] Ação declaratória autônoma | 10.0%
[10.5.8] Registro de Torrens sem oposição | 5.0%
[10.5.9] Registro de Torrens com oposição | 10.0%
[10.5.10] Especialização de hipoteca legal | R$ 1.943,48
[10.6.1] Consignação em pagamento | 10.0%
[10.6.2] Ação monitória | 10.0%
[10.6.3] Alienação judicial | 10.0%
[10.6.4] Ação de exigir contas (cada fase) | R$ 2.242,08
[10.6.5] Homologação do penhor legal | 10.0%
[10.6.6] Oposição | 10.0%
[10.6.7] Regulação de avaria grossa | 10.0%
[10.6.8] Restauração dos autos | 10.0%
[10.6.9] Intervenção de terceiros | 10.0%
[10.7.1] Ação Popular | 10.0%
[10.7.2] Ação Civil Pública | 10.0%
[10.7.3] Mandado de Segurança Coletivo | 10.0%

## Direito do Consumidor
[11.1.1] Procedimento ou defesa administrati- va sobre o valor econômico envolvido, como mandatário da empresa | 20.0%
[11.1.2] Parecer sobre normas de relação de consumo | R$ 3.406,07
[11.1.3] Acompanhamento PROCON, notifica- ção extrajudicial, agências regulado- ras e sites de resolução extrajudicial sem benefício econômico | R$ 733,39
[11.1.4] Acompanhamento PROCON, notifica- ção extrajudicial, agências regulado- ras e sites de resolução extrajudicial com benefício econômico | R$ 1.364,11
[11.1.5] Defesa administrativa de órgãos de defesa do consumidor | 20.0%
[11.1.6] Recurso administrativo em órgãos de defesa ao consumidor | 20.0%
[11.2.1] Ação judicial movida pelo consumidor, visando a responsabilizar o fornece- dor pelo fato do produto e do serviço | 20.0%
[11.2.2] Ação judicial movida pelo consumidor, visando responsabilizar o fornecedor por vício do produto e do serviço | 20.0%
[11.2.3] Ação judicial movida pelo consumidor, visando responsabilizar o fornecedor por publicidade enganosa ou abusiva | 20.0%
[11.2.4] Ação judicial movida pelo consumi- dor, visando a nulidade de cláusulas abusivas constantes em contratos de consumo | 20.0%
[11.2.5] Ação judicial movida pelo consumidor, visando responsabilizar o fornecedor pela negativação indevida | 20.0%
[11.2.6] Ação judicial movida pelo consumidor, visando responsabilizar o fornecedor pela falha na prestação do serviço de transporte aéreo (acidente aéreo, atraso de voo, cancelamento de voo, extravio de bagag | 20.0%
[11.2.7] Ação judicial movida pelo consumi- dor, vítima de fraude | 20.0%
[11.2.8] Ação judicial movida pelo consumidor, visando responsabilizar o fornecedor pelo descumprimento contratual | 20.0%
[11.2.9] Defesa em ação judicial movida pelo consumidor, sobre o valor atualizado da ação. | 20.0%
[11.2.10] Atuação em audiência isolada, para coleta de prova oral | R$ 2.093,30
[11.2.11] Representação em convenção co- letiva de consumo – Representação de entidade civil de consumidores | R$ 4.189,75
[11.2.12] Representação em convenção coleti- va de consumo – Representação de asso- ciação de fornecedores | R$ 5.760,25
[11.2.13] Representação em convenção co- letiva de consumo – Representação de sindicato de categoria econômica de consu- midores e de fornecedores | R$ 8.150,06
[11.2.14] Consultoria sem vínculo empregatício – Consultoria de empresas de pequeno porte | R$ 4.106,98
[11.2.15] Consultoria sem vínculo empregatício – Consultoria de empresas de médio porte | R$ 6.284,10
[11.2.16] Consultoria sem vínculo empregatício – Consultoria de empresas de grande porte | R$ 7.857,75
[11.2.17] Consultoria sem vínculo empregatício – Consultoria de Entidade civil de consumi- dores | R$ 7.857,75
[11.2.18] Consultoria sem vínculo empregatício – Consultoria de associações de fornece- dores | R$ 7.857,75
[11.2.19] Consultoria sem vínculo empregatício – Consultoria de sindicato de categoria eco- nômica de consumidores e de fornecedores | R$ 9.953,15

## Direito Desportivo
[12.1] Procedimento que tramita em Comis- são Disciplinar de Tribunal de Justiça Desportiva | R$ 1.382,96
[12.2] Procedimento que tramita em Tri- bunal de Justiça Desportiva (Tribunal Pleno) | R$ 1.812,52
[12.3] Procedimento que tramita em Comis- são Disciplinar de Superior Tribunal de Justiça Desportiva | R$ 1.812,52
[12.4] Procedimento que tramita em Supe- rior Tribunal de Justiça Desportiva (Tribunal Pleno) | R$ 2.556,39
[12.5] Defesa perante a Justiça Desportiva por denunciado (1º. Grau CD do TJD) | R$ 2.030,00
[12.6] Defesa perante a Justiça Desportiva por denunciado (2º. Grau, oriundos dos TJDs, CD e Pleno do STJD) | R$ 2.765,93
[12.7] Procedimentos especiais junto à Jus- tiça Desportiva | R$ 3.405,03
[12.8] Procedimento litigioso na defesa de interesse de cliente (clube, agente, atleta, etc.) frente à FIFA e TAS-CAS | R$ 25.520,00
[12.9] Participação em painel: audiência (presenciais ou online)/recurso. Os valores de matéria desportiva são acrescidos de 20% caso a atuação envolva atletas, clubes e contratos em língua estrangeira | 20.0%
[12.10.1] Patrocínio de reclamante – sobre a condenação ou acordo | 20.0%
[12.10.2] Acréscimo em caso de Recurso Ordinário | 5.0%
[12.10.3] Acréscimo em caso de Recurso de Revista | 5.0%
[12.10.4] Patrocínio de reclamado – sobre a condenação ou acordo | 20.0%
[12.10.5] Acréscimo em caso de Recurso Ordinário | 5.0%
[12.10.6] Acréscimo em caso de Recurso de Revista | 5.0%
[12.10.7] Consultoria Jurídica, sem vínculo empregatício, entidade de prática desportiva com mais de 35 atletas e/ ou membro(s) de comissão(ões) técni- ca(s) | R$ 14.185,86
[12.10.8] Consultoria Jurídica, sem vínculo empregatício, entidade de prática desportiva com menos de 35 atletas e/ou membro(s) de comissão(ões) técnica(s) | R$ 7.092,93
[12.10.9] Ação Cível: procedimento ordinário (proposição ou defesa) | 20.0%
[12.10.10] Ação Cível: procedimento sumário (proposição ou defesa) | 20.0%
[12.10.11] Procedimento de Mecanismo de Soli- dariedade, Indenização por Formação e Training Compensation | 20.0%
[12.11.1] Procedimento administrativo nacional comum em publisher ou organizador | R$ 1.037,22
[12.11.2] Procedimento administrativo comum em publisher ou organizador interna- cional | R$ 1.550,60
[12.12.1] Procedimento disciplinar nacional em publisher ou organizador | R$ 1.414,40
[12.12.2] Procedimento disciplinar internacio- nal em publisher ou organizador | R$ 2.127,35
[12.12.3] Defesa em processo disciplinar nacio- nal em publisher ou organizador | R$ 1.550,60
[12.12.4] Acréscimo em grau recursal de pro- cesso disciplinar nacional | R$ 1.550,60
[12.12.5] Defesa em processo disciplinar inter- nacional em publisher ou organizador | R$ 2.315,42
[12.12.6] Acréscimo em grau recursal de pro- cesso disciplinar internacional | 100.0%
[12.12.7] Procedimento especial regulamentar nacional em publisher ou organizador | R$ 3.090,72
[12.12.8] Procedimento especial regulamentar internacional em publisher ou organi- zador | R$ 4.599,40
[12.13.1] Procedimento litigioso na defesa do interesse de cliente (clube, agente, atleta, etc.) frente às publishers, or- ganizadoras e correlatas, em nível nacional. | R$ 7.082,45
[12.13.2] Procedimento litigioso na defesa do interesse de cliente (clube, agente, atleta, etc.) | R$ 9.974,10
[12.13.3] Participação como membro de tribu- nal disciplinar (diária) | R$ 167,63

## Direito Digital
[13.1.1] Mapeamento de dados pessoais (por processo) | R$ 450,00
[13.1.2] Elaboração de políticas ou procedimento | R$ 3.255,00
[13.1.3] Elaboração de Relatório de impacto à proteção de dados pessoais (DPIA) | R$ 7.310,00
[13.1.4] Avaliação do Legítimo Interesse (LIA) | R$ 2.604,00
[13.1.5] Elaboração do Plano de Atendimento aos titulares de dados | R$ 4.557,00
[13.1.6] Elaboração do Plano de Resposta a Incidentes com Dados Pessoais | R$ 6.510,00
[13.1.7] Suporte e orientação para aplicação do Privacy by Design, por produto, serviço ou solução | R$ 4.557,00
[13.1.8] Elaboração do Programa de Governança em Proteção de Dados Pessoais | R$ 10.416,00
[13.1.9] Elaboração de Termo de Consentimento (padrão, dados sensíveis, dados de crianças e adolescentes e idosos) (valor por termo) | R$ 1.400,00
[13.1.10] Avaliação do Legítimo Interesse (LIA) | R$ 2.604,00
[13.1.11] Avaliação do Legítimo Interesse (LIA) | R$ 2.604,00
[13.1.12] Avaliação do Legítimo Interesse (LIA) | R$ 2.604,00
[13.1.13] Avaliação do Legítimo Interesse (LIA) | R$ 2.604,00
[13.1.14] Avaliação do Legítimo Interesse (LIA) | R$ 2.604,00
[13.2.1] Termos de uso de site | R$ 1.288,67
[13.2.2] Termo de uso de software e/ou aplica- tivo | R$ 1.288,67
[13.2.3] Termo de políticas de privacidade | R$ 3.216,44
[13.2.4] Termo de autorização de uso de ima- gem | R$ 1.288,67
[13.3.1] Contrato de desenvolvimento de sof- tware | 3.0%
[13.3.2] Contrato de desenvolvimento de we- bsite | 3.0%
[13.3.3] Contrato de desenvolvimento de apli- cativo | 3.0%
[13.3.4] Contrato de fornecimento de tecnolo- gia | 3.0%
[13.3.5] Contrato de cessão de uso de tec- nologia e/ou software | 3.0%
[13.3.6] Contrato de cessão de tecnologia e/ ou software | 3.0%
[13.3.7] Contrato de cooperação tecnológica | 3.0%
[13.3.3] Contrato de escrow (código-fonte) | 5.0%
[13.4.1] Contrato de marketing digital | 3.0%
[13.4.2] Contrato de gestão de tráfego | 3.0%
[13.4.3] Contrato de social média/gestão de mídias sociais | 3.0%
[13.4.4] Contrato de copywriting | 3.0%
[13.4.5] Contrato de criação de branding | 3.0%
[13.4.6] Contrato de parceria para lançamen- to de produto digital | 3.0%
[13.4.7] Contrato de agenciamento de digital influencer | 3.0%
[13.5.1] Ação de desbloqueio e/ou reativação de conta digital | 20.0%
[13.5.2] Ação de desbloqueio e/ou reativa- ção de conta em marketplace | 20.0%
[13.5.3] Ação para remoção de conteúdo online | 20.0%
[13.5.4] Ação para identificação de usuário em plataforma digital | 20.0%
[13.5.5] Defesas judiciais e administrativas em ações relacionadas a direito digital | 20.0%

## Direito Eleitoral
[14.1] Representação Eleitoral, Ação de Investigação Judicial Eleitoral, Ação de Impugnação de Mandato Eletivo ou Ação de Impugnação de Registro de Candidatura | R$ 10.277,94
[14.2] Ação cautelar eleitoral antecedente | R$ 8.601,62
[14.3] Mandado de Segurança | R$ 8.601,62
[14.4] Habeas Corpus | R$ 8.601,62
[14.5] Defesa perante o juízo eleitoral | R$ 8.601,62
[14.6] Defesa perante ao TRE | R$ 17.025,13
[14.7] Defesa perante ao TSE | R$ 25.521,97
[14.8] Prestação de contas | R$ 10.277,94
[14.9] Ação de decretação de perda de mandato eletivo por infidelidade par- tidária e/ou reconhecimento de justa causa para desfiliação | R$ 10.634,16
[14.10] Consultoria e assessoramento jurídico mensal de partidos políticos (diretó- rios estaduais) | 15.0%
[14.11] Assessoramento jurídico mensal do período da pré-campanha às conven- ções | R$ 10.634,16

## Direito Empresarial
[15.1] Assessoria na elaboração de contrato de franquia | 3.0%
[15.2] Ação revocatória | 5.0%
[15.3.1] Requerida pelo devedor (autofalên- cia) quanto pelo Credor, sobre o valor do crédito – ME/EPP | 3.0%
[15.3.2] Requerida pelo devedor (autofalên- cia) quanto pelo credor, sobre o valor do crédito | 5.0%
[15.3.3] Pedido de destituição/substituição de administrador judicial | R$ 10.477,00
[15.4.1] Pedido e acompanhamento de recu- peração extrajudicial sobre o valor do passivo – ME/EPP | 3.0%
[15.4.2] Pedido e acompanhamento de recu- peração extrajudicial sobre o valor do passivo | 5.0%
[15.4.3] Elaboração e pedido de homologação de recuperação sobre o valor do pas- sivo | 3.0%
[15.5.1] Pedido e acompanhamento de re- cuperação judicial sobre o valor do passivo – ME/EPP | 5.0%
[15.5.2] Pedido e acompanhamento de re- cuperação judicial sobre o valor do passivo | 5.0%
[15.5.3] Pedido de destituição/substituição de administrador judicial | R$ 10.477,00
[15.6.1] Habilitação/divergência administra- tiva | 5.0%
[15.6.2] Habilitação/impugnação judicial (so- bre o valor do crédito) | 10.0%
[15.6.3] Ação de retificação, reclassificação ou exclusão de crédito (artigo 19 da Lei 11.101/05) | 10.0%
[15.6.4] Não impugnados, sobre o valor habili- tado | 10.0%
[15.6.5] Impugnados, sobre o valor habilitado | 15.0%
[15.6.6] Pedido de restituição de afins | 10.0%
[15.7.1] Ação de dissolução parcial ou total de sociedade | 5.0%
[15.7.2] Incidente de desconsideração de personalidade jurídica (pedido de defesa) | 5.0%
[15.7.3] Dissolução e liquidação de socieda- des – sobre rateio recebido | 10.0%
[15.7.4] Dissolução e liquidação de socieda- des – sobre o valor do passivo (não incluída defesa criminal) | 5.0%
[15.7.5] Ação de nulidade de assembleia ou reunião de sócios | R$ 4.253,66
[15.7.6] Ação de responsabilidade de adminis- trador societário | R$ 5.322,32
[15.7.7] Ação de anulação de constituição de pessoa jurídica | R$ 5.322,32
[15.7.8] Ação de exigir contas | R$ 5.322,32
[15.8.1] Memorando de entendimentos e/ou Letter Of Intentions | R$ 1.592,50
[15.8.2] Contrato social de sociedade LTDA | R$ 3.000,00
[15.8.3] Estatuto Societário | R$ 2.500,00
[15.8.4] Estatuto social de sociedade anônima e cooperativa | R$ 5.000,00
[15.8.5] Contrato social de sociedade com propósito específico | R$ 4.243,19
[15.8.6] Acordo de sócios e acordo de acio- nistas | R$ 4.243,19
[15.8.7] Acompanhamento de fusão e aquisi- ção | 3.0%
[15.8.8] Mutação societária | R$ 2.500,00
[15.9.1] Pedido de registro de marca | R$ 1.592,50
[15.9.2] Pedido de registro de patente | R$ 3.729,81
[15.9.3] Ação de nulidade de registro de marca | R$ 4.243,19
[15.9.4] Ação de nulidade de registro de pa- tente | R$ 6.370,02
[15.9.5] Contrato de autorização, licença e/ou uso | R$ 2.126,83

## Direito de Família
[16.1.1] Como patrono de ambas as partes | R$ 7.721,55
[16.1.2] Como patrono de uma das partes | R$ 4.598,36
[16.2.1] Como patrono de ambas as partes | 10.0%
[16.2.2] Como patrono de uma das partes | 10.0%
[16.3.1] Sem bens a serem partilhados | R$ 9.358,06
[16.3.2] Com bens a serem partilhados | R$ 9.588,55
[16.4.1] Como patrono de ambas as partes | R$ 3.687,90
[16.4.2] Como patrono de uma das partes | R$ 2.477,81
[16.5.1] Como patrono de ambas as partes | 5.0%
[16.5.2] Como patrono de uma das partes | 5.0%
[16.6.1] Como patrono de ambas as partes | R$ 6.442,31
[16.6.2] Como patrono de uma das partes | R$ 5.520,33
[16.7.1] Como patrono de ambas as partes | 10.0%
[16.7.2] Como patrono de uma das partes | 10.0%
[16.8.1] Sem bens a serem partilhados | R$ 8.770,30
[16.8.2] Com bens a serem partilhados e/ou guarda ou alimentos | 10.0%
[16.9.1] Como patrono de ambas as partes | R$ 3.860,77
[16.9.2] Como patrono de uma das partes | R$ 2.466,29
[16.10.1] Como patrono de ambas as partes | 10.0%
[16.10.2] Como patrono de uma das partes | 10.0%
[16.11.1] Como patrono de ambas as partes | R$ 4.598,36
[16.11.2] Como patrono de uma das partes | R$ 3.238,44
[16.12.1] Como patrono de ambas as partes | 10.0%
[16.12.2] Como patrono de uma das partes | 10.0%
[16.13.1] Sem bens a serem partilhados | R$ 5.520,33
[16.13.2] Com bens a serem partilhados e/ou guarda ou alimentos | 10.0%
[16.14.1] Como patrono de ambas as partes | R$ 6.350,11
[16.14.2] Como patrono de uma das partes | R$ 4.624,55
[16.15.1] Como patrono de ambas as partes | R$ 7.571,73
[16.15.2] Como patrono de uma das partes | R$ 6.061,99
[16.16.1] Sem bens a serem partilhados | R$ 7.571,73
[16.16.2] Com bens a serem partilhados e/ou guarda ou alimentos | 10.0%
[16.16.3] Reconvenção | 10.0%
[16.17.1] Como patrono de ambas as partes | R$ 4.480,00
[16.17.2] Como patrono de uma das partes | R$ 2.471,52
[16.18.1] Como patrono de ambas as partes | 5.0%
[16.18.2] Como patrono de uma das partes | 5.0%
[16.19.1] Provisórios (requeridos em caráter antecedente ou incidente) | 5.0%
[16.19.2] Ação de alimentos | R$ 4.218,04
[16.19.3] Defesa nas execuções de alimentos | R$ 2.535,43
[16.19.4] Revisão, exoneração, redução ou ma- joração | 10.0%
[16.19.5] Ação de oferta de alimentos | R$ 4.218,04
[16.20.1] Alimentos transitórios | 5.0%
[16.20.2] Alimentos compensatórios | 5.0%
[16.20.3] Defesa e acompanhamento | R$ 2.812,03
[16.21.1] Alimentícia | 10.0%
[16.21.2] Impugnação | R$ 4.679,03
[16.22.1] Habeas Corpus, relaxamento de pri- são por alimentos ou Mandado de Segurança | R$ 4.679,03
[16.23.1] Ação de guarda litigiosa | R$ 9.945,82
[16.23.2] Homologação de guarda | R$ 3.526,56
[16.23.3] Ação de alteração de guarda | R$ 9.945,82
[16.23.4] Defesa nas ações de guarda | R$ 9.945,82
[16.23.5] Conversão de guarda definitiva/pro- visória em adoção | R$ 6.905,39
[16.23.6] Ação de guarda litigiosa genitor(a) com residência fixa no exterior | R$ 11.467,08
[16.23.7] Ação de modificação de guarda geni- tor(a) com residência fixa no exterior | R$ 11.467,08
[16.23.8] Regulamentação de visitas | R$ 5.601,00
[16.24.1] Nulidade ou anulação de casamento e/ou ação de nulidade de atos jurídi- cos | R$ 1.178.977,00
[16.24.2] Restabelecimento da sociedade con- jugal | R$ 3.676,38
[16.24.3] Interdição | R$ 5.278,31
[16.24.4] Emancipação | R$ 3.203,87
[16.24.5] Acompanhamento para emancipação voluntária | R$ 1.571,55
[16.24.6] Emancipação judicial | R$ 3.203,87
[16.24.7] Suprimento de consentimento | R$ 2.593,06
[16.24.8] Busca e apreensão de menores inter- nacional-procedimento de repatria- ção | R$ 14.624,84
[16.24.9] Busca e apreensão de menores nacio- nal | R$ 7.018,54
[16.24.10] Ação judicial de alvará para venda judicial de bens de menores | R$ 5.266,79
[16.24.11] Retificação de registro cível | R$ 4.563,78
[16.24.12] Separação de corpos requerida em caráter antecedente | R$ 3.203,87
[16.24.13] Sequestro de bens requerida em cará- ter antecedente | R$ 4.794,28
[16.24.14] Ação de declaratória de danos morais por abandono afetivo e outros decor- rentes da relação de afeto | R$ 3.987,55
[16.24.15] Autorização judicial para viagens de menor | R$ 3.745,53
[16.24.16] Ação de suprimento de outorga | R$ 5.036,29
[16.24.17] Contrato de namoro | R$ 2.927,27
[16.24.18] Contrato/minuta de união estável | R$ 2.927,27
[16.24.19] Ação de reconhecimento de união estável post mortem | R$ 10.533,58
[16.24.20] Ação declaratória ou incidental de alienação parental | R$ 11.697,57
[16.24.21] Minuta de pacto antenupcial | R$ 9.358,06
[16.24.22] Composição pré-processual CEJUSC | R$ 3.710,95
[16.24.23] Audiência de conciliação | R$ 3.710,95
[16.24.24] Audiência de mediação | R$ 3.710,95
[16.24.25] Audiência de instrução | R$ 5.854,55
[16.24.26] Acompanhamento com oficial de jus- tiça para cumprimento de mandados com a presença de força policial em ações de busca e apreensão de meno- res | R$ 1.257,24
[16.24.27] Diligências junto ao oficial de justiça para o cumprimento de mandados | R$ 218,97
[16.24.28] Curatela litigiosa | R$ 8.182,54
[16.24.29] Tutela ou curatela (consensuais) | R$ 5.278,31
[16.24.30] Ação de exibição de contas na cura- tela (valor mensal de manutenção) | R$ 714,53
[16.24.31] Acompanhamento junto ao conselho tutelar para cliente prestar esclare- cimento sobre caso em observação pelo colegiado | R$ 1.257,24
[16.24.32] Acompanhamento junto à defensoria pública em sessões de conciliação/ mediação pré-processual de parte não assistida em material de família | R$ 1.257,24
[16.24.33] Contratos pós-nupciais | R$ 4.714,65
[16.24.34] Diligências para habilitação em casa- mento | R$ 1.571,55
[16.24.35] Diligências junto à detetive particular em matéria de família | R$ 523,85
[16.24.36] Investigação de paternidade/mater- nidade | R$ 7.084,55
[16.24.37] Investigação com petição de herança ou alimentos | 10.0%
[16.24.38] Reconhecimento de paternidade/ma- ternidade – via judicial | R$ 5.016,39
[16.24.39] Reconhecimento de paternidade/ma- ternidade – via administrativa | R$ 2.456,86
[16.24.40] Reconhecimento de paternidade/ma- ternidade – via administrativa | R$ 7.115,98
[16.24.41] Ação rescisória de reconhecimento de paternidade | R$ 7.115,98
[16.24.42] Pedido de medida protetiva em ação de família – lei 13.894/19 | R$ 5.016,39
[16.24.43] Ação de alteração de regime de bens com bens a serem partilhados | R$ 6.810,05
[16.24.44] Ação de alteração de regime de bens sem bens a serem partilhados | R$ 3.666,95

## Direito da Criança e do Adolescente
[17.1] Acompanhamento do adolescente em delegacia especializada – em horário diurno (das 07h às 19h) | R$ 1.791,57
[17.2] Acompanhamento do adolescente em delegacia especializada – em horário noturno (das 19h às 07h) | R$ 4.497,78
[17.3] Audiência de oitiva informal perante o Ministério Público (audiência do art. 179 do Estatuto da Criança e do Ado- lescente) | R$ 5.238,50
[17.4] Pedido de revogação de internação provisória | R$ 7.040,54
[17.5] Habeas Corpus no horário de expe- diente | R$ 14.238,24
[17.6] Habeas Corpus perante plantão | R$ 20.954,00
[17.7] Defesa técnica em execução de medi- das socioeducativas | R$ 7.040,54
[17.8] Acompanhamento da formulação do Plano Individual de Atendimento | R$ 7.040,54
[17.9] Impugnação ao Plano Individual de Atendimento | R$ 7.040,54
[17.10] Audiência de reavaliação de medida socioeducativa | R$ 7.040,54
[17.11] Defesa em procedimento de aplica- ção de sanção disciplinar a adoles- cente submetido a medida de interna- ção | R$ 7.040,54
[17.12] Pedido incidental (revogação, unifica- ção ou substituição de medida socio- educativa) | R$ 7.040,54
[17.13] Procedimentos relativos a ações co- letivas e outros procedimentos espe- ciais previstos no Estatuto da Criança e do Adolescente | R$ 14.982,11
[17.14] Representação de entidade em Ação civil Pública | R$ 5.992,84
[17.15] Defesa em procedimento relativo à imputação de irregularidades em en- tidades de atendimento e em proce- dimento relativo à aplicação de pena- lidades administrativas nos casos de infrações contra nor | R$ 2.692,59
[17.16.1] Ação de habilitação à adoção no SNA (Sistema Nacional de Adoção) | R$ 3.834,58
[17.16.2] Ação de adoção de criança e adoles- cente já destituído do poder familiar | R$ 5.793,78
[17.16.3] Ação de adoção de maior de 18 anos consensual | R$ 5.793,78
[17.16.4] Ação de adoção de maior de 18 anos litigiosa | R$ 7.323,42
[17.16.5] Adoção direta (art. 50, parágrafo 13, ECA) | R$ 5.793,78
[17.16.6] Adoção póstuma consensual | R$ 5.793,78
[17.16.7] Adoção póstuma litigiosa | R$ 7.323,42
[17.16.8] Conversão de guarda provisória em adoção consensual | R$ 4.473,68
[17.16.9] Adoção internacional de criança e adolescente residentes no Brasil (brasileiro residente exterior) | R$ 13.819,16
[17.16.10] Adoção internacional de criança e adolescente residentes em outro país signatário da Convenção de Haia (brasileiro residente no Brasil) | R$ 15.945,99
[17.16.11] Adoção internacional de criança e adolescente residentes no Brasil por pretendentes estrangeiros (Conven- ção de Haia) | R$ 15.945,99
[17.16.12] Destituição do poder familiar | R$ 4.452,73
[17.16.13] Acompanhamento como terceiro inte- ressado | R$ 3.195,49
[17.16.14] Ação de destituição do poder familiar c/c adoção | R$ 6.705,28

## Direito das Sucessões
[18.1] Inventário sem litígio, extrajudicial, sobre o monte mor ou quinhão de cada herdeiro e/ou meeira | 7.0%
[18.2] Inventário sem litígio, judicial, sobre o monte mor ou quinhão de cada her- deiro e/ou meeira | 9.0%
[18.3] Inventário com litígio, sobre o monte mor ou quinhão de cada herdeiro e/ou meeira | 10.0%
[18.4] Inventário negativo | R$ 4.452,73
[18.5] Reserva de bens requerida em caráter antecedente | 10.0%
[18.6] Remoção de inventariante | R$ 7.113,88
[18.7] Ação de colação | 10.0%
[18.8] Ação de doação inoficiosa | 10.0%
[18.9] Abertura de testamento ou codicilo | 10.0%
[18.10] Ação de nulidade de testamento | 10.0%
[18.11] Ação anulatória de testamento | 10.0%
[18.12] Ação de nulidade de partilha | R$ 10.665,59
[18.13] Ação de habilitação de herdeiros (sobre o valor habilitado) | 10.0%
[18.14] Ação de habilitação de crédito (sobre o valor habilitado) | 10.0%
[18.15] Ação declaratória de indignidade | 10.0%
[18.16] Ação declaratória de deserdação | 10.0%
[18.17] Retificação de partilha | 10.0%
[18.18] Ação de sonegados | 10.0%
[18.19] Ação de petição de herança | 10.0%
[18.20] Planejamento sucessório – holding familiar | 10.0%
[18.21] Ação de alvará para levantamento de valores e transferências de bens | 10.0%
[18.22] Ação de registro de óbito tardio | R$ 3.792,67
[18.23] Minuta de testamento e/ou assistên- cia ao ato e a abertura de testamento | 7.0%

## Direito Imobiliário e Urbanístico
[19.1.1] Ação de despejo | 10.0%
[19.1.2] Renovatória de locação | 10.0%
[19.1.3] Revisional e/ou arbitramento de aluguel | 10.0%
[19.1.4] Consignação de aluguel ou de chaves | 10.0%
[19.1.5] Adjudicação compulsória por ofensa direito de preferência | 5.0%
[19.1.6] Ato/acompanhamento de despejo e/ ou reintegração | R$ 2.126,83
[19.1.7] Pedido de restituição de depósito ou caução | 10.0%
[19.1.8] Notificação extrajudicial relacionada à locação | R$ 848,64
[19.2.1] Assessoria jurídica mensal simples (restringida à consultoria do condo- mínio) | R$ 1.047,70
[19.2.2] Assessoria jurídica mensal intermedi- ária (restringida à consultoria e as- sembleias, conforme contrato) | R$ 1.885,86
[19.2.3] Assessoria jurídica mensal abran- gente (consultoria em condomínio, comparecimento em assembleias, e representação judicial e extrajudicial do condomínio conforme contrato) | R$ 3.143,10
[19.2.4] Consulta jurídica pontual/presencial | R$ 628,62
[19.2.5] Representação em assembleias | R$ 890,55
[19.2.6] Confecção de ata de assembleia | R$ 523,85
[19.2.7] Elaboração de convenção ou Regi- mento Interno | R$ 5.238,50
[19.2.8] Alteração de Convenção ou Regimen- to Interno | R$ 3.666,95
[19.2.9] Elaboração de estatutos | R$ 4.714,65
[19.2.10] Elaboração de comunicados em geral | R$ 471,47
[19.2.11] Elaboração de contratos | R$ 3.143,10
[19.2.12] Revisão de contratos | R$ 1.309,63
[19.2.13] Parecer simples | R$ 1.519,17
[19.2.14] Parecer complexo | R$ 2.619,25
[19.2.15] Carta de advertência e/ou imposição de multa a condômino infrator | R$ 471,47
[19.2.16] Registro de contratos condominiais | R$ 1.309,63

## Direito Internacional
[20.1.1] Naturalização | R$ 12.760,00
[20.1.2] Cidadania originária | R$ 10.267,46
[20.1.3] Defesa contra a perda de nacionali- dade brasileira | R$ 39.100,16
[20.1.4] Pedido de reaquisição de nacionali- dade brasileira | R$ 7.941,57
[20.1.5] Pedido de reconhecimento a uma pes- soa à condição de apátrida | R$ 7.941,57
[20.1.6] Recurso inominado | R$ 20.472,06
[20.1.7] Defesa na expulsão, banimento e ex- tradição de estrangeiro no Brasil | R$ 17.748,04
[20.2.1] Administrador, gerente, diretor ou executivo com poderes de gestão para representar sociedade civil ou comercial, grupo ou conglomerado econômico (pessoa jurídica) | R$ 8.245,40
[20.2.2] Realização de investimento de pessoa física e empresa jurídica no país | R$ 8.245,40
[20.2.3] Fins de trabalho com vínculo empre- gatício no Brasil | R$ 4.892,76
[20.2.4] Prestação de serviços de assistência técnica (sem vínculo empregatício) | R$ 3.666,95
[20.2.5] Transferência de tecnologia (sem vín- culo empregatício) | R$ 3.666,95
[20.2.6] Demais autorizações de residência prévia, residência e/ou renovação | R$ 3.666,95
[20.2.7] Homologação de sentença estrangei- ra no Brasil perante o Superior Tribu- nal de Justiça (STJ) | R$ 11.000,85
[20.3.1] Cadastro Declaratório de Não Resi- dente (RDE-CDNR) | R$ 3.509,80
[20.3.2] Emissão de Registro Declaratório Eletrônico – Investimento Estrangeiro Direto (RDE–IED) | R$ 2.357,33
[20.3.3] Registro de eventos societários peran- te o SISBACEN | R$ 2.357,33
[20.4.1] Serviços junto à Polícia Federal – Imi- gração/Superintendência | R$ 817,21
[20.4.2] Agendamento e acompanhamento para emissão de Carteira de Registro Nacional Migratório (CRNM, antigo RNE), após a emissão da autorização de residência prévia, residência ou renovação pelo Ministério do | R$ 1.833,48
[20.4.3] Solicitação de refúgio | R$ 618,14
[20.5.1] Elaboração de contrato internacional | R$ 10.634,16
[20.5.2] Parecer sobre contrato internacional | R$ 5.322,32
[20.6.1] Requerimento de Revalidação de diploma de Graduação ou Pós-Gradu- ação Stricto Sensu em uma instituição pública de ensino superior no Brasil | R$ 3.666,95
[20.6.2] Recurso Administrativo em Revali- dação de diploma de Graduação ou Pós-Graduação Stricto Sensu em uma instituição pública de ensino superior no Brasil | R$ 3.666,95
[20.7.1] Elaboração de instrumento de consti- tuição/estatuto de sociedade limitada ou por ações com capital estrangeiro e/ou sócios estrangeiros, pessoas físi- cas ou jurídicas e/ou administradores estrangeir | R$ 12.226,66
[20.7.2] Alteração e consolidação de contrato social/estatuto de sociedade limitada ou por ações com capital estrangeiro e/ou sócios estrangeiros, pessoas físi- cas ou jurídicas e/ou administradores estrangeir | R$ 6.422,40
[20.7.3] Elaboração de ata de reunião de só- cios quotistas ou assembleia de acio- nistas | R$ 2.661,16
[20.7.4] Elaboração de ato constitutivo de empresa individual de sociedade limi- tada (EIRELI) cujo titular seja pessoa física ou jurídica estrangeira | R$ 3.666,95
[20.7.5] lteração e consolidação de ato consti- tutivo de empresa individual de socie- dade limitada (EIRELI) cujo titular seja pessoa física ou jurídica estrangeira | R$ 1.833,48

## Direito Penal
[21.1.1] Acompanhamento auto de prisão em flagrante (diurno) | R$ 2.043,02
[21.1.2] Acompanhamento auto de prisão em flagrante (noturno) | R$ 4.086,03
[21.1.3] Acompanhamento de inquérito poli- cial | R$ 6.286,20
[21.1.4] Investigação defensiva | R$ 9.429,30
[21.1.5] Apresentação do cliente ou testemu- nha ou vítima | R$ 2.043,02
[21.1.6] Representação criminal | R$ 3.500,00
[21.1.7] Delação ou colaboração premiada | 10.0%
[21.2.1] Rito comum ordinário | R$ 20.954,00
[21.2.2] Rito comum sumário | R$ 15.715,50
[21.2.3] Rito comum sumaríssimo | R$ 10.477,00
[21.2.4] Queixa-crime | R$ 15.715,50
[21.2.5] Rito Especial Júri - 1 fase – (até decisão pronúncia) | R$ 20.000,00
[21.2.6] Rito Especial Júri - 2 fase – (até a Sessão plenária) | R$ 20.000,00
[21.2.7] Rito Especial da Lei 11.343/06 – (Lei Tráfico) | R$ 15.715,50
[21.2.8] Rito da Lei 11.340/06 – (Lei Maria da Penha) | R$ 10.477,00
[21.2.9] Rito do ECA | R$ 10.477,00
[21.2.10] Processo Lei 12.850/2013 - (Lei de Organização Criminosa) | R$ 26.192,50
[21.2.11] Processo Lei 9.613/1998 – (Lei de Lavagem de Dinheiro) | R$ 26.192,50
[21.2.12] Processo da Lei 8.137/1990 | R$ 26.192,50
[21.2.13] Processo Lei 960/1998 – (Lei de Crimes Ambientais) | R$ 26.192,50
[21.2.14] Processo de crimes eleitorais | R$ 26.192,50
[21.3.1] Recurso em sentido estrito | R$ 10.477,00
[21.3.2] Recurso de apelação | R$ 10.477,00
[21.3.3] Embargos de declaração | R$ 4.190,80
[21.3.4] Embargos infringentes | R$ 4.190,80
[21.3.5] Carta testemunhável | R$ 4.190,80
[21.3.6] Correição parcial | R$ 4.190,80
[21.3.7] Revisão criminal | R$ 15.715,50
[21.3.8] Agravo em execução penal | R$ 8.381,60
[21.4.1] Recurso ordinário em Habeas Corpus | R$ 15.715,50
[21.4.2] Recurso ordinário em Mandado de Segurança em matéria criminal | R$ 15.715,50
[21.4.3] Recurso Especial | R$ 15.715,50
[21.4.4] Recurso Extraordinário | R$ 15.715,50
[21.4.5] Reclamação na esfera penal | R$ 10.477,00
[21.5.1] Pedido de revogação de prisão | R$ 5.238,50
[21.5.2] Pedido de relaxamento de prisão | R$ 5.238,50
[21.5.3] Pedido fiança criminal | R$ 3.352,64
[21.5.4] Audiência de custódia | R$ 4.700,00
[21.5.5] Acordo de não persecução penal | R$ 5.238,50
[21.5.6] Habeas Corpus perante Juízo Singular | R$ 5.238,50
[21.5.7] Habeas Corpus perante Tribunais | R$ 7.333,90
[21.5.8] Habeas Corpus perante Tribunais Su- periores | R$ 12.572,40
[21.5.9] Mandado de Segurança em matéria criminal | R$ 7.333,90
[21.6.1] Transação Penal | R$ 3.000,00
[21.6.2] Suspensão condicional do processo | R$ 3.000,00
[21.6.3] Suspensão condicional da pena | R$ 3.000,00
[21.7.1] Visita em presídio | R$ 838,16
[21.7.2] Progressão de regime | R$ 3.143,10
[21.7.3] Livramento condicional | R$ 3.143,10
[21.7.4] Insanidade mental do acusado | R$ 3.143,10
[21.7.5] Reabilitação criminal | R$ 3.143,10
[21.7.6] Defesa em PAD | R$ 5.238,50
[21.8.1] Consulta – presencial | R$ 500,00
[21.8.2] Consulta – virtual | R$ 300,00
[21.8.3] Parecer | R$ 5.238,50
[21.9.1] Perante Tribunais | R$ 3.143,10
[21.9.2] Perante Tribunais Superiores | R$ 5.238,50
[21.10.1] Rito comum ordinário | R$ 10.477,00
[21.10.2] Rito comum sumário | R$ 8.381,60
[21.10.3] Rito Comum sumaríssimo | R$ 5.238,50
[21.10.4] Rito Especial Júri – 1 fase | R$ 15.715,50
[21.10.5] Rito Especial Júri – 2 fase | R$ 15.715,50

## Direito Militar
[22.1] Promoção Militar | R$ 4.000,00
[22.2] Ficha de Apuração Disciplinar (FATD) | R$ 2.000,00
[22.3] Sindicância Militar | R$ 7.000,00
[22.4] Conselho de Disciplina | R$ 8.000,00
[22.5] Conselho de Justificação | R$ 10.000,00
[22.6] Diligências e Despachos | R$ 800,00
[22.7] Acompanhamento do militar | R$ 1.500,00
[22.8] Promoção Militar | 30.0%
[22.9] Atuação em inquérito policial militar | R$ 9.500,00
[22.10] Ato Judicial | R$ 4.700,00
[22.11] Atos em órgãos policiais (07:00h as 19:00h) | R$ 3.500,00
[22.12] Atos em órgãos policiais (19:00h as 07:00h) | R$ 4.800,00
[22.13] Exame de processo penal militar com parecer verbal | R$ 5.500,00
[22.14] Defesa em procedimento comum | R$ 14.500,00
[22.15] Defesa em procedimentos especiais | R$ 20.000,00
[22.16] Assistência a acusação | R$ 14.500,00
[22.17] Atuação em processo de execução penal | R$ 12.115,00
[22.18] Apelação | R$ 10.500,00
[22.19] Elaboração e Apresentação de Memoriais | R$ 5.300,00
[22.20] Sustentação Oral | R$ 6.000,00
[22.21] Embargos Infringentes | R$ 5.270,00
[22.22] Embargos Declaratórios | R$ 4.500,00
[22.23] Correição Parcial (Razões e Contrarrazões) | R$ 5.270,00
[22.24] Recurso em sentido estrito(Razões e Contrarrazões) | R$ 5.270,00
[22.25] Reclamação | R$ 5.300,00
[22.26] Revisão | R$ 5.300,00
[22.27] Atuação em processo de competência originária no Tribunal | R$ 15.000,00
[22.28] Reintegração do Militar na esfera Estadual | 30.0%
[22.29] Reintegração do Militar na esfera Federal | 30.0%
[22.30] Reforma Militar Estadual | 30.0%
[22.31] Reforma Militar Federal | 30.0%
[22.32] Incapacidade do Militar Estadual ou Federal | 30.0%

## Direito Municipalista
[23.1.1] Municípios até 5 mil habitantes | R$ 10.120,78
[23.1.2] Municípios de 5 mil a 15 mil habitantes | R$ 12.017,12
[23.1.3] Municípios de 15 mil a 40 mil habitan- tes | R$ 16.448,89
[23.1.4] Municípios de 40 mil a 60 mil habitan- tes | R$ 18.973,85
[23.1.5] Municípios de acima 60 mil habitantes | R$ 22.777,00
[23.2.1] Municípios até 5 mil habitantes | R$ 6.328,11
[23.2.2] Municípios de 5 mil a 15 mil habitantes | R$ 8.863,54
[23.2.3] Municípios de 15 mil a 40 mil habitan- tes | R$ 10.120,78
[23.2.4] Municípios de 40 mil a 60 mil habitan- tes | R$ 15.181,17
[23.2.5] Municípios de acima 60 mil habitantes | R$ 20.241,56
[23.3.1] Municípios até 5 mil habitantes | R$ 6.328,11
[23.3.2] Municípios de 5 mil a 15 mil habitantes | R$ 8.863,54
[23.3.3] Municípios de 15 mil a 40 mil habitan- tes | R$ 10.120,78
[23.3.4] Municípios de 40 mil a 60 mil habitan- tes | R$ 15.181,17
[23.3.5] Municípios de acima 60 mil habitantes | R$ 20.241,56
[23.4.1] Municípios até 5 mil habitantes | R$ 6.328,11
[23.4.2] Municípios de 5 mil a 15 mil habitantes | R$ 8.224,45
[23.4.3] Municípios de 15 mil a 40 mil habitan- tes | R$ 10.120,78
[23.4.4] Municípios de 40 mil a 60 mil habitan- tes | R$ 14.552,55
[23.4.5] Municípios de acima 60 mil habitantes | R$ 18.973,85
[23.5.1] Municípios até 5 mil habitantes | R$ 10.120,78
[23.5.2] Municípios de 5 mil a 15 mil habitantes | R$ 12.017,12
[23.5.3] Municípios de 15 mil a 40 mil habitan- tes | R$ 16.448,89
[23.5.4] Municípios de 40 mil a 60 mil habitan- tes | R$ 18.973,85
[23.5.5] Municípios de acima 60 mil habitantes | R$ 22.777,00
[23.6.1] Municípios até 5 mil habitantes | R$ 6.328,11
[23.6.2] Municípios de 5 mil a 15 mil habitantes | R$ 8.863,54
[23.6.3] Municípios de 15 mil a 40 mil habitan- tes | R$ 10.120,78
[23.6.4] Municípios de 40 mil a 60 mil habitan- tes | R$ 15.181,17
[23.6.5] Municípios de acima 60 mil habitantes | R$ 20.241,56
[23.7.1] Municípios até 5 mil habitantes | R$ 10.120,78
[23.7.2] Municípios de 5 mil a 15 mil habitantes | R$ 15.181,17
[23.7.3] Municípios de 15 mil a 40 mil habitan- tes | R$ 18.973,85
[23.7.4] Municípios de 40 mil a 60 mil habitan- tes | R$ 21.509,28
[23.7.5] Municípios de acima 60 mil habitantes | R$ 25.301,96
[23.8.1] Municípios até 5 mil habitantes | R$ 5.060,39
[23.8.2] Municípios de 5 mil a 15 mil habitantes | R$ 6.705,28
[23.8.3] Municípios de 15 mil a 40 mil habitan- tes | R$ 9.492,16
[23.8.4] Municípios de 40 mil a 60 mil habitan- tes | R$ 10.759,88
[23.8.5] Municípios de acima 60 mil habitantes | R$ 10.560,82
[23.9.1] Municípios até 5 mil habitantes | R$ 10.120,78
[23.9.2] Municípios de 5 mil a 15 mil habitantes | R$ 11.828,53
[23.9.3] Municípios de 15 mil a 40 mil habitan- tes | R$ 15.181,17
[23.9.4] Municípios de 40 mil a 60 mil habitan- tes | R$ 18.973,85
[23.9.5] Municípios de acima 60 mil habitantes | R$ 25.301,96
[23.10.1] Em causas até o valor de R$ 50.000,00 | R$ 5.605,20
[23.10.2] Em causas até o valor de R$ 100.000,00 | R$ 10.099,83
[23.10.3] Em causas até o valor de R$ 250.000,00 | R$ 11.220,87
[23.10.4] Em causas até o valor de R$ 500.000,00 | R$ 16.826,06
[23.10.5] Em causas até o valor de R$ 1.000.000,00 | R$ 33.641,65
[23.11.1] Pareceres em geral | R$ 10.120,78
[23.11.2] Assessoramento e consultoria em pro- cedimentos administrativos em geral | R$ 10.120,78
[23.12.1] Composta por 09 vereadores | R$ 6.328,11
[23.12.2] Composta por 11 vereadores | R$ 10.120,78
[23.12.3] Composta por 13 vereadores | R$ 12.656,22
[23.12.4] Composta por 15 vereadores | R$ 15.181,17
[23.12.5] Composta por 17 vereadores | R$ 17.716,61
[23.12.6] Composta por 19 vereadores | R$ 20.241,56
[23.12.7] Composta por 21 vereadores | R$ 22.777,00
[23.12.8] Composta por 23 ou mais vereadores | R$ 25.301,96
[23.13.1] Composta por 09 vereadores | R$ 6.328,11
[23.13.2] Composta por 11 vereadores | R$ 10.120,78
[23.13.3] Composta por 13 vereadores | R$ 12.656,22
[23.13.4] Composta por 15 vereadores | R$ 15.181,17
[23.13.5] Composta por 17 vereadores | R$ 17.716,61
[23.13.6] Composta por 19 vereadores | R$ 20.241,56
[23.13.7] Composta por 21 vereadores | R$ 22.777,00
[23.13.8] Composta por 23 ou mais vereadores | R$ 25.301,96
[23.14.1] Composta por 09 vereadores | R$ 6.328,11
[23.14.2] Composta por 11 vereadores | R$ 10.120,78
[23.14.3] Composta por 13 vereadores | R$ 12.656,22
[23.14.4] Composta por 15 vereadores | R$ 15.181,17
[23.14.5] Composta por 17 vereadores | R$ 17.716,61
[23.14.6] Composta por 19 vereadores | R$ 20.241,56
[23.14.7] Composta por 21 vereadores | R$ 22.777,00
[23.14.8] Composta por 23 ou mais vereadores | R$ 25.301,96
[23.15.1] Composta por até 15 vereadores | R$ 10.120,78
[23.15.2] Composta por até 19 vereadores | R$ 15.181,17
[23.15.3] Composta por até 21 vereadores | R$ 17.077,51
[23.16.1] Composta por até 15 vereadores | R$ 15.181,17
[23.16.2] Composta por até 19 vereadores | R$ 20.241,56
[23.16.3] Composta por até 21 vereadores | R$ 24.673,34
[23.17.1] a) Composta por 09 vereadores | R$ 6.328,11
[23.17.2] b) Composta por 11 vereadores | R$ 10.120,78
[23.17.3] c) Composta por 13 vereadores | R$ 12.656,22
[23.17.4] d) Composta por 15 vereadores | R$ 15.181,17
[23.17.5] e) Composta por 17 vereadores | R$ 17.716,61
[23.17.6] f) Composta por 19 vereadores | R$ 20.241,56
[23.17.7] g) Composta por 21 vereadores | R$ 22.777,00
[23.17.8] h) Composta por 23 ou mais vereadores | R$ 25.301,96

## Direito do Trabalho
[24.1.1] Patrocínio do Reclamante/Recla- mado, sobre o valor do acordo ou da condenação | R$ 3.680,00
[24.2.1] Com até 500 empregados | 20.0%
[24.2.2] Entre 500 e 1.000 empregados | 20.0%
[24.2.3] Acima de 1.000 empregados | 20.0%
[24.2.4] Representação em dissídio coletivo de natureza jurídica | R$ 11.199,91
[24.3.1] Agravo de instrumento | 10.0%
[24.3.2] Contraminuta de agravo de instru- mento | 10.0%
[24.3.3] Agravo de petição | 10.0%
[24.3.4] Contraminuta de agravo de petição | 10.0%
[24.3.4] Recursos ordinários | 10.0%
[24.3.6] Recurso de revista | 10.0%
[24.3.7] Contrarrazões de recursos ordinários | 10.0%
[24.3.8] Recurso Extraordinário | 10.0%
[24.3.9] Contrarrazões de Recurso Extraordi- nário | 10.0%
[24.3.10] Agravo contra despacho denegatório de seguimento de Recurso Extraordi- nário | 10.0%
[24.3.11] Contrarrazões de agravo contra des- pacho denegatório de seguimento de Recurso Extraordinário | 10.0%
[24.4.1] Elaboração de petição inicial | R$ 1.707,75
[24.4.2] Elaboração de defesa | R$ 1.707,75
[24.4.3] Acompanhamento de homologação de rescisão contratual | R$ 1.880,00
[24.4.4] Comparecimento a audiência inaugu- ral (presencial ou virtual) | R$ 1.880,00
[24.4.5] Comparecimento a audiência de ins- trução (presencial ou virtual) | R$ 1.912,05
[24.4.6] Comparecimento a audiência de con- ciliação (presencial ou virtual) | R$ 1.880,00
[24.4.7] Comparecimento a audiência de en- cerramento de instrução (presencial ou virtual) | R$ 1.880,00
[24.4.8] Embargos de devedor | 10.0%
[24.4.9] Embargos de terceiros | 10.0%
[24.4.10] Embargos de declaração | R$ 2.790,00
[24.4.11] Execução | 10.0%
[24.4.12] Pareceres escritos em geral | R$ 4.505,11
[24.4.13] Ação rescisória trabalhista | 15.0%
[24.4.14] Contestação de ação rescisória | 10.0%
[24.4.15] Ação de reintegração de empregado (sob o proveito econômico) | 15.0%
[24.4.16] Inquérito para apuração de falta grave | R$ 3.824,11
[24.4.17] Sustentação oral (presencial ou virtual) | R$ 3.856,00
[24.4.18] Acompanhamento no TRT | R$ 1.917,29
[24.4.19] Elaboração de memoriais | R$ 1.602,98
[24.4.20] Apresentação de cálculos | R$ 1.707,75
[24.4.21] Impugnação de cálculos | R$ 1.707,75
[24.4.22] Mandado de Segurança | R$ 3.824,11
[24.4.23] Resposta ao Mandado de Segurança | R$ 3.824,11
[24.4.24] Ação cautelar (requerida em caráter antecedente) | R$ 3.824,11
[24.4.25] Contestação de ação cautelar | R$ 3.824,11
[24.4.26] Petição interlocutória | R$ 450,51
[24.5.1] Elaboração de estatuto | R$ 14.929,73
[24.5.2] Confecção de edital | R$ 3.740,29
[24.5.3] Assessoria presencial em assembleia (a hora) | R$ 754,34
[24.5.4] Registro do sindicato no MP (sem im- pugnação) | R$ 3.740,29
[24.5.5] Registro do sindicato no MP (com im- pugnação) | R$ 7.470,10
[24.5.6] Impugnação de registro sindical | R$ 3.740,29
[24.6.1] Participações ou assessoria em as- sembleia da categoria – no domicílio do profissional (a hora) | R$ 534,33
[24.6.2] Participações ou assessoria em as- sembleia da categoria – fora do domi- cílio do profissional (a hora) | R$ 743,87
[24.6.3] Assessoria ou participação de reunião de diretoria e conselho ou outros ór- gãos internos – no domicílio do profis- sional (a hora) | R$ 534,33
[24.6.4] Assessoria ou participação de reu- nião de diretoria e conselho ou outros órgãos internos – fora do domicílio do profissional (a hora) | R$ 764,82
[24.7.1] Elaboração de regimento ou regula- mento eleitoral | R$ 7.501,53
[24.7.2] Elaboração de edital | R$ 764,82
[24.7.3] Integrar como membro da comissão eleitoral | R$ 7.501,53
[24.7.4] Integrar como presidente da comis- são eleitoral | R$ 15.024,02
[24.7.5] Assessoria de comissão eleitoral (a hora) | R$ 534,33
[24.7.6] Impugnação de chapas ou candidatos eleitorais | R$ 1.613,46
[24.7.7] Impugnação de resultado de eleições e associações | R$ 4.127,94
[24.7.8] Consultas a diretores e/ou outros de matéria sindical | R$ 754,34
[24.7.9] Assessoria em processos disciplina- res, em geral, para aplicar penalidade a diretor ou associado – atuação no polo ativo | R$ 3.761,24
[24.7.10] Assessoria em processos disciplina- res, em geral, para aplicar penalidade a diretor ou associado – atuação no polo passivo | R$ 7.512,01
[24.7.11] Mensalidades sindicais não consigna- das em folha – cobrança extrajudicial (cumulativo) | 10.0%
[24.7.12] Mensalidades sindicais não consig- nadas em folha – cobrança judicial (cumulativo) | 15.0%
[24.7.13] Contribuição sindical anual não con- signada – cobrança extrajudicial | 10.0%
[24.7.14] Contribuição sindical anual não con- signada – cobrança judicial | 15.0%
[24.7.15] Contribuição sindicai anu ai consig- nada em folha – cobrança extrajudi- cial | 10.0%
[24.7.16] Contribuição sindical anual consigna- da em folha – cobrança extrajudicial | 15.0%
[24.7.17] Consultoria, sem vínculo empregatí- cio, a sindicatos de trabalhadores – com até 500 empregados | R$ 4.054,60
[24.7.18] Consultoria, sem vínculo empregatí- cio, a sindicatos de trabalhadores – entre 500 e 1.000 empregados | R$ 6.160,48
[24.7.19] Consultoria, sem vínculo empregatí- cio, a sindicatos de trabalhadores – acima de 1.000 empregados | R$ 7.512,01
[24.7.20] Consultoria, sem vínculo empregatí- cio, a sindicatos de empresas – com até 10 empresas associadas | R$ 8.402,55

## Direito Tributário
[25.1.1] Honorários iniciais sobre o valor eco- nômico real da causa | 5.0%
[25.1.2] Honorários finais sobre o benefício | 10.0%
[25.2.1] Honorários iniciais sobre o valor eco- nômico real da causa | 5.0%
[25.2.2] Honorários finais sobre o benefício | 10.0%
[25.3.1] Honorários iniciais sobre o valor eco- nômico real da causa | 5.0%
[25.3.2] Honorários finais sobre o benefício | 10.0%
[25.4.1] Sobre o valor dos bens | 5.0%
[25.5.1] Honorários iniciais sobre o valor eco- nômico real da causa | 5.0%
[25.5.2] Honorários finais sobre o benefício | 10.0%
[25.6.1] Parecer sobre interpretação de nor- mas tributárias, planejamento tribu- tário ou qualquer tipo de lançamento realizado contra o interessado pelo fisco | R$ 6.800,00
[25.7.1] Micro e pequena empresa / SIMPLES | R$ 2.724,02
[25.7.2] Ltda./LUCRO PRESUMIDO | R$ 5.448,04
[25.7.3] S.A/LUCRO REAL | R$ 8.172,06
[25.7.4] Demais entidades (ex: cooperativas, sociedades civis, etc.) | R$ 4.086,03

## Direito Previdenciário
[26.1.2] Consulta Jurídica seja presencial, por mensagens de aplicativos ou e-mail. | R$ 758,00
[26.1.3] Consulta por vídeo conferência ou em condições excepcionais, com exame de documentos. | R$ 758,00
[26.1.4] Concessão de Salário Maternidade.(30% do proveito econômico) | 30.0% | OBS: Acrescentar percentual de 10% na fase recursal.
[26.1.5] Procedimento de Justificação Administrativa | R$ 4.548,00
[26.1.6] Retificação e atualização cadastral do Cadastro Nacional de Informações Sociais – CNIS | R$ 2.000,00
[26.1.7] Planejamento previdenciário com parecer, cálculos de tempo de contribuição e simulações de RMI/RMA presentes e futuras. | R$ 4.548,00
[26.1.8] Cálculo de contagem de tempo de contribuição tomando como referência o CNIS e documentos particulares do segurado. | R$ 758,00
[26.1.10] Parecer jurídico solicitado por entidades sindicais, associações, gestores de regimes previdenciários e outras pessoas jurídicas. | R$ 4.548,00
[26.1.11] Defesa administrativa para evitar suspensão do benefício previdenciário ou assistencial. | R$ 6.064,00
[26.1.12] Pedido de prestações de parcelas não recebidas. | 30.0%
[26.1.13] Sustentação oral perante órgãos recursais, administrativos desvinculada do êxito do processo administrativo. | R$ 1.518,00
[26.1.14] Recurso administrativo para Junta de Recurso INSS. | 30.0%
[26.1.15] Agendamento de Prorrogação do Benefício. | R$ 758,00
[26.1.16] Aposentadoria pessoa com Deficiência por Idade - 30% proveito econômico vencidas + 30% de 12 vincendas | 30.0%
[26.1.17] Cumprimento de Exigência. | R$ 1.518,00
[26.1.18] Diligências Cartorárias – Certidões, Inteiro Teor, Secretaria de Segurança Pública. | R$ 1.518,00
[26.1.19] Aposentadoria por Idade (até 30% do valor do benefício financeiro obtido + equivalente a 30% 12 meses de parcelas vincendas, garantindo o mínimo de | 30.0%
[26.1.20] Aposentadoria por Idade – Trabalhador Rural (30% do valor do benefício financeiro obtido + equivalente a 30% referente a 12 meses de parcelas vincendas garantindo mínimo de | 30.0%
[26.1.21] Aposentadoria por Tempo de Contribuição (30% do valor do benefício financeiro obtido + equivalente a 30% referente a 12 meses de parcelas vincendas garantindo mínimo de | 30.0%
[26.1.22] Aposentadoria Especial (30% do valor do benefício financeiro obtido + equivalente a 30% referente a 12 meses de parcelas vincendas | 30.0%
[26.1.23] Aposentadoria por Invalidez (30% do valor do benefício financeiro obtido + equivalente a 30% referente a 12 meses de parcelas vincendas | 30.0%
[26.1.24] Auxílio-Doença (30% do valor do benefício financeiro obtido + equivalente a 30% referente as parcelas compreendidas até a data da DCB prevista | 15.0%
[26.1.25] Auxílio Acidente (30% do valor do benefício financeiro obtido + equivalente a 30 referente a 12 meses de parcelas vincendas | 30.0%
[26.1.26] Pensão por Morte (30% do valor do benefício financeiro obtido + equivalente a 30 referente a 12 meses de parcelas vincendas | 30.0%
[26.1.27] Auxilio Reclusão (30% do valor do benefício financeiro obtido + equivalente a 30 referente a 12 meses de parcelas vincendas | 30.0%
[26.1.28] Concessão de Benefícios Assistenciais (30% do valor do benefício financeiro obtido + equivalente a 30 referente a 12 meses de parcelas vincendas | 30.0%
[26.1.29] Expedição de certidão de tempo de serviço/contribuição | R$ 5.500,00
[26.1.30] Justificativa de tempo de serviço | R$ 5.500,00
[26.1.4] Recurso Administrativo (acrescentar percentual de 10% sobre o valor originariamente pactuado) | 10.0% | OBS: Acrescentar percentual de 10% na fase recursal.
[26.1.4] Na hipótese do advogado atuar a partir da interposição do recurso, até 25% do equivalente a 12 meses do proveito econômico | 25.0% | OBS: Acrescentar percentual de 10% na fase recursal.
[26.2.1] Audiência de Conciliação. | R$ 2.000,00
[26.2.2] Audiência de Instrução e Julgamento. | R$ 3.000,00
[26.2.3] Aposentadoria pessoa com Deficiência por Idade  - 30% proveito economico - 30% sobre as vencidas + 30% de 12 vicendas | R$ 12.751,20
[26.2.4] Ação para requerer expedição de Certidão de Tempo de Contribuição. | R$ 6.072,00
[26.2.5] Ação ou contestação visando a manutenção de benefício previdenciário. | R$ 6.072,00
[26.2.6] Ação visando a restituição de valores indevidamente cobrados e/ou declaração de inexigibilidade dos valores cobrados pelo gestor do regime previdenciário, inclusive no caso de benefício de prestação c | R$ 6.072,00
[26.2.7] Mandado de injunção, habeas data individual e Mandado de segurança individual. | R$ 6.072,00
[26.2.8] Ação Rescisória | R$ 6.072,00
[26.2.9] Sustentação Oral | R$ 2.000,00
[26.2.10] Ações Coletivas | R$ 6.072,00
[26.2.11] Atuação somente a partir da Turma Recursal - 30% proveito econômico | 30.0%
[26.2.12] Aposentadoria por Idade (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses, garantido o mínimo) | 30.0%
[26.2.13] Aposentadoria por Idade – Trabalhador Rural (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses, | 30.0%
[26.2.14] Aposentadoria por Tempo de Contribuição (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses | 30.0%
[26.2.15] Aposentadoria Especial (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses | 30.0%
[26.2.16] Aposentadoria por Invalidez (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses | 30.0%
[26.2.17] Auxilio Doença até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após até a DCB do benefício, limitado a 12 meses | 30.0%
[26.2.18] Aposentadoria por Invalidez; auxílio-doença ou auxílio acidente decorrente de acidente do trabalho (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após até  | 30.0%
[26.2.19] Pensão por Morte (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses | 30.0%
[26.2.20] Auxílio Reclusão (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses. | 30.0%
[26.2.21] Salário maternidade: até 30% do êxito, garantido o mínimo | 30.0%
[26.3.1] Ação por erro no Cálculo (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses | R$ 6.072,00
[26.3.2] Ação por erro Material (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses | R$ 12.751,20
[26.3.3] Ação de concessão de benefício assistencial (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses | R$ 12.751,20
[26.3.4] Ação de reconhecimento de tempo de serviço/contribuição | R$ 6.072,00
[26.3.5] Atuação em Fase Recursal (acrescentar percentual de 10% sobre o valor originariamente pactuado | R$ 6.072,00 | OBS: Acrescentar percentual na fase recursal conforme tabela.

## Direito da Saúde
[27.1.1] Assessoria para elaboração de relató- rio médico circunstanciado | R$ 800,00
[27.1.2] Assessoria para elaboração de laudo pericial | R$ 1.728,71
[27.1.3] Assessoria mensal consultiva para consultórios | R$ 2.242,08
[27.1.4] Assessoria mensal consultiva para clínicas | R$ 3.363,12
[27.1.5] Assessoria mensal consultiva para hospitais e empresas de saúde (coo- perativas e/ou sociedades em grupo) | R$ 4.372,05
[27.1.6] Assessoria mensal consultiva para operadora de saúde sem dedicação exclusiva | R$ 6.558,08
[27.1.7] Assessoria total para operadora de saúde com dedicação exclusiva | R$ 13.116,16
[27.1.8] Diligências avulsas para acompanha- mento do cliente perante órgãos regu- latórios (por ato) | R$ 1.728,71
[27.1.9] Defesa/impugnação de autos e/ou manifestação perante órgãos regula- tórios | 20.0%
[27.2.1] Ação de tutela antecipada requerida em caráter antecedente | 10.0%
[27.2.2] Aditamento da tutela antecipada com pedido de tutela final | 10.0%
[27.2.3] Ação de obrigação de fazer | 10.0%
[27.2.4] Ação de Mandado de Segurança (acesso a medicamentos, tratamen- tos, regulação e assuntos afins) | 10.0%
[27.2.5] Ação de Mandado de Segurança envolvendo sanção ético-disciplinar, exceto cassação do exercício profis- sional | R$ 6.286,20
[27.2.6] Ação de Mandado de Segurança en- volvendo sanção ético-disciplinar de cassação do exercício profissional | R$ 15.715,50
[27.2.7] Propositura de ação de responsabi- lidade civil (erro médico e assuntos afins) | 30.0%
[27.2.8] Defesa em ação de responsabilidade civil | 20.0%
[27.2.9] Ação de cobrança/ressarcimento de despesas médico-hospitalares | 20.0%
[27.3.1] Manifestação prévia do denunciado em sindicância | R$ 2.388,76
[27.3.2] Representação do denunciado em processo ético-profissional (por pro- fissional) | R$ 7.166,27
[27.3.3] Representação do denunciante em processo administrativo | R$ 3.583,13
[27.3.4] Defesa em processo administrativo | R$ 3.583,13
[27.3.5] Recursos em processo administrativo | R$ 4.662,27
[27.3.6] Sustentação oral em processo ético- -profissional | R$ 2.598,30
[27.3.7] Audiência de conciliação | R$ 1.728,71
[27.3.8] Audiência de conciliação com TAC | R$ 2.252,56
[27.3.9] Audiência de instrução | R$ 2.598,30
[27.4.1] Elaboração ou revisão de documentos legais da atividade profissional (ter- mos de consentimento, confidencia- lidade, autorização para uso de ima- gem e afins), por documento | R$ 2.388,76
[27.4.2] Elaboração ou revisão de contratos diversos, exceto societários (contra- tos de honorários, parceiras, forneci- mento de insumos, manutenção, entre outros) – por contrato | R$ 1.592,50
[27.4.3] Elaboração ou revisão de regimento interno de corpo clínico | R$ 2.388,76

## Direito de Trânsito
[28.1.1] Defesa prévia por cada auto de infração | R$ 500,00
[28.1.2] Recurso à JARI por cada auto de infração | R$ 628,62
[28.1.3] Recurso ao CETRAN por cada auto de infração | R$ 942,93
[28.1.4] Defesa previa, recurso à JARI e CE- TRAN por cada auto de infração (exceto processos de suspensão/cassação e infrações auto suspensivas) | R$ 1.885,86
[28.1.5] Defesas e recursos do artigo 253-A, caput, do CTB | 20.0%
[28.1.6] Defesas e recursos do artigo 253-A, §1º, do CTB | 20.0%
[28.1.7] Defesas e recursos do artigo 253-A, §2º, do CTB – reincidência do caput | 20.0%
[28.1.8] Defesas e recursos do artigo 253-A, §2º, do CTB – reincidência do §1º | 20.0%
[28.1.9] Defesa em processo de suspensão ou cassação do direito de dirigir por pontuação, até a última instância | R$ 2.619,25
[28.1.10] Defesa em processo de suspensão ou cassação do direito de dirigir por infração específica – até a última instância | R$ 3.143,10
[28.1.11] Defesa em processo concomitante de suspensão ou cassação do direito de dirigir por infração específica (após alteração do CTB) | R$ 3.352,64
[28.1.12] Recurso administrativo de dívida ativa | 20.0%
[28.1.13] Desbloqueio administrativo de CNH | R$ 733,39
[28.1.14] Liberação de veículo apreendido/ remoção e depósito – na capital | R$ 1.571,55
[28.1.15] Defesas de multa NIC | 30.0%
[28.1.16] Defesa em processo administra- tivo Disciplinar (PAD) perante o DETRAN/GO | R$ 4.714,65
[28.1.17] Defesa em processo administrati- vo em face de permissionários ou credenciados perante o DETRAN/ GO (pessoa física ou jurídica) | 20.0%
[28.1.18] Sindicância | R$ 2.692,59
[28.1.19] Acompanhamento em audiências perante o DETRAN/GO | R$ 681,01
[28.1.20] Consultoria | R$ 314,31
[28.1.21] Consultoria c/ análise de documentos | R$ 471,47
[28.1.22] Restituição de veículo envolvido em crime de trânsito | 30.0%
[28.2.1] Ação anulatória de ato administra- tivo | 20.0%
[28.2.2] Ação de obrigação de fazer em matéria de trânsito | 20.0%
[28.2.3] Acompanhamento em processo de crime do artigo 306 CTB até homo- logação de acordo | R$ 3.143,10

## Compliance
[29.1] Código de ética | R$ 5.238,50
[29.2] Políticas e procedimentos de integri- dade | R$ 3.000,00
[29.3] Treinamento e Capacitação | R$ 3.000,00
[29.4] Mapa de riscos | R$ 6.000,00
[29.5] Canal de Denúncias | R$ 3.000,00
[29.6] Due Diligence | R$ 2.000,00
[29.6] Plano de Governança Anticorrupção | R$ 7.000,00
[29.6] Compliance Trabalhista | R$ 4.000,00
[29.6] Consultoria para Lei Geral de Proteção de Dados (LGPD) | R$ 8.000,00

## Gestão Jurídica
[30.1] Contratação na função de gestor geral | 5.0%
[30.2] Contratação na função de gestor por área | 2.0%
[30.3] Contratação na função de gestor de controladoria | 2.0%
[30.4] Contratação na função de gestor téc- nico | 2.0%
[30.5] Contratação na função de gestor ad- ministrativo-financeiro | R$ 4.000,00

## Mediação, Conciliação e Arbitragem
[31.1.1] Consulta genérica acerca dos bene- fícios e das características da utiliza- ção dos métodos autocompositivos de solução de conflitos | R$ 1.100,00
[31.1.2] Consulta para identificação do mé- todo autocompositivo adequado à solução do conflito, observando o caso concreto, com análise detalha- da de documentos – para uma parte | R$ 1.330,58
[31.1.3] Consulta para identificação do mé- todo autocompositivo adequado à solução do conflito, observando o caso concreto, com análise detalha- da de documentos – para ambas as partes conjuntamente | 10.0%
[31.1.4] Hora técnica e intelectual para análi- se dos elementos do conflito e asses- soria jurídico-estratégica – para uma parte | R$ 500,00
[31.1.5] Hora técnica e intelectual para aná- lise dos elementos do conflito e as- sessoria jurídico - estratégica – para ambas as partes conjuntamente | R$ 800,00
[31.1.6] Acompanhamento em sessão ou reunião de práticas colaborativas, mediação, conciliação, negociação ou qualquer método autocompositivo (por ato) | R$ 1.707,75
[31.1.7] Elaboração e/ou revisão de termo de acordo total ou parcial resultante do encerramento de práticas colabora- tivas, mediação, conciliação, nego- ciação ou qualquer método auto- compositivo | 10.0%
[31.1.8] Elaboração de notificação extrajudi- cial para cumprimento do acordo | R$ 500,00
[31.1.9] Requerimento de homologação de acordo realizado em esfera extraju- dicial perante o Poder Judiciário | 10.0%
[31.1.10] Tentativas de negociações extraju- diciais e preliminares com a parte contrária, via WhatsApp, e-mail ou telefone | 10.0%
[31.1.11] Intervenção para solução de qual- quer assunto eventual no terreno amigável relacionado ao acordo en- tabulado, mesmo quando for de valor estimável | 10.0%
[31.1.12] Intermediar (porta-voz) conversas sobre questões relacionadas ao con- flito, no caso de uma das partes não poder, por determinação judicial, ter contato com a outra parte – vio- lência doméstica, inca | R$ 2.661,16
[31.1.13] Retificação de acordo extrajudicial | R$ 2.661,16
[31.2.1] Consulta genérica acerca dos bene- fícios e características da utilização dos métodos autocompositivos de solução de conflitos | 20.0%
[31.2.2] Consulta para identificação do mé- todo autocompositivo adequado à solução do conflito, observando o caso concreto com análise detalha- da de documentos – para uma parte | 20.0%
[31.2.3] Consulta para identificação do mé- todo autocompositivo adequado à solução do conflito, observando o caso concreto com análise detalha- da de documentos – para ambas as partes conjuntamente | 20.0%
[31.2.4] Hora técnica e intelectual para análi- se dos elementos do conflito e asses- soria jurídico-estratégica – para uma parte | R$ 764,82
[31.2.5] Hora técnica e intelectual para aná- lise dos elementos do conflito e as- sessoria jurídico-estratégica – para ambas as partes conjuntamente | R$ 1.602,98
[31.2.6] Acompanhamento em sessão ou reunião de Práticas Colaborativas, Mediação, Conciliação, Negociação ou qualquer método autocompositivo (por ato) | 10.0%
[31.2.7] Elaboração e/ou revisão de termo de acordo total ou parcial resultante do encerramento de práticas colaborati- vas, mediação, conciliação, negocia- ção ou qualquer método autocompo- sitivo | 20.0%
[31.2.8] Requerimento de homologação de acordo realizado na esfera judicial perante o Poder Judiciário | 20.0%
[31.2.9] Elaboração de notificação extraju- dicial para cumprimento do acordo homologado pelo juiz | 20.0%
[31.2.10] Comparecimento em audiências de conciliação. O ato exclusivo de acom- panhamento como advogado(a) ou representante de qualquer das partes | 20.0%
[31.2.11] Intermediar (porta-voz) conversas sobre questões relacionadas ao lití- gio, no caso de uma das partes não poder, por determinação judicial, ter contato com a outra parte – violência doméstica, incapac | 20.0%
[31.3.1] Representação do cliente no procedi- mento arbitral | 10.0%
[31.4.1] Ajuizamento de ação anulatória da sentença arbitral | 10.0%
[31.4.2] Ajuizamento de execução judicial para o cumprimento da sentença ar- bitral | 10.0%
[31.4.3] Defesa do executado em juízo no cumprimento da sentença arbitral | 10.0%`;

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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !caller) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const body = await req.json();
    const { mensagem, historico } = body;

    if (!mensagem || typeof mensagem !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing or invalid field: mensagem' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const historyArray = Array.isArray(historico) ? historico : [];

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: 'Anthropic API key is not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [...historyArray, { role: 'user', content: mensagem }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[claude-honorarios] Anthropic API failed:', errorText);
      return new Response(JSON.stringify({ error: `Anthropic API error: ${response.statusText}`, details: errorText }), {
        status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
      });
    }

    const responseData = await response.json();
    const responseText = responseData.content?.[0]?.text || '';

    return new Response(JSON.stringify({ resposta: responseText }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    });

  } catch (err: any) {
    console.error('[claude-honorarios] Exception occurred:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json; charset=utf-8' }
    });
  }
});
