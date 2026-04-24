// src/ui/dashboard.ts
import { ClaudeUsage } from "../core/api";
import { APP_VERSION, COLORS, getStatusColor } from "../utils/theme";
import { buildBar, formatRelativeTime, computePace } from "../utils/formatters";
import { UI_COMPONENTS } from "./components";

export function renderHUD(usage: ClaudeUsage, newVersion: string | null = null): void {
  const sP = usage.five_hour.utilization;
  const wP = usage.seven_day.utilization;
  const { targetAllocation, pacePercent, slack, todayUsagePercent } = computePace(wP, usage.seven_day.resets_at);

  const sReset = formatRelativeTime(usage.five_hour.resets_at);
  const wReset = formatRelativeTime(usage.seven_day.resets_at);

  const isOverburn = pacePercent > 100 || sP > 90;
  
  console.clear();

  // Banner de Update (se houver nova versão)
  if (newVersion) {
    console.log(` ${COLORS.BG_MAGENTA}${COLORS.BLACK}${COLORS.BOLD} ✨ UPDATE DISPONÍVEL: v${newVersion} ${COLORS.RESET}`);
    console.log(` ${COLORS.MAGENTA}└─> Rode: npm i -g @igorcol/claude-stats@latest${COLORS.RESET}\n`);
  }

  console.log(UI_COMPONENTS.header(`CLAUDE OPERATIONAL TELEMETRY v${APP_VERSION}`, isOverburn));
  
  console.log(` ${UI_COMPONENTS.subLabel(`Modo: ${isOverburn ? "HIGH RISK / OVERBURN" : "OPTIMAL / STABLE"}`)}\n`);

  console.log(` ${UI_COMPONENTS.label("⚡ CARGA ATUAL")}`);
  console.log(`  SESSÃO (5H) ${buildBar(sP, getStatusColor(sP))} ${COLORS.GRAY}│ Reset: ${COLORS.CYAN}${sReset}${COLORS.RESET}`);

  const debt = Math.max(0, todayUsagePercent - 100);
  const dailyLabel = debt > 0 ? `${COLORS.RED}DÍVIDA: -${debt.toFixed(1)}%${COLORS.RESET}` : `${COLORS.GREEN}LIVRE: ${(100 - todayUsagePercent).toFixed(1)}%${COLORS.RESET}`;
  console.log(`  DIÁRIO (COT) ${buildBar(todayUsagePercent, getStatusColor(todayUsagePercent))} ${COLORS.GRAY}│ ${dailyLabel}`);

  console.log(UI_COMPONENTS.divider());

  console.log(` ${UI_COMPONENTS.label("📅 SAÚDE DO CICLO")}`);
  console.log(`  TOTAL (W)   ${buildBar(wP, getStatusColor(wP))}`);
  
  const paceStatus = pacePercent > 100 ? `${COLORS.BG_RED}${COLORS.BLACK} OVERBURN ${COLORS.RESET}` : `${COLORS.BG_GREEN}${COLORS.BLACK} STABLE ${COLORS.RESET}`;
  console.log(`  RITMO (P)   ${buildBar(pacePercent, getStatusColor(pacePercent))} ${paceStatus}`);

  // Rodapé
  console.log(`\n ${COLORS.BG_YELLOW}${COLORS.BLACK}${COLORS.BOLD} NEXT GLOBAL RESET ${COLORS.RESET} ${COLORS.BOLD}${COLORS.YELLOW} ${wReset}${COLORS.RESET}`);
  
  const slackColor = slack >= 0 ? COLORS.GREEN : COLORS.RED;
  console.log(` ${COLORS.GRAY}Ideal: ${targetAllocation.toFixed(1)}% │ Real: ${wP.toFixed(1)}% │ ${COLORS.RESET}${slackColor}${COLORS.BOLD}Folga: ${slack.toFixed(1)}%${COLORS.RESET}`);
}