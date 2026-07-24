// scripts/gerar-templates-minutas.mjs
// Gera os 11 arquivos .docx (templates com placeholders {{campo_id}}) a partir do texto
// oficial recebido no Modulo 2 (Corregedoria Geral OAB-MA). Os {{campo_id}} batem
// exatamente com os `id` de campo definidos em src/data/minutasModelos.ts.
//
// Rodar: node scripts/gerar-templates-minutas.mjs

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import fs from 'fs';
import path from 'path';

const OUT_DIR = path.resolve('public/minutas/templates');
fs.mkdirSync(OUT_DIR, { recursive: true });

function titulo(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER, spacing: { after: 300 } });
}
function subtitulo(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } });
}
function p(text) {
  return new Paragraph({ children: [new TextRun(text)], spacing: { after: 200 } });
}
// paragrafo com um rótulo em negrito seguido de texto normal: **label** resto
function pl(label, resto) {
  return new Paragraph({
    children: [new TextRun({ text: label, bold: true }), new TextRun(resto)],
    spacing: { after: 200 },
  });
}
function assinatura(nome, doc) {
  return [
    new Paragraph({ text: '', spacing: { before: 400 } }),
    new Paragraph({ children: [new TextRun({ text: '_'.repeat(40) })] }),
    new Paragraph({ children: [new TextRun({ text: nome, bold: true })] }),
    new Paragraph({ children: [new TextRun(doc)] }),
  ];
}

async function salvar(nomeArquivo, paragraphs) {
  const doc = new Document({ sections: [{ children: paragraphs }] });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(path.join(OUT_DIR, nomeArquivo), buffer);
  console.log('gerado:', nomeArquivo);
}

// ---------------------------------------------------------------------------
// 1. Procuração Geral
// ---------------------------------------------------------------------------
await salvar('procuracao-geral.docx', [
  titulo('PROCURAÇÃO'),
  pl('OUTORGANTE: ', '{{cliente_nome}}, {{cliente_nacionalidade}}, {{cliente_estado_civil}}, {{cliente_profissao}}, inscrito(a) no CPF sob o nº {{cliente_cpf}} e no RG nº {{cliente_rg}}, residente e domiciliado(a) à {{cliente_endereco}}, telefone/WhatsApp {{cliente_telefone}}, e-mail {{cliente_email}}.'),
  pl('OUTORGADO(A): ', '{{advogado_nome}}, advogado(a), inscrito(a) na OAB/{{advogado_oab_uf}} sob o nº {{advogado_oab_numero}}, com endereço profissional à {{advogado_endereco}}, telefone/WhatsApp {{advogado_telefone}}, e-mail {{advogado_email}}.'),
  p('Pelo presente instrumento particular de mandato, o(a) OUTORGANTE nomeia e constitui seu(sua) bastante procurador(a) o(a) OUTORGADO(A) acima qualificado(a), conferindo-lhe poderes para o foro em geral, com a cláusula ad judicia et extra, para representar o(a) OUTORGANTE perante quaisquer órgãos do Poder Judiciário, Juizados Especiais, Justiça Estadual, Justiça Federal, Justiça do Trabalho, Justiça Eleitoral, Justiça Militar, Tribunais Superiores, órgãos administrativos, repartições públicas federais, estaduais e municipais, autarquias, fundações, empresas públicas, sociedades de economia mista, cartórios, serventias extrajudiciais, delegacias, Ministério Público, Defensoria Pública, Procons, órgãos de fiscalização, instituições financeiras, câmaras de mediação, conciliação e arbitragem, bem como perante pessoas físicas ou jurídicas de direito público ou privado.'),
  p('O(a) OUTORGADO(A) poderá propor ações, apresentar defesas, acompanhar processos, formular requerimentos, assinar petições, apresentar manifestações, recursos, contrarrazões, memoriais, requerimentos administrativos, notificações, interpelações, declarações, termos, compromissos e demais atos necessários à defesa dos interesses do(a) OUTORGANTE.'),
  p('Confere-se, ainda, poderes especiais para: receber citação, confessar, reconhecer a procedência do pedido, transigir, firmar acordo judicial ou extrajudicial, desistir, renunciar ao direito sobre o qual se funda a ação, receber valores, levantar alvarás, receber e dar quitação, firmar compromisso, assinar declaração de hipossuficiência econômica quando cabível e autorizada, requerer benefícios da justiça gratuita, requerer expedição de alvarás, mandados de pagamento, RPV ou precatório, indicar dados bancários para recebimento de valores, requerer destaque, reserva ou pagamento de honorários contratuais e sucumbenciais, acompanhar audiências, produzir provas, apresentar documentos, requerer certidões, extrair cópias, digitalizar autos, substabelecer com ou sem reserva de poderes, praticar atos perante sistemas eletrônicos de processo judicial e administrativo e, enfim, praticar todos os atos necessários ao fiel cumprimento deste mandato.'),
  pl('Finalidade específica, quando houver: ', 'a presente procuração destina-se especialmente à atuação no(a) {{finalidade_especifica}}, sem prejuízo dos poderes gerais e especiais acima conferidos.'),
  pl('Autorização para contato e comunicações: ', 'o(a) OUTORGANTE autoriza o uso dos canais de comunicação informados neste instrumento para recebimento de orientações, solicitações de documentos, comunicações processuais, informações sobre andamento da causa e demais providências relacionadas ao mandato.'),
  pl('Ciência sobre honorários: ', 'o(a) OUTORGANTE declara estar ciente de que a presente procuração confere poderes de representação, não substituindo o contrato de honorários advocatícios, que deverá ser firmado em instrumento próprio quando houver ajuste remuneratório específico.'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{cliente_nome}}', 'CPF nº {{cliente_cpf}}'),
]);

