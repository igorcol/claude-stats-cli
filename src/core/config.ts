// src/core/config.ts
import path from "path";
import os from "os";
import fs from "fs";
import { runWizard, Config } from "../ui/wizard";
import { COLORS } from "../utils/theme";

export const CONFIG_PATH = path.join(os.homedir(), ".claude_stats_config.json");

export async function forceSetup(): Promise<Config> {
  return await runWizard(CONFIG_PATH);
}

export async function loadConfig(): Promise<Config> {
  if (!fs.existsSync(CONFIG_PATH)) {
    return await forceSetup();
  }
  const fileContent = fs.readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(fileContent);
}

export function resetConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      fs.unlinkSync(CONFIG_PATH);
      
      console.log(
        `\n${COLORS.GREEN_BOLD}✅ Sucesso:${COLORS.RESET} ${COLORS.GREEN}O arquivo de configuração foi removido.${COLORS.RESET}`
      );
      console.log(
        `${COLORS.CYAN}👉 Dica:${COLORS.RESET} Rode ${COLORS.WHITE_BOLD}stats --setup${COLORS.RESET} para configurar uma nova chave.\n`
      );
    } else {
      console.log(
        `\n${COLORS.YELLOW}⚠️  Aviso:${COLORS.RESET} Nenhum arquivo de configuração encontrado em: ${COLORS.GRAY}${CONFIG_PATH}${COLORS.RESET}\n`
      );
    }
  } catch (error) {
    console.error(
      `\n${COLORS.RED_BOLD}❌ Erro crítico ao resetar:${COLORS.RESET}`, 
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}