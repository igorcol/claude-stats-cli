// src/cli/commands.ts
import { CLI_COMPONENTS } from "../ui/components";
import { CliCommand } from "./types";
import { COLORS } from "../utils/theme";

export const COMMANDS: CliCommand[] = [
  {
    flags: ["-v", "--version"],
    description: "Exibe a versão atual",
    exitAfterExecution: true,
    action: () => console.log(`${COLORS.CYAN}Claude Telemetry v1.4.1${COLORS.RESET}`)
  },
  {
    flags: ["-r", "--reset"],
    description: "Remove o arquivo de configuração atual",
    exitAfterExecution: true,
    action: () => resetConfig()
  },
  {
    flags: ["-h", "--help"],
    description: "Exibe esta tela de ajuda",
    exitAfterExecution: true,
    action: () => {
       // O help agora pode ser gerado automaticamente lendo este mesmo array!
       console.log(`${COLORS.BOLD}${COLORS.CYAN} CLAUDE STATS - HELP ${COLORS.RESET}\n`);
       COMMANDS.forEach(cmd => {
         console.log(` ${COLORS.YELLOW}${cmd.flags.join(", ")}${COLORS.RESET}\t${cmd.description}`);
       });
       console.log("\n");
    }
  }
  // Se quiser a flag --setup, basta adicionar o objeto aqui!
];