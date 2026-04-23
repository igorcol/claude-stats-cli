#!/usr/bin/env node
import { handleCliCommands } from "./cli/router";
import { loadConfig } from "./core/config";
import { startTelemetry, runSingleScan } from "./core/telemetry";

async function bootstrap() {
  // Router para resolver flags estáticas (--help, --version, --reset)
  await handleCliCommands();

  try {
    // Se o script não morreu no router, seguimos para a lógica de negócio
    const config = await loadConfig();

    // Checagem manual para o --once (que não é uma flag de saída)
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