// ---------------------------------------------------------------------------
// 2. Procuração para Atos Urgentes
// ---------------------------------------------------------------------------
await salvar('procuracao-atos-urgentes.docx', [
  titulo('PROCURAÇÃO PARA ATO URGENTE'),
  pl('OUTORGANTE: ', '{{cliente_nome}}, {{cliente_nacionalidade}}, {{cliente_estado_civil}}, {{cliente_profissao}}, CPF nº {{cliente_cpf}}, RG nº {{cliente_rg}}, residente e domiciliado(a) à {{cliente_endereco}}.'),
  pl('OUTORGADO(A): ', '{{advogado_nome}}, advogado(a), OAB/{{advogado_oab_uf}} nº {{advogado_oab_numero}}, com endereço profissional à {{advogado_endereco}}.'),
  p('Pelo presente instrumento, o(a) OUTORGANTE confere ao(à) OUTORGADO(A) poderes para atuar, em caráter de urgência, na defesa de seus interesses no(a) {{descricao_ato_urgente}}, podendo praticar os atos necessários à proteção imediata dos direitos do(a) OUTORGANTE.'),
  p('Ficam conferidos poderes para o foro em geral, com a cláusula ad judicia et extra, inclusive para requerer medidas urgentes, protocolar petições, apresentar documentos, participar de audiência, formular requerimentos, interpor recursos, acompanhar procedimentos e substabelecer, com ou sem reserva de poderes.'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{cliente_nome}}', 'CPF nº {{cliente_cpf}}'),
]);

// ---------------------------------------------------------------------------
// 3. Substabelecimento com Reserva de Poderes
// ---------------------------------------------------------------------------
await salvar('substabelecimento-com-reserva.docx', [
  titulo('SUBSTABELECIMENTO COM RESERVA DE PODERES'),
  pl('SUBSTABELECENTE: ', '{{substabelecente_nome}}, advogado(a), inscrito(a) na OAB/{{substabelecente_oab_uf}} sob o nº {{substabelecente_oab_numero}}, com endereço profissional à {{substabelecente_endereco}}.'),
  pl('SUBSTABELECIDO(A): ', '{{substabelecido_nome}}, advogado(a), inscrito(a) na OAB/{{substabelecido_oab_uf}} sob o nº {{substabelecido_oab_numero}}, com endereço profissional à {{substabelecido_endereco}}.'),
  p('Pelo presente instrumento, o(a) SUBSTABELECENTE, na qualidade de procurador(a) de {{cliente_nome}}, substabelece, com reserva de iguais poderes, ao(à) SUBSTABELECIDO(A) acima qualificado(a), os poderes que lhe foram conferidos por procuração outorgada em {{data_procuracao_original}}, para atuar no interesse do(a) constituinte no(a) {{processo_descricao}}, em trâmite perante {{processo_orgao_juizo}}, sob o nº {{processo_numero}}.'),
  p('O presente substabelecimento é conferido para a prática dos atos necessários à defesa dos interesses do(a) constituinte, especialmente para {{finalidade_substabelecimento}}.'),
  p('O(a) SUBSTABELECENTE permanece com poderes no feito, não havendo renúncia ou retirada de sua atuação profissional.'),
  pl('Honorários entre advogados: ', 'quando houver ajuste remuneratório entre SUBSTABELECENTE e SUBSTABELECIDO(A), este deverá ser formalizado em instrumento próprio, mensagem escrita ou termo específico, preferencialmente antes da prática do ato profissional.'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{substabelecente_nome}}', 'OAB/{{substabelecente_oab_uf}} nº {{substabelecente_oab_numero}}'),
]);

// ---------------------------------------------------------------------------
// 4. Substabelecimento sem Reserva de Poderes
// ---------------------------------------------------------------------------
await salvar('substabelecimento-sem-reserva.docx', [
  titulo('SUBSTABELECIMENTO SEM RESERVA DE PODERES'),
  pl('SUBSTABELECENTE: ', '{{substabelecente_nome}}, advogado(a), inscrito(a) na OAB/{{substabelecente_oab_uf}} sob o nº {{substabelecente_oab_numero}}, com endereço profissional à {{substabelecente_endereco}}.'),
  pl('SUBSTABELECIDO(A): ', '{{substabelecido_nome}}, advogado(a), inscrito(a) na OAB/{{substabelecido_oab_uf}} sob o nº {{substabelecido_oab_numero}}, com endereço profissional à {{substabelecido_endereco}}.'),
  p('Pelo presente instrumento, o(a) SUBSTABELECENTE, na qualidade de procurador(a) de {{cliente_nome}}, substabelece, sem reserva de poderes, ao(à) SUBSTABELECIDO(A) acima qualificado(a), os poderes que lhe foram conferidos por procuração outorgada em {{data_procuracao_original}}, para atuar no interesse do(a) constituinte no(a) {{processo_descricao}}, em trâmite perante {{processo_orgao_juizo}}, sob o nº {{processo_numero}}.'),
  p('O(a) SUBSTABELECENTE declara que o(a) constituinte foi previamente cientificado(a) da transferência integral dos poderes ora substabelecidos, nos termos da ética profissional, deixando o(a) SUBSTABELECENTE de atuar no patrocínio da causa a partir da juntada deste instrumento, ressalvados os direitos e deveres decorrentes dos atos anteriormente praticados.'),
  pl('Preservação de honorários: ', 'o presente substabelecimento não implica, por si só, renúncia a honorários contratados, proporcionais ou sucumbenciais eventualmente devidos ao(à) SUBSTABELECENTE, salvo ajuste expresso em instrumento próprio.'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{substabelecente_nome}}', 'OAB/{{substabelecente_oab_uf}} nº {{substabelecente_oab_numero}}'),
]);

