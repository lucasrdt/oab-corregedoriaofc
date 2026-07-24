// src/data/minutasModelos.ts
// Estrutura dos modelos de minuta do Módulo 3 (Biblioteca de Minutas com Preenchimento por IA).
// Fonte: Anexos Práticos do Módulo 2 — Corregedoria Geral OAB-MA (Ivaldo Prado).
//
// Cada campo `id` aqui corresponde ao placeholder {{id}} usado no arquivo .docx do modelo
// (arquivoTemplate). Campos com o mesmo significado (ex: nome do cliente) usam o mesmo `id`
// entre modelos diferentes, para permitir reaproveitar dados já preenchidos.

export type TipoCampo = 'texto' | 'numero' | 'data' | 'moeda' | 'percentual' | 'textarea' | 'selecao';

export interface CampoMinuta {
  id: string;
  label: string;
  tipo: TipoCampo;
  obrigatorio: boolean;
  opcoes?: string[];
  ajuda?: string;
}

export interface ModeloMinuta {
  id: string;
  nome: string;
  categoria: 'Procuração' | 'Substabelecimento' | 'Renúncia' | 'Contrato' | 'Termo' | 'Financeiro';
  descricao: string;
  arquivoTemplate: string;
  campos: CampoMinuta[];
}

// ---------------------------------------------------------------------------
// Campos reutilizados entre vários modelos (mesmo `id`, mesmo significado)
// ---------------------------------------------------------------------------

const campoClienteNome: CampoMinuta = { id: 'cliente_nome', label: 'Nome completo do cliente', tipo: 'texto', obrigatorio: true };
const campoClienteNacionalidade: CampoMinuta = { id: 'cliente_nacionalidade', label: 'Nacionalidade', tipo: 'texto', obrigatorio: true };
const campoClienteEstadoCivil: CampoMinuta = { id: 'cliente_estado_civil', label: 'Estado civil', tipo: 'texto', obrigatorio: true };
const campoClienteProfissao: CampoMinuta = { id: 'cliente_profissao', label: 'Profissão', tipo: 'texto', obrigatorio: true };
const campoClienteCpf: CampoMinuta = { id: 'cliente_cpf', label: 'CPF do cliente', tipo: 'texto', obrigatorio: true };
const campoClienteCpfCnpj: CampoMinuta = { id: 'cliente_cpf_cnpj', label: 'CPF/CNPJ do cliente', tipo: 'texto', obrigatorio: true };
const campoClienteRg: CampoMinuta = { id: 'cliente_rg', label: 'RG do cliente', tipo: 'texto', obrigatorio: true };
const campoClienteEndereco: CampoMinuta = { id: 'cliente_endereco', label: 'Endereço completo', tipo: 'texto', obrigatorio: true };
const campoClienteTelefone: CampoMinuta = { id: 'cliente_telefone', label: 'Telefone/WhatsApp', tipo: 'texto', obrigatorio: true };
const campoClienteEmail: CampoMinuta = { id: 'cliente_email', label: 'E-mail', tipo: 'texto', obrigatorio: false };

const campoAdvogadoNome: CampoMinuta = { id: 'advogado_nome', label: 'Nome do(a) advogado(a)', tipo: 'texto', obrigatorio: true };
const campoAdvogadoOabUf: CampoMinuta = { id: 'advogado_oab_uf', label: 'UF da OAB', tipo: 'texto', obrigatorio: true };
const campoAdvogadoOabNumero: CampoMinuta = { id: 'advogado_oab_numero', label: 'Número da OAB', tipo: 'texto', obrigatorio: true };
const campoAdvogadoEndereco: CampoMinuta = { id: 'advogado_endereco', label: 'Endereço profissional', tipo: 'texto', obrigatorio: true };
const campoAdvogadoTelefone: CampoMinuta = { id: 'advogado_telefone', label: 'Telefone/WhatsApp profissional', tipo: 'texto', obrigatorio: false };
const campoAdvogadoEmail: CampoMinuta = { id: 'advogado_email', label: 'E-mail profissional', tipo: 'texto', obrigatorio: false };

const campoProcessoNumero: CampoMinuta = { id: 'processo_numero', label: 'Número do processo (se houver)', tipo: 'texto', obrigatorio: false };
const campoProcessoOrgaoJuizo: CampoMinuta = { id: 'processo_orgao_juizo', label: 'Órgão/Juízo', tipo: 'texto', obrigatorio: true };
const campoProcessoDescricao: CampoMinuta = { id: 'processo_descricao', label: 'Processo/procedimento/ato', tipo: 'texto', obrigatorio: true };

