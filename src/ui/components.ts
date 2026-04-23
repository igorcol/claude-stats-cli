
import { COLORS } from "../utils/theme";

export const UI_COMPONENTS = {
    
  header: (title: string, isAlert: boolean = false) => {
    const bg = isAlert ? COLORS.BG_RED : COLORS.BG_CYAN;
    const icon = isAlert ? "🚨" : "💎";
    return `\n ${bg}${COLORS.BLACK}${COLORS.BOLD}  ${icon} ${title}  ${COLORS.RESET}`;
  },
  
  divider: () => `\n ${COLORS.GRAY}──────────────────────────────────────────────────────────────────${COLORS.RESET}\n`,
  
  label: (text: string) => `${COLORS.WHITE_BOLD}${text}${COLORS.RESET}`,
  
  subLabel: (text: string) => `${COLORS.GRAY}${text}${COLORS.RESET}`
};