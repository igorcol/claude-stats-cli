// src/ui.ts
import { ClaudeUsage } from "./api";
import { COLORS, getStatusColor } from "./utils/theme";
import { buildBar, formatRelativeTime } from "./utils/formatters";

export function renderHUD(usage: ClaudeUsage): void {
  const sP = usage.five_hour.utilization;
  const wP = usage.seven_day.utilization;

  console.clear();
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN} CLAUDE OPERATIONAL STATUS${COLORS.RESET}`);
  console.log(`${COLORS.GRAY} --------------------------${COLORS.RESET}`);

  // Bloco 5 Horas
  console.log(`\n [5H WINDOW (sP)]`);
  console.log(` ${buildBar(sP, getStatusColor(sP))}`);
  console.log(` ${COLORS.GRAY}Resets in: ${formatRelativeTime(usage.five_hour.resets_at)}${COLORS.RESET}`);

  // Bloco 7 Dias
  console.log(`\n [7D WINDOW (wP)]`);
  console.log(` ${buildBar(wP, getStatusColor(wP))}`);
  console.log(` ${COLORS.GRAY}Resets in: ${formatRelativeTime(usage.seven_day.resets_at)}${COLORS.RESET}`);
  
  console.log(`\n${COLORS.GRAY} --------------------------${COLORS.RESET}\n`);
}