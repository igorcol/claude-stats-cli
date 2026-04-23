// src/core/telemetry.ts
import { getClaudeUsage } from "./api";
import { renderHUD } from "../ui/dashboard";
import { COLORS } from "../utils/theme";

const REFRESH_INTERVAL = 60 * 1000;

export async function startTelemetry(sessionKey: string) {
  console.log(`${COLORS.CYAN}[i] Iniciando Telemetria...${COLORS.RESET}`);

  while (true) {
    try {
      const usage = await getClaudeUsage(sessionKey);
      renderHUD(usage);

      const now = new Date().toLocaleTimeString("pt-BR");
      console.log(`\n ${COLORS.GRAY}Ultima atualização: ${now} (Próxima em ${REFRESH_INTERVAL / 1000}s)${COLORS.RESET}`);
      console.log(` ${COLORS.GRAY}Pressione Ctrl+C para encerrar.${COLORS.RESET}`);

    } catch (error) {
      console.log(`\n ${COLORS.RED}[!] Erro na atualização: ${error instanceof Error ? error.message : "Erro Desconhecido"}${COLORS.RESET}`);
      console.log(` ${COLORS.GRAY}Tentando novamente em 15s...${COLORS.RESET}`);
      await new Promise((resolve) => setTimeout(resolve, 15000));
      continue;
    }

    await new Promise((resolve) => setTimeout(resolve, REFRESH_INTERVAL));
  }
}

export async function runSingleScan(sessionKey: string) {
  try {
    const usage = await getClaudeUsage(sessionKey);
    renderHUD(usage);
    console.log(`\n ${COLORS.GRAY}Scan único finalizado.${COLORS.RESET}\n`);
  } catch (error) {
    console.error(`\n ${COLORS.RED}[!] Erro no scan único: ${error instanceof Error ? error.message : error}${COLORS.RESET}`);
    process.exit(1);
  }
}