import { COLORS } from "./theme";

export function buildBar(percent: number, color: string): string {
  const width = 20;
  const filled = Math.min(
    width,
    Math.max(0, Math.floor(percent / (100 / width))),
  );
  const empty = width - filled;

  const bar = "█".repeat(filled) + "░".repeat(empty);
  return `${color}[${bar}] ${percent.toFixed(1)}%${COLORS.RESET}`;
}

// Converte Data ISO para Delta Time Inteligente (Relativo)
export function formatRelativeTime(isoString: string | null): string {
  // Se não houver data de reset, significa que o uso está zerado/disponível
  if (!isoString) return "[ Aguardando primeira interação ]";

  const targetTime = new Date(isoString).getTime();
  const now = Date.now();
  const diffMs = targetTime - now;

  // Se a data já passou, mas a API ainda não atualizou para null
  if (diffMs <= 0) return "Ready";

  const totalMins = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMins / 1440);
  const hours = Math.floor((totalMins % 1440) / 60);
  const mins = totalMins % 60;

  if (days > 0) return `${days}d ${hours}h ${mins}min`;
  if (hours > 0) return `${hours}h ${mins}min`;
  return `${mins}min`;
}

export function computePace(wP: number, resetAt: string | null) {
  if (!resetAt) return { targetAllocation: 0, pacePercent: 0, slack: 0 };
  
  const totalCycleMs = 7 * 24 * 60 * 60 * 1000;
  const resetTime = new Date(resetAt).getTime();
  const startTime = resetTime - totalCycleMs; 
  const now = Date.now();
  
  // --------- HORA DE RESET  ---------
  const RESET_HOUR = 1;  // 4 DA MANHÃ
  // ----------------------------------

  // Encontra a "Âncora": o horário de reset (ex: 04:00) no dia que a semana começou
  const anchorDate = new Date(startTime);
  anchorDate.setHours(RESET_HOUR, 0, 0, 0);
  const anchorTime = anchorDate.getTime();

  // Quantos períodos de 24h se passaram desde a primeira "âncora" da semana?
  const diffMs = now - anchorTime;
  const elapsedDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  
  // currentDay: se diff < 24h, é o Dia 1. Se diff > 24h, é Dia 2, etc.
  // Soma +1 porque o orçamento do primeiro dia já está disponível no minuto 1.
  const currentDay = Math.max(1, Math.min(7, elapsedDays + 1));

  const dailyAllowance = 100 / 7;
  const targetAllocation = dailyAllowance * currentDay;
  
  const pacePercent = targetAllocation > 0 ? (wP / targetAllocation) * 100 : 0;
  const slack = targetAllocation - wP;
  
  return { targetAllocation, pacePercent, slack };
}
