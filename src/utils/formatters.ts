
import { COLORS } from "./theme";

export function buildBar(percent: number, color: string): string {
  const width = 20;
  const filled = Math.min(width, Math.max(0, Math.floor(percent / (100 / width))));
  const empty = width - filled;

  const bar = "█".repeat(filled) + "░".repeat(empty);
  return `${color}[${bar}] ${percent.toFixed(1)}%${COLORS.RESET}`;
}

export function formatLocalTime(isoString: string | null): string {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR'); 
}