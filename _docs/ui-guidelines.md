# 🎨 DIRETRIZES DE UI (DESIGN SYSTEM & TERMINAL)

O **Claude Operational HUD** não é apenas uma ferramenta; é uma interface tática. O design é focado em alta densidade de informação, leitura rápida sob pressão e estética cibernética/industrial (Cyber-Ops).

## 1. Filosofia de Design (The Cyber-Ops Aesthetic)

*   **Sem Ruído Visual:** O terminal não é uma página web. Use o contraste a seu favor. Deixe os espaços em branco (ou vazios) guiarem o olhar.
*   **Baixo Perfil (Low-Profile):** Evite excesso de emojis coloridos. Prefira o uso de caracteres geométricos padrão Unicode e blocos ANSI (como `█`, `▓`, `▒`, `░`, `│`, `└─>`).
*   **Comunicação Direta:** Nunca diga "Aqui está o seu uso de hoje:". Diga `CARGA ATUAL`.
*   **Código de Cores Restrito:** O estado de erro ou perigo DEVE ser `RED`. O estado de segurança e folga DEVE ser `GREEN`. Informativos de sistema são `CYAN` ou `MAGENTA`. Nunca invente combinações de cores fora da paleta global.

## 2. A Paleta Global (`src/utils/theme.ts`)

É **estritamente proibido** utilizar strings de escape ANSI isoladas no meio do código (ex: `\x1b[31m`). Qualquer cor ou modificador de texto deve ser extraído do objeto global `COLORS`.

```typescript
// Exemplo de uso correto:
console.log(`${COLORS.CYAN}Meu texto${COLORS.RESET}`);

// Exemplo PROIBIDO:
console.log(`\x1b[36mMeu texto\x1b[0m`);
Sempre lembre de fechar o bloco de cor com ${COLORS.RESET} para não sangrar a cor para a próxima linha do terminal do usuário.

3. Comportamentos de Visualização (View Modes)
O arquivo src/ui/dashboard.ts orquestra qual "Skin" do sistema será apresentada com base no HUDOptions que ele recebe do motor. O sistema suporta os seguintes estados que podem ser combinados:

A. HUD Completo (Default)
A visão tática expansiva. Limpa o terminal (console.clear()), desenha o Header em destaque, separa as seções de Sessão e Semanal com um divisor central e apresenta os dados detalhados de Slack (Folga) e datas exatas de Reset.

B. Modo Compacto (--compact ou -c)
Uma versão de densidade extrema desenhada para ocupar não mais que duas linhas.

Uso: Ideal para ser deixado em um terminal lateral aberto continuamente.

Regra de Ouro: As barras de progresso devem ser reduzidas de largura (ex: de tamanho dinâmico para 12 blocos rígidos) para não quebrar a quebra de linha (word-wrap) do terminal do usuário.

C. Modo Anônimo (--anonymous ou -a)
Camada de privacidade aplicada em tempo de renderização.

O motor (metrics.ts) ainda sabe o nome e o tier real do operador.

No momento exato de pintar a tela (dashboard.ts), as variáveis são interceptadas:

account_alias torna-se OPERATOR.

plan_tier torna-se SECURE.

Nota: Essa flag é compatível tanto com o HUD Completo quanto com o Modo Compacto.

D. Modo Máquina (--json)
A anti-UI. Se ativado, o sistema anula toda e qualquer importação visual.

Regra Restrita: Nenhum log humano pode ser disparado. Zero headers, zero cores, zero barras de progresso. O sistema deve emitir exclusivamente um JSON com os dados e sair com o código de encerramento nativo (process.exit(0) ou erro em JSON com exit(1)).