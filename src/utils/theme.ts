// src/utils/theme.ts

export const COLORS = {
  CYAN: "\x1b[36m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  ORANGE: "\x1b[38;5;208m", // ANSI 256 para Laranja
  RED: "\x1b[31m",
  GRAY: "\x1b[90m",
  BOLD: "\x1b[1m",
  RESET: "\x1b[0m",
};

export function getStatusColor(percent: number): string {
  if (percent >= 94) return COLORS.RED;
  if (percent >= 91) return COLORS.ORANGE;
  if (percent >= 80) return COLORS.YELLOW; 
  return COLORS.GREEN;
}