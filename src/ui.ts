// src/ui.ts
import { ClaudeUsage } from "./api";
import { COLORS, getStatusColor } from "./utils/theme";
import { buildBar, formatRelativeTime, computePace } from "./utils/formatters";

export function renderHUD(usage: ClaudeUsage): void {
  const sP = usage.five_hour.utilization;
  const wP = usage.seven_day.utilization;
  const { targetAllocation, pacePercent, slack, todayUsagePercent } = computePace(wP, usage.seven_day.resets_at);

  const sReset = formatRelativeTime(usage.five_hour.resets_at);
  const wReset = formatRelativeTime(usage.seven_day.resets_at);

  const isOverburn = pacePercent > 100 || sP > 90;
  const headerBG = isOverburn ? COLORS.BG_RED : COLORS.BG_CYAN;
  const statusIcon = isOverburn ? "🚨" : "💎";
  
  console.clear();
  
  // HEADER
  console.log(`\n ${headerBG}${COLORS.BLACK}${COLORS.BOLD}  ${statusIcon} CLAUDE OPERATIONAL TELEMETRY v1.3.1  ${COLORS.RESET}`);
  console.log(` ${COLORS.GRAY} Modo: ${isOverburn ? "HIGH RISK / OVERBURN" : "OPTIMAL / STABLE"}${COLORS.RESET}\n`);

  // --- CARGA ATUAL ---
  console.log(` ${COLORS.WHITE_BOLD}⚡ CARGA ATUAL${COLORS.RESET}`);
  
  console.log(`  SESSÃO (5H) ${buildBar(sP, getStatusColor(sP))} ${COLORS.GRAY}│ Reset: ${COLORS.CYAN}${sReset}${COLORS.RESET}`);

  const debt = Math.max(0, todayUsagePercent - 100);
  const dailyLabel = debt > 0 ? `${COLORS.RED}DÍVIDA: -${debt.toFixed(1)}%${COLORS.RESET}` : `${COLORS.GREEN}LIVRE: ${(100 - todayUsagePercent).toFixed(1)}%${COLORS.RESET}`;
  console.log(`  DIÁRIO (COT) ${buildBar(todayUsagePercent, getStatusColor(todayUsagePercent))} ${COLORS.GRAY}│ ${dailyLabel}${COLORS.RESET}`);

  console.log(`\n ${COLORS.GRAY}──────────────────────────────────────────────────────────────────${COLORS.RESET}\n`);

  // --- SAÚDE DO CICLO ---
  console.log(` ${COLORS.WHITE_BOLD}📅 SAÚDE DO CICLO${COLORS.RESET}`);
  
  console.log(`  TOTAL (W)   ${buildBar(wP, getStatusColor(wP))}`);
  
  const paceStatus = pacePercent > 100 ? `${COLORS.BG_RED}${COLORS.BLACK} OVERBURN ${COLORS.RESET}` : `${COLORS.BG_GREEN}${COLORS.BLACK} STABLE ${COLORS.RESET}`;
  console.log(`  RITMO (P)   ${buildBar(pacePercent, getStatusColor(pacePercent))} ${paceStatus}`);

  // --- RODAPÉ ---
  console.log(`\n ${COLORS.BG_YELLOW}${COLORS.BLACK}${COLORS.BOLD} NEXT GLOBAL RESET ${COLORS.RESET} ${COLORS.BOLD}${COLORS.YELLOW} ${wReset}${COLORS.RESET}`);
  
  const slackColor = slack >= 0 ? COLORS.GREEN : COLORS.RED;
  console.log(` ${COLORS.GRAY}Ideal: ${targetAllocation.toFixed(1)}% │ Real: ${wP.toFixed(1)}% │ ${COLORS.RESET}${slackColor}${COLORS.BOLD}Folga: ${slack.toFixed(1)}%${COLORS.RESET}`);
}