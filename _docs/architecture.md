# 🗺️ ARQUITETURA DE SISTEMA (DATA FLOW & ORCHESTRATION)

Este documento mapeia a arquitetura do **Claude Operational HUD**. O sistema opera sob um modelo de fluxo unidirecional rigoroso: Captura -> Busca -> Processamento -> Renderização.

## 1. O Mapa de Módulos (Responsabilidades)

O código-fonte (`src/`) é estritamente dividido em três domínios principais:

*   **`/cli/` (Interceptação):** Lida com comandos de ação única (ex: `--help`, `--logout`, `--setup`). Processa as intenções do usuário antes que o motor de telemetria seja acionado.
*   **`/core/` (O Motor):** Contém a lógica pesada. Conexão com API, persistência de disco, orquestração de loop e cálculos matemáticos.
*   **`/ui/` (Apresentação):** Componentes visuais passivos. Não tomam decisões de estado, apenas "pintam" os dados na tela do terminal.
*   **`/utils/` (Ferramentas):** Funções utilitárias puras (formatação de barras de progresso, sistema de cores e temas).

## 2. Ciclo de Vida do CLI (Lifecycle)

A execução do comando `stats` segue uma trilha imutável:

1.  **Boot & Flags (`index.ts`):** 
    *   Registra os *handlers* de Graceful Shutdown (SIGINT/Ctrl+C).
    *   Faz o parse das flags modificadoras de execução (`--compact`, `--anonymous`, `--json`, `--once`).
    *   Injeta essas flags no objeto `ScanOptions` para descer pela árvore de execução.
2.  **Orquestração (`core/telemetry.ts`):**
    *   Lê os modificadores e decide entre rodar um loop infinito (`startTelemetry`) ou um disparo único (`runSingleScan`).
    *   Inicia o loop com intervalo padrão de 60 segundos.
3.  **Data Fetching (`core/api.ts`):**
    *   Recebe a `sessionKey` e o objeto de cache (`cachedParams`).
    *   *Short-circuiting:* Se o cache da organização existir, pula a rota de verificação de conta (`/organizations`) e bate direto no endpoint de utilização (`/usage`).
4.  **Mecanismo de Inteligência (`core/metrics.ts`):**
    *   Recebe o payload cru da API da Anthropic (que não possui nenhum dado analítico profundo).
    *   Enriquece os dados, calculando porcentagens de `Pace`, `Overburn`, `Slack`, `Daily Debt` e formatando cronômetros de reset.
5.  **Renderização (`ui/dashboard.ts`):**
    *   Recebe o objeto final `EnrichedUsage` e o `HUDOptions`.
    *   Decide qual "skin" desenhar no terminal (Full, Compact, Mascarado/Anônimo) baseando-se estritamente nas flags ativadas.

## 3. Sistema de Persistência e Cache (Identity Check)

Para evitar chamadas HTTP desnecessárias e diminuir drasticamente as chances de bloqueio por *rate-limit*, o sistema utiliza persistência local no arquivo `.claude_stats_config.json`, localizado no diretório `Home` do operador.

*   **Lazy Loading Dinâmico:** No primeiro setup, o sistema não exige que o usuário saiba seu `organizationId`. A `api.ts` faz uma requisição para identificar a conta e, ao obter sucesso, a `telemetry.ts` injeta esse ID, o `account_alias` e o `plan_tier` no arquivo de configuração.
*   As próximas execuções extraem esses dados do arquivo, montando o *header* e as métricas visuais de forma assíncrona, quase imediata.

## 4. Mecanismos de Resiliência (Auto-Recovery)

A camada de rede trata a conexão com a Anthropic como hostil e não confiável. 

*   Se a API retornar um `403 Forbidden` (Sessão Expirada), o erro é lançado para cima.
*   O interceptor global no `telemetry.ts` captura esse erro específico e pausa o CLI antes que ele cause um *crash* fatal.
*   Um *Wizard* de recuperação é ativado diretamente no terminal, solicitando educadamente uma nova `sessionKey` ao operador.
*   Ao inserir a nova chave, o sistema a persiste, recarrega o estado em memória e retoma o loop de telemetria da estaca zero de forma transparente.