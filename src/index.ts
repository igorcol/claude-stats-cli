#!/usr/bin/env node
import { handleCliCommands } from "./cli/router";
import { loadConfig } from "./core/config";
import { startTelemetry, runSingleScan } from "./core/telemetry";

// src/index.ts
async function bootstrap() {
  // Router verifica as flags. 
  // Se for --setup, roda o Wizard, NÃO mata o processo e retorna true.
  const commandHandled = await handleCliCommands();

  try {
    // Carrega a config (se o --setup rodou, ele pega a chave nova aqui)
    const config = await loadConfig();

    // Decide se abre o Dashboard ou faz Scan Único
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