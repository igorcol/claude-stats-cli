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