// ---------------------------------------------------------------------------
// 5. Termo de Ciência (substabelecimento sem reserva)
// ---------------------------------------------------------------------------
await salvar('termo-ciencia-substabelecimento.docx', [
  titulo('TERMO DE CIÊNCIA E ANUÊNCIA'),
  p('Eu, {{cliente_nome}}, {{cliente_nacionalidade}}, {{cliente_estado_civil}}, {{cliente_profissao}}, CPF nº {{cliente_cpf}}, residente e domiciliado(a) à {{cliente_endereco}}, declaro, para todos os fins, que fui previamente informado(a) pelo(a) advogado(a) {{substabelecente_nome}}, OAB/{{substabelecente_oab_uf}} nº {{substabelecente_oab_numero}}, acerca do substabelecimento sem reserva de poderes em favor de {{substabelecido_nome}}, OAB/{{substabelecido_oab_uf}} nº {{substabelecido_oab_numero}}, relativamente ao(à) {{processo_descricao}}, nº {{processo_numero}}, em trâmite perante {{processo_orgao_juizo}}.'),
  p('Declaro estar ciente de que o(a) advogado(a) substabelecente deixará de atuar no referido caso a partir da regular formalização do substabelecimento sem reserva, permanecendo preservados os direitos e deveres decorrentes dos atos anteriormente praticados, inclusive eventual ajuste de honorários, se houver.'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{cliente_nome}}', 'CPF nº {{cliente_cpf}}'),
]);

// ---------------------------------------------------------------------------
// 6. Comunicação Extrajudicial de Renúncia ao Cliente
// ---------------------------------------------------------------------------
await salvar('renuncia-comunicacao-cliente.docx', [
  titulo('COMUNICAÇÃO DE RENÚNCIA AO MANDATO'),
  pl('À: ', '{{cliente_nome}}'),
  pl('Endereço: ', '{{cliente_endereco}}'),
  pl('E-mail/WhatsApp: ', '{{cliente_email_whatsapp}}'),
  p('Prezado(a) Senhor(a) {{cliente_nome}},'),
  p('Na qualidade de advogado(a) constituído(a) nos autos do(a) {{processo_descricao}}, nº {{processo_numero}}, em trâmite perante {{processo_orgao_juizo}}, venho, por meio desta, comunicar formalmente a renúncia ao mandato que me foi outorgado.'),
  p('Nos termos da legislação aplicável, permanecerei responsável pela representação processual pelo prazo legal de 10 (dez) dias contados da ciência desta comunicação, salvo se houver substituição por novo(a) advogado(a) antes do término desse prazo.'),
  p('Solicito que Vossa Senhoria constitua novo(a) advogado(a) com a maior brevidade possível, a fim de evitar prejuízo à continuidade da defesa de seus interesses.'),
  p('Esta comunicação é realizada sem exposição dos motivos da renúncia, em respeito ao sigilo profissional e à preservação da relação advogado-cliente.'),
  p('Permanecem preservados os direitos e obrigações decorrentes dos serviços profissionais já prestados, inclusive eventual saldo de honorários, despesas, prestação de contas, documentos e demais acertos necessários, conforme o caso.'),
  p('Atenciosamente,'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{advogado_nome}}', 'OAB/{{advogado_oab_uf}} nº {{advogado_oab_numero}}'),
]);

// ---------------------------------------------------------------------------
// 7. Petição de Renúncia ao Juízo
// ---------------------------------------------------------------------------
await salvar('peticao-renuncia-juizo.docx', [
  titulo('PETIÇÃO DE RENÚNCIA AO JUÍZO'),
  p('EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{vara}} DA COMARCA DE {{comarca_uf}}'),
  pl('Processo nº: ', '{{processo_numero}}'),
  pl('Parte: ', '{{nome_parte_representada}}'),
  p('{{advogado_nome}}, advogado(a), inscrito(a) na OAB/{{advogado_oab_uf}} sob o nº {{advogado_oab_numero}}, nos autos do processo em epígrafe, em que atua como patrono(a) de {{nome_parte_representada}}, vem, respeitosamente, à presença de Vossa Excelência, comunicar sua RENÚNCIA AO MANDATO outorgado.'),
  p('Informa que o(a) constituinte foi devidamente comunicado(a) da renúncia em {{data_comunicacao_renuncia}}, conforme comprovante anexo.'),
  p('Nos termos legais, o(a) advogado(a) subscritor(a) permanecerá responsável pela representação processual pelo prazo de 10 (dez) dias contados da notificação do(a) constituinte, salvo se houver substituição por novo(a) patrono(a) antes do término desse prazo.'),
  p('Requer que as futuras intimações, após o prazo legal ou após a habilitação de novo(a) advogado(a), deixem de ser direcionadas ao(à) subscritor(a), observadas as cautelas processuais aplicáveis.'),
  p('Termos em que, Pede deferimento.'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{advogado_nome}}', 'OAB/{{advogado_oab_uf}} nº {{advogado_oab_numero}}'),
]);

