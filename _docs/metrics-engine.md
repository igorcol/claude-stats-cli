# ⚙️ MOTOR DE MÉTRICAS (PACE, OVERBURN & SLACK)

Este documento descreve a matemática e a lógica de negócios dentro de `src/core/metrics.ts`. O objetivo deste motor é transformar dados brutos de consumo ("você usou 50%") em inteligência acionável ("você está consumindo rápido demais para uma terça-feira").

## 1. O Problema da "Janela Deslizante" (Rolling Window)

A Anthropic contabiliza limites usando janelas de tempo contínuas (5 horas para sessões, 7 dias para a semana total). Diferente de uma franquia de celular que reseta dia 1º, a cota do Claude é fluida. O motor precisa calcular o ritmo de queima baseado não apenas no uso, mas na fração de tempo percorrida dentro do ciclo atual.

## 2. A Métrica de Ritmo (Pace) e o "Daily Bucket"

Para tornar a janela de 7 dias compreensível, o motor fatia a cota total de 100% em 7 blocos iguais (aproximadamente **14.28% ao dia**). 

*   **Pace (%):** É a porcentagem de cota *esperada* ou *ideal* que o operador deveria ter consumido até o exato segundo da medição, baseando-se no tempo que já passou desde o último reset global semanal.
*   **A Regra de Ouro:** Se a barra de Uso Semanal (`weekly.utilization`) for MAIOR que a barra de Ritmo (`pace.pace_percent`), o operador está no vermelho.

## 3. Estados Operacionais: Stable vs Overburn

O sistema opera sob dois paradigmas matemáticos estritos de avaliação de risco diário:

*   **STATUS: STABLE (Optimal)**
    *   **Condição:** Uso Atual ≤ Ritmo Ideal.
    *   **Significado:** O operador está vivendo dentro do orçamento do seu "Daily Bucket" e usando apenas a cota do passado ou do presente.
*   **STATUS: OVERBURN (High Risk)**
    *   **Condição:** Uso Atual > Ritmo Ideal.
    *   **Significado:** O operador esgotou a cota permitida para o momento atual e começou a "queimar" (*burn*) a cota reservada para os dias futuros (*over*). Ele corre risco de bloqueio iminente (ficar sem acesso na quinta-feira, por exemplo).

## 4. Slack (Folga) e Debt (Dívida)

Em vez de apenas alertar o usuário, o sistema quantifica o quão longe da meta ele está.

*   **Slack (Folga):** Quando em `STABLE`, é a diferença positiva entre o que você poderia ter usado e o que realmente usou. Representa a "gordura" de mensagens que você pode queimar hoje sem comprometer o amanhã.
*   **Daily Debt (Dívida):** Quando em `OVERBURN`, calcula exatamente quantos "%" o usuário ultrapassou do seu limite seguro diário, facilitando o freio cognitivo nas próximas horas.

## 5. O Contrato de Dados (`EnrichedUsage`)

Qualquer refatoração deve obrigatoriamente retornar a interface `EnrichedUsage` intacta para a camada de UI (`src/ui/dashboard.ts`). O Payload deve ser formatado da seguinte maneira:

```typescript
export interface EnrichedUsage {
  session: {
    utilization: number;
    reset_formatted: string; // Ex: "14:30"
  };
  weekly: {
    utilization: number;
    reset_formatted: string; // Ex: "Sexta, 22:00"
  };
  pace: {
    pace_percent: number;         // Onde eu deveria estar (%)
    target_allocation: number;    // Meta exata matemática
    slack: number;                // Folga acumulada (+%)
    today_usage_percent: number;  // Quanto do daily bucket foi usado
  };
  analysis: {
    is_overburn: boolean;         // Trigger principal de UI
    daily_debt: number;           // Dívida se estiver em overburn (-%)
    daily_free: number;           // Espaço livre se stable (+%)
  };
  account_alias: string;
  plan_tier: "PRO" | "FREE";
}

Não modifique as propriedades matemáticas sem ajustar a interface correspondente e a UI.
Com este arquivo, garantimos que termos próprios do sistema, como *Daily Bucket* e *Overburn*, não se percam em futuras iterações. 
Mande um "feito" quando criar e vamos para o fechamento: **`_DOCS/ui-guidelines.md`**!