// src/core/telemetry.ts
import { getClaudeUsage } from "./api";
import { renderHUD } from "../ui/dashboard";
import { COLORS } from "../utils/theme";
import { forceSetup } from "./config"; // Precisamos disso para o auto-recovery
import readline from "readline/promises";

const REFRESH_INTERVAL = 60 * 1000;

export async function startTelemetry(initialKey: string) {
  let currentKey = initialKey;
  
  console.log(`${COLORS.CYAN}[i] Iniciando Telemetria...${COLORS.RESET}`);

  while (true) {
    try {
      const usage = await getClaudeUsage(currentKey);
      renderHUD(usage);

      const now = new Date().toLocaleTimeString("pt-BR");
      console.log(`\n ${COLORS.GRAY}Ultima atualização: ${now} (Próxima em ${REFRESH_INTERVAL / 1000}s)${COLORS.RESET}`);
      console.log(` ${COLORS.GRAY}Pressione Ctrl+C para encerrar.${COLORS.RESET}`);

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erro Desconhecido";
      
      // INTERCEPTOR DE EXPIRAÇÃO (Auto-Recovery)
      if (errorMsg.includes("403") || errorMsg.includes("Auth")) {
        const newKey = await handleExpiredSession();
        
        if (newKey) {
          currentKey = newKey; // Atualiza a chave na memória do loop
          console.log(`\n ${COLORS.GREEN}✔ Chave atualizada. Retomando telemetria...${COLORS.RESET}`);
          continue; // Tenta rodar novamente IMEDIATAMENTE com a chave nova
        } else {
          console.log(`\n ${COLORS.GRAY}Encerrando por falta de credenciais válidas.${COLORS.RESET}`);
          process.exit(0);
        }
      }

      // TRATAMENTO DE ERROS COMUNS (Rede/Timeout)
      console.log(`\n ${COLORS.RED}[!] Erro na atualização: ${errorMsg}${COLORS.RESET}`);
      console.log(` ${COLORS.GRAY}Tentando novamente em 15s...${COLORS.RESET}`);
      await new Promise((resolve) => setTimeout(resolve, 15000));
      continue;
    }

    await new Promise((resolve) => setTimeout(resolve, REFRESH_INTERVAL));
  }
}

/**
 * Função auxiliar para lidar com a interface de erro de expiração
 */
async function handleExpiredSession(): Promise<string | null> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(`\n\n ${COLORS.BG_RED}${COLORS.BLACK}${COLORS.BOLD} ⚠️  SESSÃO EXPIRADA ${COLORS.RESET}`);
  console.log(` ${COLORS.RED}Sua sessionKey não é mais válida ou a Anthropic recusou o acesso.${COLORS.RESET}`);
  
  const answer = await rl.question(`\n Deseja atualizar a chave agora? (y/n): `);
  
  rl.close();

  if (answer.toLowerCase() === "y") {
    // Abre o Wizard 
    const config = await forceSetup();
    return config.sessionKey;
  }

  return null;
}

export async function runSingleScan(sessionKey: string) {
  try {
    const usage = await getClaudeUsage(sessionKey);
    renderHUD(usage);
    console.log(`\n ${COLORS.GRAY}Scan único finalizado.${COLORS.RESET}\n`);
  } catch (error) {
    console.error(`\n ${COLORS.RED}[!] Erro no scan único: ${error instanceof Error ? error.message : error}${COLORS.RESET}`);
    process.exit(1);
  }
}