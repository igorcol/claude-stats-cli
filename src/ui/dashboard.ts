// src/ui/dashboard.ts
import { EnrichedUsage } from "../core/metrics";
import { APP_VERSION, COLORS, getStatusColor } from "../utils/theme";
import { buildBar } from "../utils/formatters";
import { UI_COMPONENTS } from "./components";

/**
 * Renderiza o HUD Operacional utilizando o payload enriquecido.
 * Toda a lógica matemática foi movida para o core/metrics.ts.
 */
export function renderHUD(usage: EnrichedUsage, newVersion: string | null = null): void {
  // Destructuring das métricas já processadas
  const { 
    session, 
    weekly, 
    pace, 
    analysis, 
    account_alias, 
    plan_tier 
  } = usage;

  const isOverburn = analysis.is_overburn;
  
  console.clear();

  // Banner de Update (se houver nova versão)
  if (newVersion) {
    console.log(` ${COLORS.BG_MAGENTA}${COLORS.BLACK}${COLORS.BOLD} ✨ UPDATE DISPONÍVEL: v${newVersion} ${COLORS.RESET}`);
    console.log(` ${COLORS.MAGENTA}└─> Rode: npm i -g @igorcol/claude-stats@latest${COLORS.RESET}\n`);
  }

  // Header com Identidade do Operador e Licença
  console.log(
    UI_COMPONENTS.header(
      "CLAUDE OPERATIONAL HUD", 
      APP_VERSION, 
      account_alias, 
      plan_tier, 
      isOverburn
    )
  );
  
  console.log(` ${UI_COMPONENTS.subLabel(`Modo: ${isOverburn ? "HIGH RISK / OVERBURN" : "OPTIMAL / STABLE"}`)}\n`);

  // --- SEÇÃO: CARGA ATUAL ---
  console.log(` ${UI_COMPONENTS.label("⚡ CARGA ATUAL")}`);
  
  // Utilização da Sessão (5H)
  console.log(`  SESSÃO (5H) ${buildBar(session.utilization, getStatusColor(session.utilization))} ${COLORS.GRAY}│ Reset: ${COLORS.CYAN}${session.reset_formatted}${COLORS.RESET}`);

  // Utilização Diária (COT)
  const dailyLabel = analysis.daily_debt > 0 
    ? `${COLORS.RED}DÍVIDA: -${analysis.daily_debt.toFixed(1)}%${COLORS.RESET}` 
    : `${COLORS.GREEN}LIVRE: ${analysis.daily_free.toFixed(1)}%${COLORS.RESET}`;

  console.log(`  DIÁRIO (COT) ${buildBar(pace.today_usage_percent, getStatusColor(pace.today_usage_percent))} ${COLORS.GRAY}│ ${dailyLabel}`);

  console.log(UI_COMPONENTS.divider());

  // --- SEÇÃO: SAÚDE DO CICLO ---
  console.log(` ${UI_COMPONENTS.label("📅 SAÚDE DO CICLO")}`);
  
  // Total Semanal acumulado
  console.log(`  TOTAL (W)   ${buildBar(weekly.utilization, getStatusColor(weekly.utilization))}`);
  
  // Ritmo de Consumo (Pace)
  const paceStatus = isOverburn 
    ? `${COLORS.BG_RED}${COLORS.BLACK} OVERBURN ${COLORS.RESET}` 
    : `${COLORS.BG_GREEN}${COLORS.BLACK} STABLE ${COLORS.RESET}`;

  console.log(`  RITMO (P)   ${buildBar(pace.pace_percent, getStatusColor(pace.pace_percent))} ${paceStatus}`);

  // Rodapé: Próximo Reset Global e Análise de Folga
  console.log(`\n ${COLORS.BG_YELLOW}${COLORS.BLACK}${COLORS.BOLD} NEXT GLOBAL RESET ${COLORS.RESET} ${COLORS.BOLD}${COLORS.YELLOW} ${weekly.reset_formatted}${COLORS.RESET}`);
  
  const slackColor = pace.slack >= 0 ? COLORS.GREEN : COLORS.RED;
  console.log(` ${COLORS.GRAY}Ideal: ${pace.target_allocation.toFixed(1)}% │ Real: ${weekly.utilization.toFixed(1)}% │ ${COLORS.RESET}${slackColor}${COLORS.BOLD}Folga: ${pace.slack.toFixed(1)}%${COLORS.RESET}`);
}