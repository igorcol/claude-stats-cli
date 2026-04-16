// src/ui.ts
import { ClaudeUsage } from "./api";
import { COLORS, getStatusColor } from "./utils/theme";
import { buildBar, formatRelativeTime, computePace } from "./utils/formatters";

export function renderHUD(usage: ClaudeUsage): void {
  const sP = usage.five_hour.utilization;
  const wP = usage.seven_day.utilization;

  // Motor Temporal de Daily Pace
  const { targetAllocation, pacePercent, slack } = computePace(
    wP,
    usage.seven_day.resets_at,
  );

  console.clear();
  console.log(
    `\n${COLORS.BOLD}${COLORS.CYAN} CLAUDE OPERATIONAL STATUS${COLORS.RESET}`,
  );
  console.log(`${COLORS.GRAY} --------------------------${COLORS.RESET}`);

  // Bloco 5 Horas
  console.log(`\n [ SESSÃO ATIVA ]`);
  console.log(` ${buildBar(sP, getStatusColor(sP))}`);
  console.log(
    ` ${COLORS.GRAY}Resets in: ${formatRelativeTime(usage.five_hour.resets_at)}${COLORS.RESET}`,
  );
  

  // Bloco 7 Dias
  console.log(`\n [ SEMANAL ]`);
  console.log(` ${buildBar(wP, getStatusColor(wP))}`);
  console.log(
    ` ${COLORS.GRAY}Resets in: ${formatRelativeTime(usage.seven_day.resets_at)}${COLORS.RESET}`,
  );
  

  // Novo Bloco: Ritmo Diário Projetado
  console.log(`\n [ DAILY PACE (Burn Rate) ]`);
  // Removemos a trava falsa. A função buildBar já protege o layout nativamente.
  console.log(` ${buildBar(pacePercent, getStatusColor(pacePercent))}`);

  // String condicional para a Folga
  const slackStr =
    slack >= 0
      ? `${COLORS.GREEN}+${slack.toFixed(1)}% de folga${COLORS.RESET}`
      : `${COLORS.RED}${slack.toFixed(1)}% de overburn${COLORS.RESET}`;

  console.log(
    ` ${COLORS.GRAY}Alvo Ideal: ${targetAllocation.toFixed(1)}% | Usado: ${wP.toFixed(1)}% | ${slackStr}`,
  );

  console.log(`\n${COLORS.GRAY} --------------------------${COLORS.RESET}\n`);
}
