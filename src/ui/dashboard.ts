// src/ui/dashboard.ts
import { EnrichedUsage } from "../core/metrics";
import { APP_VERSION, COLORS, getStatusColor } from "../utils/theme";
import { buildBar } from "../utils/formatters";
import { UI_COMPONENTS } from "./components";

// Interface local para manter o desacoplamento do telemetry.ts
interface HUDOptions {
  isCompact?: boolean;
  isAnonymous?: boolean;
}

/**
 * PONTO DE ENTRADA ÚNICO: Orquestra qual versão do HUD será exibida.
 */
export function renderHUD(
  usage: EnrichedUsage,
  newVersion: string | null = null,
  options: HUDOptions = {}
): void {
  // Limpamos o console em ambos os modos para manter o HUD fixo no topo
  console.clear();

  if (options.isCompact) {
    renderCompactView(usage, options.isAnonymous);
  } else {
    renderFullView(usage, newVersion, options.isAnonymous);
  }
}

/**
 * COMPONENTE: HUD COMPLETO (A versão agressiva/industrial padrão)
 */
function renderFullView(usage: EnrichedUsage, newVersion: string | null, isAnonymous?: boolean): void {
  const { session, weekly, pace, analysis, account_alias, plan_tier } = usage;
  const isOverburn = analysis.is_overburn;

  // --- MÁSCARA ANÔNIMA ---
  const displayAlias = isAnonymous ? "OPERATOR" : account_alias;
  const displayTier = isAnonymous ? "SECURE" : plan_tier;

  // Banner de Update
  if (newVersion) {
    console.log(` ${COLORS.BG_MAGENTA}${COLORS.BLACK}${COLORS.BOLD} ✨ UPDATE DISPONÍVEL: v${newVersion} ${COLORS.RESET}`);
    console.log(` ${COLORS.MAGENTA}└─> Rode: npm i -g @igorcol/claude-stats@latest${COLORS.RESET}\n`);
  }

  // Header UI (Agora usando os dados mascarados se aplicável)
  console.log(UI_COMPONENTS.header("CLAUDE OPERATIONAL HUD", APP_VERSION, displayAlias, displayTier, isOverburn));
  console.log(` ${UI_COMPONENTS.subLabel(`Modo: ${isOverburn ? "HIGH RISK / OVERBURN" : "OPTIMAL / STABLE"}`)}\n`);

  // --- SEÇÃO: CARGA ATUAL ---
  console.log(` ${UI_COMPONENTS.label("⚡ CARGA ATUAL")}`);
  console.log(`  SESSÃO (5H) ${buildBar(session.utilization, getStatusColor(session.utilization))} ${session.utilization.toFixed(1)}% ${COLORS.GRAY}│ Reset: ${COLORS.CYAN}${session.reset_formatted}${COLORS.RESET}`);

  const dailyLabel = analysis.daily_debt > 0
      ? `${COLORS.RED}DÍVIDA: -${analysis.daily_debt.toFixed(1)}%${COLORS.RESET}`
      : `${COLORS.GREEN}LIVRE: ${analysis.daily_free.toFixed(1)}%${COLORS.RESET}`;

  console.log(`  DIÁRIO (COT) ${buildBar(pace.today_usage_percent, getStatusColor(pace.today_usage_percent))} ${COLORS.GRAY}│ ${dailyLabel}`);

  console.log(UI_COMPONENTS.divider());

  // --- SEÇÃO: SAÚDE DO CICLO ---
  console.log(` ${UI_COMPONENTS.label("📅 SAÚDE DO CICLO")}`);
  console.log(`  TOTAL (W)   ${buildBar(weekly.utilization, getStatusColor(weekly.utilization))}`);
  
  const paceStatus = isOverburn
    ? `${COLORS.BG_RED}${COLORS.BLACK} OVERBURN ${COLORS.RESET}`
    : `${COLORS.BG_GREEN}${COLORS.BLACK} STABLE ${COLORS.RESET}`;

  console.log(`  RITMO (P)   ${buildBar(pace.pace_percent, getStatusColor(pace.pace_percent))} ${paceStatus}`);

  // Rodapé: Reset e Folga
  console.log(`\n ${COLORS.BG_YELLOW}${COLORS.BLACK}${COLORS.BOLD} NEXT GLOBAL RESET ${COLORS.RESET} ${COLORS.BOLD}${COLORS.YELLOW} ${weekly.reset_formatted}${COLORS.RESET}`);
  
  const slackColor = pace.slack >= 0 ? COLORS.GREEN : COLORS.RED;
  console.log(` ${COLORS.GRAY}Ideal: ${pace.target_allocation.toFixed(1)}% │ Real: ${weekly.utilization.toFixed(1)}% │ ${COLORS.RESET}${slackColor}${COLORS.BOLD}Folga: ${pace.slack.toFixed(1)}%${COLORS.RESET}`);
}

/**
 * COMPONENTE: HUD COMPACTO (A versão minimalista para monitoramento discreto)
 */
function renderCompactView(usage: EnrichedUsage, isAnonymous?: boolean): void {
  const { session, weekly, pace, analysis, account_alias, plan_tier } = usage;
  
  // --- MÁSCARA ANÔNIMA ---
  const displayAlias = isAnonymous ? "OPERATOR" : account_alias;
  const displayTier = isAnonymous ? "SECURE" : plan_tier;
  // Se for anônimo, forçamos a cor cinza para a tag SECURE, senão mantém a lógica normal
  const tierColor = isAnonymous ? COLORS.GRAY : (plan_tier === "PRO" ? COLORS.MAGENTA : COLORS.CYAN);
  
  const statusIcon = analysis.is_overburn ? "🚨" : "💎";
  const paceStatus = analysis.is_overburn ? `${COLORS.RED}OVR${COLORS.RESET}` : `${COLORS.GREEN}STB${COLORS.RESET}`;

  // Linha 1: Status Crítico em uma linha (Agora usando os dados mascarados)
  console.log(`\n ${statusIcon} ${COLORS.CYAN}${COLORS.BOLD}CLAUDE HUD${COLORS.RESET} │ 👤 ${COLORS.WHITE_BOLD}${displayAlias}${COLORS.RESET} (${tierColor}${displayTier}${COLORS.RESET}) │ ${COLORS.GREEN}ONLINE${COLORS.RESET}`);
  
  // Linha 2: Métricas Compactas (Barras reduzidas para 12 caracteres)
  const sBar = buildBar(session.utilization, getStatusColor(session.utilization), 12);
  const wBar = buildBar(weekly.utilization, getStatusColor(weekly.utilization), 12);

  console.log(` ${COLORS.GRAY}5H:${COLORS.RESET} ${sBar} ${session.utilization.toFixed(0)}% │ ${COLORS.GRAY}7D:${COLORS.RESET} ${wBar} ${weekly.utilization.toFixed(0)}% │ ${COLORS.GRAY}P:${COLORS.RESET} ${paceStatus} (${pace.pace_percent.toFixed(0)}%)`);
}