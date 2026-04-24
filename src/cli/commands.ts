// src/cli/commands.ts
import { CliCommand } from "./types";
import { APP_VERSION, COLORS } from "../utils/theme";
import { forceSetup, resetConfig } from "../core/config";
import { getLatestChangelog } from "../core/changelog";
import { checkForUpdates } from "../core/updates";

export const COMMANDS: CliCommand[] = [
  // * --VERSION
  {
    flags: ["-v", "--version"],
    description: "Exibe a versão atual",
    exitAfterExecution: true,
    action: () =>
      console.log(
        `${COLORS.CYAN}Claude Telemetry v${APP_VERSION}${COLORS.RESET}`,
      ),
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
      console.log(
        `\n${COLORS.MAGENTA_BOLD}💎 CLAUDE STATS CLI${COLORS.RESET} ${COLORS.GRAY}v${APP_VERSION}${COLORS.RESET}`,
      );
      console.log(`${COLORS.GRAY}Uso: stats [flags]${COLORS.RESET}\n`);

      console.log(`${COLORS.WHITE_BOLD}COMANDOS DISPONÍVEIS:${COLORS.RESET}`);

      COMMANDS.forEach((cmd) => {
        // Alinhamento manual: garante que as flags ocupem 20 espaços
        const flagsStr = cmd.flags.join(" ou ");
        const padding = " ".repeat(Math.max(0, 20 - flagsStr.length));

        console.log(
          `  ${COLORS.YELLOW}${flagsStr}${COLORS.RESET}${padding}${COLORS.GRAY}${cmd.description}${COLORS.RESET}`,
        );
      });

      console.log(
        `\n${COLORS.CYAN}Dica:${COLORS.RESET} Use ${COLORS.WHITE_BOLD}stats --guide${COLORS.RESET} para entender as métricas.\n`,
      );
    },
  },

  // * --GUIDE
  {
    flags: ["-g", "--guide"],
    description: "Manual de métricas e conceitos do HUD",
    exitAfterExecution: true,
    action: () => {
      console.log(
        `\n${COLORS.BG_CYAN}${COLORS.BLACK}${COLORS.BOLD} CLAUDE STATS ${APP_VERSION}  ${COLORS.RESET}`,
      );
      console.log(
        `\n${COLORS.BG_MAGENTA}${COLORS.WHITE_BOLD} OPERATIONAL GUIDE ${COLORS.RESET}\n`,
      );

      console.log(`${COLORS.CYAN_BOLD}🔄 SESSÃO (5H):${COLORS.RESET}`);
      console.log(
        `${COLORS.GRAY}   Barra de uso da janela móvel (sessão de 5h). (Padrão exibido pelo claude).${COLORS.RESET}\n`,
      );

      console.log(`${COLORS.CYAN_BOLD}📊 COT (Daily Limit):${COLORS.RESET}`);
      console.log(
        `${COLORS.GRAY}   Limite não restrito do dia. (100% da semana distribuido durante os 7 dias da semana = 14.3% ao dia.)${COLORS.RESET}`,
      );
      console.log(
        `${COLORS.GRAY}       - Usado para limitar seu uso diario para que a cota semanal dure os 7 dias.${COLORS.RESET}\n`,
      );

      console.log(
        `${COLORS.CYAN_BOLD}📅  TOTAL W (Weekly Limit):${COLORS.RESET}`,
      );
      console.log(
        `${COLORS.GRAY}   Barra de uso semanal. (Padrão exibido pelo claude).${COLORS.RESET}\n`,
      );

      console.log(`${COLORS.CYAN_BOLD}📈 RITMO (P ou Pace):${COLORS.RESET}`);
      console.log(
        `${COLORS.GRAY}   Soma da cota diaria do dia do reset semanal até o dia atual (14.3% ao dia),${COLORS.RESET}\n`,
      );

      console.log(`${COLORS.CYAN_BOLD}🧪 OUTROS:${COLORS.RESET}`);
      console.log(
        `${COLORS.GRAY}   IDEAL: Teto diario (14.3% ao dia) ${COLORS.RESET}`,
      );
      console.log(
        `${COLORS.GRAY}   REAL: Seu limite semanal padrão. ${COLORS.RESET}`,
      );
      console.log(
        `${COLORS.GRAY}   FOLGA: Diferença entre seu limite semanal atual X o teto ideal para hoje. ${COLORS.RESET}\n`,
      );

      console.log(
        `${COLORS.MAGENTA}──────────────────────────────────────────────────────────────────${COLORS.RESET}\n`,
      );
    },
  },

  // * --SETUP
  {
    flags: ["-s", "--setup"], // ? SE TODAS TEM - ou --, não posso só deixar aqui com ["s", "setup"] ??
    description: "Força a reconfiguração da sessionKey",
    exitAfterExecution: false,
    action: async () => {
      await forceSetup();
    },
  },

  // * --CHANGELOG
  {
    flags: ["-c", "--changelog"],
    description: "Exibe as novidades da versão instalada",
    exitAfterExecution: true,
    action: () => {
      const news = getLatestChangelog();

      console.log(
        `\n ${COLORS.BG_CYAN}${COLORS.BLACK}${COLORS.BOLD} WHAT'S NEW IN v${APP_VERSION} ${COLORS.RESET}`,
      );
      console.log(
        ` ${COLORS.GRAY}Ver histórico completo em: github.com/igorcol/claude-stats-cli${COLORS.RESET}\n`,
      );

      console.log(
        news || `${COLORS.GRAY}Nenhuma informação disponível.${COLORS.RESET}`,
      );
      console.log(
        `\n${COLORS.CYAN}──────────────────────────────────────────────────────────────────${COLORS.RESET}\n`,
      );
    },
  },

  // * --UPDATE
  {
    flags: ["-u", "--update"],
    description: "Verifica manualmente se há uma nova versão disponível",
    exitAfterExecution: true,
    action: async () => {
      console.log(
        `\n ${COLORS.CYAN}⏳ Verificando servidores da Anthropic/GitHub...${COLORS.RESET}`,
      );

      const latestVersion = await checkForUpdates();

      if (latestVersion) {
        console.log(
          `\n ${COLORS.BG_MAGENTA}${COLORS.WHITE_BOLD} UPDATE FOUND ${COLORS.RESET}`,
        );
        console.log(
          ` Nova versão disponível: ${COLORS.CYAN_BOLD}v${latestVersion}${COLORS.RESET}`,
        );
        console.log(
          ` Versão instalada: ${COLORS.GRAY}v${APP_VERSION}${COLORS.RESET}\n`,
        );

        console.log(` ${COLORS.YELLOW}Como atualizar:${COLORS.RESET}`);
        console.log(
          ` ${COLORS.WHITE_BOLD}npm install -g @igorcol/claude-stats@latest${COLORS.RESET}\n`,
        );
      } else {
        console.log(
          `\n ${COLORS.BG_GREEN}${COLORS.BLACK}${COLORS.BOLD} UP TO DATE ${COLORS.RESET}`,
        );
        console.log(
          ` Você já está utilizando a versão mais recente (${COLORS.GREEN}v${APP_VERSION}${COLORS.RESET}).\n`,
        );
      }
    },
  },
];
