# 🤖 DIRETRIZES DO OPERADOR (AI SYSTEM PROMPT)

Este projeto é o **Claude Operational HUD**, uma interface de telemetria CLI avançada para monitoramento de cotas da Anthropic. O design system é inspirado em interfaces cibernéticas, industriais e de alta performance. 

Ao modificar, refatorar ou adicionar código a este repositório, você **deve** obedecer estritamente às seguintes regras:

## 1. Arquitetura e Separação de Conceitos (SoC)
- **Nunca misture lógica de negócios com UI:** O diretório `src/ui/` deve ser estúpido. Ele apenas recebe dados processados e os renderiza. Toda a matemática e cálculo de estado deve ocorrer em `src/core/metrics.ts`.
- **Comunicação de Rede Isolada:** Todas as requisições HTTP e lógicas de headers pertencem exclusivamente a `src/core/api.ts`.
- **Fluxo de Execução:** O arquivo `src/index.ts` intercepta os argumentos (flags) e orquestra o roteamento para as funções do core (ex: `startTelemetry` ou `runSingleScan`).

## 2. Padrões de Código e TypeScript
- **Strict Mode:** Use tipagem forte e interfaces explícitas. **É estritamente proibido o uso de `any`**, a menos que seja um retorno bruto e imprevisível de uma API de terceiros (o que deve ser tipado via *Type Casting* assim que possível).
- **Sem Dependências Desnecessárias:** Este é um CLI leve. Não instale bibliotecas de formatação, cores ou requisições (como `axios` ou `chalk`). Use a API `fetch` nativa do Node e o objeto global de cores em `src/utils/theme.ts`.

## 3. Diretrizes de UI / Terminal (Terminal Guidelines)
- **Identidade Visual:** O HUD é industrial, tático e "low-profile". Evite emojis excessivos. Confie nos caracteres ANSI (como `█` e `░`), divisores geométricos e no sistema de cores centralizado (`COLORS`).
- **Respeito às Flags:**
  - Se a flag `--json` estiver ativa, o sistema deve cuspir **apenas** JSON puro no `stdout` e encerrar `process.exit(0)`. Qualquer `console.log` de texto decorativo, barra de progresso ou erro legível por humanos quebrará integrações de terceiros. Erros no modo JSON devem ser devolvidos como `{"error": "message"}`.
  - Se a flag `--anonymous` (`-a`) estiver ativa, dados sensíveis do operador (nome e tier) devem ser substituídos por `OPERATOR` e `SECURE` no HUD.
  - Se a flag `--compact` (`-c`) estiver ativa, o output deve ser limitado a um resumo essencial de poucas linhas, sem limpar brutalmente telas anteriores do usuário se não for necessário.

## 4. Persistência de Dados e Cache
- **Arquivos Locais:** A chave de sessão (`sessionKey`) e os metadados cacheados (Org ID, Alias, Tier) são salvos no arquivo `.claude_stats_config.json` no diretório Home (`~/`) do operador. Nunca modifique o caminho deste arquivo para o diretório atual da aplicação, para garantir que o CLI funcione globalmente em qualquer pasta.

## 5. Resiliência e Graceful Shutdown
- **Auto-Recovery:** Erros de rede ou 403 (Sessão Expirada) não devem causar crashes não tratados. Eles devem ser capturados pelo `src/core/telemetry.ts`, informando o erro polidamente ou invocando o Wizard de reautenticação (`forceSetup`).
- **Tratamento de Sinais:** `SIGINT` (Ctrl+C) deve ser capturado suavemente para encerrar os loops de `setInterval` ou `while` sem vomitar stack traces na tela do usuário.

## 6. Base de Conhecimento Expandida (Leia antes de codar)
Para contexto aprofundado, consulte os arquivos no diretório `_DOCS/`:
- **`_DOCS/architecture.md`**: Detalha o fluxo de dados, a orquestração de módulos e o ciclo de vida do CLI.
- **`_DOCS/metrics-engine.md`**: Explica as regras de negócio intrínsecas e a matemática sagrada por trás das métricas de `Pace`, `Overburn` e `Slack`.
- **`_DOCS/ui-guidelines.md`**: Documenta o padrão estético, uso correto do sistema de cores e comportamento esperado para cada visualização.

"Criar o futuro ao invés de prever."