// src/setup.ts
import fs from "fs";
import readline from "readline/promises";
import { COLORS } from "./utils/theme";

export interface Config {
  sessionKey: string;
}

export async function runWizard(configPath: string): Promise<Config> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.clear();
  console.log(`\n ${COLORS.BG_CYAN}${COLORS.BLACK}${COLORS.BOLD}  🛠️  CLAUDE STATS: SETUP INICIAL  ${COLORS.RESET}`);
  console.log(` ${COLORS.GRAY}Parece que é sua primeira vez por aqui.${COLORS.RESET}\n`);

  console.log(` ${COLORS.BOLD}${COLORS.WHITE}COMO OBTER SUA CHAVE:${COLORS.RESET}`);
  console.log(` 1. Acesse ${COLORS.CYAN}https://claude.ai${COLORS.RESET} e faça login.`);
  console.log(` 2. Pressione ${COLORS.BOLD}F12${COLORS.RESET} (Inspecionar) -> Aba ${COLORS.BOLD}Application${COLORS.RESET}.`);
  console.log(` 3. No menu lateral: ${COLORS.BOLD}Cookies${COLORS.RESET} -> ${COLORS.BOLD}https://claude.ai${COLORS.RESET}.`);
  console.log(` 4. Procure por ${COLORS.CYAN}sessionKey${COLORS.RESET} e copie o valor.`);
  console.log(`    ${COLORS.GRAY}(Começa com sk-ant-sid...)${COLORS.RESET}\n`);

  const key = await rl.question(
    ` ${COLORS.BG_YELLOW}${COLORS.BLACK} INSIRA SUA SESSION KEY: ${COLORS.RESET} `
  );

  if (!key.trim().startsWith("sk-ant-sid")) {
    console.log(`\n ${COLORS.BG_RED}${COLORS.BLACK} [!] ERRO ${COLORS.RESET} Chave inválida. Deve começar com 'sk-ant-sid'.`);
    rl.close();
    process.exit(1);
  }

  const config: Config = { sessionKey: key.trim() };

  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\n ${COLORS.GREEN}✔ Configuração salva com sucesso!${COLORS.RESET}`);
    console.log(` ${COLORS.CYAN}Iniciando telemetria...${COLORS.RESET}`);

    await new Promise((resolve) => setTimeout(resolve, 1500));
    rl.close();
    return config;
  } catch (err) {
    console.log(`\n ${COLORS.RED}[!] Erro ao salvar arquivo de config.${COLORS.RESET}`);
    process.exit(1);
  }
}