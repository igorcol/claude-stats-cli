import { getClaudeUsage } from './api';
import { loadConfig } from './config';
import { renderHUD } from './ui';

async function bootstrap() {
    try {
        const config = loadConfig();
        const usage = await getClaudeUsage(config.sessionKey);
        
        renderHUD(usage);
    } catch (error) {
        console.error('\x1b[31m[!] FALHA GERAL DO SISTEMA:\x1b[0m');
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

bootstrap();