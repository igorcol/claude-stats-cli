import fs from "node:fs";
import path from "node:path";

// Tipagem
export interface ClaudeConfig {
  sessionKey: string;
}

export function loadConfig(): ClaudeConfig {
  // cfg path
  const configPath = path.resolve(__dirname, "../claude_config.json");

  if (!fs.existsSync(configPath)) {
    console.error(
      `\x1b[31m[!] ERRO CRÍTICO: Config não encontrada em ${configPath}\x1b[0m`,
    );
    process.exit(1); // Encerra a execução
  }

  try {
    const rawData = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(rawData);

    if (!config.sessionKey) {
      console.error(
        '\x1b[31m[!] ERRO CRÍTICO: "sessionKey" ausente no JSON.\x1b[0m',
      );
      process.exit(1);
    }

    return { sessionKey: config.sessionKey };
  } catch (error) {
    console.error(
      "\x1b[31m[!] ERRO CRÍTICO: Falha ao ler ou fazer parse do claude_config.json\x1b[0m",
      error,
    );
    process.exit(1);
  }
}