// ---------------------------------------------------------------------------
// 8. Contrato de Prestação de Serviços Advocatícios e Honorários (27 cláusulas)
// ---------------------------------------------------------------------------
await salvar('contrato-honorarios.docx', [
  titulo('CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS E HONORÁRIOS'),
  p('Pelo presente instrumento particular, de um lado:'),
  pl('CONTRATANTE: ', '{{cliente_nome}}, {{cliente_nacionalidade}}, {{cliente_estado_civil}}, {{cliente_profissao}}, inscrito(a) no CPF/CNPJ sob o nº {{cliente_cpf_cnpj}}, RG/Inscrição Estadual nº {{cliente_rg_ie}}, residente/sediado(a) à {{cliente_endereco}}, telefone/WhatsApp {{cliente_telefone}}, e-mail {{cliente_email}}.'),
  p('E, de outro lado:'),
  pl('CONTRATADO(A): ', '{{advogado_nome_sociedade}}, inscrito(a) na OAB/{{advogado_oab_uf}} sob o nº {{advogado_oab_numero}}, CPF/CNPJ nº {{advogado_cpf_cnpj}}, com endereço profissional à {{advogado_endereco}}, telefone/WhatsApp {{advogado_telefone}}, e-mail {{advogado_email}}.'),
  p('As partes resolvem celebrar o presente Contrato de Prestação de Serviços Advocatícios e Honorários, mediante as cláusulas e condições seguintes.'),

  subtitulo('CLÁUSULA 1ª – DO OBJETO'),
  p('O presente contrato tem por objeto a prestação de serviços advocatícios pelo(a) CONTRATADO(A) em favor do(a) CONTRATANTE, consistentes em {{descricao_servico}}.'),
  p('Parágrafo primeiro. A atuação contratada compreende, especificamente: {{atos_incluidos}}.'),
  p('Parágrafo segundo. Não estão incluídos neste contrato, salvo ajuste escrito posterior: recursos para Tribunais Superiores, ação autônoma, cumprimento de sentença, execução, impugnações incidentais complexas, medidas cautelares autônomas, ações conexas, reconvenção, embargos, agravos, sustentação oral, audiências adicionais, diligências fora da comarca, perícias, custas, emolumentos, deslocamentos, cópias, autenticações, certidões, pareceres técnicos de terceiros e outros serviços não expressamente previstos.'),
  p('Parágrafo terceiro. Havendo necessidade de atuação não prevista no objeto inicial, as partes poderão firmar aditivo contratual ou novo contrato de honorários.'),

  subtitulo('CLÁUSULA 2ª – DA NATUREZA DA OBRIGAÇÃO PROFISSIONAL'),
  p('O(a) CONTRATADO(A) obriga-se a empregar zelo, técnica, independência profissional, diligência e boa-fé na defesa dos interesses do(a) CONTRATANTE, não assumindo obrigação de resultado.'),
  p('Parágrafo único. O(a) CONTRATANTE declara estar ciente de que demandas judiciais, administrativas ou extrajudiciais envolvem riscos, variáveis de interpretação, prazos de terceiros, atuação de magistrados, órgãos públicos, partes contrárias e demais fatores que não dependem exclusivamente do(a) advogado(a).'),

  subtitulo('CLÁUSULA 3ª – DOS HONORÁRIOS INICIAIS OU FIXOS'),
  p('Pelos serviços descritos na Cláusula 1ª, o(a) CONTRATANTE pagará ao(à) CONTRATADO(A), a título de honorários advocatícios contratuais iniciais/fixos, o valor de R$ {{valor_honorarios_fixos}}.'),
  p('Parágrafo primeiro. O pagamento será realizado da seguinte forma: {{forma_pagamento}}.'),
  p('Parágrafo segundo. O atraso no pagamento de qualquer parcela superior a {{prazo_atraso_suspensao_dias}} dias poderá autorizar a suspensão de atos não urgentes, a cobrança dos valores vencidos e/ou a rescisão contratual, observadas as cautelas éticas e processuais, especialmente quando houver mandato judicial em curso.'),
  p('Parágrafo terceiro. O inadimplemento não autoriza abandono de causa pelo(a) advogado(a), devendo eventual encerramento da relação profissional observar as regras de renúncia, comunicação e preservação dos direitos do(a) CONTRATANTE.'),

  subtitulo('CLÁUSULA 4ª – DOS HONORÁRIOS PERCENTUAIS OU DE ÊXITO'),
  p('Além dos honorários fixos previstos na cláusula anterior, o(a) CONTRATANTE pagará ao(à) CONTRATADO(A), a título de honorários de êxito, o percentual de {{percentual_honorarios_exito}}% sobre o proveito econômico obtido, assim entendido como todo valor, bem, crédito, economia, redução de dívida, vantagem patrimonial, acordo, condenação, indenização, benefício, restituição, levantamento, alvará, precatório, RPV ou qualquer outro resultado econômico decorrente da atuação profissional.'),
  p('Parágrafo primeiro. Os honorários de êxito serão devidos no momento em que houver recebimento, disponibilização, compensação, acordo, homologação, trânsito em julgado, levantamento de valores, reconhecimento do direito ou obtenção efetiva da vantagem econômica, conforme a natureza do caso.'),
  p('Parágrafo segundo. Quando o objeto envolver prestações vencidas e vincendas, os honorários incidirão sobre {{base_calculo_parcelas}}, observados os critérios de moderação e razoabilidade.'),
  p('Parágrafo terceiro. Em caso de acordo judicial ou extrajudicial, os honorários percentuais incidirão sobre o valor total do acordo, ainda que o pagamento ao(à) CONTRATANTE seja parcelado.'),
  p('Parágrafo quarto. Caso o(a) CONTRATANTE realize acordo diretamente com a parte contrária sem ciência ou aquiescência do(a) CONTRATADO(A), permanecerá devido o pagamento dos honorários contratuais ajustados, na proporção da vantagem econômica obtida.'),

  subtitulo('CLÁUSULA 5ª – DA QUOTA LITIS, QUANDO APLICÁVEL'),
  p('Quando os honorários forem pactuados em percentual sobre o proveito econômico, as partes declaram ciência de que a remuneração do(a) advogado(a) deverá ser representada por pecúnia e observar moderação e razoabilidade.'),
  p('Parágrafo único. Os honorários contratuais, quando acrescidos dos honorários de sucumbência, não poderão superar a vantagem econômica obtida pelo(a) CONTRATANTE, salvo hipóteses legalmente admitidas e ajustes compatíveis com a ética profissional.'),

  subtitulo('CLÁUSULA 6ª – DOS HONORÁRIOS DE SUCUMBÊNCIA'),
  p('Os honorários de sucumbência fixados judicialmente, por arbitramento, condenação, acordo, cumprimento de sentença, execução, recurso ou qualquer outra decisão, pertencem ao(à) advogado(a) que atuou na causa, não se confundindo com os honorários contratuais ora pactuados.'),
  p('Parágrafo primeiro. Os honorários de sucumbência não excluem os honorários contratuais, salvo ajuste expresso diverso, respeitada a legislação aplicável.'),
  p('Parágrafo segundo. O(a) CONTRATANTE declara ciência de que os honorários sucumbenciais pertencem ao(à) CONTRATADO(A), que poderá executá-los de forma autônoma, inclusive requerer expedição de RPV, precatório, alvará ou pagamento em seu favor, quando cabível.'),
  p('Parágrafo terceiro. Em caso de substabelecimento, parceria ou atuação conjunta com outros advogados, a repartição dos honorários de sucumbência observará ajuste próprio entre os profissionais ou, na ausência de ajuste, a proporcionalidade da atuação de cada um.'),

  subtitulo('CLÁUSULA 7ª – DA AUTORIZAÇÃO DE DESCONTO, RETENÇÃO OU COMPENSAÇÃO DE HONORÁRIOS'),
  p('O(a) CONTRATANTE autoriza expressamente o(a) CONTRATADO(A) a descontar, reter ou compensar os honorários contratuais, honorários de êxito, despesas adiantadas e valores devidos em razão deste contrato diretamente de quantias que vierem a ser recebidas, levantadas, depositadas, transferidas ou disponibilizadas em favor do(a) CONTRATANTE, inclusive por alvará, transferência judicial, acordo, RPV, precatório, depósito extrajudicial ou pagamento direto.'),
  p('Parágrafo primeiro. Realizado o desconto ou compensação, o(a) CONTRATADO(A) deverá prestar contas ao(à) CONTRATANTE, informando o valor recebido, a base de cálculo dos honorários, eventuais despesas abatidas e o saldo líquido a ser repassado.'),
  p('Parágrafo segundo. Quando os valores forem recebidos diretamente pelo(a) CONTRATANTE, este(a) deverá pagar ao(à) CONTRATADO(A) os honorários devidos no prazo de {{prazo_dias_pagamento_apos_recebimento}} dias, contados do recebimento ou disponibilização da vantagem econômica.'),
  p('Parágrafo terceiro. A autorização prevista nesta cláusula é específica, expressa e integra a formação da vontade contratual das partes.'),

  subtitulo('CLÁUSULA 8ª – DAS DESPESAS, CUSTAS E SERVIÇOS DE TERCEIROS'),
  p('Não estão incluídas nos honorários advocatícios as despesas necessárias à condução do caso, tais como custas judiciais, taxas, emolumentos, diligências, deslocamentos, hospedagem, alimentação, cópias, autenticações, certidões, reconhecimento de firma, traduções, honorários periciais, pareceres técnicos, assistentes técnicos, contadores, correspondentes, despachantes, protocolos físicos ou digitais pagos e demais gastos necessários.'),
  p('Parágrafo primeiro. Tais despesas serão de responsabilidade do(a) CONTRATANTE, salvo se houver ajuste expresso em sentido diverso.'),
  p('Parágrafo segundo. Caso o(a) CONTRATADO(A) antecipe despesas, poderá ser ressarcido(a) pelo(a) CONTRATANTE mediante apresentação de comprovantes, inclusive por desconto ou retenção no momento da prestação de contas, quando autorizado neste contrato.'),

  subtitulo('CLÁUSULA 9ª – DO DESCONTO OU CONDIÇÃO ESPECIAL DE HONORÁRIOS'),
  p('Por liberalidade, estratégia de contratação, condição econômica do(a) CONTRATANTE ou peculiaridade do caso, o(a) CONTRATADO(A) concede desconto/condição especial no valor de {{valor_desconto}}, de modo que os honorários ajustados passam a ser de R$ {{valor_final_com_desconto}}.'),
  p('Parágrafo primeiro. O desconto ora concedido é condicionado ao cumprimento pontual das obrigações de pagamento assumidas pelo(a) CONTRATANTE.'),
  p('Parágrafo segundo. Em caso de inadimplemento, rescisão imotivada, revogação do mandato sem justo motivo ou descumprimento contratual, poderá ser restabelecido o valor integral originalmente praticado, proporcionalmente ao trabalho realizado, respeitados os limites éticos e a tabela de honorários aplicável.'),
  p('Parágrafo terceiro. O desconto concedido não implica aviltamento de honorários, devendo ser justificado pelas circunstâncias específicas da contratação e não podendo servir como mecanismo de captação indevida de clientela.'),

  subtitulo('CLÁUSULA 10ª – DA TABELA DE HONORÁRIOS DA OAB'),
  p('As partes declaram ciência de que os honorários advocatícios devem observar a dignidade da profissão, os critérios de moderação e a tabela de honorários vigente da Seccional competente, evitando-se a fixação de valores irrisórios ou incompatíveis com o trabalho profissional.'),
  p('Parágrafo único. Havendo divergência futura quanto ao valor contratado, as partes reconhecem a relevância da tabela de honorários da OAB como parâmetro mínimo e orientativo, sem prejuízo da análise do caso concreto.'),

  subtitulo('CLÁUSULA 11ª – DAS OBRIGAÇÕES DO(A) CONTRATADO(A)'),
  p('São obrigações do(a) CONTRATADO(A):'),
  p('I – atuar com zelo, técnica, independência, lealdade, boa-fé e observância às normas da advocacia;'),
  p('II – informar ao(à) CONTRATANTE os principais atos e andamentos relevantes do caso;'),
  p('III – orientar o(a) CONTRATANTE quanto aos riscos jurídicos razoavelmente identificáveis;'),
  p('IV – preservar o sigilo profissional;'),
  p('V – prestar contas de valores eventualmente recebidos em nome do(a) CONTRATANTE;'),
  p('VI – devolver documentos originais quando solicitados e quando não forem mais necessários à atuação;'),
  p('VII – comunicar eventual impossibilidade de continuidade da atuação, observadas as regras de renúncia ao mandato.'),

  subtitulo('CLÁUSULA 12ª – DAS OBRIGAÇÕES DO(A) CONTRATANTE'),
  p('São obrigações do(a) CONTRATANTE:'),
  p('I – fornecer informações verdadeiras, completas e atualizadas;'),
  p('II – entregar documentos solicitados em tempo hábil;'),
  p('III – manter seus dados de contato atualizados;'),
  p('IV – responder às solicitações do(a) CONTRATADO(A) com brevidade;'),
  p('V – pagar pontualmente os honorários e despesas ajustados;'),
  p('VI – não praticar atos que prejudiquem a estratégia jurídica sem prévia comunicação ao(à) CONTRATADO(A);'),
  p('VII – informar imediatamente qualquer contato da parte contrária, acordo, proposta, notificação, intimação ou fato relevante relacionado ao objeto contratado;'),
  p('VIII – respeitar a independência técnica do(a) advogado(a).'),

  subtitulo('CLÁUSULA 13ª – DO SIGILO PROFISSIONAL E DA CONFIDENCIALIDADE'),
  p('O(a) CONTRATADO(A) obriga-se a preservar sigilo profissional sobre fatos, documentos, informações, estratégias, dados pessoais, dados sensíveis, segredos comerciais, negociações, valores, provas, comunicações e demais elementos de que tomar conhecimento em razão da relação profissional, salvo autorização expressa do(a) CONTRATANTE, dever legal, ordem judicial, necessidade de defesa própria ou hipóteses admitidas pelas normas da advocacia.'),
  p('Parágrafo primeiro. O(a) CONTRATANTE também se obriga a preservar a confidencialidade das estratégias jurídicas, pareceres, minutas, manifestações, orientações técnicas, comunicações internas, mensagens, reuniões e demais conteúdos produzidos pelo(a) CONTRATADO(A), não podendo divulgá-los a terceiros, publicá-los em redes sociais, encaminhá-los a pessoas estranhas à relação profissional ou utilizá-los para finalidade diversa sem autorização prévia e escrita.'),
  p('Parágrafo segundo. A obrigação de confidencialidade permanece mesmo após o encerramento do contrato.'),
  p('Parágrafo terceiro. O compartilhamento de informações com outros profissionais necessários à condução do caso, tais como advogados parceiros, correspondentes, peritos, contadores, assistentes técnicos, mediadores ou consultores, será permitido quando necessário à execução dos serviços, observada a preservação do sigilo.'),

  subtitulo('CLÁUSULA 14ª – DA PROTEÇÃO DE DADOS PESSOAIS'),
  p('O(a) CONTRATANTE autoriza o tratamento de seus dados pessoais e, quando necessário, dados pessoais sensíveis, para fins de execução deste contrato, cumprimento de obrigação legal ou regulatória, exercício regular de direitos em processo judicial, administrativo ou arbitral, proteção do crédito, comunicação entre as partes e demais finalidades legítimas relacionadas à prestação dos serviços advocatícios.'),
  p('Parágrafo único. O(a) CONTRATADO(A) compromete-se a adotar cautelas razoáveis de segurança e confidencialidade no tratamento dos dados recebidos.'),

  subtitulo('CLÁUSULA 15ª – DA COMUNICAÇÃO ENTRE AS PARTES'),
  p('As comunicações entre as partes poderão ocorrer por telefone, WhatsApp, e-mail, videoconferência, aplicativos de mensagem, reuniões presenciais ou outros meios indicados no preâmbulo deste contrato.'),
  p('Parágrafo primeiro. O(a) CONTRATANTE declara ciência de que comunicações por aplicativos de mensagem podem ser utilizadas para solicitações de documentos, envio de informações, alinhamentos e confirmações, sem prejuízo da formalização de atos relevantes por documento próprio quando necessário.'),
  p('Parágrafo segundo. O(a) CONTRATANTE deverá comunicar imediatamente eventual alteração de telefone, e-mail, endereço ou outro dado de contato.'),

  subtitulo('CLÁUSULA 16ª – DOS RISCOS DA DEMANDA E DA INDEPENDÊNCIA TÉCNICA'),
  p('O(a) CONTRATANTE declara ter sido informado(a) de que o resultado do caso depende de fatores jurídicos, probatórios, processuais, administrativos e decisórios que não estão sob controle exclusivo do(a) CONTRATADO(A).'),
  p('Parágrafo primeiro. O(a) CONTRATADO(A) atuará com independência técnica, não estando obrigado(a) a adotar tese, medida, recurso, incidente ou providência que entenda juridicamente inadequada, temerária, abusiva, antiética ou contrária aos interesses profissionais e legais envolvidos.'),
  p('Parágrafo segundo. A eventual discordância do(a) CONTRATANTE quanto à estratégia técnica poderá ensejar realinhamento da atuação, aditivo contratual, substabelecimento ou renúncia ao mandato, conforme o caso.'),

  subtitulo('CLÁUSULA 17ª – DA PRESTAÇÃO DE CONTAS'),
  p('Sempre que o(a) CONTRATADO(A) receber valores, documentos, bens ou vantagens em nome do(a) CONTRATANTE, deverá prestar contas de forma clara, discriminando valores recebidos, honorários descontados, despesas ressarcidas e saldo eventualmente devido.'),
  p('Parágrafo primeiro. A prestação de contas poderá ocorrer por demonstrativo escrito, e-mail, recibo, relatório financeiro, termo de quitação ou outro meio idôneo.'),
  p('Parágrafo segundo. O(a) CONTRATANTE deverá indicar conta bancária de sua titularidade para recebimento de valores líquidos, quando houver.'),

  subtitulo('CLÁUSULA 18ª – DA REVOGAÇÃO DO MANDATO PELO(A) CONTRATANTE'),
  p('O(a) CONTRATANTE poderá revogar o mandato outorgado ao(à) CONTRATADO(A) a qualquer tempo, mediante comunicação formal.'),
  p('Parágrafo primeiro. A revogação não desobriga o(a) CONTRATANTE do pagamento dos honorários contratados, vencidos, proporcionais ou de êxito relacionados ao trabalho já realizado, nem afasta o direito do(a) CONTRATADO(A) aos honorários de sucumbência proporcionais à atuação profissional.'),
  p('Parágrafo segundo. Havendo revogação após atuação relevante, acordo, sentença, decisão favorável, obtenção de vantagem econômica ou encaminhamento substancial do caso, os honorários serão devidos conforme este contrato, proporcionalmente ao trabalho desenvolvido e ao resultado alcançado ou viabilizado pela atuação profissional.'),

  subtitulo('CLÁUSULA 19ª – DA RENÚNCIA AO MANDATO PELO(A) CONTRATADO(A)'),
  p('O(a) CONTRATADO(A) poderá renunciar ao mandato, especialmente em caso de quebra de confiança, inadimplemento, ausência de colaboração do(a) CONTRATANTE, conflito ético, divergência técnica insanável, omissão de informações relevantes, exigência de conduta incompatível com a ética profissional ou outra razão justificada.'),
  p('Parágrafo primeiro. A renúncia será comunicada ao(à) CONTRATANTE e, quando houver processo em curso, ao juízo ou órgão competente, observando-se o prazo legal de responsabilidade após a notificação, salvo substituição anterior por novo(a) patrono(a).'),
  p('Parágrafo segundo. A renúncia não implicará renúncia automática aos honorários contratados, proporcionais, vencidos, de êxito ou sucumbenciais eventualmente devidos.'),

  subtitulo('CLÁUSULA 20ª – DA RESCISÃO CONTRATUAL'),
  p('O presente contrato poderá ser rescindido por qualquer das partes, mediante comunicação escrita.'),
  p('Parágrafo primeiro. Em caso de rescisão, serão devidos os honorários vencidos, despesas comprovadas, valores proporcionais ao trabalho realizado e, quando aplicável, honorários de êxito sobre vantagem econômica obtida ou decorrente da atuação profissional já desenvolvida.'),
  p('Parágrafo segundo. A rescisão contratual não se confunde automaticamente com renúncia ao mandato judicial, devendo esta ser formalizada nos autos quando necessário.'),

  subtitulo('CLÁUSULA 21ª – DO ACORDO, TRANSAÇÃO OU COMPOSIÇÃO'),
  p('O(a) CONTRATANTE não deverá firmar acordo, transação, confissão, reconhecimento, renúncia ou composição com a parte contrária sem prévia comunicação ao(à) CONTRATADO(A), a fim de evitar prejuízos jurídicos, processuais ou financeiros.'),
  p('Parágrafo primeiro. A realização de acordo judicial ou extrajudicial não reduz nem exclui os honorários contratados, salvo ajuste expresso em sentido diverso.'),
  p('Parágrafo segundo. Os honorários percentuais incidirão sobre o valor econômico total do acordo ou vantagem obtida, ainda que o pagamento seja parcelado ou realizado por meio de obrigação não pecuniária economicamente mensurável.'),

  subtitulo('CLÁUSULA 22ª – DA CONTRATAÇÃO DE OUTROS PROFISSIONAIS'),
  p('O(a) CONTRATADO(A) poderá, quando necessário ou conveniente à defesa dos interesses do(a) CONTRATANTE, atuar em conjunto com outros advogados, substabelecer poderes com ou sem reserva, contratar correspondentes, solicitar pareceres, indicar peritos, contadores, assistentes técnicos ou outros profissionais auxiliares.'),
  p('Parágrafo primeiro. Os honorários e despesas de terceiros não estão incluídos neste contrato, salvo previsão expressa.'),
  p('Parágrafo segundo. Quando houver contratação de outro profissional com ônus ao(à) CONTRATANTE, este(a) deverá ser previamente informado(a), salvo situação de urgência devidamente justificada.'),

  subtitulo('CLÁUSULA 23ª – DO USO DE IMAGEM, CASO CONCRETO E PUBLICIDADE'),
  p('O(a) CONTRATADO(A) não poderá divulgar nome, imagem, documentos, dados, caso concreto, valores, estratégia, resultado, decisão ou informação identificável do(a) CONTRATANTE para fins de publicidade profissional sem autorização expressa e específica, observadas as normas éticas da advocacia.'),
  p('Parágrafo único. Ainda que autorizado, o uso de informações deverá respeitar o sigilo profissional, a dignidade da advocacia, a proteção de dados pessoais e as limitações éticas aplicáveis à publicidade profissional.'),

  subtitulo('CLÁUSULA 24ª – DA INEXISTÊNCIA DE EXCLUSIVIDADE, VÍNCULO EMPREGATÍCIO OU SOCIEDADE'),
  p('O presente contrato possui natureza civil e profissional, não gerando vínculo empregatício, societário, associativo, de representação comercial, subordinação ou exclusividade, salvo previsão expressa em instrumento próprio.'),

  subtitulo('CLÁUSULA 25ª – DA COBRANÇA DE HONORÁRIOS'),
  p('Em caso de inadimplemento, o(a) CONTRATADO(A) poderá promover cobrança amigável ou judicial dos honorários devidos, inclusive com fundamento neste contrato como título executivo extrajudicial, quando cabível.'),
  p('Parágrafo único. Havendo necessidade de cobrança judicial dos honorários em face do(a) CONTRATANTE, recomenda-se que o(a) CONTRATADO(A), se ainda estiver no patrocínio da causa principal, avalie a necessidade de renúncia e representação por outro advogado, observadas as normas éticas aplicáveis.'),

  subtitulo('CLÁUSULA 26ª – DA DECLARAÇÃO DE CIÊNCIA E COMPREENSÃO'),
  p('O(a) CONTRATANTE declara que leu o presente contrato, compreendeu suas cláusulas, teve oportunidade de formular perguntas, recebeu esclarecimentos suficientes sobre objeto, riscos, honorários, despesas, sucumbência, êxito, sigilo, desconto, revogação, renúncia e prestação de contas, assinando-o de forma livre e consciente.'),

  subtitulo('CLÁUSULA 27ª – DO FORO'),
  p('As partes elegem o foro da Comarca de {{comarca_uf_foro}} para dirimir eventuais controvérsias decorrentes deste contrato, salvo competência legal específica ou eleição de meio adequado de solução consensual de conflitos.'),

  p('E, por estarem justas e contratadas, assinam as partes o presente instrumento em {{numero_vias}} vias de igual teor, juntamente com duas testemunhas.'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{cliente_nome}}', 'CPF/CNPJ nº {{cliente_cpf_cnpj}}'),
  ...assinatura('{{advogado_nome_sociedade}}', 'OAB/{{advogado_oab_uf}} nº {{advogado_oab_numero}}'),
  new Paragraph({ text: '', spacing: { before: 300 } }),
  p('TESTEMUNHAS:'),
  p('1. Nome:'),
  p('   CPF:'),
  p('2. Nome:'),
  p('   CPF:'),
]);

