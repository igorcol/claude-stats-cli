// src/core/metrics.ts
import { ClaudeUsage } from "./api";
import { computePace, formatRelativeTime } from "../utils/formatters";

// O Objeto que será consumido tanto pela UI quanto pela flag --json
export interface EnrichedUsage {
  account_alias: string;
  plan_tier: "PRO" | "FREE";
  
  session: {
    utilization: number;
    reset_formatted: string;
  };
  
  weekly: {
    utilization: number;
    reset_formatted: string;
  };

  analysis: {
    is_overburn: boolean;
    daily_debt: number;
    daily_free: number;
  };

  pace: {
    target_allocation: number;
    pace_percent: number;
    slack: number;
    today_usage_percent: number;
  };
}

export function enrichUsageData(usage: ClaudeUsage): EnrichedUsage {
  const sP = usage.five_hour.utilization;
  const wP = usage.seven_day.utilization;
  
  // Executa os cálculos pesados
  const paceData = computePace(wP, usage.seven_day.resets_at);
  
  // Formata os tempos
  const sReset = formatRelativeTime(usage.five_hour.resets_at);
  const wReset = formatRelativeTime(usage.seven_day.resets_at);
  
  // Define os booleanos e limites
  const isOverburn = paceData.pacePercent > 100 || sP > 90;
  const dailyDebt = Math.max(0, paceData.todayUsagePercent - 100);
  const dailyFree = Math.max(0, 100 - paceData.todayUsagePercent);

  // Retorna o Payload Enriquecido
  return {
    account_alias: usage.account_alias,
    plan_tier: usage.plan_tier,
    session: {
      utilization: sP,
      reset_formatted: sReset,
    },
    weekly: {
      utilization: wP,
      reset_formatted: wReset,
    },
    analysis: {
      is_overburn: isOverburn,
      daily_debt: dailyDebt,
      daily_free: dailyFree,
    },
    pace: {
      target_allocation: paceData.targetAllocation,
      pace_percent: paceData.pacePercent,
      slack: paceData.slack,
      today_usage_percent: paceData.todayUsagePercent,
    }
  };
}