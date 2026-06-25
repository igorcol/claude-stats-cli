// src/core/telemetry.ts
import { getClaudeUsage } from "./api";
import { renderHUD } from "../ui/dashboard";
import { COLORS } from "../utils/theme";
import { forceSetup, loadConfig, saveConfig } from "./config";
import readline from "readline/promises";
import { checkForUpdates } from "./updates";
import { enrichUsageData } from "./metrics";

const REFRESH_INTERVAL = 60 * 1000;

// Atualizado para incluir a flag anônima
export interface ScanOptions {
  isJson?: boolean;
  isCompact?: boolean;
  isAnonymous?: boolean;
}

export async function startTelemetry(
  initialKey: string,
  options: ScanOptions = {},
) {
  let currentKey = initialKey;
  let updateAvailable: string | null = null;

  checkForUpdates().then((version) => {
    updateAvailable = version;
  });

  console.log(`${COLORS.CYAN}[i] Iniciando Telemetria...${COLORS.RESET}`);

  while (true) {
    try {
      const config = await loadConfig();

      const hasCache = !!(
        config.organizationId &&
        config.account_alias &&
        config.plan_tier
      );

      // Tentar usar o cache se existir
      const cachedParams = hasCache
        ? {
            id: config.organizationId!,
            alias: config.account_alias!,
            tier: config.plan_tier!,
          }
        : undefined;

      const rawUsage = await getClaudeUsage(currentKey, cachedParams);

      // Se não tem ID no config. Salva
      if (!config.organizationId) {
        await saveConfig({
          ...config,
          organizationId: rawUsage.organization_id,
          account_alias: rawUsage.account_alias,
          plan_tier: rawUsage.plan_tier,
        });
      }

      // Passa pela Inteligência antes do Dashboard
      const enrichedPayload = enrichUsageData(rawUsage);
      
      // Enviando o objeto de opções completo para o orquestrador visual
      renderHUD(enrichedPayload, updateAvailable, options);

      const now = new Date().toLocaleTimeString("pt-BR");
      console.log(
        `\n ${COLORS.GRAY}Ultima atualização: ${now} (Próxima em ${REFRESH_INTERVAL / 1000}s)${COLORS.RESET}`,
      );
      console.log(
        ` ${COLORS.GRAY}Pressione Ctrl+C para encerrar.${COLORS.RESET}`,
      );
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Erro Desconhecido";

      // INTERCEPTOR DE EXPIRAÇÃO (Auto-Recovery)
      if (errorMsg.includes("403") || errorMsg.includes("Auth")) {
        const newKey = await handleExpiredSession();

        if (newKey) {
          currentKey = newKey; // Atualiza a chave na memória do loop
          console.log(
            `\n ${COLORS.GREEN}✔ Chave atualizada. Retomando telemetria...${COLORS.RESET}`,
          );
          continue; // Tenta rodar novamente IMEDIATAMENTE com a chave nova
        } else {
          console.log(
            `\n ${COLORS.GRAY}Encerrando por falta de credenciais válidas.${COLORS.RESET}`,
          );
          process.exit(0);
        }
      }

      // TRATAMENTO DE ERROS COMUNS (Rede/Timeout)
      console.log(
        `\n ${COLORS.RED}[!] Erro na atualização: ${errorMsg}${COLORS.RESET}`,
      );
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

  console.log(
    `\n\n ${COLORS.BG_RED}${COLORS.BLACK}${COLORS.BOLD} ⚠️  SESSÃO EXPIRADA ${COLORS.RESET}`,
  );
  console.log(
    ` ${COLORS.RED}Sua sessionKey não é mais válida ou a Anthropic recusou o acesso.${COLORS.RESET}`,
  );

  const answer = await rl.question(
    `\n Deseja atualizar a chave agora? (y/n): `,
  );

  rl.close();

  if (answer.toLowerCase() === "y") {
    // Abre o Wizard
    const config = await forceSetup();
    return config.sessionKey;
  }

  return null;
}

export async function runSingleScan(
  sessionKey: string,
  options: ScanOptions = {},
) {
  try {
    const rawUsage = await getClaudeUsage(sessionKey);
    const enrichedPayload = enrichUsageData(rawUsage);

    // 🔀 A ENCRUZILHADA
    if (options.isJson) {
      // Modo Máquina: Cospe apenas o JSON e sai silenciosamente.
      console.log(JSON.stringify(enrichedPayload, null, 2));
      process.exit(0);
    }

    // Modo Operador: Pinta a tela
    renderHUD(enrichedPayload, null, options);
    console.log(`\n ${COLORS.GRAY}Scan único finalizado.${COLORS.RESET}\n`);
  } catch (error) {
    if (options.isJson) {
      // No modo JSON, os erros também devem sair em JSON para não quebrar a automação
      console.log(
        JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown Error",
        }),
      );
    } else {
      console.error(
        `\n ${COLORS.RED}[!] Erro no scan único: ${error instanceof Error ? error.message : error}${COLORS.RESET}`,
      );
    }
    process.exit(1);
  }
}