// ---------------------------------------------------------------------------
// 9. Termo de Ciência sobre Riscos da Demanda
// ---------------------------------------------------------------------------
await salvar('termo-ciencia-riscos.docx', [
  titulo('TERMO DE CIÊNCIA E ORIENTAÇÃO SOBRE RISCOS'),
  pl('CLIENTE: ', '{{cliente_nome}}'),
  pl('ADVOGADO(A): ', '{{advogado_nome}}'),
  pl('CASO/PROCESSO: ', '{{caso_processo_descricao}}'),
  p('Declaro, para os devidos fins, que fui informado(a) pelo(a) advogado(a) acima identificado(a) acerca dos riscos jurídicos, processuais, probatórios, financeiros e temporais relacionados ao caso descrito.'),
  p('Declaro ciência de que a atuação advocatícia constitui obrigação de meio, e não promessa de resultado, dependendo a solução da causa de fatores como provas, documentos, interpretação da legislação, entendimento do juízo ou órgão competente, atuação da parte contrária, prazos processuais, recursos e demais circunstâncias externas à vontade exclusiva do(a) advogado(a).'),
  p('Fui informado(a), ainda, sobre a necessidade de fornecer documentos e informações verdadeiras, completas e tempestivas, bem como sobre a importância de manter meus dados de contato atualizados.'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{cliente_nome}}', 'CPF nº {{cliente_cpf}}'),
  ...assinatura('{{advogado_nome}}', 'OAB/{{advogado_oab_uf}} nº {{advogado_oab_numero}}'),
]);