const campoLocal: CampoMinuta = { id: 'local', label: 'Local', tipo: 'texto', obrigatorio: true };
const campoData: CampoMinuta = { id: 'data', label: 'Data', tipo: 'data', obrigatorio: true };

// ---------------------------------------------------------------------------
// Modelos
// ---------------------------------------------------------------------------

export const modelosMinutas: ModeloMinuta[] = [
  {
    id: 'procuracao-geral',
    nome: 'Procuração Ad Judicia et Extra com Poderes Gerais e Especiais',
    categoria: 'Procuração',
    descricao: 'Procuração completa, com poderes gerais para o foro e poderes especiais (receber citação, transigir, receber valores, substabelecer, etc.).',
    arquivoTemplate: '/minutas/templates/procuracao-geral.docx',
    campos: [
      campoClienteNome,
      campoClienteNacionalidade,
      campoClienteEstadoCivil,
      campoClienteProfissao,
      campoClienteCpf,
      campoClienteRg,
      campoClienteEndereco,
      campoClienteTelefone,
      campoClienteEmail,
      campoAdvogadoNome,
      campoAdvogadoOabUf,
      campoAdvogadoOabNumero,
      campoAdvogadoEndereco,
      campoAdvogadoTelefone,
      campoAdvogadoEmail,
      { id: 'finalidade_especifica', label: 'Finalidade específica (processo, procedimento ou demanda)', tipo: 'textarea', obrigatorio: false, ajuda: 'Deixe em branco se a procuração for para atuação geral, sem vínculo a um processo específico.' },
      campoLocal,
      campoData,
    ],
  },
  {
    id: 'procuracao-atos-urgentes',
    nome: 'Procuração Simplificada para Atos Urgentes',
    categoria: 'Procuração',
    descricao: 'Procuração enxuta para atuação imediata em caráter de urgência (audiência, medida liminar, delegacia, prazo etc.).',
    arquivoTemplate: '/minutas/templates/procuracao-atos-urgentes.docx',
    campos: [
      campoClienteNome,
      campoClienteNacionalidade,
      campoClienteEstadoCivil,
      campoClienteProfissao,
      campoClienteCpf,
      campoClienteRg,
      campoClienteEndereco,
      campoAdvogadoNome,
      campoAdvogadoOabUf,
      campoAdvogadoOabNumero,
      campoAdvogadoEndereco,
      { id: 'descricao_ato_urgente', label: 'Descrição do ato urgente', tipo: 'textarea', obrigatorio: true, ajuda: 'Ex: audiência, protocolo de medida, pedido liminar, acompanhamento em delegacia, impetração, cumprimento de prazo.' },
      campoLocal,
      campoData,
    ],
  },
  {
    id: 'substabelecimento-com-reserva',
    nome: 'Substabelecimento com Reserva de Poderes',
    categoria: 'Substabelecimento',
    descricao: 'Transferência de poderes a outro(a) advogado(a), mantendo o(a) substabelecente com os mesmos poderes no processo.',
    arquivoTemplate: '/minutas/templates/substabelecimento-com-reserva.docx',
    campos: [
      { id: 'substabelecente_nome', label: 'Nome do(a) advogado(a) substabelecente', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecente_oab_uf', label: 'UF da OAB (substabelecente)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecente_oab_numero', label: 'Número da OAB (substabelecente)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecente_endereco', label: 'Endereço profissional (substabelecente)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_nome', label: 'Nome do(a) advogado(a) substabelecido(a)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_oab_uf', label: 'UF da OAB (substabelecido)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_oab_numero', label: 'Número da OAB (substabelecido)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_endereco', label: 'Endereço profissional (substabelecido)', tipo: 'texto', obrigatorio: true },
      campoClienteNome,
      { id: 'data_procuracao_original', label: 'Data da procuração original', tipo: 'data', obrigatorio: true },
      campoProcessoDescricao,
      campoProcessoOrgaoJuizo,
      campoProcessoNumero,
      { id: 'finalidade_substabelecimento', label: 'Finalidade do substabelecimento', tipo: 'textarea', obrigatorio: true, ajuda: 'Ex: participar de audiência, despachar, protocolar manifestação, acompanhar diligência.' },
      campoLocal,
      campoData,
    ],
  },
  {
    id: 'substabelecimento-sem-reserva',
    nome: 'Substabelecimento sem Reserva de Poderes',
    categoria: 'Substabelecimento',
    descricao: 'Transferência integral de poderes a outro(a) advogado(a), com o(a) substabelecente deixando de atuar no caso.',
    arquivoTemplate: '/minutas/templates/substabelecimento-sem-reserva.docx',
    campos: [
      { id: 'substabelecente_nome', label: 'Nome do(a) advogado(a) substabelecente', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecente_oab_uf', label: 'UF da OAB (substabelecente)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecente_oab_numero', label: 'Número da OAB (substabelecente)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecente_endereco', label: 'Endereço profissional (substabelecente)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_nome', label: 'Nome do(a) advogado(a) substabelecido(a)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_oab_uf', label: 'UF da OAB (substabelecido)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_oab_numero', label: 'Número da OAB (substabelecido)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_endereco', label: 'Endereço profissional (substabelecido)', tipo: 'texto', obrigatorio: true },
      campoClienteNome,
      { id: 'data_procuracao_original', label: 'Data da procuração original', tipo: 'data', obrigatorio: true },
      campoProcessoDescricao,
      campoProcessoOrgaoJuizo,
      campoProcessoNumero,
      campoLocal,
      campoData,
    ],
  },
  {
    id: 'termo-ciencia-substabelecimento',
    nome: 'Termo de Ciência do Cliente (Substabelecimento sem Reserva)',
    categoria: 'Termo',
    descricao: 'Declaração do cliente de que foi informado sobre o substabelecimento sem reserva e a saída do advogado original do caso.',
    arquivoTemplate: '/minutas/templates/termo-ciencia-substabelecimento.docx',
    campos: [
      campoClienteNome,
      campoClienteNacionalidade,
      campoClienteEstadoCivil,
      campoClienteProfissao,
      campoClienteCpf,
      campoClienteEndereco,
      { id: 'substabelecente_nome', label: 'Nome do(a) advogado(a) substabelecente', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecente_oab_uf', label: 'UF da OAB (substabelecente)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecente_oab_numero', label: 'Número da OAB (substabelecente)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_nome', label: 'Nome do(a) novo(a) advogado(a)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_oab_uf', label: 'UF da OAB (novo advogado)', tipo: 'texto', obrigatorio: true },
      { id: 'substabelecido_oab_numero', label: 'Número da OAB (novo advogado)', tipo: 'texto', obrigatorio: true },
      campoProcessoDescricao,
      campoProcessoNumero,
      campoProcessoOrgaoJuizo,
      campoLocal,
      campoData,
    ],
  },
  {
    id: 'renuncia-comunicacao-cliente',
    nome: 'Comunicação Extrajudicial de Renúncia ao Cliente',
    categoria: 'Renúncia',
    descricao: 'Carta/comunicado formal ao cliente informando a renúncia ao mandato, sem exposição de motivos.',
    arquivoTemplate: '/minutas/templates/renuncia-comunicacao-cliente.docx',
    campos: [
      campoClienteNome,
      campoClienteEndereco,
      { id: 'cliente_email_whatsapp', label: 'E-mail/WhatsApp do cliente', tipo: 'texto', obrigatorio: true },
      campoProcessoDescricao,
      campoProcessoNumero,
      campoProcessoOrgaoJuizo,
      campoAdvogadoNome,
      campoAdvogadoOabUf,
      campoAdvogadoOabNumero,
      campoLocal,
      campoData,
    ],
  },
  {
    id: 'peticao-renuncia-juizo',
    nome: 'Petição de Renúncia ao Juízo',
    categoria: 'Renúncia',
    descricao: 'Petição protocolada nos autos comunicando ao juízo a renúncia ao mandato.',
    arquivoTemplate: '/minutas/templates/peticao-renuncia-juizo.docx',
    campos: [
      { id: 'vara', label: 'Vara', tipo: 'texto', obrigatorio: true },
      { id: 'comarca_uf', label: 'Comarca/UF', tipo: 'texto', obrigatorio: true },
      campoProcessoNumero,
      { id: 'nome_parte_representada', label: 'Nome da parte representada', tipo: 'texto', obrigatorio: true },
      campoAdvogadoNome,
      campoAdvogadoOabUf,
      campoAdvogadoOabNumero,
      { id: 'data_comunicacao_renuncia', label: 'Data em que o cliente foi comunicado da renúncia', tipo: 'data', obrigatorio: true },
      campoLocal,
      campoData,
    ],
  },
  {
    id: 'contrato-honorarios',
    nome: 'Contrato de Prestação de Serviços Advocatícios e Honorários',
    categoria: 'Contrato',
    descricao: 'Contrato completo (27 cláusulas): objeto, honorários fixos e de êxito, sucumbência, despesas, sigilo, LGPD, rescisão, foro etc.',
    arquivoTemplate: '/minutas/templates/contrato-honorarios.docx',
    campos: [
      campoClienteNome,
      campoClienteNacionalidade,
      campoClienteEstadoCivil,
      campoClienteProfissao,
      campoClienteCpfCnpj,
      { id: 'cliente_rg_ie', label: 'RG/Inscrição Estadual do cliente', tipo: 'texto', obrigatorio: true },
      campoClienteEndereco,
      campoClienteTelefone,
      campoClienteEmail,
      { id: 'advogado_nome_sociedade', label: 'Nome do(a) advogado(a) ou sociedade de advogados', tipo: 'texto', obrigatorio: true },
      campoAdvogadoOabUf,
      campoAdvogadoOabNumero,
      { id: 'advogado_cpf_cnpj', label: 'CPF/CNPJ do(a) advogado(a)/sociedade', tipo: 'texto', obrigatorio: true },
      campoAdvogadoEndereco,
      campoAdvogadoTelefone,
      campoAdvogadoEmail,
      { id: 'descricao_servico', label: 'Descrição do serviço contratado', tipo: 'textarea', obrigatorio: true, ajuda: 'Ex: consultoria, ajuizamento de ação, defesa judicial, recurso, inventário, divórcio, ação trabalhista etc.' },
      { id: 'atos_incluidos', label: 'Atos especificamente incluídos', tipo: 'textarea', obrigatorio: false, ajuda: 'Ex: reunião inicial, análise documental, petição inicial, protocolo, acompanhamento até sentença, audiências.' },
      { id: 'valor_honorarios_fixos', label: 'Valor dos honorários fixos/iniciais (R$)', tipo: 'moeda', obrigatorio: true },
      { id: 'forma_pagamento', label: 'Forma de pagamento', tipo: 'textarea', obrigatorio: true, ajuda: 'Ex: à vista, entrada + parcelas, PIX, boleto, cartão.' },
      { id: 'prazo_atraso_suspensao_dias', label: 'Prazo de atraso (dias) que autoriza suspensão de atos não urgentes', tipo: 'numero', obrigatorio: false },
      { id: 'percentual_honorarios_exito', label: 'Percentual de honorários de êxito (%)', tipo: 'percentual', obrigatorio: false },
      { id: 'base_calculo_parcelas', label: 'Base de cálculo quando houver parcelas vencidas/vincendas', tipo: 'textarea', obrigatorio: false },
      { id: 'prazo_dias_pagamento_apos_recebimento', label: 'Prazo (dias) para pagamento após recebimento direto pelo cliente', tipo: 'numero', obrigatorio: false },
      { id: 'valor_desconto', label: 'Valor ou percentual de desconto concedido (se houver)', tipo: 'texto', obrigatorio: false },
      { id: 'valor_final_com_desconto', label: 'Valor final dos honorários com desconto (R$)', tipo: 'moeda', obrigatorio: false },
      { id: 'comarca_uf_foro', label: 'Comarca/UF do foro de eleição', tipo: 'texto', obrigatorio: true },
      { id: 'numero_vias', label: 'Número de vias do contrato', tipo: 'numero', obrigatorio: false },
      campoLocal,
      campoData,
    ],
  },
  {
    id: 'termo-ciencia-riscos',
    nome: 'Termo de Ciência sobre Riscos da Demanda',
    categoria: 'Termo',
    descricao: 'Declaração do cliente de que foi orientado sobre os riscos jurídicos, processuais e financeiros do caso.',
    arquivoTemplate: '/minutas/templates/termo-ciencia-riscos.docx',
    campos: [
      campoClienteNome,
      campoClienteCpf,
      campoAdvogadoNome,
      campoAdvogadoOabUf,
      campoAdvogadoOabNumero,
      { id: 'caso_processo_descricao', label: 'Descrição do caso/processo', tipo: 'textarea', obrigatorio: true },
      campoLocal,
      campoData,
    ],
  },
  {
    id: 'recibo-honorarios',
    nome: 'Recibo de Honorários Advocatícios',
    categoria: 'Financeiro',
    descricao: 'Recibo simples de pagamento de honorários (iniciais, fixos, parcela, êxito, sucumbência, consulta ou diligência).',
    arquivoTemplate: '/minutas/templates/recibo-honorarios.docx',
    campos: [
      campoClienteNome,
      campoClienteCpfCnpj,
      { id: 'valor_recebido', label: 'Valor recebido (R$)', tipo: 'moeda', obrigatorio: true },
      {
        id: 'tipo_honorario',
        label: 'Tipo de honorário',
        tipo: 'selecao',
        obrigatorio: true,
        opcoes: ['Iniciais', 'Fixos', 'Parcela', 'Êxito', 'Sucumbência', 'Consulta', 'Diligência'],
      },
      { id: 'descricao_servico_processo', label: 'Descrição do serviço ou processo', tipo: 'textarea', obrigatorio: true },
      {
        id: 'forma_pagamento_recibo',
        label: 'Forma de pagamento',
        tipo: 'selecao',
        obrigatorio: true,
        opcoes: ['PIX', 'Transferência', 'Dinheiro', 'Cartão', 'Boleto', 'Outro'],
      },
      { id: 'data_pagamento', label: 'Data do pagamento', tipo: 'data', obrigatorio: true },
      { id: 'advogado_nome_sociedade', label: 'Nome do(a) advogado(a)/sociedade', tipo: 'texto', obrigatorio: true },
      campoAdvogadoOabUf,
      campoAdvogadoOabNumero,
      campoLocal,
      campoData,
    ],
  },
  {
    id: 'termo-prestacao-contas',
    nome: 'Termo de Prestação de Contas e Quitação Parcial',
    categoria: 'Financeiro',
    descricao: 'Demonstrativo de valores recebidos em nome do cliente, deduções autorizadas e saldo líquido repassado.',
    arquivoTemplate: '/minutas/templates/termo-prestacao-contas.docx',
    campos: [
      campoClienteNome,
      campoClienteCpf,
      campoAdvogadoNome,
      campoAdvogadoOabUf,
      campoAdvogadoOabNumero,
      { id: 'processo_caso', label: 'Número/descrição do processo ou caso', tipo: 'texto', obrigatorio: true },
      { id: 'valor_bruto_recebido', label: 'Valor bruto recebido (R$)', tipo: 'moeda', obrigatorio: true },
      {
        id: 'origem_valor',
        label: 'Origem do valor',
        tipo: 'selecao',
        obrigatorio: true,
        opcoes: ['Alvará', 'Acordo', 'RPV', 'Precatório', 'Pagamento direto', 'Outro'],
      },
      { id: 'data_recebimento', label: 'Data do recebimento', tipo: 'data', obrigatorio: true },
      { id: 'valor_honorarios_contratuais', label: 'Honorários contratuais (R$)', tipo: 'moeda', obrigatorio: false },
      { id: 'valor_honorarios_exito', label: 'Honorários de êxito (R$)', tipo: 'moeda', obrigatorio: false },
      { id: 'valor_despesas_comprovadas', label: 'Despesas comprovadas (R$)', tipo: 'moeda', obrigatorio: false },
      { id: 'valor_outros_abatimentos', label: 'Outros abatimentos autorizados (R$)', tipo: 'moeda', obrigatorio: false },
      { id: 'valor_saldo_liquido', label: 'Saldo líquido repassado ao cliente (R$)', tipo: 'moeda', obrigatorio: true },
      {
        id: 'forma_repasse',
        label: 'Forma de repasse',
        tipo: 'selecao',
        obrigatorio: true,
        opcoes: ['PIX', 'Transferência', 'Outro'],
      },
      { id: 'data_repasse', label: 'Data do repasse', tipo: 'data', obrigatorio: true },
      { id: 'observacoes', label: 'Observações', tipo: 'textarea', obrigatorio: false },
      campoLocal,
      campoData,
    ],
  },
];

export function buscarModeloPorId(id: string): ModeloMinuta | undefined {
  return modelosMinutas.find((m) => m.id === id);
}

export function buscarModelosPorCategoria(categoria: ModeloMinuta['categoria']): ModeloMinuta[] {
  return modelosMinutas.filter((m) => m.categoria === categoria);
}

export const categoriasDisponiveis = [...new Set(modelosMinutas.map((m) => m.categoria))];
