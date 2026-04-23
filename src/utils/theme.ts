// src/utils/theme.ts

export const COLORS = {
  CYAN: "\x1b[36m",
  CYAN_BOLD: "\x1b[1;36m",
  GREEN: "\x1b[32m",
  GREEN_BOLD: "\x1b[1;32m",
  YELLOW: "\x1b[33m",
  ORANGE: "\x1b[38;5;208m",
  RED: "\x1b[31m",
  RED_BOLD: "\x1b[1;31m",
  GRAY: "\x1b[37m",      
  WHITE: "\x1b[37m",
  WHITE_BOLD: "\x1b[1;37m",
  BLACK: "\x1b[30m",
  
  BG_CYAN: "\x1b[46m",
  BG_RED: "\x1b[41m",
  BG_GREEN: "\x1b[42m",
  BG_YELLOW: "\x1b[43m",
  
  BOLD: "\x1b[1m",
  RESET: "\x1b[0m",
};

export function getStatusColor(percent: number): string {
  if (percent >= 94) return COLORS.RED;
  if (percent >= 91) return COLORS.ORANGE;
  if (percent >= 80) return COLORS.YELLOW; 
  return COLORS.GREEN;
}