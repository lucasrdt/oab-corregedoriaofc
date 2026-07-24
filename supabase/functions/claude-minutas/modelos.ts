// supabase/functions/claude-minutas/modelos.ts
// GERADO AUTOMATICAMENTE por scripts/gerar-modelos-edge-minutas.mjs a partir de
// src/data/minutasModelos.ts - NAO EDITAR A MAO. Rode o script gerador de novo
// depois de qualquer mudanca no schema do frontend.

export interface CampoMinutaEdge {
  id: string;
  label: string;
  tipo: string;
  obrigatorio: boolean;
  opcoes?: string[];
}

export interface ModeloMinutaEdge {
  id: string;
  nome: string;
  campos: CampoMinutaEdge[];
}

export const modelosMinutas: ModeloMinutaEdge[] = [
  {
    "id": "procuracao-geral",
    "nome": "Procuração Ad Judicia et Extra com Poderes Gerais e Especiais",
    "campos": [
      {
        "id": "cliente_nome",
        "label": "Nome completo do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_nacionalidade",
        "label": "Nacionalidade",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_estado_civil",
        "label": "Estado civil",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_profissao",
        "label": "Profissão",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_cpf",
        "label": "CPF do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_rg",
        "label": "RG do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_endereco",
        "label": "Endereço completo",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_telefone",
        "label": "Telefone/WhatsApp",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_email",
        "label": "E-mail",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "advogado_nome",
        "label": "Nome do(a) advogado(a)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_uf",
        "label": "UF da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_numero",
        "label": "Número da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_endereco",
        "label": "Endereço profissional",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_telefone",
        "label": "Telefone/WhatsApp profissional",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "advogado_email",
        "label": "E-mail profissional",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "finalidade_especifica",
        "label": "Finalidade específica (processo, procedimento ou demanda)",
        "tipo": "textarea",
        "obrigatorio": false
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  },
  {
    "id": "procuracao-atos-urgentes",
    "nome": "Procuração Simplificada para Atos Urgentes",
    "campos": [
      {
        "id": "cliente_nome",
        "label": "Nome completo do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_nacionalidade",
        "label": "Nacionalidade",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_estado_civil",
        "label": "Estado civil",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_profissao",
        "label": "Profissão",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_cpf",
        "label": "CPF do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_rg",
        "label": "RG do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_endereco",
        "label": "Endereço completo",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_nome",
        "label": "Nome do(a) advogado(a)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_uf",
        "label": "UF da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_numero",
        "label": "Número da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_endereco",
        "label": "Endereço profissional",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "descricao_ato_urgente",
        "label": "Descrição do ato urgente",
        "tipo": "textarea",
        "obrigatorio": true
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  },
  {
    "id": "substabelecimento-com-reserva",
    "nome": "Substabelecimento com Reserva de Poderes",
    "campos": [
      {
        "id": "substabelecente_nome",
        "label": "Nome do(a) advogado(a) substabelecente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecente_oab_uf",
        "label": "UF da OAB (substabelecente)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecente_oab_numero",
        "label": "Número da OAB (substabelecente)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecente_endereco",
        "label": "Endereço profissional (substabelecente)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_nome",
        "label": "Nome do(a) advogado(a) substabelecido(a)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_oab_uf",
        "label": "UF da OAB (substabelecido)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_oab_numero",
        "label": "Número da OAB (substabelecido)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_endereco",
        "label": "Endereço profissional (substabelecido)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_nome",
        "label": "Nome completo do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data_procuracao_original",
        "label": "Data da procuração original",
        "tipo": "data",
        "obrigatorio": true
      },
      {
        "id": "processo_descricao",
        "label": "Processo/procedimento/ato",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "processo_orgao_juizo",
        "label": "Órgão/Juízo",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "processo_numero",
        "label": "Número do processo (se houver)",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "finalidade_substabelecimento",
        "label": "Finalidade do substabelecimento",
        "tipo": "textarea",
        "obrigatorio": true
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  },
  {
    "id": "substabelecimento-sem-reserva",
    "nome": "Substabelecimento sem Reserva de Poderes",
    "campos": [
      {
        "id": "substabelecente_nome",
        "label": "Nome do(a) advogado(a) substabelecente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecente_oab_uf",
        "label": "UF da OAB (substabelecente)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecente_oab_numero",
        "label": "Número da OAB (substabelecente)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecente_endereco",
        "label": "Endereço profissional (substabelecente)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_nome",
        "label": "Nome do(a) advogado(a) substabelecido(a)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_oab_uf",
        "label": "UF da OAB (substabelecido)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_oab_numero",
        "label": "Número da OAB (substabelecido)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_endereco",
        "label": "Endereço profissional (substabelecido)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_nome",
        "label": "Nome completo do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data_procuracao_original",
        "label": "Data da procuração original",
        "tipo": "data",
        "obrigatorio": true
      },
      {
        "id": "processo_descricao",
        "label": "Processo/procedimento/ato",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "processo_orgao_juizo",
        "label": "Órgão/Juízo",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "processo_numero",
        "label": "Número do processo (se houver)",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  },
  {
    "id": "termo-ciencia-substabelecimento",
    "nome": "Termo de Ciência do Cliente (Substabelecimento sem Reserva)",
    "campos": [
      {
        "id": "cliente_nome",
        "label": "Nome completo do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_nacionalidade",
        "label": "Nacionalidade",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_estado_civil",
        "label": "Estado civil",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_profissao",
        "label": "Profissão",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_cpf",
        "label": "CPF do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_endereco",
        "label": "Endereço completo",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecente_nome",
        "label": "Nome do(a) advogado(a) substabelecente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecente_oab_uf",
        "label": "UF da OAB (substabelecente)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecente_oab_numero",
        "label": "Número da OAB (substabelecente)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_nome",
        "label": "Nome do(a) novo(a) advogado(a)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_oab_uf",
        "label": "UF da OAB (novo advogado)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "substabelecido_oab_numero",
        "label": "Número da OAB (novo advogado)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "processo_descricao",
        "label": "Processo/procedimento/ato",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "processo_numero",
        "label": "Número do processo (se houver)",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "processo_orgao_juizo",
        "label": "Órgão/Juízo",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  },
  {
    "id": "renuncia-comunicacao-cliente",
    "nome": "Comunicação Extrajudicial de Renúncia ao Cliente",
    "campos": [
      {
        "id": "cliente_nome",
        "label": "Nome completo do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_endereco",
        "label": "Endereço completo",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_email_whatsapp",
        "label": "E-mail/WhatsApp do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "processo_descricao",
        "label": "Processo/procedimento/ato",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "processo_numero",
        "label": "Número do processo (se houver)",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "processo_orgao_juizo",
        "label": "Órgão/Juízo",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_nome",
        "label": "Nome do(a) advogado(a)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_uf",
        "label": "UF da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_numero",
        "label": "Número da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  },
  {
    "id": "peticao-renuncia-juizo",
    "nome": "Petição de Renúncia ao Juízo",
    "campos": [
      {
        "id": "vara",
        "label": "Vara",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "comarca_uf",
        "label": "Comarca/UF",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "processo_numero",
        "label": "Número do processo (se houver)",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "nome_parte_representada",
        "label": "Nome da parte representada",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_nome",
        "label": "Nome do(a) advogado(a)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_uf",
        "label": "UF da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_numero",
        "label": "Número da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data_comunicacao_renuncia",
        "label": "Data em que o cliente foi comunicado da renúncia",
        "tipo": "data",
        "obrigatorio": true
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  },
  {
    "id": "contrato-honorarios",
    "nome": "Contrato de Prestação de Serviços Advocatícios e Honorários",
    "campos": [
      {
        "id": "cliente_nome",
        "label": "Nome completo do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_nacionalidade",
        "label": "Nacionalidade",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_estado_civil",
        "label": "Estado civil",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_profissao",
        "label": "Profissão",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_cpf_cnpj",
        "label": "CPF/CNPJ do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_rg_ie",
        "label": "RG/Inscrição Estadual do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_endereco",
        "label": "Endereço completo",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_telefone",
        "label": "Telefone/WhatsApp",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_email",
        "label": "E-mail",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "advogado_nome_sociedade",
        "label": "Nome do(a) advogado(a) ou sociedade de advogados",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_uf",
        "label": "UF da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_numero",
        "label": "Número da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_cpf_cnpj",
        "label": "CPF/CNPJ do(a) advogado(a)/sociedade",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_endereco",
        "label": "Endereço profissional",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_telefone",
        "label": "Telefone/WhatsApp profissional",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "advogado_email",
        "label": "E-mail profissional",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "descricao_servico",
        "label": "Descrição do serviço contratado",
        "tipo": "textarea",
        "obrigatorio": true
      },
      {
        "id": "atos_incluidos",
        "label": "Atos especificamente incluídos",
        "tipo": "textarea",
        "obrigatorio": false
      },
      {
        "id": "valor_honorarios_fixos",
        "label": "Valor dos honorários fixos/iniciais (R$)",
        "tipo": "moeda",
        "obrigatorio": true
      },
      {
        "id": "forma_pagamento",
        "label": "Forma de pagamento",
        "tipo": "textarea",
        "obrigatorio": true
      },
      {
        "id": "prazo_atraso_suspensao_dias",
        "label": "Prazo de atraso (dias) que autoriza suspensão de atos não urgentes",
        "tipo": "numero",
        "obrigatorio": false
      },
      {
        "id": "percentual_honorarios_exito",
        "label": "Percentual de honorários de êxito (%)",
        "tipo": "percentual",
        "obrigatorio": false
      },
      {
        "id": "base_calculo_parcelas",
        "label": "Base de cálculo quando houver parcelas vencidas/vincendas",
        "tipo": "textarea",
        "obrigatorio": false
      },
      {
        "id": "prazo_dias_pagamento_apos_recebimento",
        "label": "Prazo (dias) para pagamento após recebimento direto pelo cliente",
        "tipo": "numero",
        "obrigatorio": false
      },
      {
        "id": "valor_desconto",
        "label": "Valor ou percentual de desconto concedido (se houver)",
        "tipo": "texto",
        "obrigatorio": false
      },
      {
        "id": "valor_final_com_desconto",
        "label": "Valor final dos honorários com desconto (R$)",
        "tipo": "moeda",
        "obrigatorio": false
      },
      {
        "id": "comarca_uf_foro",
        "label": "Comarca/UF do foro de eleição",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "numero_vias",
        "label": "Número de vias do contrato",
        "tipo": "numero",
        "obrigatorio": false
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  },
  {
    "id": "termo-ciencia-riscos",
    "nome": "Termo de Ciência sobre Riscos da Demanda",
    "campos": [
      {
        "id": "cliente_nome",
        "label": "Nome completo do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_cpf",
        "label": "CPF do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_nome",
        "label": "Nome do(a) advogado(a)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_uf",
        "label": "UF da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_numero",
        "label": "Número da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "caso_processo_descricao",
        "label": "Descrição do caso/processo",
        "tipo": "textarea",
        "obrigatorio": true
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  },
  {
    "id": "recibo-honorarios",
    "nome": "Recibo de Honorários Advocatícios",
    "campos": [
      {
        "id": "cliente_nome",
        "label": "Nome completo do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_cpf_cnpj",
        "label": "CPF/CNPJ do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "valor_recebido",
        "label": "Valor recebido (R$)",
        "tipo": "moeda",
        "obrigatorio": true
      },
      {
        "id": "tipo_honorario",
        "label": "Tipo de honorário",
        "tipo": "selecao",
        "obrigatorio": true,
        "opcoes": [
          "Iniciais",
          "Fixos",
          "Parcela",
          "Êxito",
          "Sucumbência",
          "Consulta",
          "Diligência"
        ]
      },
      {
        "id": "descricao_servico_processo",
        "label": "Descrição do serviço ou processo",
        "tipo": "textarea",
        "obrigatorio": true
      },
      {
        "id": "forma_pagamento_recibo",
        "label": "Forma de pagamento",
        "tipo": "selecao",
        "obrigatorio": true,
        "opcoes": [
          "PIX",
          "Transferência",
          "Dinheiro",
          "Cartão",
          "Boleto",
          "Outro"
        ]
      },
      {
        "id": "data_pagamento",
        "label": "Data do pagamento",
        "tipo": "data",
        "obrigatorio": true
      },
      {
        "id": "advogado_nome_sociedade",
        "label": "Nome do(a) advogado(a)/sociedade",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_uf",
        "label": "UF da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_numero",
        "label": "Número da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  },
  {
    "id": "termo-prestacao-contas",
    "nome": "Termo de Prestação de Contas e Quitação Parcial",
    "campos": [
      {
        "id": "cliente_nome",
        "label": "Nome completo do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "cliente_cpf",
        "label": "CPF do cliente",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_nome",
        "label": "Nome do(a) advogado(a)",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_uf",
        "label": "UF da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "advogado_oab_numero",
        "label": "Número da OAB",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "processo_caso",
        "label": "Número/descrição do processo ou caso",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "valor_bruto_recebido",
        "label": "Valor bruto recebido (R$)",
        "tipo": "moeda",
        "obrigatorio": true
      },
      {
        "id": "origem_valor",
        "label": "Origem do valor",
        "tipo": "selecao",
        "obrigatorio": true,
        "opcoes": [
          "Alvará",
          "Acordo",
          "RPV",
          "Precatório",
          "Pagamento direto",
          "Outro"
        ]
      },
      {
        "id": "data_recebimento",
        "label": "Data do recebimento",
        "tipo": "data",
        "obrigatorio": true
      },
      {
        "id": "valor_honorarios_contratuais",
        "label": "Honorários contratuais (R$)",
        "tipo": "moeda",
        "obrigatorio": false
      },
      {
        "id": "valor_honorarios_exito",
        "label": "Honorários de êxito (R$)",
        "tipo": "moeda",
        "obrigatorio": false
      },
      {
        "id": "valor_despesas_comprovadas",
        "label": "Despesas comprovadas (R$)",
        "tipo": "moeda",
        "obrigatorio": false
      },
      {
        "id": "valor_outros_abatimentos",
        "label": "Outros abatimentos autorizados (R$)",
        "tipo": "moeda",
        "obrigatorio": false
      },
      {
        "id": "valor_saldo_liquido",
        "label": "Saldo líquido repassado ao cliente (R$)",
        "tipo": "moeda",
        "obrigatorio": true
      },
      {
        "id": "forma_repasse",
        "label": "Forma de repasse",
        "tipo": "selecao",
        "obrigatorio": true,
        "opcoes": [
          "PIX",
          "Transferência",
          "Outro"
        ]
      },
      {
        "id": "data_repasse",
        "label": "Data do repasse",
        "tipo": "data",
        "obrigatorio": true
      },
      {
        "id": "observacoes",
        "label": "Observações",
        "tipo": "textarea",
        "obrigatorio": false
      },
      {
        "id": "local",
        "label": "Local",
        "tipo": "texto",
        "obrigatorio": true
      },
      {
        "id": "data",
        "label": "Data",
        "tipo": "data",
        "obrigatorio": true
      }
    ]
  }
];

export function buscarModeloPorId(id: string): ModeloMinutaEdge | undefined {
  return modelosMinutas.find((m) => m.id === id);
}
