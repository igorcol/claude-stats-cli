#!/usr/bin/env node
import { loadConfig } from "./core/config";
import { startTelemetry } from "./core/telemetry";

async function bootstrap() {
  try {
    const config = await loadConfig();
    await startTelemetry(config.sessionKey);
  } catch (error) {
    console.error("\n [!] Erro fatal no bootstrap.");
    process.exit(1);
  }
}

bootstrap();