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
  if (!isoString) return "N/A";

  const targetTime = new Date(isoString).getTime();
  const now = Date.now();
  const diffMs = targetTime - now;

  if (diffMs <= 0) return "Agora";

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
  const now = Date.now();

  let remainingMs = Math.max(0, resetTime - now);
  if (remainingMs > totalCycleMs) remainingMs = totalCycleMs;

  // 1. Tempo Decorrido em Milissegundos
  const elapsedMs = totalCycleMs - remainingMs;

  // 2. Converte para Dias Decimais (ex: 34h = 1.41 dias)
  const elapsedDaysExact = elapsedMs / (24 * 60 * 60 * 1000);

  // 3. Arredonda para cima para destravar o "Chunk" do dia atual (1.41 vira Dia 2)
  // Math.max e min garantem que o dia nunca seja menor que 1 ou maior que 7
  const currentDay = Math.max(1, Math.min(7, Math.ceil(elapsedDaysExact)));

  // 4. O Alvo Ideal (14.28% por dia)
  const dailyAllowance = 100 / 7;
  const targetAllocation = dailyAllowance * currentDay;

  // Ritmo de Queima (Burn Rate)
  const pacePercent = targetAllocation > 0 ? (wP / targetAllocation) * 100 : 0;

  // Folga vs Overburn
  const slack = targetAllocation - wP;

  return { targetAllocation, pacePercent, slack };
}
