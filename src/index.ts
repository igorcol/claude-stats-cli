#!/usr/bin/env node
import { parseArgs } from "./cli/args";
import { CLI_COMMANDS } from "./cli/commands";
import { loadConfig, forceSetup } from "./core/config"; // Vamos ajustar o config.ts
import { startTelemetry, runSingleScan } from "./core/telemetry";

async function bootstrap() {
  const args = parseArgs();

  // Flags Prioritárias (Morrem após execução)
  if (args.help) return CLI_COMMANDS.showHelp();
  if (args.version) return CLI_COMMANDS.showVersion();
  if (args.reset) return CLI_COMMANDS.resetConfig();

  try {
    // Lógica de Config/Setup
    // Se a flag --setup estiver presente, forçamos o wizard
    const config = args.setup ? await forceSetup() : await loadConfig();

    // Modos de Execução
    if (args.once) {
      await runSingleScan(config.sessionKey);
    } else {
      await startTelemetry(config.sessionKey);
    }
  } catch (error) {
    process.exit(1);
  }
}

bootstrap();