import { ClaudeUsage } from "./api";

// Cores ANSI para o Terminal
const COLORS = {
  CYAN: "\x1b[36m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  RED: "\x1b[31m",
  GRAY: "\x1b[90m",
  BOLD: "\x1b[1m",
  RESET: "\x1b[0m",
};

// Retorna a cor conforme porcentagem
function getColorForUtilization(percent: number): string {
  if (percent >= 94) return COLORS.RED;
  if (percent >= 91) return COLORS.YELLOW;
  return COLORS.GREEN;
}

// Constroi barra de progresso
function buildBar(percent: number, color: string): string {
  const width = 20;
  // Garante q preenchimento não quebre se tiver over ou underflow
  const filled = Math.min(
    width,
    Math.max(0, Math.floor(percent / (100 / width))),
  );
  const empty = width - filled;

  const bar = "█".repeat(filled) + "░".repeat(empty);
  return `${color}[${bar}] ${percent.toFixed(1)}%${COLORS.RESET}`;
}

// Formata para local time
function formatLocalTime(isoString: string | null): string {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR'); 
}


// * ---- RENDERIZA HUD ---- * //
export function renderHUD(usage: ClaudeUsage): void {
    const sP = usage.five_hour.utilization;
    const wP = usage.seven_day.utilization;

    console.clear();
    console.log(`\n${COLORS.BOLD}${COLORS.CYAN} CLAUDE OPERATIONAL STATUS${COLORS.RESET}`);
    console.log(`${COLORS.GRAY} --------------------------${COLORS.RESET}`);

    // Bloco 5 Horas
    console.log(`\n [5H WINDOW (sP)]`);
    console.log(` ${buildBar(sP, getColorForUtilization(sP))}`);
    console.log(` ${COLORS.GRAY}Resets at: ${formatLocalTime(usage.five_hour.resets_at)}${COLORS.RESET}`);

    // Bloco 7 Dias
    console.log(`\n [7D WINDOW (wP)]`);
    console.log(` ${buildBar(wP, getColorForUtilization(wP))}`);
    console.log(` ${COLORS.GRAY}Resets at: ${formatLocalTime(usage.seven_day.resets_at)}${COLORS.RESET}`);
    
    console.log(`\n${COLORS.GRAY} --------------------------${COLORS.RESET}\n`);
}

