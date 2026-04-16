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

  console.clear();
  
  // HEADER MINIMALISTA
  console.log(`\n ${COLORS.BG_CYAN}${COLORS.BLACK}${COLORS.BLACK} CLAUDE TELEMETRY SYSTEM ${COLORS.RESET} ${COLORS.CYAN}v2.0.0${COLORS.RESET}`);
  console.log(` ${COLORS.GRAY}Rooted Session Analysis | Sorocaba, SP${COLORS.RESET}\n`);

  // --- BLOCO 1: O AGORA (Sessão & Hoje) ---
  const todayStatus = todayUsagePercent > 100 ? " OVERBURN " : " STABLE ";
  const todayBG = todayUsagePercent > 100 ? COLORS.BG_RED : COLORS.BG_GREEN;

  console.log(` ${COLORS.BOLD}${COLORS.WHITE}⚡ CARGA ATUAL [ Diário ]${COLORS.RESET}`);
  console.log(` ${COLORS.GRAY}SESSION${RESET_SPACE(2)} ${buildBar(sP, getStatusColor(sP))} ${COLORS.RESET} ${COLORS.GRAY}[Next: ${sReset}]${COLORS.RESET}`);
  console.log(` ${COLORS.GRAY}DAILY  ${RESET_SPACE(2)} ${buildBar(todayUsagePercent, getStatusColor(todayUsagePercent))} ${todayBG}${COLORS.BLACK}${COLORS.BOLD}${todayStatus}${COLORS.RESET}`);

  console.log(`\n ${COLORS.GRAY}──────────────────────────────────────────────────────────────────${COLORS.RESET}\n`);

  // --- BLOCO 2: A SEMANA (Global & Pace) ---
  const paceBG = pacePercent > 100 ? COLORS.BG_RED : COLORS.BG_YELLOW;
  
  console.log(` ${COLORS.BOLD}${COLORS.WHITE}📅 SAÚDE DA SEMANA${COLORS.RESET}`);
  console.log(` ${COLORS.GRAY}WEEKLY ${RESET_SPACE(2)} ${buildBar(wP, getStatusColor(wP))} ${COLORS.RESET}`);
  console.log(` ${COLORS.GRAY}PACE   ${RESET_SPACE(2)} ${buildBar(pacePercent, getStatusColor(pacePercent))} ${paceBG}${COLORS.BLACK}${COLORS.BOLD} RITMO ${COLORS.RESET} `);

  // --- BLOCO 3: DEADLINES & DATA (O que importa de verdade) ---
  console.log(`\n ${COLORS.BG_YELLOW}${COLORS.BLACK}${COLORS.BLACK} WEEKLY DEADLINE ${COLORS.RESET} ${COLORS.BOLD}${COLORS.YELLOW} ${wReset} até o reset semanal. ${COLORS.RESET}`);
  
  const slackColor = slack >= 0 ? COLORS.GREEN : COLORS.RED;
  console.log(` ${COLORS.GRAY}Teto: ${targetAllocation.toFixed(1)}% | Current: ${wP.toFixed(1)}% | ${COLORS.RESET}${slackColor}${COLORS.BOLD}Folga: ${slack.toFixed(1)}%${COLORS.RESET}`);
  console.log("");
}

// Helper simples para alinhar texto
function RESET_SPACE(n: number) { return " ".repeat(n); }