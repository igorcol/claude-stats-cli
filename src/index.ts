#!/usr/bin/env node
import { handleCliCommands } from "./cli/router";
import { getLatestChangelog } from "./core/changelog";
import { loadConfig, saveConfig } from "./core/config";
import { startTelemetry, runSingleScan } from "./core/telemetry";
import { APP_VERSION, COLORS } from "./utils/theme";

async function bootstrap() {
  // --- GRACEFUL SHUTDOWN HANDLER ---
  // Captura o Ctrl+C (SIGINT)
  process.on("SIGINT", () => {
    console.log(
      `\n\n ${COLORS.BG_YELLOW}${COLORS.BLACK} SHUTDOWN ${COLORS.RESET} ${COLORS.GRAY}Encerrando processos de forma segura...${COLORS.RESET}`,
    );

    // Pequeno delay para garantir que os buffers de log sejam impressos
    setTimeout(() => {
      console.log(` ${COLORS.CYAN}Até logo! 🖖${COLORS.RESET}\n`);
      process.exit(0);
    }, 100);
  });

  // Captura erros não tratados para evitar o crash feio
  process.on("uncaughtException", (err) => {
    console.error(
      `\n ${COLORS.BG_RED}${COLORS.BLACK} FATAL ERROR ${COLORS.RESET} ${COLORS.RED}${err.message}${COLORS.RESET}`,
    );
    process.exit(1);
  });

  // Executa comandos de flag
  await handleCliCommands();

  try {
    const config = await loadConfig();

    // --- LOGICA DE UPDATE LOG ---
    // Se a versão atual for diferente da ultima "vista"
    if (config.last_seen_version !== APP_VERSION) {
      const news = getLatestChangelog();

      if (news) {
        console.clear();
        console.log(`\n ${COLORS.BG_CYAN}${COLORS.BLACK}${COLORS.BOLD} NEW VERSION DETECTED: v${APP_VERSION} ${COLORS.RESET}`);
        console.log(news);
        console.log(`\n${COLORS.CYAN}──────────────────────────────────────────────────────────────────${COLORS.RESET}`);
        console.log(`${COLORS.GRAY}Iniciando telemetria em 3 segundos...${COLORS.RESET}\n`);

        // Atualiza a config para marcar que ele já viu esta versão
        saveConfig({ ...config, last_seen_version: APP_VERSION });

        // Pequena pausa para leitura antes do Dashboard limpar a tela
        await new Promise(resolve => setTimeout(resolve, 3500));
      }
    }

    if (process.argv.includes("--once") || process.argv.includes("-o")) {
      await runSingleScan(config.sessionKey);
    } else {
      await startTelemetry(config.sessionKey);
    }
  } catch (error) {
    process.exit(1);
  }
}

bootstrap();
