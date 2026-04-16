

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
  console.log(`\n ${COLORS.BOLD}${COLORS.CYAN}┎────────────────────────────────────────────────────────────────────────┒${COLORS.RESET}`);
  console.log(` ${COLORS.BOLD}${COLORS.CYAN}┃                    CLAUDE OPERATIONAL TELEMETRY                    ┃${COLORS.RESET}`);
  console.log(` ${COLORS.BOLD}${COLORS.CYAN}┖────────────────────────────────────────────────────────────────────────┚${COLORS.RESET}`);

  // --- SEÇÃO 1: ACIONÁVEL / CURTO PRAZO (Urgente) ---
  console.log(`\n ${COLORS.BOLD}${COLORS.CYAN}┌[ STATUS DE SESSÃO IMEDIATA ]${COLORS.RESET}`);
  
  // SESSÃO
  console.log(`  │ ${COLORS.BOLD}${COLORS.GRAY}SESSÃO (5H)${COLORS.RESET} ${buildBar(sP, getStatusColor(sP))} ${COLORS.GRAY}Next:${COLORS.RESET} ${COLORS.CYAN_BOLD}${sessionReset}${COLORS.RESET}`);

  // HOJE
  const todayColor = todayUsagePercent > 100 ? COLORS.RED_BOLD : COLORS.GREEN_BOLD;
  console.log(`  │ ${COLORS.BOLD}${COLORS.GRAY}HOJE   (COT)${COLORS.RESET} ${buildBar(todayUsagePercent, getStatusColor(todayUsagePercent))} ${COLORS.GRAY}Livre:${COLORS.RESET} ${todayColor}${remainingToday.toFixed(1)}% do balde${COLORS.RESET}`);
  
  console.log(` ${COLORS.CYAN}└───────────────────────────────${COLORS.RESET}`);

  // --- SEÇÃO 2: ESTRATÉGICO / SAÚDE DA CONTA (O Oráculo) ---
  console.log(`\n ${COLORS.BOLD}${COLORS.CYAN}┌[ SAÚDE E RITMO DA CONTA ]${COLORS.RESET}`);

  // SEMANAL
  console.log(`  │ ${COLORS.BOLD}${COLORS.GRAY}SEMANAL (W)${COLORS.RESET} ${buildBar(wP, getStatusColor(wP))} ${COLORS.GRAY}RESET EM:${COLORS.RESET} ${COLORS.BOLD}${COLORS.YELLOW}${weeklyReset}${COLORS.RESET}`);

  // RITMO (Pace)
  const paceLabelColor = pacePercent > 100 ? COLORS.RED_BOLD : COLORS.GREEN_BOLD;
  console.log(`  │ ${COLORS.BOLD}${COLORS.GRAY}RITMO (PACE)${COLORS.RESET} ${buildBar(pacePercent, getStatusColor(pacePercent))} ${COLORS.GRAY}Status:${COLORS.RESET} ${paceLabelColor}[${pacePercent > 100 ? "OVERBURN" : "STABLE"}]${COLORS.RESET}`);

  // DETALHES TÉCNICOS (O rodapé de dados puros)
  const slackColor = slack >= 0 ? COLORS.GREEN_BOLD : COLORS.RED_BOLD;
  const detailsLine = `${COLORS.BOLD}${COLORS.GRAY}DADOS TÉCNICOS ::${COLORS.RESET} Alvo: ${COLORS.WHITE_BOLD}${targetAllocation.toFixed(1)}%${COLORS.RESET} | Uso: ${COLORS.WHITE_BOLD}${wP.toFixed(1)}%${COLORS.RESET} | Folga Semanal: ${slackColor}${slack.toFixed(1)}%${COLORS.RESET}`;
  
  console.log(`  │\n  │ ${detailsLine}`);
  console.log(` ${COLORS.CYAN}└────────────────────────────────────────────────────────────────────────${COLORS.RESET}\n`);
}