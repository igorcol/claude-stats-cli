

export const COLORS = {
  CYAN: "\x1b[36m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  RED: "\x1b[31m",
  GRAY: "\x1b[90m",
  BOLD: "\x1b[1m",
  RESET: "\x1b[0m",
};

const THRESHOLDS = {
  WARNING: 91,
  CRITICAL: 94,
};

export function getStatusColor(percent: number): string {
  if (percent >= THRESHOLDS.CRITICAL) return COLORS.RED;
  if (percent >= THRESHOLDS.WARNING) return COLORS.YELLOW;
  return COLORS.GREEN;
}