// ---------------------------------------------------------------------------
// 10. Recibo de Honorários Advocatícios
// ---------------------------------------------------------------------------
await salvar('recibo-honorarios.docx', [
  titulo('RECIBO'),
  p('Recebi de {{cliente_nome}}, CPF/CNPJ nº {{cliente_cpf_cnpj}}, a importância de R$ {{valor_recebido}}, referente ao pagamento de honorários advocatícios ({{tipo_honorario}}), relativos ao(à) {{descricao_servico_processo}}.'),
  pl('Forma de pagamento: ', '{{forma_pagamento_recibo}}.'),
  pl('Data do pagamento: ', '{{data_pagamento}}.'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{advogado_nome_sociedade}}', 'OAB/{{advogado_oab_uf}} nº {{advogado_oab_numero}}'),
]);

// ---------------------------------------------------------------------------
// 11. Termo de Prestação de Contas e Quitação Parcial
// ---------------------------------------------------------------------------
await salvar('termo-prestacao-contas.docx', [
  titulo('TERMO DE PRESTAÇÃO DE CONTAS'),
  pl('CLIENTE: ', '{{cliente_nome}}'),
  pl('ADVOGADO(A): ', '{{advogado_nome}}'),
  pl('PROCESSO/CASO: ', '{{processo_caso}}'),
  p('O(a) advogado(a) apresenta ao(à) cliente a seguinte prestação de contas:'),
  pl('Valor bruto recebido: ', 'R$ {{valor_bruto_recebido}}'),
  pl('Origem do valor: ', '{{origem_valor}}'),
  pl('Data do recebimento: ', '{{data_recebimento}}'),
  subtitulo('Deduções autorizadas:'),
  pl('Honorários contratuais: ', 'R$ {{valor_honorarios_contratuais}}'),
  pl('Honorários de êxito: ', 'R$ {{valor_honorarios_exito}}'),
  pl('Despesas comprovadas: ', 'R$ {{valor_despesas_comprovadas}}'),
  pl('Outros abatimentos autorizados: ', 'R$ {{valor_outros_abatimentos}}'),
  pl('Saldo líquido repassado ao cliente: ', 'R$ {{valor_saldo_liquido}}'),
  pl('Forma de repasse: ', '{{forma_repasse}}'),
  pl('Data do repasse: ', '{{data_repasse}}'),
  p('O(a) CLIENTE declara ter recebido as informações acima e, ressalvadas eventuais observações expressamente registradas neste termo, confere quitação parcial quanto aos valores discriminados.'),
  pl('Observações: ', '{{observacoes}}'),
  p('{{local}}, {{data}}.'),
  ...assinatura('{{cliente_nome}}', 'CPF nº {{cliente_cpf}}'),
  ...assinatura('{{advogado_nome}}', 'OAB/{{advogado_oab_uf}} nº {{advogado_oab_numero}}'),
]);

console.log('\nTodos os 11 templates foram gerados em', OUT_DIR);
