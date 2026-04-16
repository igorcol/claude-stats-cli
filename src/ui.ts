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

  console.clear();
  console.log(`\n${COLORS.BOLD}${COLORS.CYAN} CLAUDE OPERATIONAL STATUS${COLORS.RESET}`);
  console.log(`${COLORS.GRAY} --------------------------${COLORS.RESET}`);

  // Bloco 1: Sessão Ativa (Curto Prazo)
  console.log(`\n [ SESSÃO ATIVA ]`);
  console.log(` ${buildBar(sP, getStatusColor(sP))}`);
  console.log(` ${COLORS.GRAY}Resets in: ${formatRelativeTime(usage.five_hour.resets_at)}${COLORS.RESET}`);

  // Bloco 2: O Balde de Hoje (Médio Prazo) - A NOVIDADE
  console.log(`\n [ COMBUSTÍVEL DE HOJE ]`);
  console.log(` ${buildBar(todayUsagePercent, getStatusColor(todayUsagePercent))}`);
  const remainingToday = Math.max(0, 100 - todayUsagePercent);
  console.log(` ${COLORS.GRAY}Você ainda tem ${remainingToday.toFixed(1)}% do orçamento de hoje${COLORS.RESET}`);

  // Bloco 3: Semanal (Longo Prazo)
  console.log(`\n [ SEMANAL ]`);
  console.log(` ${buildBar(wP, getStatusColor(wP))}`);
  
  // Bloco 4: Daily Pace (Estratégico)
  console.log(`\n [ DAILY PACE (Burn Rate) ]`);
  console.log(` ${buildBar(pacePercent, getStatusColor(pacePercent))}`);

  const slackStr = slack >= 0
      ? `${COLORS.GREEN}+${slack.toFixed(1)}% de folga${COLORS.RESET}`
      : `${COLORS.RED}${slack.toFixed(1)}% de overburn${COLORS.RESET}`;

  console.log(` ${COLORS.GRAY}Alvo Ideal: ${targetAllocation.toFixed(1)}% | Usado: ${wP.toFixed(1)}% | ${slackStr}`);
  console.log(`\n${COLORS.GRAY} --------------------------${COLORS.RESET}\n`);
}
