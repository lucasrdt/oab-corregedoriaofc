export type StatusTag = "EMENDA" | "+10%" | "NOVO" | "ATUALIZADO";

// "Badge fantasma": estilo neutro e minimalista de propósito — a tag existe pra fins de
// auditoria, mas não deve competir visualmente com o nome do serviço.
const GHOST_BADGE = "bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5";

export const STATUS_TAG_STYLES: Record<StatusTag, string> = {
  EMENDA: GHOST_BADGE,
  "+10%": GHOST_BADGE,
  NOVO: GHOST_BADGE,
  ATUALIZADO: GHOST_BADGE,
};

// Mesmo espírito "fantasma" do GHOST_BADGE, mas para os cabeçalhos navy (DetalheItemSheet) —
// slate-100/500 fica ilegível sobre fundo escuro, então usa branco translúcido em vez disso.
const GHOST_BADGE_DARK = "border-white/15 bg-white/10 text-white/70 text-[10px] px-1.5 py-0.5";

export const STATUS_TAG_STYLES_DARK: Record<StatusTag, string> = {
  EMENDA: GHOST_BADGE_DARK,
  "+10%": GHOST_BADGE_DARK,
  NOVO: GHOST_BADGE_DARK,
  ATUALIZADO: GHOST_BADGE_DARK,
};

/**
 * Mapeamento item.id → status oficial (EMENDA, NOVO, ATUALIZADO, +10%) da Tabela OAB-MA 2026.
 * Preenchido a partir do "Quadro Comparativo De → Para" do documento oficial
 * (Tabela_Honorarios_OABMA_2026_VisualLaw), cobrindo as 53 alterações auditadas
 * (50 correções de valor + 3 itens novos da Emenda Eceiza). Itens da tabela que não constam
 * do quadro comparativo permanecem sem tag, para não exibir classificação não verificada.
 * Itens com situação "PROPOSTA 26" no documento (valor da proposta base preenchido pela
 * 1ª vez) foram mapeados para ATUALIZADO, por não haver categoria própria no StatusTag.
 */
export const STATUS_POR_ITEM: Partial<Record<string, StatusTag>> = {
  "1.2": "+10%",
  "1.12.1": "+10%",
  "3.1.1": "EMENDA",
  "3.1.2": "+10%",
  "3.2.1": "+10%",
  "3.3.2": "+10%",
  "3.3.3": "+10%",
  "3.3.6": "EMENDA",
  "3.3.7": "+10%",
  "3.3.9": "EMENDA",
  "3.3.13": "+10%",
  "3.3.14": "+10%",
  "3.3.21": "+10%",
  "4.1": "+10%",
  "10.5.3": "+10%",
  "10.5.5": "+10%",
  "12.2": "+10%",
  "12.4": "+10%",
  "12.5": "EMENDA",
  "12.8": "EMENDA",
  "16.1.2": "+10%",
  "16.17.1": "EMENDA",
  "18.5": "+10%",
  "20.1.1": "EMENDA",
  "20.1.2": "+10%",
  "20.1.7": "+10%",
  "20.2.3": "+10%",
  "21.2.8": "+10%",
  "21.5.4": "EMENDA",
  "21.5.6": "+10%",
  "21.7.2": "+10%",
  "21.7.3": "+10%",
  "22.10": "+10%",
  "22.15": "+10%",
  "22.24": "+10%",
  "24.1.1": "EMENDA",
  "24.3.1": "EMENDA",
  "24.3.2": "EMENDA",
  "24.3.3": "EMENDA",
  "24.3.4": "EMENDA",
  "24.3.6": "EMENDA",
  "24.4.3": "EMENDA",
  "24.4.8": "EMENDA",
  "24.4.11": "EMENDA",
  "25.1.2": "ATUALIZADO",
  "25.2.2": "ATUALIZADO",
  "25.3.2": "+10%",
  "25.4.1": "+10%",
  "25.5.2": "ATUALIZADO",
  "25.6.1": "EMENDA",
  "25.7.2": "+10%",
  "28.1.1": "EMENDA",
  "28.2.1": "+10%",
  "14.12": "NOVO",
  "14.13": "NOVO",
  "24.3.6-A": "NOVO",
};

export function getStatusTag(itemId: string): StatusTag | undefined {
  return STATUS_POR_ITEM[itemId];
}
