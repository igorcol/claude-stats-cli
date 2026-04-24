import { COLORS } from "../utils/theme";

export const UI_COMPONENTS = {
  header: (
    title: string,
    version: string,
    alias: string,
    tier: string,
    isAlert: boolean = false,
  ) => {
    const bg = isAlert ? COLORS.BG_RED : COLORS.BG_CYAN;
    const icon = isAlert ? "🚨" : "💎";

    // Cores dinâmicas
    const tierColor = tier === "PRO" ? COLORS.MAGENTA : COLORS.CYAN;
    const tierText = tier === "PRO" ? "PRO" : "FREE";

    // 1. Título com bloco de cor sólido (O clássico) + Versão sutil ao lado
    const titleBlock = `\n ${bg}${COLORS.BLACK}${COLORS.BOLD}  ${icon} ${title}  ${COLORS.RESET}  ${COLORS.GRAY}v${version}${COLORS.RESET} │${COLORS.RESET} ${COLORS.GREEN}${COLORS.BOLD}ONLINE${COLORS.RESET}`;

    // 2. Linha de Metadados Limpa (Sem colchetes, separada por pipe)
    const metaLine = `👤 ${COLORS.WHITE_BOLD}${alias}${COLORS.RESET}  ${COLORS.GRAY}│${COLORS.RESET}  ${tierColor}${COLORS.BOLD}${tierText}${COLORS.RESET}  ${COLORS.GRAY}`;

    return `${titleBlock}\n ${COLORS.GRAY}──────────────────────────────────────────────────────────────────${COLORS.RESET}\n ${metaLine}`;
  },

  divider: () =>
    `\n ${COLORS.GRAY}──────────────────────────────────────────────────────────────────${COLORS.RESET}\n`,

  label: (text: string) => `${COLORS.WHITE_BOLD}${text}${COLORS.RESET}`,

  subLabel: (text: string) => `${COLORS.GRAY}${text}${COLORS.RESET}`,
};
