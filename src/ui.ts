// src/ui.ts
import { ClaudeUsage } from "./api";
import { COLORS, getStatusColor } from "./utils/theme";
import { buildBar, formatRelativeTime, computePace } from "./utils/formatters";

export function renderHUD(usage: ClaudeUsage): void {
  const sP = usage.five_hour.utilization;
  const wP = usage.seven_day.utilization;
  const { targetAllocation, pacePercent, slack, todayUsagePercent } = computePace(
    wP,
    usage.seven_day.resets_at,
  );

  const sessionReset = formatRelativeTime(usage.five_hour.resets_at);
  const weeklyReset = formatRelativeTime(usage.seven_day.resets_at);
  const remainingToday = Math.max(0, 100 - todayUsagePercent);

  console.clear();
  console.log(`\n ${COLORS.BOLD}${COLORS.CYAN}┎──────────────────────────────────────────────────────────┒${COLORS.RESET}`);
  console.log(` ${COLORS.BOLD}${COLORS.CYAN}┃                CLAUDE OPERATIONAL STATUS                 ┃${COLORS.RESET}`);
  console.log(` ${COLORS.BOLD}${COLORS.CYAN}┖──────────────────────────────────────────────────────────┚${COLORS.RESET}`);

  // --- CURTO PRAZO ---
  console.log(`\n ${COLORS.BOLD}${COLORS.WHITE}[ CURTO PRAZO: CONSUMO IMEDIATO ]${COLORS.RESET}`);
  
  // SESSÃO: Removi a % extra daqui
  console.log(`  SESSÃO (5H)  ${buildBar(sP, getStatusColor(sP))}`);
  console.log(`               ${COLORS.GRAY}↳ Próximo reset: ${COLORS.CYAN}${sessionReset}${COLORS.RESET}\n`);

  // HOJE: Removi a % extra daqui
  const todayColor = todayUsagePercent > 100 ? COLORS.RED : COLORS.GREEN;
  console.log(`  HOJE (COT)   ${buildBar(todayUsagePercent, getStatusColor(todayUsagePercent))}`);
  console.log(`               ${COLORS.GRAY}↳ Disponível: ${todayColor}${remainingToday.toFixed(1)}%${COLORS.GRAY} do balde diário${COLORS.RESET}`);

  console.log(`\n ${COLORS.GRAY}────────────────────────────────────────────────────────────${COLORS.RESET}`);

  // --- LONGO PRAZO ---
  console.log(`\n ${COLORS.BOLD}${COLORS.WHITE}[ LONGO PRAZO: SAÚDE DA CONTA ]${COLORS.RESET}`);

  // SEMANAL: Removi a % extra daqui e dei destaque no Reset Semanal
  console.log(`  SEMANAL      ${buildBar(wP, getStatusColor(wP))}`);
  console.log(`               ${COLORS.BOLD}${COLORS.GRAY}↳ CICLO ENCERRA EM: ${weeklyReset}${COLORS.RESET}\n`);

  // PACE: O Oráculo do Ritmo
  const paceLabel = pacePercent > 100 ? "OVERBURN" : "STABLE";
  const slackColor = slack >= 0 ? COLORS.GREEN : COLORS.RED;
  
  console.log(`  PACE (RITMO) ${buildBar(pacePercent, getStatusColor(pacePercent))} ${COLORS.BOLD}[${paceLabel}]${COLORS.RESET}`);
  
  // STATS (Rodapé preciso)
  console.log(`\n  ${COLORS.BOLD}DETALHES:${COLORS.RESET}  Alvo: ${targetAllocation.toFixed(1)}%  |  Uso: ${wP.toFixed(1)}%  |  Folga: ${slackColor}${slack.toFixed(1)}%${COLORS.RESET}`);

  console.log(`\n ${COLORS.CYAN}────────────────────────────────────────────────────────────${COLORS.RESET}\n`);
}