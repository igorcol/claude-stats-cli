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
  if (!resetAt) return { targetAllocation: 0, pacePercent: 0, slack: 0, todayUsagePercent: 0 };
  
  const totalCycleMs = 7 * 24 * 60 * 60 * 1000;
  const resetTime = new Date(resetAt).getTime();
  const startTime = resetTime - totalCycleMs; 
  const now = Date.now();
  
  const RESET_HOUR = 4; // Horario de reset

  const anchorDate = new Date(startTime);
  anchorDate.setHours(RESET_HOUR, 0, 0, 0);
  const anchorTime = anchorDate.getTime();

  const diffMs = now - anchorTime;
  const elapsedDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const currentDay = Math.max(1, Math.min(7, elapsedDays + 1));

  const dailyAllowance = 100 / 7; // ~14.28%
  const targetAllocation = dailyAllowance * currentDay;
  const yesterdayTarget = dailyAllowance * (currentDay - 1);
  
  // --- LÓGICA DO BALDE DE HOJE ---
  // Quanto você usou além do que era permitido até ontem?
  const usedTodayRaw = Math.max(0, wP - yesterdayTarget);
  // Qual a porcentagem disso em relação ao balde de hoje (14.28%)?
  const todayUsagePercent = (usedTodayRaw / dailyAllowance) * 100;

  const pacePercent = targetAllocation > 0 ? (wP / targetAllocation) * 100 : 0;
  const slack = targetAllocation - wP;
  
  return { 
    targetAllocation, 
    pacePercent, 
    slack, 
    todayUsagePercent 
  };
}
