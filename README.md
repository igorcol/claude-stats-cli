# ⚡ Claude Operational HUD

> Um painel de telemetria brutalista via CLI para monitorar o uso de tokens da sua conta Claude Pro em tempo real, direto do terminal, com latência zero.

---

## 🎯 A Ideia
Uma ferramenta de linha de comando (CLI) escrita em TypeScript que extrai, processa e renderiza seus dados de consumo da Anthropic em uma interface visual colorida, TDAH-friendly e impossível de ignorar. Você digita um comando de 5 letras e sabe exatamente o quão rápido pode trabalhar nas próximas horas.

## 🩸 O Porquê (O Gargalo)
O processo padrão para verificar seu limite no Claude é quebrado: exige abrir o navegador, trocar de aba, clicar no perfil e tentar interpretar uma interface limitante. 

Este sistema foi criado para resolver três problemas:
1. **Velocidade de Acesso:** Substituir 15 segundos de cliques por 1 segundo de terminal. Foco mantido.
2. **Redução de Carga Cognitiva:** Barras de progresso com formatação condicional (Verde > Amarelo > Vermelho). Você bate o olho e sente o "nível de perigo" de bloqueio.
3. **Visão de Raio-X (Hidden Data):** A UI web do Claude mascara dados úteis. Esta API extrai a "Single Source of Truth", mostrando as porcentagens exatas em decimais, os timestamps literais de reset e, futuramente, métricas não publicadas na interface padrão da Anthropic.

---

## ⚙️ Como Funciona (O Fluxo de Dados)

A arquitetura usa o padrão *Vault & Engine*, mantendo sua chave segura fora do código-fonte e conectando-se diretamente aos servidores internos.

1. **Leitura de Cofre:** O script injeta a sua `sessionKey` a partir do `claude_config.json` (ignorado no Git por segurança).
2. **Org Discovery:** Envia um *fetch* autenticado para `https://claude.ai/api/organizations` e localiza dinamicamente o ID (UUID) da sua conta associada à *capability* `claude_pro`.
3. **Usage Fetch:** Com o UUID em mãos, consulta a rota interna `/usage`, extraindo os objetos JSON de `five_hour` e `seven_day`.
4. **Renderização:** O motor visual formata as datas ISO para o seu *timezone* local, calcula as larguras matemáticas da barra de progresso (0-100%) e cospe os resultados via códigos ANSI no terminal.

---

## 🚀 Setup & Instalação

### 1. Clonar e Configurar
```bash
git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
cd SEU_REPOSITORIO
npm install
```

### 2. O Cofre de Segurança
Crie um arquivo chamado `claude_config.json` na raiz do projeto (não se preocupe, o `.gitignore` o protegerá) e insira sua chave extraída dos cookies do navegador (`F12 > Application > Cookies > sessionKey`):
```json
{
  "sessionKey": "sk-ant-sua-chave-aqui"
}
```

### 3. Integração Global (Windows)
    1. Coloque a pasta do projeto no seu PATH de Variáveis de Ambiente.
    2. Certifique-se de que o arquivo stats.bat contido na raiz possui a diretriz de chamada para o motor TSX.

### 4. Execução
No seu CMD, PowerShell, terminal do VS Code ou pelo Win + R, digite:
```bash
stats
```
