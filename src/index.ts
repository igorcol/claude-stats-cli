import { getClaudeUsage } from './api';
import { loadConfig } from './config';
import { renderHUD } from './ui';
import { COLORS } from './utils/theme';

// Configuração de Intervalo (60 segundos é o ideal para não ser bloqueado pela API)
const REFRESH_INTERVAL = 60 * 1000; 

async function bootstrap() {
    const config = loadConfig();
    
    console.log(`${COLORS.CYAN}[i] Iniciando Telemetria...${COLORS.RESET}`);

    // Loop Infinito de Monitoramento
    while (true) {
        try {
            const usage = await getClaudeUsage(config.sessionKey);
            
            renderHUD(usage);

            // Timestamp de última atualização para você saber que o script não travou
            const now = new Date().toLocaleTimeString('pt-BR');
            console.log(``);
            console.log(` ${COLORS.GRAY}Ultima atualização: ${now} (Próxima em ${REFRESH_INTERVAL / 1000}s)${COLORS.RESET}`);
            console.log(` ${COLORS.GRAY}Pressione Ctrl+C para encerrar.${COLORS.RESET}`);

        } catch (error) {
            // Em tempo real, não queremos que o script morra por um erro de rede temporário
            console.log(`\n ${COLORS.RED}[!] Erro na atualização. Tentando novamente em 10s...${COLORS.RESET}`);
        }

        // Aguarda o intervalo antes da próxima leitura
        await new Promise(resolve => setTimeout(resolve, REFRESH_INTERVAL));
    }
}

bootstrap();