#!/usr/bin/env node
import { getClaudeUsage } from './api';
import { loadConfig } from './config';
import { renderHUD } from './ui';
import { COLORS } from './utils/theme';

const REFRESH_INTERVAL = 60 * 1000; 

async function bootstrap() {
    try {
        // loadConfig agora chama o Wizard internamente se necessário
        const config = await loadConfig();
        
        console.log(`${COLORS.CYAN}[i] Iniciando Telemetria...${COLORS.RESET}`);

        while (true) {
            try {
                const usage = await getClaudeUsage(config.sessionKey);
                renderHUD(usage);

                const now = new Date().toLocaleTimeString('pt-BR');
                console.log(`\n ${COLORS.GRAY}Ultima atualização: ${now} (Próxima em ${REFRESH_INTERVAL / 1000}s)${COLORS.RESET}`);
                console.log(` ${COLORS.GRAY}Pressione Ctrl+C para encerrar.${COLORS.RESET}`);

            } catch (error) {
                // Se a API falhar no loop, avisamos mas não matamos o script
                console.log(`\n ${COLORS.RED}[!] Erro na atualização: ${error instanceof Error ? error.message : 'Erro Desconhecido'}${COLORS.RESET}`);
                console.log(` ${COLORS.GRAY}Tentando novamente em 15s...${COLORS.RESET}`);
                await new Promise(resolve => setTimeout(resolve, 15000));
                continue; // Pula o wait de 60s e tenta mais cedo
            }

            await new Promise(resolve => setTimeout(resolve, REFRESH_INTERVAL));
        }
    } catch (fatalError) {
        // Erro fatal (ex: erro ao salvar arquivo de config no setup)
        console.error(`\n ${COLORS.RED}[!] FALHA GERAL DO SISTEMA:${COLORS.RESET}`);
        console.error(fatalError instanceof Error ? fatalError.message : fatalError);
        process.exit(1);
    }
}

bootstrap();