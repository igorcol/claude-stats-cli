// src/setup.ts
import fs from "fs";
import readline from "readline/promises";
import { COLORS } from "./utils/theme";
import { getClaudeUsage } from "./api";

export interface Config {
  sessionKey: string;
}

export async function runWizard(configPath: string): Promise<Config> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.clear();
  console.log(
    `\n ${COLORS.BG_CYAN}${COLORS.BLACK}${COLORS.BOLD}  🛠️  CLAUDE STATS: SETUP INICIAL  ${COLORS.RESET}`,
  );
  console.log(
    ` ${COLORS.GRAY}Configure sua chave para iniciar a telemetria.${COLORS.RESET}\n`,
  );

  // Instruções fixas no topo para não poluir
  console.log(
    ` ${COLORS.BOLD}${COLORS.WHITE}COMO OBTER SUA CHAVE:${COLORS.RESET}`,
  );
  console.log(
    ` 1. Acesse ${COLORS.CYAN}https://claude.ai${COLORS.RESET} e faça login.`,
  );
  console.log(
    ` 2. Pressione ${COLORS.BOLD}F12${COLORS.RESET} -> ${COLORS.BOLD}Application${COLORS.RESET} -> ${COLORS.BOLD}Cookies${COLORS.RESET}.`,
  );
  console.log(
    ` 3. Copie o valor da ${COLORS.CYAN}sessionKey${COLORS.RESET} (sk-ant-sid...)\n`,
  );

  while (true) {
    const key = await rl.question(
      ` ${COLORS.BG_YELLOW}${COLORS.BLACK} INSIRA SUA SESSION KEY: ${COLORS.RESET} `,
    );

    const trimmedKey = key.trim();

    // 1. Validação básica de formato
    if (!trimmedKey.startsWith("sk-ant-sid")) {
      console.log(
        `\n ${COLORS.RED} [!] FORMATO INVÁLIDO:${COLORS.RESET} A chave deve começar com 'sk-ant-sid'.`,
      );
      console.log(
        ` ${COLORS.GRAY} Verifique se você copiou o campo correto.${COLORS.RESET}\n`,
      );
      continue;
    }

    // 2. Teste de Autenticação Real
    process.stdout.write(
      `\n ${COLORS.CYAN}⏳ Validando junto à Anthropic...${COLORS.RESET}`,
    );

    try {
      await getClaudeUsage(trimmedKey);

      // SUCESSO
      const config = { sessionKey: trimmedKey };
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

      console.log(
        `\r ${COLORS.BG_GREEN}${COLORS.BLACK}${COLORS.BOLD} SUCESSO ${COLORS.RESET} Credenciais validadas!`,
      );

      rl.close(); // Fecha o input ANTES de retornar
      return config;
    } catch (err) {
      // Agora o catch realmente funciona!
      process.stdout.write(`\r${" ".repeat(60)}\r`); // Limpa o "Validando..."

      console.log(
        ` ${COLORS.BG_RED}${COLORS.BLACK}${COLORS.BOLD} AUTH ERROR ${COLORS.RESET} ${COLORS.RED}Chave recusada pela Anthropic.${COLORS.RESET}`,
      );
      console.log(
        ` ${COLORS.GRAY} Verifique se a sessionKey está correta e tente de novo.\n${COLORS.RESET}`,
      );

      // O loop continua, ele vai perguntar de novo
    }
  }
}
