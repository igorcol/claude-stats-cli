#!/usr/bin/env node
import { handleCliCommands } from "./cli/router";
import { loadConfig } from "./core/config";
import { startTelemetry, runSingleScan } from "./core/telemetry";
import { COLORS } from "./utils/theme";

async function bootstrap() {
  // --- GRACEFUL SHUTDOWN HANDLER ---
  // Captura o Ctrl+C (SIGINT)
  process.on("SIGINT", () => {
    console.log(
      `\n\n ${COLORS.BG_YELLOW}${COLORS.BLACK} SHUTDOWN ${COLORS.RESET} ${COLORS.GRAY}Encerrando processos de forma segura...${COLORS.RESET}`,
    );

    // Pequeno delay para garantir que os buffers de log sejam impressos
    setTimeout(() => {
      console.log(` ${COLORS.CYAN}Até logo, Igor! 🖖${COLORS.RESET}\n`);
      process.exit(0); // Sai com status 0 (sucesso)
    }, 100);
  });

  // Captura erros não tratados para evitar o crash feio
  process.on("uncaughtException", (err) => {
    console.error(
      `\n ${COLORS.BG_RED}${COLORS.BLACK} FATAL ERROR ${COLORS.RESET} ${COLORS.RED}${err.message}${COLORS.RESET}`,
    );
    process.exit(1);
  });

  await handleCliCommands();

  try {
    const config = await loadConfig();

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
