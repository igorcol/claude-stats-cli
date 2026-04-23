// src/cli/commands.ts
import fs from "fs";
import { CONFIG_PATH } from "../core/config";
import { COLORS } from "../utils/theme";
import { UI_COMPONENTS } from "../ui/components";

export const CLI_COMMANDS = {
  showVersion: () => {
    console.log(`${COLORS.CYAN}Claude Telemetry v1.4.0${COLORS.RESET}`);
  },

  showHelp: () => {
    console.log(UI_COMPONENTS.header("CLAUDE TELEMETRY - HELP", false));
    console.log(`\n ${COLORS.WHITE_BOLD}Uso:${COLORS.RESET} stats [flags]\n`);
    console.log(` ${COLORS.CYAN}-s, --setup${COLORS.RESET}    Força a reconfiguração da sessionKey`);
    console.log(` ${COLORS.CYAN}-o, --once${COLORS.RESET}     Executa um scan único e encerra`);
    console.log(` ${COLORS.CYAN}-r, --reset${COLORS.RESET}    Remove o arquivo de configuração atual`);
    console.log(` ${COLORS.CYAN}-v, --version${COLORS.RESET}  Exibe a versão atual`);
    console.log(` ${COLORS.CYAN}-h, --help${COLORS.RESET}     Exibe esta tela de ajuda`);
    console.log(UI_COMPONENTS.divider());
  },

  resetConfig: () => {
    if (fs.existsSync(CONFIG_PATH)) {
      fs.unlinkSync(CONFIG_PATH);
      console.log(`${COLORS.GREEN}✔ Configuração removida com sucesso.${COLORS.RESET}`);
    } else {
      console.log(`${COLORS.GRAY}[i] Nenhuma configuração encontrada para remover.${COLORS.RESET}`);
    }
  }
};