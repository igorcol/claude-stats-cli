// src/cli/commands.ts
import { CliCommand } from "./types";
import { APP_VERSION, COLORS } from "../utils/theme";
import { forceSetup } from "../core/config";

export const COMMANDS: CliCommand[] = [
  // * --VERSION
  {
    flags: ["-v", "--version"],
    description: "Exibe a versão atual",
    exitAfterExecution: true,
    action: () =>
      console.log(`${COLORS.CYAN}Claude Telemetry v${APP_VERSION}${COLORS.RESET}`),
  },

  // * --RESET
  {
    flags: ["-r", "--reset"],
    description: "Remove o arquivo de configuração atual",
    exitAfterExecution: true,
    action: () => resetConfig(),
  },

  //* --HELP
  {
    flags: ["-h", "--help"],
    description: "Exibe esta tela de ajuda",
    exitAfterExecution: true,
    action: () => {
      // O help é gerado automaticamente lendo este mesmo array
      console.log(
        `${COLORS.BOLD}${COLORS.CYAN} CLAUDE STATS - HELP ${COLORS.RESET}\n`,
      );
      COMMANDS.forEach((cmd) => {
        console.log(
          ` ${COLORS.YELLOW}${cmd.flags.join(", ")}${COLORS.RESET}\t${cmd.description}`,
        );
      });
      console.log("\n");
    },
  },

  // * -- SETUP
  {
    flags: ["-s", "--setup"], // ? SE TODAS TEM - ou --, não posso só deixar aqui com ["s", "setup"] ??
    description: "Força a reconfiguração da sessionKey",
    exitAfterExecution: false,
    action: async () => {
      await forceSetup();
    },
  },
];
