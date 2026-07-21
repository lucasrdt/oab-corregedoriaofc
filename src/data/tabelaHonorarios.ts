// src/data/tabelaHonorarios.ts
// Tabela de Honorários Mínimos OAB-MA 2026
// Fonte: Documento oficial OAB-MA — NOVA_TABELA_HONORARIOS_OAB-MA_COM_EMENDAS
// Total: 970 itens | 31 áreas do direito
// AVISO: Valores de referência. Sempre confirme no documento oficial antes de formalizar contratos.

export type TipoCalculo = 'fixo' | 'percentual' | 'faixas';

export interface SituacaoItem {
  situacao: string;
  valor_minimo: number;
}

export interface ItemTabela {
  id: string;
  area: string;
  descricao: string;
  tipo: TipoCalculo;
  percentual_minimo: number | null;
  valor_minimo: number | null;
  requer_valor_causa: boolean;
  observacao?: string | null;
  situacoes?: SituacaoItem[];
}

export const AVISO_TABELA =
  'Os valores apresentados são baseados na Tabela de Honorários Mínimos OAB-MA 2026. ' +
  'Sempre confirme no documento oficial antes de formalizar contratos.';

export const tabelaHonorarios: ItemTabela[] = [
  {
    "id": "1.1",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "CONSULTA/REUNIÃO",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 500.0,
    "requer_valor_causa": false,
    "observacao": "Fora do horário de expediente: acrescenta-se R$ 150,00",
    "situacoes": [
      {
        "situacao": "a) No escritório, pessoalmente ou por qualquer meio eletrônico",
        "valor_minimo": 500.0
      },
      {
        "situacao": "b) Em local externo (distinto do escritório)",
        "valor_minimo": 700.0
      },
      {
        "situacao": "c) Com exames de documentos",
        "valor_minimo": 1000.0
      }
    ]
  },
  {
    "id": "1.2",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Hora técnica",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 550.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.3",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Pareceres",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3006.9,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.4",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Memoriais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2860.22,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.5",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Petição ou requerimento avulso",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1183.9,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.6",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Acompanhamento de cliente a órgão administrativo ou judiciário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 880.07,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.7",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Exame de autos de processo em ór- gãos administrativos ou judiciários",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 880.07,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.8",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Diligência ou acompanhamento de cliente junto a Delegacia de Polícia Obs.: fora do horário comercial, acrescen- ta-se R$ 240,00",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 880.07,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.9",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Cobrança amigável",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "1.10",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Intervenção para solução de conflito extrajudicial amigável",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "1.11",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "CORRESPONDÊNCIA   Fotocópia/digitalização de até 100 folhas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 157.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.11.1",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Fotocópia/digitalização de mais de 100 folhas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 0.2,
    "requer_valor_causa": false,
    "observacao": "Acrescenta-se R$ 0,20 por folha acima de 100."
  },
  {
    "id": "1.11.2",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Protocolo (por ato)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 157.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.11.3",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Audiência conciliatória (presencial ou virtual)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 377.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.11.4",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Audiência de instrução e julgamento (presencial ou virtual)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 607.67,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.12.1",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Diária profissional - independente- mente das despesas de transporte, alimentação e estadia (mínimo)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1210.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.13.1",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "A diária profissional - independente- mente das despesas de transporte, alimentação e estadia (mínimo)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2147.79,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.13.2",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Deslocamento",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 565.76,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.14.1",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Na comarca, para citação, notifica- ção, interpelação ou exames periciais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1204.86,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "1.14.2",
    "area": "Atividades Jurídicas Avulsas",
    "descricao": "Na comarca, para depoimento pesso- al ou inquirição de testemunhas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1718.23,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "2.1",
    "area": "Juizados Especiais Estaduais e Federais",
    "descricao": "Inicial ou contestação, e audiência",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "2.2",
    "area": "Juizados Especiais Estaduais e Federais",
    "descricao": "Atuação em 2ª instância",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "2.3",
    "area": "Juizados Especiais Estaduais e Federais",
    "descricao": "Sustentação oral perante Turmas Recursais",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "3.1.1",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Interposição",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": 7380.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "3.1.2",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Contrarrazões",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": 5313.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "3.2.1",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Apelação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8118.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.2.2",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Interposição ou contrariedade",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5175.64,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.2.3",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Carta testemunhável",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3457.41,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.2.4",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Agravo em execução",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3845.06,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.2.5",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Recurso em sentido estrito",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5175.64,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.2.6",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Habeas Corpus",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7512.01,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.1",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Elaboração de memoriais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3457.41,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.2",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Sustentação Oral em Tribunal local (presencial ou virtual)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5313.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.3",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Sustentação Oral em Tribunal de ou- tro Estado (presencial ou virtual)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8118.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.4",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Sustentação Oral nos Tribunais Supe- riores (presencial ou virtual)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8287.31,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.5",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Acompanhamento de recurso",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3006.9,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.6",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Embargos de declaração",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3560.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.7",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Embargos infringentes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5313.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.8",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Embargos de divergência",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3845.06,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.9",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Agravo de instrumento",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6110.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.10",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Agravo regimental",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "3.3.11",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Recurso adesivo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3845.06,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.12",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Recurso ordinário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6181.43,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.13",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Recurso Especial e Extraordinário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 22143.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.14",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Revisão Criminal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 13431.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.15",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Reclamação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4683.22,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.16",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Correição Parcial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7690.12,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.17",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Agravo Contra Denegação de Segui- mento de Recurso Especial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7690.12,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.18",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Contrarrazões no agravo contra de- negação de seguimento de Recurso Especial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7690.12,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.19",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Agravo Contra Denegação de Segui- mento de Recurso Extraordinário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7690.12,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.20",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Contrarrazões no Agravo Contra De- negação de Seguimento de Recurso Extraordinário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7690.12,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.21",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Mandado de Segurança",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12034.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.22",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Incidente de Resolução de Deman- das Repetitivas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7690.12,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.23",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Incidente de Assunção de Compe- tência",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7690.12,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "3.3.24",
    "area": "Advocacia Perante Tribunais",
    "descricao": "Incidente de Arguição de Declara- ção de Inconstitucionalidade",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6181.43,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.1",
    "area": "Direito Administrativo",
    "descricao": "Defesa administrativa/Recurso pe- rante órgãos extrajudiciais",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 4213.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.2",
    "area": "Direito Administrativo",
    "descricao": "Impugnação/Recurso contra edital de concurso público",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3771.72,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.3",
    "area": "Direito Administrativo",
    "descricao": "Acompanhamento em processo admi- nistrativo disciplinar",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4190.8,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.4",
    "area": "Direito Administrativo",
    "descricao": "Acompanhamento em sindicância",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2095.4,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.5",
    "area": "Direito Administrativo",
    "descricao": "Medidas cautelares administrativas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.6",
    "area": "Direito Administrativo",
    "descricao": "Atuação perante conselhos profissio- nais",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.7",
    "area": "Direito Administrativo",
    "descricao": "Defesa administrativa/Recurso ad- ministrativo em órgãos de defesa do consumidor",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.8",
    "area": "Direito Administrativo",
    "descricao": "Procedimento especial – Mandado de Injunção",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7333.9,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.9",
    "area": "Direito Administrativo",
    "descricao": "Advocacia Trabalhista para servido- res públicos",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.10",
    "area": "Direito Administrativo",
    "descricao": "Licitações e contratos públicos",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.11",
    "area": "Direito Administrativo",
    "descricao": "Acompanhamento de sessões e pra- zos em processo licitatório eletrônico",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": 3500.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.12",
    "area": "Direito Administrativo",
    "descricao": "Acompanhamento de sessões e pra- zos em processo licitatório presencial",
    "tipo": "percentual",
    "percentual_minimo": 1.5,
    "valor_minimo": 1500.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.13",
    "area": "Direito Administrativo",
    "descricao": "Acompanhamento em reuniões que envolvam processos licitatórios junto a órgãos públicos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 800.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.14",
    "area": "Direito Administrativo",
    "descricao": "Petição intermediária em processo licitatório",
    "tipo": "percentual",
    "percentual_minimo": 1.0,
    "valor_minimo": 1500.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.15",
    "area": "Direito Administrativo",
    "descricao": "Organização de documentos de cre- denciamento, proposta e habilitação para a licitação",
    "tipo": "percentual",
    "percentual_minimo": 2.0,
    "valor_minimo": 3000.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.16",
    "area": "Direito Administrativo",
    "descricao": "Parecer de edital de licitação",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": 2500.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.17",
    "area": "Direito Administrativo",
    "descricao": "Parecer sobre contrato público e ter- mo aditivo",
    "tipo": "percentual",
    "percentual_minimo": 2.5,
    "valor_minimo": 3000.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.18",
    "area": "Direito Administrativo",
    "descricao": "Impugnação de edital",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": 3000.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.19",
    "area": "Direito Administrativo",
    "descricao": "Recurso ou contrarrazões em proces- so licitatório",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.20",
    "area": "Direito Administrativo",
    "descricao": "Análise e/ou pedido de reequilíbrio fi- nanceiro de contrato público perante o ente contratante",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.21",
    "area": "Direito Administrativo",
    "descricao": "Cobrança extrajudicial por inadim- plência de contrato público",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.22",
    "area": "Direito Administrativo",
    "descricao": "Propositura de defesa prévia/recurso em processo administrativo",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.23",
    "area": "Direito Administrativo",
    "descricao": "Propositura de representação em pro- cesso administrativo",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.24",
    "area": "Direito Administrativo",
    "descricao": "Propositura de pedido de reconside- ração em processo administrativo",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.25",
    "area": "Direito Administrativo",
    "descricao": "Elaboração de quesitos em processo administrativo/judicial",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.26",
    "area": "Direito Administrativo",
    "descricao": "Impugnação à perícia em processo administrativo/judicial",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.27",
    "area": "Direito Administrativo",
    "descricao": "Representação ou cautelar perante os tribunais de contas",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.28",
    "area": "Direito Administrativo",
    "descricao": "Defesa em procedimentos perante os tribunais de contas",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.29",
    "area": "Direito Administrativo",
    "descricao": "Processo de execução de contrato público",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "4.30",
    "area": "Direito Administrativo",
    "descricao": "Assessoria em portais de licitações (para atualização de cadastros e certidões)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1571.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.31",
    "area": "Direito Administrativo",
    "descricao": "Elaboração de resposta a ofício e noti- ficação extrajudicial (simples)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 314.31,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.32",
    "area": "Direito Administrativo",
    "descricao": "Elaboração de resposta a ofício e noti- ficação extrajudicial (complexo)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1047.7,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.33",
    "area": "Direito Administrativo",
    "descricao": "Consultoria para empresa em tema de licitação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "4.34",
    "area": "Direito Administrativo",
    "descricao": "Defesa/Recurso em ações de impro- bidade, Ação Civil Pública e ações populares",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "5.1",
    "area": "Direito Aeronáutico",
    "descricao": "Defesa administrativa em auto de infração",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "5.2",
    "area": "Direito Aeronáutico",
    "descricao": "Recurso administrativo em auto de infração 1ª instância",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "5.3",
    "area": "Direito Aeronáutico",
    "descricao": "Recurso administrativo em auto de infração 2ª instância",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "5.4",
    "area": "Direito Aeronáutico",
    "descricao": "Recursos internos",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "5.5",
    "area": "Direito Aeronáutico",
    "descricao": "Acompanhamentos em audiências",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2200.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "5.6",
    "area": "Direito Aeronáutico",
    "descricao": "Acompanhamento de procedimento de importação de aeronaves",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "5.7",
    "area": "Direito Aeronáutico",
    "descricao": "Análise/elaboração contratual - compra e venda de aeronaves",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "5.8",
    "area": "Direito Aeronáutico",
    "descricao": "Análise contratual – contratos internacionais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7333.9,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "5.9",
    "area": "Direito Aeronáutico",
    "descricao": "Processo de transferência/averbação no RAB",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4190.8,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "5.10",
    "area": "Direito Aeronáutico",
    "descricao": "Ação anulatória de ato administrativo",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "5.11",
    "area": "Direito Aeronáutico",
    "descricao": "Mandado de Segurança",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8905.45,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "5.12",
    "area": "Direito Aeronáutico",
    "descricao": "Processo de homologação de pistas de pouso e decolagem",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.1",
    "area": "Direito Agrário",
    "descricao": "Ações possessórias – móveis",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3216.44,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.2",
    "area": "Direito Agrário",
    "descricao": "Ações possessórias – imóveis (interdito proibitório, manutenção e reintegração).",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5615.67,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.3",
    "area": "Direito Agrário",
    "descricao": "Nunciação de obra nova",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4976.58,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.4",
    "area": "Direito Agrário",
    "descricao": "Usucapião",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5615.67,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.5",
    "area": "Direito Agrário",
    "descricao": "Divisão e demarcação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4976.58,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.6",
    "area": "Direito Agrário",
    "descricao": "Embargos de terceiro",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5615.67,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.7",
    "area": "Direito Agrário",
    "descricao": "Habilitação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4012.69,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.8",
    "area": "Direito Agrário",
    "descricao": "Restauração de autos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4012.69,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.9",
    "area": "Direito Agrário",
    "descricao": "Das vendas a crédito com reserva de domínio",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4012.69,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.10",
    "area": "Direito Agrário",
    "descricao": "Do juízo arbitral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4976.58,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.11",
    "area": "Direito Agrário",
    "descricao": "Da ação monitória",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2849.74,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.12",
    "area": "Direito Agrário",
    "descricao": "Desapropriação direta",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5689.01,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.13",
    "area": "Direito Agrário",
    "descricao": "Desapropriação indireta",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9628.36,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.14",
    "area": "Direito Agrário",
    "descricao": "Ação de constituição, extinção de usufruto ou fideicomisso",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4274.62,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.15",
    "area": "Direito Agrário",
    "descricao": "Mandado de Segurança",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6422.4,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.16",
    "area": "Direito Agrário",
    "descricao": "Ação ordinária de despejo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4976.58,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "6.17",
    "area": "Direito Agrário",
    "descricao": "Atos/acompanhamento despejo/rein- tegração",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3216.44,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "7.1.2",
    "area": "Direito Ambiental",
    "descricao": "Defesa prévia",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "7.1.3",
    "area": "Direito Ambiental",
    "descricao": "Recurso",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "7.1.4",
    "area": "Direito Ambiental",
    "descricao": "Acompanhamento em audiência",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "7.1.5",
    "area": "Direito Ambiental",
    "descricao": "Atuação ou acompanhamento em procedimentos de licenciamento ou certificação ambiental.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8591.14,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "7.1.6",
    "area": "Direito Ambiental",
    "descricao": "Visita de campo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1257.24,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "7.1.7",
    "area": "Direito Ambiental",
    "descricao": "Análise dos aspectos ambientais do contrato",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "7.2.1",
    "area": "Direito Ambiental",
    "descricao": "Defesa em Inquérito Civil",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6286.2,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "7.2.2",
    "area": "Direito Ambiental",
    "descricao": "Atuação em Processo Civil (1ª instância)",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "7.2.3",
    "area": "Direito Ambiental",
    "descricao": "Atuação em Ação Civil Pública (1ª instância)",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "7.2.4",
    "area": "Direito Ambiental",
    "descricao": "Atuação em audiência isolada para coleta de provas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "7.2.5",
    "area": "Direito Ambiental",
    "descricao": "Atuação isolada em termo de ajusta- mento de conduta",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4714.65,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "7.2.6",
    "area": "Direito Ambiental",
    "descricao": "Acompanhamento em estudos am- bientais",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "7.2.7",
    "area": "Direito Ambiental",
    "descricao": "Parecer sobre interpretação de nor- mas ambientais, sobre projeto am- biental ou sobre qualquer tipo de lançamento realizado contra o inte- ressado",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "7.2.8",
    "area": "Direito Ambiental",
    "descricao": "Atuação em procedimento extrajudi- cial cujo objeto seja crime ambiental",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6286.2,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "7.2.9",
    "area": "Direito Ambiental",
    "descricao": "Atuação em processo judicial cujo objeto seja crime ambiental",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8381.6,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "8.1.1",
    "area": "Direito Animalista",
    "descricao": "Defesa de auto de infração",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "8.1.2",
    "area": "Direito Animalista",
    "descricao": "Manifestações em geral",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "8.2.1",
    "area": "Direito Animalista",
    "descricao": "Elaboração de estatuto e/ou regi- mento",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7260.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "8.2.2",
    "area": "Direito Animalista",
    "descricao": "Integrar como presidente da comissão de conselho municipal e/ou estadual e/ou nacional de proteção animal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3834.58,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "8.2.3",
    "area": "Direito Animalista",
    "descricao": "Assessoria de comissão de conselho de proteção animal – a hora",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1278.19,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "8.2.4",
    "area": "Direito Animalista",
    "descricao": "Pareceres",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4358.43,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "8.3.1",
    "area": "Direito Animalista",
    "descricao": "Reconhecimento e/ou dissolução de união estável com pedido de guarda unilateral de animal não humano",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1000.0,
    "requer_valor_causa": false,
    "observacao": "Acrescenta-se R$ 1.000,00 ao ato correspondente na tabela."
  },
  {
    "id": "8.3.2",
    "area": "Direito Animalista",
    "descricao": "Reconhecimento e/ou dissolução de união estável com pedido de guarda compartilhada de animal não humano",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1700.0,
    "requer_valor_causa": false,
    "observacao": "Acrescenta-se R$ 1.700,00 ao ato correspondente na tabela."
  },
  {
    "id": "8.3.3",
    "area": "Direito Animalista",
    "descricao": "Divórcio com pedido de guarda unila- teral de animal não humano",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1000.0,
    "requer_valor_causa": false,
    "observacao": "Acrescenta-se R$ 1.000,00 ao ato correspondente na tabela."
  },
  {
    "id": "8.3.4",
    "area": "Direito Animalista",
    "descricao": "Divórcio com pedido de guarda com- partilhada de animal não humano",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1700.0,
    "requer_valor_causa": false,
    "observacao": "Acrescenta-se R$ 1.700,00 ao ato correspondente na tabela."
  },
  {
    "id": "8.3.5",
    "area": "Direito Animalista",
    "descricao": "Alimentos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1000.0,
    "requer_valor_causa": false,
    "observacao": "Acrescenta-se R$ 1.000,00 ao ato correspondente na tabela."
  },
  {
    "id": "9.1",
    "area": "Direito Bancário",
    "descricao": "Parecer Jurídico/Legal Opinion acer- ca do regulatório referente ao Banco Central e seus órgãos e autarquias",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.2",
    "area": "Direito Bancário",
    "descricao": "Consultoria para estruturação, cria- ção de Fintechs, Instituições de Pa- gamentos e outras de Pequeno Porte incluindo Adequação conforme regu- lações do Banco Central",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 104770.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.3",
    "area": "Direito Bancário",
    "descricao": "Consultoria, criação e assessoramen- to de Empresa Simples de Crédito (LC 167/2019)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 52385.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.4",
    "area": "Direito Bancário",
    "descricao": "Consultoria e elaboração de atos constitutivos de cooperativas de crédito, instituições de microcrédito, instituições de seguro e resseguro",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10477.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.5",
    "area": "Direito Bancário",
    "descricao": "Embargos do executado, monitórios e/ ou defesas do devedor, crédito rural ou não",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6286.2,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.6",
    "area": "Direito Bancário",
    "descricao": "Assessoria mensal para instituições financeiras",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.7",
    "area": "Direito Bancário",
    "descricao": "Assessoria para constituição de Fun- dos de Investimento, FIAGRO, FIDIC e outros",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 104770.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.8",
    "area": "Direito Bancário",
    "descricao": "Consultoria em Blockchain, Bitcoins, Tokenização de ativos, NFT e demais relacionados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 52385.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.9",
    "area": "Direito Bancário",
    "descricao": "Ações judiciais relacionadas a finan- ciamentos imobiliários",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.10",
    "area": "Direito Bancário",
    "descricao": "Embargos do Executado, monitórios e/ ou defesas do devedor, crédito rural ou não",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6286.2,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.11",
    "area": "Direito Bancário",
    "descricao": "Ações indenizatórias (cobrança in- devida, venda casada, negativação indevida, cartão de crédito não solici- tado, entre outras)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.12",
    "area": "Direito Bancário",
    "descricao": "Ação Revisional",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.13",
    "area": "Direito Bancário",
    "descricao": "Acompanhamento de cliente em reu- nião com gerentes/negociações",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1047.7,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.14",
    "area": "Direito Bancário",
    "descricao": "Parecer jurídico sobre contrato ban- cário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.15",
    "area": "Direito Bancário",
    "descricao": "Negociação extrajudicial junto à insti- tuição financeira",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.16",
    "area": "Direito Bancário",
    "descricao": "Defesa e atuação em Ação Civil Pública",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10477.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.17",
    "area": "Direito Bancário",
    "descricao": "Defesa em ações indenizatórias (co- brança indevida, negativação indevi- da, cartão de crédito não solicitado, entre outras)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4190.8,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "9.18",
    "area": "Direito Bancário",
    "descricao": "Execução de título extrajudicial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "10.1.1",
    "area": "Direito Civil",
    "descricao": "Notificação, interpelação e protesto",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2242.08,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "10.1.2",
    "area": "Direito Civil",
    "descricao": "Antecedentes",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.1.3",
    "area": "Direito Civil",
    "descricao": "Se formulado pedido principal",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.2.1",
    "area": "Direito Civil",
    "descricao": "Sem valor declarado",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3735.05,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "10.2.2",
    "area": "Direito Civil",
    "descricao": "Com valor declarado",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.2.3",
    "area": "Direito Civil",
    "descricao": "Acréscimo por litisconsorte",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1498.21,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "10.3.1",
    "area": "Direito Civil",
    "descricao": "Execução de título extrajudicial",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.3.2",
    "area": "Direito Civil",
    "descricao": "Cumprimento de sentença",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.4.1",
    "area": "Direito Civil",
    "descricao": "Embargos à execução",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.4.2",
    "area": "Direito Civil",
    "descricao": "Exceção de pré-executividade",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.5.1",
    "area": "Direito Civil",
    "descricao": "Divisão ou demarcação",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.5.2",
    "area": "Direito Civil",
    "descricao": "Cumuladas",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.5.3",
    "area": "Direito Civil",
    "descricao": "Usucapião",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 10934.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.5.4",
    "area": "Direito Civil",
    "descricao": "Desapropriação",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.5.5",
    "area": "Direito Civil",
    "descricao": "Reivindicatória",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 10230.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.5.6",
    "area": "Direito Civil",
    "descricao": "Ações petitórias",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.5.7",
    "area": "Direito Civil",
    "descricao": "Ação declaratória autônoma",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.5.8",
    "area": "Direito Civil",
    "descricao": "Registro de Torrens sem oposição",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.5.9",
    "area": "Direito Civil",
    "descricao": "Registro de Torrens com oposição",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.5.10",
    "area": "Direito Civil",
    "descricao": "Especialização de hipoteca legal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1943.48,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "10.6.1",
    "area": "Direito Civil",
    "descricao": "Consignação em pagamento",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.6.2",
    "area": "Direito Civil",
    "descricao": "Ação monitória",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.6.3",
    "area": "Direito Civil",
    "descricao": "Alienação judicial",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.6.4",
    "area": "Direito Civil",
    "descricao": "Ação de exigir contas (cada fase)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2242.08,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "10.6.5",
    "area": "Direito Civil",
    "descricao": "Homologação do penhor legal",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.6.6",
    "area": "Direito Civil",
    "descricao": "Oposição",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.6.7",
    "area": "Direito Civil",
    "descricao": "Regulação de avaria grossa",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.6.8",
    "area": "Direito Civil",
    "descricao": "Restauração dos autos",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.6.9",
    "area": "Direito Civil",
    "descricao": "Intervenção de terceiros",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.7.1",
    "area": "Direito Civil",
    "descricao": "Ação Popular",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.7.2",
    "area": "Direito Civil",
    "descricao": "Ação Civil Pública",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "10.7.3",
    "area": "Direito Civil",
    "descricao": "Mandado de Segurança Coletivo",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.1.1",
    "area": "Direito do Consumidor",
    "descricao": "Procedimento ou defesa administrati- va sobre o valor econômico envolvido, como mandatário da empresa",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.1.2",
    "area": "Direito do Consumidor",
    "descricao": "Parecer sobre normas de relação de consumo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3406.07,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.1.3",
    "area": "Direito do Consumidor",
    "descricao": "Acompanhamento PROCON, notifica- ção extrajudicial, agências regulado- ras e sites de resolução extrajudicial sem benefício econômico",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 733.39,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.1.4",
    "area": "Direito do Consumidor",
    "descricao": "Acompanhamento PROCON, notifica- ção extrajudicial, agências regulado- ras e sites de resolução extrajudicial com benefício econômico",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1364.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.1.5",
    "area": "Direito do Consumidor",
    "descricao": "Defesa administrativa de órgãos de defesa do consumidor",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.1.6",
    "area": "Direito do Consumidor",
    "descricao": "Recurso administrativo em órgãos de defesa ao consumidor",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.2.1",
    "area": "Direito do Consumidor",
    "descricao": "Ação judicial movida pelo consumidor, visando a responsabilizar o fornece- dor pelo fato do produto e do serviço",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.2.2",
    "area": "Direito do Consumidor",
    "descricao": "Ação judicial movida pelo consumidor, visando responsabilizar o fornecedor por vício do produto e do serviço",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.2.3",
    "area": "Direito do Consumidor",
    "descricao": "Ação judicial movida pelo consumidor, visando responsabilizar o fornecedor por publicidade enganosa ou abusiva",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.2.4",
    "area": "Direito do Consumidor",
    "descricao": "Ação judicial movida pelo consumi- dor, visando a nulidade de cláusulas abusivas constantes em contratos de consumo",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.2.5",
    "area": "Direito do Consumidor",
    "descricao": "Ação judicial movida pelo consumidor, visando responsabilizar o fornecedor pela negativação indevida",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.2.6",
    "area": "Direito do Consumidor",
    "descricao": "Ação judicial movida pelo consumidor, visando responsabilizar o fornecedor pela falha na prestação do serviço de transporte aéreo (acidente aéreo, atraso de voo, cancelamento de voo, extravio de bagag",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.2.7",
    "area": "Direito do Consumidor",
    "descricao": "Ação judicial movida pelo consumi- dor, vítima de fraude",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.2.8",
    "area": "Direito do Consumidor",
    "descricao": "Ação judicial movida pelo consumidor, visando responsabilizar o fornecedor pelo descumprimento contratual",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.2.9",
    "area": "Direito do Consumidor",
    "descricao": "Defesa em ação judicial movida pelo consumidor, sobre o valor atualizado da ação.",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "11.2.10",
    "area": "Direito do Consumidor",
    "descricao": "Atuação em audiência isolada, para coleta de prova oral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2093.3,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.2.11",
    "area": "Direito do Consumidor",
    "descricao": "Representação em convenção co- letiva de consumo – Representação de entidade civil de consumidores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4189.75,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.2.12",
    "area": "Direito do Consumidor",
    "descricao": "Representação em convenção coleti- va de consumo – Representação de asso- ciação de fornecedores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5760.25,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.2.13",
    "area": "Direito do Consumidor",
    "descricao": "Representação em convenção co- letiva de consumo – Representação de sindicato de categoria econômica de consu- midores e de fornecedores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8150.06,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.2.14",
    "area": "Direito do Consumidor",
    "descricao": "Consultoria sem vínculo empregatício – Consultoria de empresas de pequeno porte",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4106.98,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.2.15",
    "area": "Direito do Consumidor",
    "descricao": "Consultoria sem vínculo empregatício – Consultoria de empresas de médio porte",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6284.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.2.16",
    "area": "Direito do Consumidor",
    "descricao": "Consultoria sem vínculo empregatício – Consultoria de empresas de grande porte",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7857.75,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.2.17",
    "area": "Direito do Consumidor",
    "descricao": "Consultoria sem vínculo empregatício – Consultoria de Entidade civil de consumi- dores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7857.75,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.2.18",
    "area": "Direito do Consumidor",
    "descricao": "Consultoria sem vínculo empregatício – Consultoria de associações de fornece- dores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7857.75,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "11.2.19",
    "area": "Direito do Consumidor",
    "descricao": "Consultoria sem vínculo empregatício – Consultoria de sindicato de categoria eco- nômica de consumidores e de fornecedores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9953.15,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.1",
    "area": "Direito Desportivo",
    "descricao": "Procedimento que tramita em Comis- são Disciplinar de Tribunal de Justiça Desportiva",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1382.96,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.2",
    "area": "Direito Desportivo",
    "descricao": "Procedimento que tramita em Tri- bunal de Justiça Desportiva (Tribunal Pleno)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3036.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.3",
    "area": "Direito Desportivo",
    "descricao": "Procedimento que tramita em Comis- são Disciplinar de Superior Tribunal de Justiça Desportiva",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1812.52,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.4",
    "area": "Direito Desportivo",
    "descricao": "Procedimento que tramita em Supe- rior Tribunal de Justiça Desportiva (Tribunal Pleno)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4213.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.5",
    "area": "Direito Desportivo",
    "descricao": "Defesa perante a Justiça Desportiva por denunciado (1º. Grau CD do TJD)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2030.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.6",
    "area": "Direito Desportivo",
    "descricao": "Defesa perante a Justiça Desportiva por denunciado (2º. Grau, oriundos dos TJDs, CD e Pleno do STJD)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2765.93,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.7",
    "area": "Direito Desportivo",
    "descricao": "Procedimentos especiais junto à Jus- tiça Desportiva",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3405.03,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.8",
    "area": "Direito Desportivo",
    "descricao": "Procedimento litigioso na defesa de interesse de cliente (clube, agente, atleta, etc.) frente à FIFA e TAS-CAS",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 25520.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.9",
    "area": "Direito Desportivo",
    "descricao": "Participação em painel: audiência (presenciais ou online)/recurso. Os valores de matéria desportiva são acrescidos de 20% caso a atuação envolva atletas, clubes e contratos em língua estrangeira",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.10.1",
    "area": "Direito Desportivo",
    "descricao": "Patrocínio de reclamante – sobre a condenação ou acordo",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.10.2",
    "area": "Direito Desportivo",
    "descricao": "Acréscimo em caso de Recurso Ordinário",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.10.3",
    "area": "Direito Desportivo",
    "descricao": "Acréscimo em caso de Recurso de Revista",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.10.4",
    "area": "Direito Desportivo",
    "descricao": "Patrocínio de reclamado – sobre a condenação ou acordo",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.10.5",
    "area": "Direito Desportivo",
    "descricao": "Acréscimo em caso de Recurso Ordinário",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.10.6",
    "area": "Direito Desportivo",
    "descricao": "Acréscimo em caso de Recurso de Revista",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.10.7",
    "area": "Direito Desportivo",
    "descricao": "Consultoria Jurídica, sem vínculo empregatício, entidade de prática desportiva com mais de 35 atletas e/ ou membro(s) de comissão(ões) técni- ca(s)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 14185.86,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.10.8",
    "area": "Direito Desportivo",
    "descricao": "Consultoria Jurídica, sem vínculo empregatício, entidade de prática desportiva com menos de 35 atletas e/ou membro(s) de comissão(ões) técnica(s)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7092.93,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.10.9",
    "area": "Direito Desportivo",
    "descricao": "Ação Cível: procedimento ordinário (proposição ou defesa)",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.10.10",
    "area": "Direito Desportivo",
    "descricao": "Ação Cível: procedimento sumário (proposição ou defesa)",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.10.11",
    "area": "Direito Desportivo",
    "descricao": "Procedimento de Mecanismo de Soli- dariedade, Indenização por Formação e Training Compensation",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.11.1",
    "area": "Direito Desportivo",
    "descricao": "Procedimento administrativo nacional comum em publisher ou organizador",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1037.22,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.11.2",
    "area": "Direito Desportivo",
    "descricao": "Procedimento administrativo comum em publisher ou organizador interna- cional",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1550.6,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.12.1",
    "area": "Direito Desportivo",
    "descricao": "Procedimento disciplinar nacional em publisher ou organizador",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1414.4,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.12.2",
    "area": "Direito Desportivo",
    "descricao": "Procedimento disciplinar internacio- nal em publisher ou organizador",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2127.35,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.12.3",
    "area": "Direito Desportivo",
    "descricao": "Defesa em processo disciplinar nacio- nal em publisher ou organizador",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1550.6,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.12.4",
    "area": "Direito Desportivo",
    "descricao": "Acréscimo em grau recursal de pro- cesso disciplinar nacional",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1550.6,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.12.5",
    "area": "Direito Desportivo",
    "descricao": "Defesa em processo disciplinar inter- nacional em publisher ou organizador",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2315.42,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.12.6",
    "area": "Direito Desportivo",
    "descricao": "Acréscimo em grau recursal de pro- cesso disciplinar internacional",
    "tipo": "percentual",
    "percentual_minimo": 100.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "12.12.7",
    "area": "Direito Desportivo",
    "descricao": "Procedimento especial regulamentar nacional em publisher ou organizador",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3090.72,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.12.8",
    "area": "Direito Desportivo",
    "descricao": "Procedimento especial regulamentar internacional em publisher ou organi- zador",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4599.4,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.13.1",
    "area": "Direito Desportivo",
    "descricao": "Procedimento litigioso na defesa do interesse de cliente (clube, agente, atleta, etc.) frente às publishers, or- ganizadoras e correlatas, em nível nacional.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7082.45,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.13.2",
    "area": "Direito Desportivo",
    "descricao": "Procedimento litigioso na defesa do interesse de cliente (clube, agente, atleta, etc.)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9974.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "12.13.3",
    "area": "Direito Desportivo",
    "descricao": "Participação como membro de tribu- nal disciplinar (diária)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 167.63,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.1",
    "area": "Direito Digital",
    "descricao": "Mapeamento de dados pessoais (por processo)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 450.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.2",
    "area": "Direito Digital",
    "descricao": "Elaboração de políticas ou procedimento",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3255.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.3",
    "area": "Direito Digital",
    "descricao": "Elaboração de Relatório de impacto à proteção de dados pessoais (DPIA)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7310.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.4",
    "area": "Direito Digital",
    "descricao": "Avaliação do Legítimo Interesse (LIA)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2604.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.5",
    "area": "Direito Digital",
    "descricao": "Elaboração do Plano de Atendimento aos titulares de dados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4557.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.6",
    "area": "Direito Digital",
    "descricao": "Elaboração do Plano de Resposta a Incidentes com Dados Pessoais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6510.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.7",
    "area": "Direito Digital",
    "descricao": "Suporte e orientação para aplicação do Privacy by Design, por produto, serviço ou solução",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4557.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.8",
    "area": "Direito Digital",
    "descricao": "Elaboração do Programa de Governança em Proteção de Dados Pessoais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10416.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.9",
    "area": "Direito Digital",
    "descricao": "Elaboração de Termo de Consentimento (padrão, dados sensíveis, dados de crianças e adolescentes e idosos) (valor por termo)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1400.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.10",
    "area": "Direito Digital",
    "descricao": "Avaliação do Legítimo Interesse (LIA)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2604.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.11",
    "area": "Direito Digital",
    "descricao": "Avaliação do Legítimo Interesse (LIA)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2604.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.12",
    "area": "Direito Digital",
    "descricao": "Avaliação do Legítimo Interesse (LIA)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2604.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.13",
    "area": "Direito Digital",
    "descricao": "Avaliação do Legítimo Interesse (LIA)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2604.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.1.14",
    "area": "Direito Digital",
    "descricao": "Avaliação do Legítimo Interesse (LIA)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2604.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.2.1",
    "area": "Direito Digital",
    "descricao": "Termos de uso de site",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1288.67,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.2.2",
    "area": "Direito Digital",
    "descricao": "Termo de uso de software e/ou aplica- tivo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1288.67,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.2.3",
    "area": "Direito Digital",
    "descricao": "Termo de políticas de privacidade",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3216.44,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.2.4",
    "area": "Direito Digital",
    "descricao": "Termo de autorização de uso de ima- gem",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1288.67,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "13.3.1",
    "area": "Direito Digital",
    "descricao": "Contrato de desenvolvimento de sof- tware",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.3.2",
    "area": "Direito Digital",
    "descricao": "Contrato de desenvolvimento de we- bsite",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.3.3",
    "area": "Direito Digital",
    "descricao": "Contrato de desenvolvimento de apli- cativo",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.3.4",
    "area": "Direito Digital",
    "descricao": "Contrato de fornecimento de tecnolo- gia",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.3.5",
    "area": "Direito Digital",
    "descricao": "Contrato de cessão de uso de tec- nologia e/ou software",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.3.6",
    "area": "Direito Digital",
    "descricao": "Contrato de cessão de tecnologia e/ ou software",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.3.7",
    "area": "Direito Digital",
    "descricao": "Contrato de cooperação tecnológica",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.3.8",
    "area": "Direito Digital",
    "descricao": "Contrato de escrow (código-fonte)",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": 3216.44,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.4.1",
    "area": "Direito Digital",
    "descricao": "Contrato de marketing digital",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.4.2",
    "area": "Direito Digital",
    "descricao": "Contrato de gestão de tráfego",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.4.3",
    "area": "Direito Digital",
    "descricao": "Contrato de social média/gestão de mídias sociais",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.4.4",
    "area": "Direito Digital",
    "descricao": "Contrato de copywriting",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.4.5",
    "area": "Direito Digital",
    "descricao": "Contrato de criação de branding",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.4.6",
    "area": "Direito Digital",
    "descricao": "Contrato de parceria para lançamen- to de produto digital",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.4.7",
    "area": "Direito Digital",
    "descricao": "Contrato de agenciamento de digital influencer",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.5.1",
    "area": "Direito Digital",
    "descricao": "Ação de desbloqueio e/ou reativação de conta digital",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.5.2",
    "area": "Direito Digital",
    "descricao": "Ação de desbloqueio e/ou reativa- ção de conta em marketplace",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.5.3",
    "area": "Direito Digital",
    "descricao": "Ação para remoção de conteúdo online",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.5.4",
    "area": "Direito Digital",
    "descricao": "Ação para identificação de usuário em plataforma digital",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "13.5.5",
    "area": "Direito Digital",
    "descricao": "Defesas judiciais e administrativas em ações relacionadas a direito digital",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "14.1",
    "area": "Direito Eleitoral",
    "descricao": "Representação Eleitoral, Ação de Investigação Judicial Eleitoral, Ação de Impugnação de Mandato Eletivo ou Ação de Impugnação de Registro de Candidatura",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10277.94,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "14.2",
    "area": "Direito Eleitoral",
    "descricao": "Ação cautelar eleitoral antecedente",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8601.62,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "14.3",
    "area": "Direito Eleitoral",
    "descricao": "Mandado de Segurança",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8601.62,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "14.4",
    "area": "Direito Eleitoral",
    "descricao": "Habeas Corpus",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8601.62,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "14.5",
    "area": "Direito Eleitoral",
    "descricao": "Defesa perante o juízo eleitoral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8601.62,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "14.6",
    "area": "Direito Eleitoral",
    "descricao": "Defesa perante ao TRE",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 17025.13,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "14.7",
    "area": "Direito Eleitoral",
    "descricao": "Defesa perante ao TSE",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 25521.97,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "14.8",
    "area": "Direito Eleitoral",
    "descricao": "Prestação de contas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10277.94,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "14.9",
    "area": "Direito Eleitoral",
    "descricao": "Ação de decretação de perda de mandato eletivo por infidelidade par- tidária e/ou reconhecimento de justa causa para desfiliação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10634.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "14.10",
    "area": "Direito Eleitoral",
    "descricao": "Consultoria e assessoramento jurídico mensal de partidos políticos (diretó- rios estaduais)",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "14.11",
    "area": "Direito Eleitoral",
    "descricao": "Assessoramento jurídico mensal do período da pré-campanha às conven- ções",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10634.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.1",
    "area": "Direito Empresarial",
    "descricao": "Assessoria na elaboração de contrato de franquia",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.2",
    "area": "Direito Empresarial",
    "descricao": "Ação revocatória",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.3.1",
    "area": "Direito Empresarial",
    "descricao": "Requerida pelo devedor (autofalên- cia) quanto pelo Credor, sobre o valor do crédito – ME/EPP",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.3.2",
    "area": "Direito Empresarial",
    "descricao": "Requerida pelo devedor (autofalên- cia) quanto pelo credor, sobre o valor do crédito",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.3.3",
    "area": "Direito Empresarial",
    "descricao": "Pedido de destituição/substituição de administrador judicial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10477.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.4.1",
    "area": "Direito Empresarial",
    "descricao": "Pedido e acompanhamento de recu- peração extrajudicial sobre o valor do passivo – ME/EPP",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.4.2",
    "area": "Direito Empresarial",
    "descricao": "Pedido e acompanhamento de recu- peração extrajudicial sobre o valor do passivo",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.4.3",
    "area": "Direito Empresarial",
    "descricao": "Elaboração e pedido de homologação de recuperação sobre o valor do pas- sivo",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.5.1",
    "area": "Direito Empresarial",
    "descricao": "Pedido e acompanhamento de re- cuperação judicial sobre o valor do passivo – ME/EPP",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.5.2",
    "area": "Direito Empresarial",
    "descricao": "Pedido e acompanhamento de re- cuperação judicial sobre o valor do passivo",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.5.3",
    "area": "Direito Empresarial",
    "descricao": "Pedido de destituição/substituição de administrador judicial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10477.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.6.1",
    "area": "Direito Empresarial",
    "descricao": "Habilitação/divergência administra- tiva",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.6.2",
    "area": "Direito Empresarial",
    "descricao": "Habilitação/impugnação judicial (so- bre o valor do crédito)",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.6.3",
    "area": "Direito Empresarial",
    "descricao": "Ação de retificação, reclassificação ou exclusão de crédito (artigo 19 da Lei 11.101/05)",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.6.4",
    "area": "Direito Empresarial",
    "descricao": "Não impugnados, sobre o valor habili- tado",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.6.5",
    "area": "Direito Empresarial",
    "descricao": "Impugnados, sobre o valor habilitado",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.6.6",
    "area": "Direito Empresarial",
    "descricao": "Pedido de restituição de afins",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.7.1",
    "area": "Direito Empresarial",
    "descricao": "Ação de dissolução parcial ou total de sociedade",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.7.2",
    "area": "Direito Empresarial",
    "descricao": "Incidente de desconsideração de personalidade jurídica (pedido de defesa)",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.7.3",
    "area": "Direito Empresarial",
    "descricao": "Dissolução e liquidação de socieda- des – sobre rateio recebido",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.7.4",
    "area": "Direito Empresarial",
    "descricao": "Dissolução e liquidação de socieda- des – sobre o valor do passivo (não incluída defesa criminal)",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.7.5",
    "area": "Direito Empresarial",
    "descricao": "Ação de nulidade de assembleia ou reunião de sócios",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4253.66,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.7.6",
    "area": "Direito Empresarial",
    "descricao": "Ação de responsabilidade de adminis- trador societário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5322.32,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.7.7",
    "area": "Direito Empresarial",
    "descricao": "Ação de anulação de constituição de pessoa jurídica",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5322.32,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.7.8",
    "area": "Direito Empresarial",
    "descricao": "Ação de exigir contas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5322.32,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.8.1",
    "area": "Direito Empresarial",
    "descricao": "Memorando de entendimentos e/ou Letter Of Intentions",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1592.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.8.2",
    "area": "Direito Empresarial",
    "descricao": "Contrato social de sociedade LTDA",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.8.3",
    "area": "Direito Empresarial",
    "descricao": "Estatuto Societário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.8.4",
    "area": "Direito Empresarial",
    "descricao": "Estatuto social de sociedade anônima e cooperativa",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.8.5",
    "area": "Direito Empresarial",
    "descricao": "Contrato social de sociedade com propósito específico",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4243.19,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.8.6",
    "area": "Direito Empresarial",
    "descricao": "Acordo de sócios e acordo de acio- nistas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4243.19,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.8.7",
    "area": "Direito Empresarial",
    "descricao": "Acompanhamento de fusão e aquisi- ção",
    "tipo": "percentual",
    "percentual_minimo": 3.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "15.8.8",
    "area": "Direito Empresarial",
    "descricao": "Mutação societária",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.9.1",
    "area": "Direito Empresarial",
    "descricao": "Pedido de registro de marca",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1592.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.9.2",
    "area": "Direito Empresarial",
    "descricao": "Pedido de registro de patente",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3729.81,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.9.3",
    "area": "Direito Empresarial",
    "descricao": "Ação de nulidade de registro de marca",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4243.19,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.9.4",
    "area": "Direito Empresarial",
    "descricao": "Ação de nulidade de registro de pa- tente",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6370.02,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "15.9.5",
    "area": "Direito Empresarial",
    "descricao": "Contrato de autorização, licença e/ou uso",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2126.83,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.1.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7721.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.1.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5566.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.2.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.2.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.3.1",
    "area": "Direito de Família",
    "descricao": "Sem bens a serem partilhados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9358.06,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.3.2",
    "area": "Direito de Família",
    "descricao": "Com bens a serem partilhados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9588.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.4.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3687.9,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.4.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2477.81,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.5.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.5.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.6.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6442.31,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.6.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5520.33,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.7.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.7.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.8.1",
    "area": "Direito de Família",
    "descricao": "Sem bens a serem partilhados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8770.3,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.8.2",
    "area": "Direito de Família",
    "descricao": "Com bens a serem partilhados e/ou guarda ou alimentos",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.9.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3860.77,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.9.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2466.29,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.10.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.10.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.11.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4598.36,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.11.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3238.44,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.12.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.12.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.13.1",
    "area": "Direito de Família",
    "descricao": "Sem bens a serem partilhados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5520.33,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.13.2",
    "area": "Direito de Família",
    "descricao": "Com bens a serem partilhados e/ou guarda ou alimentos",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.14.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6350.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.14.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4624.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.15.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7571.73,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.15.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6061.99,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.16.1",
    "area": "Direito de Família",
    "descricao": "Sem bens a serem partilhados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7571.73,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.16.2",
    "area": "Direito de Família",
    "descricao": "Com bens a serem partilhados e/ou guarda ou alimentos",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.16.3",
    "area": "Direito de Família",
    "descricao": "Reconvenção",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.17.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4480.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.17.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2471.52,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.18.1",
    "area": "Direito de Família",
    "descricao": "Como patrono de ambas as partes",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.18.2",
    "area": "Direito de Família",
    "descricao": "Como patrono de uma das partes",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.19.1",
    "area": "Direito de Família",
    "descricao": "Provisórios (requeridos em caráter antecedente ou incidente)",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.19.2",
    "area": "Direito de Família",
    "descricao": "Ação de alimentos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4218.04,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.19.3",
    "area": "Direito de Família",
    "descricao": "Defesa nas execuções de alimentos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2535.43,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.19.4",
    "area": "Direito de Família",
    "descricao": "Revisão, exoneração, redução ou ma- joração",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.19.5",
    "area": "Direito de Família",
    "descricao": "Ação de oferta de alimentos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4218.04,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.20.1",
    "area": "Direito de Família",
    "descricao": "Alimentos transitórios",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.20.2",
    "area": "Direito de Família",
    "descricao": "Alimentos compensatórios",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.20.3",
    "area": "Direito de Família",
    "descricao": "Defesa e acompanhamento",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2812.03,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.21.1",
    "area": "Direito de Família",
    "descricao": "Alimentícia",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.21.2",
    "area": "Direito de Família",
    "descricao": "Impugnação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4679.03,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.22.1",
    "area": "Direito de Família",
    "descricao": "Habeas Corpus, relaxamento de pri- são por alimentos ou Mandado de Segurança",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4679.03,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.23.1",
    "area": "Direito de Família",
    "descricao": "Ação de guarda litigiosa",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9945.82,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.23.2",
    "area": "Direito de Família",
    "descricao": "Homologação de guarda",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3526.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.23.3",
    "area": "Direito de Família",
    "descricao": "Ação de alteração de guarda",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9945.82,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.23.4",
    "area": "Direito de Família",
    "descricao": "Defesa nas ações de guarda",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9945.82,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.23.5",
    "area": "Direito de Família",
    "descricao": "Conversão de guarda definitiva/pro- visória em adoção",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6905.39,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.23.6",
    "area": "Direito de Família",
    "descricao": "Ação de guarda litigiosa genitor(a) com residência fixa no exterior",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 11467.08,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.23.7",
    "area": "Direito de Família",
    "descricao": "Ação de modificação de guarda geni- tor(a) com residência fixa no exterior",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 11467.08,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.23.8",
    "area": "Direito de Família",
    "descricao": "Regulamentação de visitas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5601.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.1",
    "area": "Direito de Família",
    "descricao": "Nulidade ou anulação de casamento e/ou ação de nulidade de atos jurídi- cos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1178977.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.2",
    "area": "Direito de Família",
    "descricao": "Restabelecimento da sociedade con- jugal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3676.38,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.3",
    "area": "Direito de Família",
    "descricao": "Interdição",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5278.31,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.4",
    "area": "Direito de Família",
    "descricao": "Emancipação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3203.87,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.5",
    "area": "Direito de Família",
    "descricao": "Acompanhamento para emancipação voluntária",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1571.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.6",
    "area": "Direito de Família",
    "descricao": "Emancipação judicial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3203.87,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.7",
    "area": "Direito de Família",
    "descricao": "Suprimento de consentimento",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2593.06,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.8",
    "area": "Direito de Família",
    "descricao": "Busca e apreensão de menores inter- nacional-procedimento de repatria- ção",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 14624.84,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.9",
    "area": "Direito de Família",
    "descricao": "Busca e apreensão de menores nacio- nal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7018.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.10",
    "area": "Direito de Família",
    "descricao": "Ação judicial de alvará para venda judicial de bens de menores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5266.79,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.11",
    "area": "Direito de Família",
    "descricao": "Retificação de registro cível",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4563.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.12",
    "area": "Direito de Família",
    "descricao": "Separação de corpos requerida em caráter antecedente",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3203.87,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.13",
    "area": "Direito de Família",
    "descricao": "Sequestro de bens requerida em cará- ter antecedente",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4794.28,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.14",
    "area": "Direito de Família",
    "descricao": "Ação de declaratória de danos morais por abandono afetivo e outros decor- rentes da relação de afeto",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3987.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.15",
    "area": "Direito de Família",
    "descricao": "Autorização judicial para viagens de menor",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3745.53,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.16",
    "area": "Direito de Família",
    "descricao": "Ação de suprimento de outorga",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5036.29,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.17",
    "area": "Direito de Família",
    "descricao": "Contrato de namoro",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2927.27,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.18",
    "area": "Direito de Família",
    "descricao": "Contrato/minuta de união estável",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2927.27,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.19",
    "area": "Direito de Família",
    "descricao": "Ação de reconhecimento de união estável post mortem",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10533.58,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.20",
    "area": "Direito de Família",
    "descricao": "Ação declaratória ou incidental de alienação parental",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 11697.57,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.21",
    "area": "Direito de Família",
    "descricao": "Minuta de pacto antenupcial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9358.06,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.22",
    "area": "Direito de Família",
    "descricao": "Composição pré-processual CEJUSC",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3710.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.23",
    "area": "Direito de Família",
    "descricao": "Audiência de conciliação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3710.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.24",
    "area": "Direito de Família",
    "descricao": "Audiência de mediação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3710.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.25",
    "area": "Direito de Família",
    "descricao": "Audiência de instrução",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5854.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.26",
    "area": "Direito de Família",
    "descricao": "Acompanhamento com oficial de jus- tiça para cumprimento de mandados com a presença de força policial em ações de busca e apreensão de meno- res",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1257.24,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.27",
    "area": "Direito de Família",
    "descricao": "Diligências junto ao oficial de justiça para o cumprimento de mandados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 218.97,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.28",
    "area": "Direito de Família",
    "descricao": "Curatela litigiosa",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8182.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.29",
    "area": "Direito de Família",
    "descricao": "Tutela ou curatela (consensuais)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5278.31,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.30",
    "area": "Direito de Família",
    "descricao": "Ação de exibição de contas na cura- tela (valor mensal de manutenção)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 714.53,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.31",
    "area": "Direito de Família",
    "descricao": "Acompanhamento junto ao conselho tutelar para cliente prestar esclare- cimento sobre caso em observação pelo colegiado",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1257.24,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.32",
    "area": "Direito de Família",
    "descricao": "Acompanhamento junto à defensoria pública em sessões de conciliação/ mediação pré-processual de parte não assistida em material de família",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1257.24,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.33",
    "area": "Direito de Família",
    "descricao": "Contratos pós-nupciais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4714.65,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.34",
    "area": "Direito de Família",
    "descricao": "Diligências para habilitação em casa- mento",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1571.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.35",
    "area": "Direito de Família",
    "descricao": "Diligências junto à detetive particular em matéria de família",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 523.85,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.36",
    "area": "Direito de Família",
    "descricao": "Investigação de paternidade/mater- nidade",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7084.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.37",
    "area": "Direito de Família",
    "descricao": "Investigação com petição de herança ou alimentos",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "16.24.38",
    "area": "Direito de Família",
    "descricao": "Reconhecimento de paternidade/ma- ternidade – via judicial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5016.39,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.39",
    "area": "Direito de Família",
    "descricao": "Reconhecimento de paternidade/ma- ternidade – via administrativa",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2456.86,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.40",
    "area": "Direito de Família",
    "descricao": "Reconhecimento de paternidade/ma- ternidade – via administrativa",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7115.98,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.41",
    "area": "Direito de Família",
    "descricao": "Ação rescisória de reconhecimento de paternidade",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7115.98,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.42",
    "area": "Direito de Família",
    "descricao": "Pedido de medida protetiva em ação de família – lei 13.894/19",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5016.39,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.43",
    "area": "Direito de Família",
    "descricao": "Ação de alteração de regime de bens com bens a serem partilhados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6810.05,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "16.24.44",
    "area": "Direito de Família",
    "descricao": "Ação de alteração de regime de bens sem bens a serem partilhados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3666.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.1",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Acompanhamento do adolescente em delegacia especializada – em horário diurno (das 07h às 19h)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1791.57,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.2",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Acompanhamento do adolescente em delegacia especializada – em horário noturno (das 19h às 07h)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4497.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.3",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Audiência de oitiva informal perante o Ministério Público (audiência do art. 179 do Estatuto da Criança e do Ado- lescente)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.4",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Pedido de revogação de internação provisória",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7040.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.5",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Habeas Corpus no horário de expe- diente",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 14238.24,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.6",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Habeas Corpus perante plantão",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20954.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.7",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Defesa técnica em execução de medi- das socioeducativas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7040.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.8",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Acompanhamento da formulação do Plano Individual de Atendimento",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7040.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.9",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Impugnação ao Plano Individual de Atendimento",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7040.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.10",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Audiência de reavaliação de medida socioeducativa",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7040.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.11",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Defesa em procedimento de aplica- ção de sanção disciplinar a adoles- cente submetido a medida de interna- ção",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7040.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.12",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Pedido incidental (revogação, unifica- ção ou substituição de medida socio- educativa)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7040.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.13",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Procedimentos relativos a ações co- letivas e outros procedimentos espe- ciais previstos no Estatuto da Criança e do Adolescente",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 14982.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.14",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Representação de entidade em Ação civil Pública",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5992.84,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.15",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Defesa em procedimento relativo à imputação de irregularidades em en- tidades de atendimento e em proce- dimento relativo à aplicação de pena- lidades administrativas nos casos de infrações contra nor",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2692.59,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.1",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Ação de habilitação à adoção no SNA (Sistema Nacional de Adoção)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3834.58,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.2",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Ação de adoção de criança e adoles- cente já destituído do poder familiar",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5793.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.3",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Ação de adoção de maior de 18 anos consensual",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5793.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.4",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Ação de adoção de maior de 18 anos litigiosa",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7323.42,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.5",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Adoção direta (art. 50, parágrafo 13, ECA)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5793.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.6",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Adoção póstuma consensual",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5793.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.7",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Adoção póstuma litigiosa",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7323.42,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.8",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Conversão de guarda provisória em adoção consensual",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4473.68,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.9",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Adoção internacional de criança e adolescente residentes no Brasil (brasileiro residente exterior)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 13819.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.10",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Adoção internacional de criança e adolescente residentes em outro país signatário da Convenção de Haia (brasileiro residente no Brasil)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15945.99,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.11",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Adoção internacional de criança e adolescente residentes no Brasil por pretendentes estrangeiros (Conven- ção de Haia)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15945.99,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.12",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Destituição do poder familiar",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4452.73,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.13",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Acompanhamento como terceiro inte- ressado",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3195.49,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "17.16.14",
    "area": "Direito da Criança e do Adolescente",
    "descricao": "Ação de destituição do poder familiar c/c adoção",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6705.28,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "18.1",
    "area": "Direito das Sucessões",
    "descricao": "Inventário sem litígio, extrajudicial, sobre o monte mor ou quinhão de cada herdeiro e/ou meeira",
    "tipo": "percentual",
    "percentual_minimo": 7.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.2",
    "area": "Direito das Sucessões",
    "descricao": "Inventário sem litígio, judicial, sobre o monte mor ou quinhão de cada her- deiro e/ou meeira",
    "tipo": "percentual",
    "percentual_minimo": 9.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.3",
    "area": "Direito das Sucessões",
    "descricao": "Inventário com litígio, sobre o monte mor ou quinhão de cada herdeiro e/ou meeira",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.4",
    "area": "Direito das Sucessões",
    "descricao": "Inventário negativo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4452.73,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "18.5",
    "area": "Direito das Sucessões",
    "descricao": "Reserva de bens requerida em caráter antecedente",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 4290.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.6",
    "area": "Direito das Sucessões",
    "descricao": "Remoção de inventariante",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7113.88,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "18.7",
    "area": "Direito das Sucessões",
    "descricao": "Ação de colação",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.8",
    "area": "Direito das Sucessões",
    "descricao": "Ação de doação inoficiosa",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.9",
    "area": "Direito das Sucessões",
    "descricao": "Abertura de testamento ou codicilo",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.10",
    "area": "Direito das Sucessões",
    "descricao": "Ação de nulidade de testamento",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.11",
    "area": "Direito das Sucessões",
    "descricao": "Ação anulatória de testamento",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.12",
    "area": "Direito das Sucessões",
    "descricao": "Ação de nulidade de partilha",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10665.59,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "18.13",
    "area": "Direito das Sucessões",
    "descricao": "Ação de habilitação de herdeiros (sobre o valor habilitado)",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.14",
    "area": "Direito das Sucessões",
    "descricao": "Ação de habilitação de crédito (sobre o valor habilitado)",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.15",
    "area": "Direito das Sucessões",
    "descricao": "Ação declaratória de indignidade",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.16",
    "area": "Direito das Sucessões",
    "descricao": "Ação declaratória de deserdação",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.17",
    "area": "Direito das Sucessões",
    "descricao": "Retificação de partilha",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.18",
    "area": "Direito das Sucessões",
    "descricao": "Ação de sonegados",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.19",
    "area": "Direito das Sucessões",
    "descricao": "Ação de petição de herança",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.20",
    "area": "Direito das Sucessões",
    "descricao": "Planejamento sucessório – holding familiar",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.21",
    "area": "Direito das Sucessões",
    "descricao": "Ação de alvará para levantamento de valores e transferências de bens",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "18.22",
    "area": "Direito das Sucessões",
    "descricao": "Ação de registro de óbito tardio",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3792.67,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "18.23",
    "area": "Direito das Sucessões",
    "descricao": "Minuta de testamento e/ou assistên- cia ao ato e a abertura de testamento",
    "tipo": "percentual",
    "percentual_minimo": 7.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "19.1.1",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Ação de despejo",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "19.1.2",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Renovatória de locação",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "19.1.3",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Revisional e/ou arbitramento de aluguel",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "19.1.4",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Consignação de aluguel ou de chaves",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "19.1.5",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Adjudicação compulsória por ofensa direito de preferência",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "19.1.6",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Ato/acompanhamento de despejo e/ ou reintegração",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2126.83,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.1.7",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Pedido de restituição de depósito ou caução",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "19.1.8",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Notificação extrajudicial relacionada à locação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 848.64,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.1",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Assessoria jurídica mensal simples (restringida à consultoria do condo- mínio)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1047.7,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.2",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Assessoria jurídica mensal intermedi- ária (restringida à consultoria e as- sembleias, conforme contrato)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1885.86,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.3",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Assessoria jurídica mensal abran- gente (consultoria em condomínio, comparecimento em assembleias, e representação judicial e extrajudicial do condomínio conforme contrato)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.4",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Consulta jurídica pontual/presencial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 628.62,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.5",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Representação em assembleias",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 890.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.6",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Confecção de ata de assembleia",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 523.85,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.7",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Elaboração de convenção ou Regi- mento Interno",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.8",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Alteração de Convenção ou Regimen- to Interno",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3666.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.9",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Elaboração de estatutos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4714.65,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.10",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Elaboração de comunicados em geral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 471.47,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.11",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Elaboração de contratos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.12",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Revisão de contratos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1309.63,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.13",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Parecer simples",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1519.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.14",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Parecer complexo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2619.25,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.15",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Carta de advertência e/ou imposição de multa a condômino infrator",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 471.47,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "19.2.16",
    "area": "Direito Imobiliário e Urbanístico",
    "descricao": "Registro de contratos condominiais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1309.63,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.1.1",
    "area": "Direito Internacional",
    "descricao": "Naturalização",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12760.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.1.2",
    "area": "Direito Internacional",
    "descricao": "Cidadania originária",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 14036.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.1.3",
    "area": "Direito Internacional",
    "descricao": "Defesa contra a perda de nacionali- dade brasileira",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 39100.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.1.4",
    "area": "Direito Internacional",
    "descricao": "Pedido de reaquisição de nacionali- dade brasileira",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7941.57,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.1.5",
    "area": "Direito Internacional",
    "descricao": "Pedido de reconhecimento a uma pes- soa à condição de apátrida",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7941.57,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.1.6",
    "area": "Direito Internacional",
    "descricao": "Recurso inominado",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20472.06,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.1.7",
    "area": "Direito Internacional",
    "descricao": "Defesa na expulsão, banimento e ex- tradição de estrangeiro no Brasil",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 28072.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.2.1",
    "area": "Direito Internacional",
    "descricao": "Administrador, gerente, diretor ou executivo com poderes de gestão para representar sociedade civil ou comercial, grupo ou conglomerado econômico (pessoa jurídica)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8245.4,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.2.2",
    "area": "Direito Internacional",
    "descricao": "Realização de investimento de pessoa física e empresa jurídica no país",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8245.4,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.2.3",
    "area": "Direito Internacional",
    "descricao": "Fins de trabalho com vínculo empre- gatício no Brasil",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 14036.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.2.4",
    "area": "Direito Internacional",
    "descricao": "Prestação de serviços de assistência técnica (sem vínculo empregatício)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3666.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.2.5",
    "area": "Direito Internacional",
    "descricao": "Transferência de tecnologia (sem vín- culo empregatício)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3666.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.2.6",
    "area": "Direito Internacional",
    "descricao": "Demais autorizações de residência prévia, residência e/ou renovação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3666.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.2.7",
    "area": "Direito Internacional",
    "descricao": "Homologação de sentença estrangei- ra no Brasil perante o Superior Tribu- nal de Justiça (STJ)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 11000.85,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.3.1",
    "area": "Direito Internacional",
    "descricao": "Cadastro Declaratório de Não Resi- dente (RDE-CDNR)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3509.8,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.3.2",
    "area": "Direito Internacional",
    "descricao": "Emissão de Registro Declaratório Eletrônico – Investimento Estrangeiro Direto (RDE–IED)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2357.33,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.3.3",
    "area": "Direito Internacional",
    "descricao": "Registro de eventos societários peran- te o SISBACEN",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2357.33,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.4.1",
    "area": "Direito Internacional",
    "descricao": "Serviços junto à Polícia Federal – Imi- gração/Superintendência",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 817.21,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.4.2",
    "area": "Direito Internacional",
    "descricao": "Agendamento e acompanhamento para emissão de Carteira de Registro Nacional Migratório (CRNM, antigo RNE), após a emissão da autorização de residência prévia, residência ou renovação pelo Ministério do",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1833.48,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.4.3",
    "area": "Direito Internacional",
    "descricao": "Solicitação de refúgio",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 618.14,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.5.1",
    "area": "Direito Internacional",
    "descricao": "Elaboração de contrato internacional",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10634.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.5.2",
    "area": "Direito Internacional",
    "descricao": "Parecer sobre contrato internacional",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5322.32,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.6.1",
    "area": "Direito Internacional",
    "descricao": "Requerimento de Revalidação de diploma de Graduação ou Pós-Gradu- ação Stricto Sensu em uma instituição pública de ensino superior no Brasil",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3666.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.6.2",
    "area": "Direito Internacional",
    "descricao": "Recurso Administrativo em Revali- dação de diploma de Graduação ou Pós-Graduação Stricto Sensu em uma instituição pública de ensino superior no Brasil",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3666.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.7.1",
    "area": "Direito Internacional",
    "descricao": "Elaboração de instrumento de consti- tuição/estatuto de sociedade limitada ou por ações com capital estrangeiro e/ou sócios estrangeiros, pessoas físi- cas ou jurídicas e/ou administradores estrangeir",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12226.66,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.7.2",
    "area": "Direito Internacional",
    "descricao": "Alteração e consolidação de contrato social/estatuto de sociedade limitada ou por ações com capital estrangeiro e/ou sócios estrangeiros, pessoas físi- cas ou jurídicas e/ou administradores estrangeir",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6422.4,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.7.3",
    "area": "Direito Internacional",
    "descricao": "Elaboração de ata de reunião de só- cios quotistas ou assembleia de acio- nistas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2661.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.7.4",
    "area": "Direito Internacional",
    "descricao": "Elaboração de ato constitutivo de empresa individual de sociedade limi- tada (EIRELI) cujo titular seja pessoa física ou jurídica estrangeira",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3666.95,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "20.7.5",
    "area": "Direito Internacional",
    "descricao": "lteração e consolidação de ato consti- tutivo de empresa individual de socie- dade limitada (EIRELI) cujo titular seja pessoa física ou jurídica estrangeira",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1833.48,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.1.1",
    "area": "Direito Penal",
    "descricao": "Acompanhamento auto de prisão em flagrante (diurno)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2043.02,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.1.2",
    "area": "Direito Penal",
    "descricao": "Acompanhamento auto de prisão em flagrante (noturno)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4086.03,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.1.3",
    "area": "Direito Penal",
    "descricao": "Acompanhamento de inquérito poli- cial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6286.2,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.1.4",
    "area": "Direito Penal",
    "descricao": "Investigação defensiva",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9429.3,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.1.5",
    "area": "Direito Penal",
    "descricao": "Apresentação do cliente ou testemu- nha ou vítima",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2043.02,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.1.6",
    "area": "Direito Penal",
    "descricao": "Representação criminal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.1.7",
    "area": "Direito Penal",
    "descricao": "Delação ou colaboração premiada",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "21.2.1",
    "area": "Direito Penal",
    "descricao": "Rito comum ordinário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20954.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.2",
    "area": "Direito Penal",
    "descricao": "Rito comum sumário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.3",
    "area": "Direito Penal",
    "descricao": "Rito comum sumaríssimo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10477.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.4",
    "area": "Direito Penal",
    "descricao": "Queixa-crime",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.5",
    "area": "Direito Penal",
    "descricao": "Rito Especial Júri - 1 fase – (até decisão pronúncia)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.6",
    "area": "Direito Penal",
    "descricao": "Rito Especial Júri - 2 fase – (até a Sessão plenária)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.7",
    "area": "Direito Penal",
    "descricao": "Rito Especial da Lei 11.343/06 – (Lei Tráfico)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.8",
    "area": "Direito Penal",
    "descricao": "Rito da Lei 11.340/06 – (Lei Maria da Penha)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 11000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.9",
    "area": "Direito Penal",
    "descricao": "Rito do ECA",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10477.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.10",
    "area": "Direito Penal",
    "descricao": "Processo Lei 12.850/2013 - (Lei de Organização Criminosa)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 26192.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.11",
    "area": "Direito Penal",
    "descricao": "Processo Lei 9.613/1998 – (Lei de Lavagem de Dinheiro)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 26192.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.12",
    "area": "Direito Penal",
    "descricao": "Processo da Lei 8.137/1990",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 26192.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.13",
    "area": "Direito Penal",
    "descricao": "Processo Lei 960/1998 – (Lei de Crimes Ambientais)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 26192.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.2.14",
    "area": "Direito Penal",
    "descricao": "Processo de crimes eleitorais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 26192.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.3.1",
    "area": "Direito Penal",
    "descricao": "Recurso em sentido estrito",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10477.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.3.2",
    "area": "Direito Penal",
    "descricao": "Recurso de apelação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10477.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.3.3",
    "area": "Direito Penal",
    "descricao": "Embargos de declaração",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4190.8,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.3.4",
    "area": "Direito Penal",
    "descricao": "Embargos infringentes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4190.8,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.3.5",
    "area": "Direito Penal",
    "descricao": "Carta testemunhável",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4190.8,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.3.6",
    "area": "Direito Penal",
    "descricao": "Correição parcial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4190.8,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.3.7",
    "area": "Direito Penal",
    "descricao": "Revisão criminal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.3.8",
    "area": "Direito Penal",
    "descricao": "Agravo em execução penal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8381.6,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.4.1",
    "area": "Direito Penal",
    "descricao": "Recurso ordinário em Habeas Corpus",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.4.2",
    "area": "Direito Penal",
    "descricao": "Recurso ordinário em Mandado de Segurança em matéria criminal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.4.3",
    "area": "Direito Penal",
    "descricao": "Recurso Especial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.4.4",
    "area": "Direito Penal",
    "descricao": "Recurso Extraordinário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.4.5",
    "area": "Direito Penal",
    "descricao": "Reclamação na esfera penal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10477.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.5.1",
    "area": "Direito Penal",
    "descricao": "Pedido de revogação de prisão",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.5.2",
    "area": "Direito Penal",
    "descricao": "Pedido de relaxamento de prisão",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.5.3",
    "area": "Direito Penal",
    "descricao": "Pedido fiança criminal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3352.64,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.5.4",
    "area": "Direito Penal",
    "descricao": "Audiência de custódia",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4700.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.5.5",
    "area": "Direito Penal",
    "descricao": "Acordo de não persecução penal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.5.6",
    "area": "Direito Penal",
    "descricao": "Habeas Corpus perante Juízo Singular",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5709.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.5.7",
    "area": "Direito Penal",
    "descricao": "Habeas Corpus perante Tribunais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7333.9,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.5.8",
    "area": "Direito Penal",
    "descricao": "Habeas Corpus perante Tribunais Su- periores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12572.4,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.5.9",
    "area": "Direito Penal",
    "descricao": "Mandado de Segurança em matéria criminal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7333.9,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.6.1",
    "area": "Direito Penal",
    "descricao": "Transação Penal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.6.2",
    "area": "Direito Penal",
    "descricao": "Suspensão condicional do processo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.6.3",
    "area": "Direito Penal",
    "descricao": "Suspensão condicional da pena",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.7.1",
    "area": "Direito Penal",
    "descricao": "Visita em presídio",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 838.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.7.2",
    "area": "Direito Penal",
    "descricao": "Progressão de regime",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3300.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.7.3",
    "area": "Direito Penal",
    "descricao": "Livramento condicional",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3300.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.7.4",
    "area": "Direito Penal",
    "descricao": "Insanidade mental do acusado",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.7.5",
    "area": "Direito Penal",
    "descricao": "Reabilitação criminal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.7.6",
    "area": "Direito Penal",
    "descricao": "Defesa em PAD",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.8.1",
    "area": "Direito Penal",
    "descricao": "Consulta – presencial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.8.2",
    "area": "Direito Penal",
    "descricao": "Consulta – virtual",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 300.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.8.3",
    "area": "Direito Penal",
    "descricao": "Parecer",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.9.1",
    "area": "Direito Penal",
    "descricao": "Perante Tribunais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.9.2",
    "area": "Direito Penal",
    "descricao": "Perante Tribunais Superiores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.10.1",
    "area": "Direito Penal",
    "descricao": "Rito comum ordinário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10477.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.10.2",
    "area": "Direito Penal",
    "descricao": "Rito comum sumário",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8381.6,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.10.3",
    "area": "Direito Penal",
    "descricao": "Rito Comum sumaríssimo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.10.4",
    "area": "Direito Penal",
    "descricao": "Rito Especial Júri – 1 fase",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "21.10.5",
    "area": "Direito Penal",
    "descricao": "Rito Especial Júri – 2 fase",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.1",
    "area": "Direito Militar",
    "descricao": "Promoção Militar",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.2",
    "area": "Direito Militar",
    "descricao": "Ficha de Apuração Disciplinar (FATD)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.3",
    "area": "Direito Militar",
    "descricao": "Sindicância Militar",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.4",
    "area": "Direito Militar",
    "descricao": "Conselho de Disciplina",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.5",
    "area": "Direito Militar",
    "descricao": "Conselho de Justificação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.6",
    "area": "Direito Militar",
    "descricao": "Diligências e Despachos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 800.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.7",
    "area": "Direito Militar",
    "descricao": "Acompanhamento do militar",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.8",
    "area": "Direito Militar",
    "descricao": "Promoção Militar",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "22.9",
    "area": "Direito Militar",
    "descricao": "Atuação em inquérito policial militar",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.10",
    "area": "Direito Militar",
    "descricao": "Ato Judicial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5621.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.11",
    "area": "Direito Militar",
    "descricao": "Atos em órgãos policiais (07:00h as 19:00h)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.12",
    "area": "Direito Militar",
    "descricao": "Atos em órgãos policiais (19:00h as 07:00h)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4800.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.13",
    "area": "Direito Militar",
    "descricao": "Exame de processo penal militar com parecer verbal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.14",
    "area": "Direito Militar",
    "descricao": "Defesa em procedimento comum",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 14500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.15",
    "area": "Direito Militar",
    "descricao": "Defesa em procedimentos especiais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 28072.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.16",
    "area": "Direito Militar",
    "descricao": "Assistência a acusação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 14500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.17",
    "area": "Direito Militar",
    "descricao": "Atuação em processo de execução penal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12115.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.18",
    "area": "Direito Militar",
    "descricao": "Apelação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.19",
    "area": "Direito Militar",
    "descricao": "Elaboração e Apresentação de Memoriais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5300.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.20",
    "area": "Direito Militar",
    "descricao": "Sustentação Oral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.21",
    "area": "Direito Militar",
    "descricao": "Embargos Infringentes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5270.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.22",
    "area": "Direito Militar",
    "descricao": "Embargos Declaratórios",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.23",
    "area": "Direito Militar",
    "descricao": "Correição Parcial (Razões e Contrarrazões)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5270.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.24",
    "area": "Direito Militar",
    "descricao": "Recurso em sentido estrito(Razões e Contrarrazões)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5621.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.25",
    "area": "Direito Militar",
    "descricao": "Reclamação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5300.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.26",
    "area": "Direito Militar",
    "descricao": "Revisão",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5300.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.27",
    "area": "Direito Militar",
    "descricao": "Atuação em processo de competência originária no Tribunal",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "22.28",
    "area": "Direito Militar",
    "descricao": "Reintegração do Militar na esfera Estadual",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "22.29",
    "area": "Direito Militar",
    "descricao": "Reintegração do Militar na esfera Federal",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "22.30",
    "area": "Direito Militar",
    "descricao": "Reforma Militar Estadual",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "22.31",
    "area": "Direito Militar",
    "descricao": "Reforma Militar Federal",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "22.32",
    "area": "Direito Militar",
    "descricao": "Incapacidade do Militar Estadual ou Federal",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "23.1.1",
    "area": "Direito Municipalista",
    "descricao": "Municípios até 5 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.1.2",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 5 mil a 15 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12017.12,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.1.3",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 15 mil a 40 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 16448.89,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.1.4",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 40 mil a 60 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 18973.85,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.1.5",
    "area": "Direito Municipalista",
    "descricao": "Municípios de acima 60 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 22777.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.2.1",
    "area": "Direito Municipalista",
    "descricao": "Municípios até 5 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6328.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.2.2",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 5 mil a 15 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8863.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.2.3",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 15 mil a 40 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.2.4",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 40 mil a 60 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.2.5",
    "area": "Direito Municipalista",
    "descricao": "Municípios de acima 60 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20241.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.3.1",
    "area": "Direito Municipalista",
    "descricao": "Municípios até 5 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6328.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.3.2",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 5 mil a 15 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8863.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.3.3",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 15 mil a 40 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.3.4",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 40 mil a 60 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.3.5",
    "area": "Direito Municipalista",
    "descricao": "Municípios de acima 60 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20241.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.4.1",
    "area": "Direito Municipalista",
    "descricao": "Municípios até 5 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6328.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.4.2",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 5 mil a 15 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8224.45,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.4.3",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 15 mil a 40 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.4.4",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 40 mil a 60 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 14552.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.4.5",
    "area": "Direito Municipalista",
    "descricao": "Municípios de acima 60 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 18973.85,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.5.1",
    "area": "Direito Municipalista",
    "descricao": "Municípios até 5 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.5.2",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 5 mil a 15 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12017.12,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.5.3",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 15 mil a 40 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 16448.89,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.5.4",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 40 mil a 60 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 18973.85,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.5.5",
    "area": "Direito Municipalista",
    "descricao": "Municípios de acima 60 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 22777.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.6.1",
    "area": "Direito Municipalista",
    "descricao": "Municípios até 5 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6328.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.6.2",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 5 mil a 15 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8863.54,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.6.3",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 15 mil a 40 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.6.4",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 40 mil a 60 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.6.5",
    "area": "Direito Municipalista",
    "descricao": "Municípios de acima 60 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20241.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.7.1",
    "area": "Direito Municipalista",
    "descricao": "Municípios até 5 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.7.2",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 5 mil a 15 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.7.3",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 15 mil a 40 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 18973.85,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.7.4",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 40 mil a 60 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 21509.28,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.7.5",
    "area": "Direito Municipalista",
    "descricao": "Municípios de acima 60 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 25301.96,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.8.1",
    "area": "Direito Municipalista",
    "descricao": "Municípios até 5 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5060.39,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.8.2",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 5 mil a 15 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6705.28,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.8.3",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 15 mil a 40 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 9492.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.8.4",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 40 mil a 60 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10759.88,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.8.5",
    "area": "Direito Municipalista",
    "descricao": "Municípios de acima 60 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10560.82,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.9.1",
    "area": "Direito Municipalista",
    "descricao": "Municípios até 5 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.9.2",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 5 mil a 15 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 11828.53,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.9.3",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 15 mil a 40 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.9.4",
    "area": "Direito Municipalista",
    "descricao": "Municípios de 40 mil a 60 mil habitan- tes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 18973.85,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.9.5",
    "area": "Direito Municipalista",
    "descricao": "Municípios de acima 60 mil habitantes",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 25301.96,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.10.1",
    "area": "Direito Municipalista",
    "descricao": "Em causas até o valor de R$ 50.000,00",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5605.2,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.10.2",
    "area": "Direito Municipalista",
    "descricao": "Em causas até o valor de R$ 100.000,00",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10099.83,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.10.3",
    "area": "Direito Municipalista",
    "descricao": "Em causas até o valor de R$ 250.000,00",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 11220.87,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.10.4",
    "area": "Direito Municipalista",
    "descricao": "Em causas até o valor de R$ 500.000,00",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 16826.06,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.10.5",
    "area": "Direito Municipalista",
    "descricao": "Em causas até o valor de R$ 1.000.000,00",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 33641.65,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.11.1",
    "area": "Direito Municipalista",
    "descricao": "Pareceres em geral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.11.2",
    "area": "Direito Municipalista",
    "descricao": "Assessoramento e consultoria em pro- cedimentos administrativos em geral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.12.1",
    "area": "Direito Municipalista",
    "descricao": "Composta por 09 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6328.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.12.2",
    "area": "Direito Municipalista",
    "descricao": "Composta por 11 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.12.3",
    "area": "Direito Municipalista",
    "descricao": "Composta por 13 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12656.22,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.12.4",
    "area": "Direito Municipalista",
    "descricao": "Composta por 15 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.12.5",
    "area": "Direito Municipalista",
    "descricao": "Composta por 17 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 17716.61,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.12.6",
    "area": "Direito Municipalista",
    "descricao": "Composta por 19 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20241.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.12.7",
    "area": "Direito Municipalista",
    "descricao": "Composta por 21 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 22777.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.12.8",
    "area": "Direito Municipalista",
    "descricao": "Composta por 23 ou mais vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 25301.96,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.13.1",
    "area": "Direito Municipalista",
    "descricao": "Composta por 09 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6328.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.13.2",
    "area": "Direito Municipalista",
    "descricao": "Composta por 11 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.13.3",
    "area": "Direito Municipalista",
    "descricao": "Composta por 13 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12656.22,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.13.4",
    "area": "Direito Municipalista",
    "descricao": "Composta por 15 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.13.5",
    "area": "Direito Municipalista",
    "descricao": "Composta por 17 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 17716.61,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.13.6",
    "area": "Direito Municipalista",
    "descricao": "Composta por 19 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20241.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.13.7",
    "area": "Direito Municipalista",
    "descricao": "Composta por 21 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 22777.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.13.8",
    "area": "Direito Municipalista",
    "descricao": "Composta por 23 ou mais vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 25301.96,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.14.1",
    "area": "Direito Municipalista",
    "descricao": "Composta por 09 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6328.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.14.2",
    "area": "Direito Municipalista",
    "descricao": "Composta por 11 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.14.3",
    "area": "Direito Municipalista",
    "descricao": "Composta por 13 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12656.22,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.14.4",
    "area": "Direito Municipalista",
    "descricao": "Composta por 15 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.14.5",
    "area": "Direito Municipalista",
    "descricao": "Composta por 17 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 17716.61,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.14.6",
    "area": "Direito Municipalista",
    "descricao": "Composta por 19 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20241.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.14.7",
    "area": "Direito Municipalista",
    "descricao": "Composta por 21 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 22777.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.14.8",
    "area": "Direito Municipalista",
    "descricao": "Composta por 23 ou mais vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 25301.96,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.15.1",
    "area": "Direito Municipalista",
    "descricao": "Composta por até 15 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.15.2",
    "area": "Direito Municipalista",
    "descricao": "Composta por até 19 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.15.3",
    "area": "Direito Municipalista",
    "descricao": "Composta por até 21 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 17077.51,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.16.1",
    "area": "Direito Municipalista",
    "descricao": "Composta por até 15 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.16.2",
    "area": "Direito Municipalista",
    "descricao": "Composta por até 19 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20241.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.16.3",
    "area": "Direito Municipalista",
    "descricao": "Composta por até 21 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 24673.34,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.17.1",
    "area": "Direito Municipalista",
    "descricao": "a) Composta por 09 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6328.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.17.2",
    "area": "Direito Municipalista",
    "descricao": "b) Composta por 11 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10120.78,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.17.3",
    "area": "Direito Municipalista",
    "descricao": "c) Composta por 13 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12656.22,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.17.4",
    "area": "Direito Municipalista",
    "descricao": "d) Composta por 15 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15181.17,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.17.5",
    "area": "Direito Municipalista",
    "descricao": "e) Composta por 17 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 17716.61,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.17.6",
    "area": "Direito Municipalista",
    "descricao": "f) Composta por 19 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 20241.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.17.7",
    "area": "Direito Municipalista",
    "descricao": "g) Composta por 21 vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 22777.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "23.17.8",
    "area": "Direito Municipalista",
    "descricao": "h) Composta por 23 ou mais vereadores",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 25301.96,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.1.1",
    "area": "Direito do Trabalho",
    "descricao": "Patrocínio do Reclamante/Recla- mado, sobre o valor do acordo ou da condenação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3680.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.2.1",
    "area": "Direito do Trabalho",
    "descricao": "Com até 500 empregados",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.2.2",
    "area": "Direito do Trabalho",
    "descricao": "Entre 500 e 1.000 empregados",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.2.3",
    "area": "Direito do Trabalho",
    "descricao": "Acima de 1.000 empregados",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.2.4",
    "area": "Direito do Trabalho",
    "descricao": "Representação em dissídio coletivo de natureza jurídica",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 11199.91,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.3.1",
    "area": "Direito do Trabalho",
    "descricao": "Agravo de instrumento",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 3856.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.3.2",
    "area": "Direito do Trabalho",
    "descricao": "Contraminuta de agravo de instru- mento",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 3856.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.3.3",
    "area": "Direito do Trabalho",
    "descricao": "Agravo de petição",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 3856.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.3.4",
    "area": "Direito do Trabalho",
    "descricao": "Contraminuta de agravo de petição",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 3856.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.3.5",
    "area": "Direito do Trabalho",
    "descricao": "Recursos ordinários",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 3740.29,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.3.6",
    "area": "Direito do Trabalho",
    "descricao": "Recurso de revista",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 6500.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.3.7",
    "area": "Direito do Trabalho",
    "descricao": "Contrarrazões de recursos ordinários",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.3.8",
    "area": "Direito do Trabalho",
    "descricao": "Recurso Extraordinário",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.3.9",
    "area": "Direito do Trabalho",
    "descricao": "Contrarrazões de Recurso Extraordi- nário",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.3.10",
    "area": "Direito do Trabalho",
    "descricao": "Agravo contra despacho denegatório de seguimento de Recurso Extraordi- nário",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.3.11",
    "area": "Direito do Trabalho",
    "descricao": "Contrarrazões de agravo contra des- pacho denegatório de seguimento de Recurso Extraordinário",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.4.1",
    "area": "Direito do Trabalho",
    "descricao": "Elaboração de petição inicial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1707.75,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.2",
    "area": "Direito do Trabalho",
    "descricao": "Elaboração de defesa",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1707.75,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.3",
    "area": "Direito do Trabalho",
    "descricao": "Acompanhamento de homologação de rescisão contratual",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1880.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.4",
    "area": "Direito do Trabalho",
    "descricao": "Comparecimento a audiência inaugu- ral (presencial ou virtual)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1880.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.5",
    "area": "Direito do Trabalho",
    "descricao": "Comparecimento a audiência de ins- trução (presencial ou virtual)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1912.05,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.6",
    "area": "Direito do Trabalho",
    "descricao": "Comparecimento a audiência de con- ciliação (presencial ou virtual)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1880.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.7",
    "area": "Direito do Trabalho",
    "descricao": "Comparecimento a audiência de en- cerramento de instrução (presencial ou virtual)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1880.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.8",
    "area": "Direito do Trabalho",
    "descricao": "Embargos de devedor",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 2790.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.4.9",
    "area": "Direito do Trabalho",
    "descricao": "Embargos de terceiros",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.4.10",
    "area": "Direito do Trabalho",
    "descricao": "Embargos de declaração",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2790.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.11",
    "area": "Direito do Trabalho",
    "descricao": "Execução",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 2790.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.4.12",
    "area": "Direito do Trabalho",
    "descricao": "Pareceres escritos em geral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4505.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.13",
    "area": "Direito do Trabalho",
    "descricao": "Ação rescisória trabalhista",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.4.14",
    "area": "Direito do Trabalho",
    "descricao": "Contestação de ação rescisória",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.4.15",
    "area": "Direito do Trabalho",
    "descricao": "Ação de reintegração de empregado (sob o proveito econômico)",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.4.16",
    "area": "Direito do Trabalho",
    "descricao": "Inquérito para apuração de falta grave",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3824.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.17",
    "area": "Direito do Trabalho",
    "descricao": "Sustentação oral (presencial ou virtual)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3856.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.18",
    "area": "Direito do Trabalho",
    "descricao": "Acompanhamento no TRT",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1917.29,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.19",
    "area": "Direito do Trabalho",
    "descricao": "Elaboração de memoriais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1602.98,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.20",
    "area": "Direito do Trabalho",
    "descricao": "Apresentação de cálculos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1707.75,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.21",
    "area": "Direito do Trabalho",
    "descricao": "Impugnação de cálculos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1707.75,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.22",
    "area": "Direito do Trabalho",
    "descricao": "Mandado de Segurança",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3824.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.23",
    "area": "Direito do Trabalho",
    "descricao": "Resposta ao Mandado de Segurança",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3824.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.24",
    "area": "Direito do Trabalho",
    "descricao": "Ação cautelar (requerida em caráter antecedente)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3824.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.25",
    "area": "Direito do Trabalho",
    "descricao": "Contestação de ação cautelar",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3824.11,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.4.26",
    "area": "Direito do Trabalho",
    "descricao": "Petição interlocutória",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 450.51,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.5.1",
    "area": "Direito do Trabalho",
    "descricao": "Elaboração de estatuto",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 14929.73,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.5.2",
    "area": "Direito do Trabalho",
    "descricao": "Confecção de edital",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3740.29,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.5.3",
    "area": "Direito do Trabalho",
    "descricao": "Assessoria presencial em assembleia (a hora)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 754.34,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.5.4",
    "area": "Direito do Trabalho",
    "descricao": "Registro do sindicato no MP (sem im- pugnação)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3740.29,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.5.5",
    "area": "Direito do Trabalho",
    "descricao": "Registro do sindicato no MP (com im- pugnação)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7470.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.5.6",
    "area": "Direito do Trabalho",
    "descricao": "Impugnação de registro sindical",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3740.29,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.6.1",
    "area": "Direito do Trabalho",
    "descricao": "Participações ou assessoria em as- sembleia da categoria – no domicílio do profissional (a hora)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 534.33,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.6.2",
    "area": "Direito do Trabalho",
    "descricao": "Participações ou assessoria em as- sembleia da categoria – fora do domi- cílio do profissional (a hora)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 743.87,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.6.3",
    "area": "Direito do Trabalho",
    "descricao": "Assessoria ou participação de reunião de diretoria e conselho ou outros ór- gãos internos – no domicílio do profis- sional (a hora)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 534.33,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.6.4",
    "area": "Direito do Trabalho",
    "descricao": "Assessoria ou participação de reu- nião de diretoria e conselho ou outros órgãos internos – fora do domicílio do profissional (a hora)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 764.82,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.1",
    "area": "Direito do Trabalho",
    "descricao": "Elaboração de regimento ou regula- mento eleitoral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7501.53,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.2",
    "area": "Direito do Trabalho",
    "descricao": "Elaboração de edital",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 764.82,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.3",
    "area": "Direito do Trabalho",
    "descricao": "Integrar como membro da comissão eleitoral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7501.53,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.4",
    "area": "Direito do Trabalho",
    "descricao": "Integrar como presidente da comis- são eleitoral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15024.02,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.5",
    "area": "Direito do Trabalho",
    "descricao": "Assessoria de comissão eleitoral (a hora)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 534.33,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.6",
    "area": "Direito do Trabalho",
    "descricao": "Impugnação de chapas ou candidatos eleitorais",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1613.46,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.7",
    "area": "Direito do Trabalho",
    "descricao": "Impugnação de resultado de eleições e associações",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4127.94,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.8",
    "area": "Direito do Trabalho",
    "descricao": "Consultas a diretores e/ou outros de matéria sindical",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 754.34,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.9",
    "area": "Direito do Trabalho",
    "descricao": "Assessoria em processos disciplina- res, em geral, para aplicar penalidade a diretor ou associado – atuação no polo ativo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3761.24,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.10",
    "area": "Direito do Trabalho",
    "descricao": "Assessoria em processos disciplina- res, em geral, para aplicar penalidade a diretor ou associado – atuação no polo passivo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7512.01,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.11",
    "area": "Direito do Trabalho",
    "descricao": "Mensalidades sindicais não consigna- das em folha – cobrança extrajudicial (cumulativo)",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.7.12",
    "area": "Direito do Trabalho",
    "descricao": "Mensalidades sindicais não consig- nadas em folha – cobrança judicial (cumulativo)",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.7.13",
    "area": "Direito do Trabalho",
    "descricao": "Contribuição sindical anual não con- signada – cobrança extrajudicial",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.7.14",
    "area": "Direito do Trabalho",
    "descricao": "Contribuição sindical anual não con- signada – cobrança judicial",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.7.15",
    "area": "Direito do Trabalho",
    "descricao": "Contribuição sindicai anu ai consig- nada em folha – cobrança extrajudi- cial",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.7.16",
    "area": "Direito do Trabalho",
    "descricao": "Contribuição sindical anual consigna- da em folha – cobrança extrajudicial",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "24.7.17",
    "area": "Direito do Trabalho",
    "descricao": "Consultoria, sem vínculo empregatí- cio, a sindicatos de trabalhadores – com até 500 empregados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4054.6,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.18",
    "area": "Direito do Trabalho",
    "descricao": "Consultoria, sem vínculo empregatí- cio, a sindicatos de trabalhadores – entre 500 e 1.000 empregados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6160.48,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.19",
    "area": "Direito do Trabalho",
    "descricao": "Consultoria, sem vínculo empregatí- cio, a sindicatos de trabalhadores – acima de 1.000 empregados",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7512.01,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.7.20",
    "area": "Direito do Trabalho",
    "descricao": "Consultoria, sem vínculo empregatí- cio, a sindicatos de empresas – com até 10 empresas associadas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8402.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "25.1.1",
    "area": "Direito Tributário",
    "descricao": "Honorários iniciais sobre o valor eco- nômico real da causa",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "25.1.2",
    "area": "Direito Tributário",
    "descricao": "Honorários finais sobre o benefício",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 4086.03,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "25.2.1",
    "area": "Direito Tributário",
    "descricao": "Honorários iniciais sobre o valor eco- nômico real da causa",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "25.2.2",
    "area": "Direito Tributário",
    "descricao": "Honorários finais sobre o benefício",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 4086.03,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "25.3.1",
    "area": "Direito Tributário",
    "descricao": "Honorários iniciais sobre o valor eco- nômico real da causa",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "25.3.2",
    "area": "Direito Tributário",
    "descricao": "Honorários finais sobre o benefício",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 5313.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "25.4.1",
    "area": "Direito Tributário",
    "descricao": "Sobre o valor dos bens",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": 8426.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "25.5.1",
    "area": "Direito Tributário",
    "descricao": "Honorários iniciais sobre o valor eco- nômico real da causa",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "25.5.2",
    "area": "Direito Tributário",
    "descricao": "Honorários finais sobre o benefício",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 4086.03,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "25.6.1",
    "area": "Direito Tributário",
    "descricao": "Parecer sobre interpretação de nor- mas tributárias, planejamento tribu- tário ou qualquer tipo de lançamento realizado contra o interessado pelo fisco",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6800.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "25.7.1",
    "area": "Direito Tributário",
    "descricao": "Micro e pequena empresa / SIMPLES",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2724.02,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "25.7.2",
    "area": "Direito Tributário",
    "descricao": "Ltda./LUCRO PRESUMIDO",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7480.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "25.7.3",
    "area": "Direito Tributário",
    "descricao": "S.A/LUCRO REAL",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8172.06,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "25.7.4",
    "area": "Direito Tributário",
    "descricao": "Demais entidades (ex: cooperativas, sociedades civis, etc.)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4086.03,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.2",
    "area": "Direito Previdenciário",
    "descricao": "Consulta Jurídica seja presencial, por mensagens de aplicativos ou e-mail.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 758.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.3",
    "area": "Direito Previdenciário",
    "descricao": "Consulta por vídeo conferência ou em condições excepcionais, com exame de documentos.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 758.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.4",
    "area": "Direito Previdenciário",
    "descricao": "Concessão de Salário Maternidade.(30% do proveito econômico)",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": "Acrescentar percentual de 10% na fase recursal."
  },
  {
    "id": "26.1.5",
    "area": "Direito Previdenciário",
    "descricao": "Procedimento de Justificação Administrativa",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4548.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.6",
    "area": "Direito Previdenciário",
    "descricao": "Retificação e atualização cadastral do Cadastro Nacional de Informações Sociais – CNIS",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.7",
    "area": "Direito Previdenciário",
    "descricao": "Planejamento previdenciário com parecer, cálculos de tempo de contribuição e simulações de RMI/RMA presentes e futuras.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4548.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.8",
    "area": "Direito Previdenciário",
    "descricao": "Cálculo de contagem de tempo de contribuição tomando como referência o CNIS e documentos particulares do segurado.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 758.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.10",
    "area": "Direito Previdenciário",
    "descricao": "Parecer jurídico solicitado por entidades sindicais, associações, gestores de regimes previdenciários e outras pessoas jurídicas.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4548.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.11",
    "area": "Direito Previdenciário",
    "descricao": "Defesa administrativa para evitar suspensão do benefício previdenciário ou assistencial.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6064.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.12",
    "area": "Direito Previdenciário",
    "descricao": "Pedido de prestações de parcelas não recebidas.",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.13",
    "area": "Direito Previdenciário",
    "descricao": "Sustentação oral perante órgãos recursais, administrativos desvinculada do êxito do processo administrativo.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1518.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.14",
    "area": "Direito Previdenciário",
    "descricao": "Recurso administrativo para Junta de Recurso INSS.",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.15",
    "area": "Direito Previdenciário",
    "descricao": "Agendamento de Prorrogação do Benefício.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 758.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.16",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria pessoa com Deficiência por Idade - 30% proveito econômico vencidas + 30% de 12 vincendas",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.17",
    "area": "Direito Previdenciário",
    "descricao": "Cumprimento de Exigência.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1518.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.18",
    "area": "Direito Previdenciário",
    "descricao": "Diligências Cartorárias – Certidões, Inteiro Teor, Secretaria de Segurança Pública.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1518.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.19",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria por Idade (até 30% do valor do benefício financeiro obtido + equivalente a 30% 12 meses de parcelas vincendas, garantindo o mínimo de",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.20",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria por Idade – Trabalhador Rural (30% do valor do benefício financeiro obtido + equivalente a 30% referente a 12 meses de parcelas vincendas garantindo mínimo de",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.21",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria por Tempo de Contribuição (30% do valor do benefício financeiro obtido + equivalente a 30% referente a 12 meses de parcelas vincendas garantindo mínimo de",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.22",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria Especial (30% do valor do benefício financeiro obtido + equivalente a 30% referente a 12 meses de parcelas vincendas",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.23",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria por Invalidez (30% do valor do benefício financeiro obtido + equivalente a 30% referente a 12 meses de parcelas vincendas",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.24",
    "area": "Direito Previdenciário",
    "descricao": "Auxílio-Doença (30% do valor do benefício financeiro obtido + equivalente a 30% referente as parcelas compreendidas até a data da DCB prevista",
    "tipo": "percentual",
    "percentual_minimo": 15.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.25",
    "area": "Direito Previdenciário",
    "descricao": "Auxílio Acidente (30% do valor do benefício financeiro obtido + equivalente a 30 referente a 12 meses de parcelas vincendas",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.26",
    "area": "Direito Previdenciário",
    "descricao": "Pensão por Morte (30% do valor do benefício financeiro obtido + equivalente a 30 referente a 12 meses de parcelas vincendas",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.27",
    "area": "Direito Previdenciário",
    "descricao": "Auxilio Reclusão (30% do valor do benefício financeiro obtido + equivalente a 30 referente a 12 meses de parcelas vincendas",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.28",
    "area": "Direito Previdenciário",
    "descricao": "Concessão de Benefícios Assistenciais (30% do valor do benefício financeiro obtido + equivalente a 30 referente a 12 meses de parcelas vincendas",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.1.29",
    "area": "Direito Previdenciário",
    "descricao": "Expedição de certidão de tempo de serviço/contribuição",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.30",
    "area": "Direito Previdenciário",
    "descricao": "Justificativa de tempo de serviço",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.1.31",
    "area": "Direito Previdenciário",
    "descricao": "Recurso Administrativo (acrescentar percentual de 10% sobre o valor originariamente pactuado)",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": 5500.0,
    "requer_valor_causa": true,
    "observacao": "Acrescentar percentual de 10% na fase recursal."
  },
  {
    "id": "26.1.32",
    "area": "Direito Previdenciário",
    "descricao": "Na hipótese do advogado atuar a partir da interposição do recurso, até 25% do equivalente a 12 meses do proveito econômico",
    "tipo": "percentual",
    "percentual_minimo": 25.0,
    "valor_minimo": 5500.0,
    "requer_valor_causa": true,
    "observacao": "Acrescentar percentual de 10% na fase recursal."
  },
  {
    "id": "26.2.1",
    "area": "Direito Previdenciário",
    "descricao": "Audiência de Conciliação.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.2.2",
    "area": "Direito Previdenciário",
    "descricao": "Audiência de Instrução e Julgamento.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.2.3",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria pessoa com Deficiência por Idade  - 30% proveito economico - 30% sobre as vencidas + 30% de 12 vicendas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12751.2,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.2.4",
    "area": "Direito Previdenciário",
    "descricao": "Ação para requerer expedição de Certidão de Tempo de Contribuição.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6072.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.2.5",
    "area": "Direito Previdenciário",
    "descricao": "Ação ou contestação visando a manutenção de benefício previdenciário.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6072.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.2.6",
    "area": "Direito Previdenciário",
    "descricao": "Ação visando a restituição de valores indevidamente cobrados e/ou declaração de inexigibilidade dos valores cobrados pelo gestor do regime previdenciário, inclusive no caso de benefício de prestação c",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6072.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.2.7",
    "area": "Direito Previdenciário",
    "descricao": "Mandado de injunção, habeas data individual e Mandado de segurança individual.",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6072.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.2.8",
    "area": "Direito Previdenciário",
    "descricao": "Ação Rescisória",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6072.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.2.9",
    "area": "Direito Previdenciário",
    "descricao": "Sustentação Oral",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.2.10",
    "area": "Direito Previdenciário",
    "descricao": "Ações Coletivas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6072.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.2.11",
    "area": "Direito Previdenciário",
    "descricao": "Atuação somente a partir da Turma Recursal - 30% proveito econômico",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.2.12",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria por Idade (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses, garantido o mínimo)",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.2.13",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria por Idade – Trabalhador Rural (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses,",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.2.14",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria por Tempo de Contribuição (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.2.15",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria Especial (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.2.16",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria por Invalidez (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.2.17",
    "area": "Direito Previdenciário",
    "descricao": "Auxilio Doença até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após até a DCB do benefício, limitado a 12 meses",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.2.18",
    "area": "Direito Previdenciário",
    "descricao": "Aposentadoria por Invalidez; auxílio-doença ou auxílio acidente decorrente de acidente do trabalho (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após até ",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.2.19",
    "area": "Direito Previdenciário",
    "descricao": "Pensão por Morte (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.2.20",
    "area": "Direito Previdenciário",
    "descricao": "Auxílio Reclusão (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses.",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.2.21",
    "area": "Direito Previdenciário",
    "descricao": "Salário maternidade: até 30% do êxito, garantido o mínimo",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "26.3.1",
    "area": "Direito Previdenciário",
    "descricao": "Ação por erro no Cálculo (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6072.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.3.2",
    "area": "Direito Previdenciário",
    "descricao": "Ação por erro Material (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12751.2,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.3.3",
    "area": "Direito Previdenciário",
    "descricao": "Ação de concessão de benefício assistencial (até 30% do valor das parcelas retroativas e mais o equivalente a 30% do proveito econômico após a instituição definitiva do benefício, limitado a 12 meses",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 12751.2,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.3.4",
    "area": "Direito Previdenciário",
    "descricao": "Ação de reconhecimento de tempo de serviço/contribuição",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6072.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "26.3.5",
    "area": "Direito Previdenciário",
    "descricao": "Atuação em Fase Recursal (acrescentar percentual de 10% sobre o valor originariamente pactuado",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6072.0,
    "requer_valor_causa": false,
    "observacao": "Acrescentar percentual na fase recursal conforme tabela."
  },
  {
    "id": "27.1.1",
    "area": "Direito da Saúde",
    "descricao": "Assessoria para elaboração de relató- rio médico circunstanciado",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 800.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.1.2",
    "area": "Direito da Saúde",
    "descricao": "Assessoria para elaboração de laudo pericial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1728.71,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.1.3",
    "area": "Direito da Saúde",
    "descricao": "Assessoria mensal consultiva para consultórios",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2242.08,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.1.4",
    "area": "Direito da Saúde",
    "descricao": "Assessoria mensal consultiva para clínicas",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3363.12,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.1.5",
    "area": "Direito da Saúde",
    "descricao": "Assessoria mensal consultiva para hospitais e empresas de saúde (coo- perativas e/ou sociedades em grupo)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4372.05,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.1.6",
    "area": "Direito da Saúde",
    "descricao": "Assessoria mensal consultiva para operadora de saúde sem dedicação exclusiva",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6558.08,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.1.7",
    "area": "Direito da Saúde",
    "descricao": "Assessoria total para operadora de saúde com dedicação exclusiva",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 13116.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.1.8",
    "area": "Direito da Saúde",
    "descricao": "Diligências avulsas para acompanha- mento do cliente perante órgãos regu- latórios (por ato)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1728.71,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.1.9",
    "area": "Direito da Saúde",
    "descricao": "Defesa/impugnação de autos e/ou manifestação perante órgãos regula- tórios",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "27.2.1",
    "area": "Direito da Saúde",
    "descricao": "Ação de tutela antecipada requerida em caráter antecedente",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "27.2.2",
    "area": "Direito da Saúde",
    "descricao": "Aditamento da tutela antecipada com pedido de tutela final",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "27.2.3",
    "area": "Direito da Saúde",
    "descricao": "Ação de obrigação de fazer",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "27.2.4",
    "area": "Direito da Saúde",
    "descricao": "Ação de Mandado de Segurança (acesso a medicamentos, tratamen- tos, regulação e assuntos afins)",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "27.2.5",
    "area": "Direito da Saúde",
    "descricao": "Ação de Mandado de Segurança envolvendo sanção ético-disciplinar, exceto cassação do exercício profis- sional",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6286.2,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.2.6",
    "area": "Direito da Saúde",
    "descricao": "Ação de Mandado de Segurança en- volvendo sanção ético-disciplinar de cassação do exercício profissional",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15715.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.2.7",
    "area": "Direito da Saúde",
    "descricao": "Propositura de ação de responsabi- lidade civil (erro médico e assuntos afins)",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "27.2.8",
    "area": "Direito da Saúde",
    "descricao": "Defesa em ação de responsabilidade civil",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "27.2.9",
    "area": "Direito da Saúde",
    "descricao": "Ação de cobrança/ressarcimento de despesas médico-hospitalares",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "27.3.1",
    "area": "Direito da Saúde",
    "descricao": "Manifestação prévia do denunciado em sindicância",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2388.76,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.3.2",
    "area": "Direito da Saúde",
    "descricao": "Representação do denunciado em processo ético-profissional (por pro- fissional)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7166.27,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.3.3",
    "area": "Direito da Saúde",
    "descricao": "Representação do denunciante em processo administrativo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3583.13,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.3.4",
    "area": "Direito da Saúde",
    "descricao": "Defesa em processo administrativo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3583.13,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.3.5",
    "area": "Direito da Saúde",
    "descricao": "Recursos em processo administrativo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4662.27,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.3.6",
    "area": "Direito da Saúde",
    "descricao": "Sustentação oral em processo ético- -profissional",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2598.3,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.3.7",
    "area": "Direito da Saúde",
    "descricao": "Audiência de conciliação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1728.71,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.3.8",
    "area": "Direito da Saúde",
    "descricao": "Audiência de conciliação com TAC",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2252.56,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.3.9",
    "area": "Direito da Saúde",
    "descricao": "Audiência de instrução",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2598.3,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.4.1",
    "area": "Direito da Saúde",
    "descricao": "Elaboração ou revisão de documentos legais da atividade profissional (ter- mos de consentimento, confidencia- lidade, autorização para uso de ima- gem e afins), por documento",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2388.76,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.4.2",
    "area": "Direito da Saúde",
    "descricao": "Elaboração ou revisão de contratos diversos, exceto societários (contra- tos de honorários, parceiras, forneci- mento de insumos, manutenção, entre outros) – por contrato",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1592.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "27.4.3",
    "area": "Direito da Saúde",
    "descricao": "Elaboração ou revisão de regimento interno de corpo clínico",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2388.76,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.1",
    "area": "Direito de Trânsito",
    "descricao": "Defesa prévia por cada auto de infração",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1100.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.2",
    "area": "Direito de Trânsito",
    "descricao": "Recurso à JARI por cada auto de infração",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 628.62,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.3",
    "area": "Direito de Trânsito",
    "descricao": "Recurso ao CETRAN por cada auto de infração",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 942.93,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.4",
    "area": "Direito de Trânsito",
    "descricao": "Defesa previa, recurso à JARI e CE- TRAN por cada auto de infração (exceto processos de suspensão/cassação e infrações auto suspensivas)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1885.86,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.5",
    "area": "Direito de Trânsito",
    "descricao": "Defesas e recursos do artigo 253-A, caput, do CTB",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "28.1.6",
    "area": "Direito de Trânsito",
    "descricao": "Defesas e recursos do artigo 253-A, §1º, do CTB",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "28.1.7",
    "area": "Direito de Trânsito",
    "descricao": "Defesas e recursos do artigo 253-A, §2º, do CTB – reincidência do caput",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "28.1.8",
    "area": "Direito de Trânsito",
    "descricao": "Defesas e recursos do artigo 253-A, §2º, do CTB – reincidência do §1º",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "28.1.9",
    "area": "Direito de Trânsito",
    "descricao": "Defesa em processo de suspensão ou cassação do direito de dirigir por pontuação, até a última instância",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2619.25,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.10",
    "area": "Direito de Trânsito",
    "descricao": "Defesa em processo de suspensão ou cassação do direito de dirigir por infração específica – até a última instância",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.11",
    "area": "Direito de Trânsito",
    "descricao": "Defesa em processo concomitante de suspensão ou cassação do direito de dirigir por infração específica (após alteração do CTB)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3352.64,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.12",
    "area": "Direito de Trânsito",
    "descricao": "Recurso administrativo de dívida ativa",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "28.1.13",
    "area": "Direito de Trânsito",
    "descricao": "Desbloqueio administrativo de CNH",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 733.39,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.14",
    "area": "Direito de Trânsito",
    "descricao": "Liberação de veículo apreendido/ remoção e depósito – na capital",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1571.55,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.15",
    "area": "Direito de Trânsito",
    "descricao": "Defesas de multa NIC",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "28.1.16",
    "area": "Direito de Trânsito",
    "descricao": "Defesa em processo administra- tivo Disciplinar (PAD) perante o DETRAN/GO",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4714.65,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.17",
    "area": "Direito de Trânsito",
    "descricao": "Defesa em processo administrati- vo em face de permissionários ou credenciados perante o DETRAN/ GO (pessoa física ou jurídica)",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "28.1.18",
    "area": "Direito de Trânsito",
    "descricao": "Sindicância",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2692.59,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.19",
    "area": "Direito de Trânsito",
    "descricao": "Acompanhamento em audiências perante o DETRAN/GO",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 681.01,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.20",
    "area": "Direito de Trânsito",
    "descricao": "Consultoria",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 314.31,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.21",
    "area": "Direito de Trânsito",
    "descricao": "Consultoria c/ análise de documentos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 471.47,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "28.1.22",
    "area": "Direito de Trânsito",
    "descricao": "Restituição de veículo envolvido em crime de trânsito",
    "tipo": "percentual",
    "percentual_minimo": 30.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "28.2.1",
    "area": "Direito de Trânsito",
    "descricao": "Ação anulatória de ato administra- tivo",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": 5621.0,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "28.2.2",
    "area": "Direito de Trânsito",
    "descricao": "Ação de obrigação de fazer em matéria de trânsito",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "28.2.3",
    "area": "Direito de Trânsito",
    "descricao": "Acompanhamento em processo de crime do artigo 306 CTB até homo- logação de acordo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3143.1,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "29.1",
    "area": "Compliance",
    "descricao": "Código de ética",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 5238.5,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "29.2",
    "area": "Compliance",
    "descricao": "Políticas e procedimentos de integri- dade",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "29.3",
    "area": "Compliance",
    "descricao": "Treinamento e Capacitação",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "29.4",
    "area": "Compliance",
    "descricao": "Mapa de riscos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "29.5",
    "area": "Compliance",
    "descricao": "Canal de Denúncias",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 3000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "29.6",
    "area": "Compliance",
    "descricao": "Due Diligence",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "29.7",
    "area": "Compliance",
    "descricao": "Plano de Governança Anticorrupção",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 7000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "29.8",
    "area": "Compliance",
    "descricao": "Compliance Trabalhista",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "29.9",
    "area": "Compliance",
    "descricao": "Consultoria para Lei Geral de Proteção de Dados (LGPD)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 8000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "30.1",
    "area": "Gestão Jurídica",
    "descricao": "Contratação na função de gestor geral",
    "tipo": "percentual",
    "percentual_minimo": 5.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "30.2",
    "area": "Gestão Jurídica",
    "descricao": "Contratação na função de gestor por área",
    "tipo": "percentual",
    "percentual_minimo": 2.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "30.3",
    "area": "Gestão Jurídica",
    "descricao": "Contratação na função de gestor de controladoria",
    "tipo": "percentual",
    "percentual_minimo": 2.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "30.4",
    "area": "Gestão Jurídica",
    "descricao": "Contratação na função de gestor téc- nico",
    "tipo": "percentual",
    "percentual_minimo": 2.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "30.5",
    "area": "Gestão Jurídica",
    "descricao": "Contratação na função de gestor ad- ministrativo-financeiro",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 4000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.1.1",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Consulta genérica acerca dos bene- fícios e das características da utiliza- ção dos métodos autocompositivos de solução de conflitos",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1100.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.1.2",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Consulta para identificação do mé- todo autocompositivo adequado à solução do conflito, observando o caso concreto, com análise detalha- da de documentos – para uma parte",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1330.58,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.1.3",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Consulta para identificação do mé- todo autocompositivo adequado à solução do conflito, observando o caso concreto, com análise detalha- da de documentos – para ambas as partes conjuntamente",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.1.4",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Hora técnica e intelectual para análi- se dos elementos do conflito e asses- soria jurídico-estratégica – para uma parte",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.1.5",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Hora técnica e intelectual para aná- lise dos elementos do conflito e as- sessoria jurídico - estratégica – para ambas as partes conjuntamente",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 800.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.1.6",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Acompanhamento em sessão ou reunião de práticas colaborativas, mediação, conciliação, negociação ou qualquer método autocompositivo (por ato)",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1707.75,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.1.7",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Elaboração e/ou revisão de termo de acordo total ou parcial resultante do encerramento de práticas colabora- tivas, mediação, conciliação, nego- ciação ou qualquer método auto- compositivo",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.1.8",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Elaboração de notificação extrajudi- cial para cumprimento do acordo",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 500.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.1.9",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Requerimento de homologação de acordo realizado em esfera extraju- dicial perante o Poder Judiciário",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.1.10",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Tentativas de negociações extraju- diciais e preliminares com a parte contrária, via WhatsApp, e-mail ou telefone",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.1.11",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Intervenção para solução de qual- quer assunto eventual no terreno amigável relacionado ao acordo en- tabulado, mesmo quando for de valor estimável",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.1.12",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Intermediar (porta-voz) conversas sobre questões relacionadas ao con- flito, no caso de uma das partes não poder, por determinação judicial, ter contato com a outra parte – vio- lência doméstica, inca",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2661.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.1.13",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Retificação de acordo extrajudicial",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 2661.16,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.2.1",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Consulta genérica acerca dos bene- fícios e características da utilização dos métodos autocompositivos de solução de conflitos",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.2.2",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Consulta para identificação do mé- todo autocompositivo adequado à solução do conflito, observando o caso concreto com análise detalha- da de documentos – para uma parte",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.2.3",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Consulta para identificação do mé- todo autocompositivo adequado à solução do conflito, observando o caso concreto com análise detalha- da de documentos – para ambas as partes conjuntamente",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.2.4",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Hora técnica e intelectual para análi- se dos elementos do conflito e asses- soria jurídico-estratégica – para uma parte",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 764.82,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.2.5",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Hora técnica e intelectual para aná- lise dos elementos do conflito e as- sessoria jurídico-estratégica – para ambas as partes conjuntamente",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 1602.98,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "31.2.6",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Acompanhamento em sessão ou reunião de Práticas Colaborativas, Mediação, Conciliação, Negociação ou qualquer método autocompositivo (por ato)",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.2.7",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Elaboração e/ou revisão de termo de acordo total ou parcial resultante do encerramento de práticas colaborati- vas, mediação, conciliação, negocia- ção ou qualquer método autocompo- sitivo",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.2.8",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Requerimento de homologação de acordo realizado na esfera judicial perante o Poder Judiciário",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.2.9",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Elaboração de notificação extraju- dicial para cumprimento do acordo homologado pelo juiz",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.2.10",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Comparecimento em audiências de conciliação. O ato exclusivo de acom- panhamento como advogado(a) ou representante de qualquer das partes",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.2.11",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Intermediar (porta-voz) conversas sobre questões relacionadas ao lití- gio, no caso de uma das partes não poder, por determinação judicial, ter contato com a outra parte – violência doméstica, incapac",
    "tipo": "percentual",
    "percentual_minimo": 20.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.3.1",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Representação do cliente no procedi- mento arbitral",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.4.1",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Ajuizamento de ação anulatória da sentença arbitral",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.4.2",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Ajuizamento de execução judicial para o cumprimento da sentença ar- bitral",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "31.4.3",
    "area": "Mediação, Conciliação e Arbitragem",
    "descricao": "Defesa do executado em juízo no cumprimento da sentença arbitral",
    "tipo": "percentual",
    "percentual_minimo": 10.0,
    "valor_minimo": null,
    "requer_valor_causa": true,
    "observacao": null
  },
  {
    "id": "14.12",
    "area": "Direito Eleitoral",
    "descricao": "Ação Declaratória de Nulidade de Filiação Partidária c/c Tutela de Urgência",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 10278.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "14.13",
    "area": "Direito Eleitoral",
    "descricao": "Ação Anulatória de Decisão Partidária c/c Declaratória de Nulidade de Candidatura por Inelegibilidade, com Obrigação de Fazer e Tutela de Urgência",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 15000.0,
    "requer_valor_causa": false,
    "observacao": null
  },
  {
    "id": "24.3.6-A",
    "area": "Direito do Trabalho",
    "descricao": "Contrarrazões de Recurso de Revista",
    "tipo": "fixo",
    "percentual_minimo": null,
    "valor_minimo": 6500.0,
    "requer_valor_causa": false,
    "observacao": null
  }
];

// ── Engine de cálculo determinística ────────────────────────────────────────
// O cálculo NUNCA é feito pela IA — sempre por esta função
export function calcularHonorario(
  item: ItemTabela,
  valorCausa?: number,
  situacaoIdx?: number
): { resultado: number; explicacao: string } {

  // Item com situações (ex: 1.1 Consulta/Reunião)
  if (item.situacoes && item.situacoes.length > 0) {
    const situacao = item.situacoes[situacaoIdx ?? 0];
    return {
      resultado: situacao.valor_minimo,
      explicacao:
        `${situacao.situacao} — valor mínimo de R$ ${situacao.valor_minimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} conforme item ${item.id} da Tabela OAB-MA 2026.${item.observacao ? ' ' + item.observacao : ''}`,
    };
  }

  // Valor fixo
  if (item.tipo === 'fixo' || !item.requer_valor_causa) {
    return {
      resultado: item.valor_minimo ?? 0,
      explicacao: `Valor fixo mínimo de R$ ${(item.valor_minimo ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} conforme item ${item.id} da Tabela OAB-MA 2026.${item.observacao ? ' ' + item.observacao : ''}`,
    };
  }

  // Percentual sobre valor da causa
  if (item.tipo === 'percentual' && item.percentual_minimo && valorCausa) {
    const calculado = valorCausa * (item.percentual_minimo / 100);
    const resultado = item.valor_minimo
      ? Math.max(calculado, item.valor_minimo)
      : calculado;
    const usouMinimo = item.valor_minimo != null && resultado === item.valor_minimo;

    return {
      resultado,
      explicacao: usouMinimo
        ? `Aplicado valor mínimo de R$ ${item.valor_minimo!.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} — ${item.percentual_minimo}% sobre R$ ${valorCausa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} resultaria abaixo do mínimo. Item ${item.id} da Tabela OAB-MA 2026.${item.observacao ? ' ' + item.observacao : ''}`
        : `${item.percentual_minimo}% sobre o valor da causa de R$ ${valorCausa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} = R$ ${resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Item ${item.id} da Tabela OAB-MA 2026.${item.observacao ? ' ' + item.observacao : ''}`,
    };
  }

  return {
    resultado: item.valor_minimo ?? 0,
    explicacao: `Valor mínimo conforme item ${item.id} da Tabela OAB-MA 2026.`,
  };
}

// ── Utilitários ──────────────────────────────────────────────────────────────
export function buscarPorArea(area: string): ItemTabela[] {
  return tabelaHonorarios.filter(
    (item) => item.area.toLowerCase() === area.toLowerCase()
  );
}

export function buscarPorId(id: string): ItemTabela | undefined {
  return tabelaHonorarios.find((item) => item.id === id);
}

export function buscarPorDescricao(termo: string): ItemTabela[] {
  const lower = termo.toLowerCase();
  return tabelaHonorarios.filter(
    (item) =>
      item.descricao.toLowerCase().includes(lower) ||
      item.area.toLowerCase().includes(lower)
  );
}

export const areasDisponiveis = [
  ...new Set(tabelaHonorarios.map((i) => i.area)),
].sort();
