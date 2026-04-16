// src/utils/theme.ts

export const COLORS = {
  // Foreground
  CYAN: "\x1b[36m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  RED: "\x1b[31m",
  GRAY: "\x1b[90m",
  WHITE: "\x1b[37m",
  BLACK: "\x1b[30m",
  
  // Background (A mágica da UI disruptiva)
  BG_CYAN: "\x1b[46m",
  BG_RED: "\x1b[41m",
  BG_GREEN: "\x1b[42m",
  BG_YELLOW: "\x1b[43m",
  
  BOLD: "\x1b[1m",
  RESET: "\x1b[0m",
};

export function getStatusColor(percent: number): string {
  if (percent >= 94) return COLORS.RED;
  if (percent >= 85) return COLORS.YELLOW; 
  return COLORS.GREEN;
}