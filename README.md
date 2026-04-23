# ⚡ CLAUDE OPERATIONAL HUD 
![Version](https://img.shields.io/badge/version-1.0.0--beta.2-magenta?style=for-the-badge)
[![Changelog](https://img.shields.io/badge/What's_New%3F-Click_Here-00f2ff?style=for-the-badge)](./CHANGELOG.md)

> **Do passageiro ao gestor.** Pare de ser limitado pela Anthropic e comece a gerenciar seu orçamento de inteligência em tempo real.

---

## 🧠 A Filosofia: Gerenciamento de Orçamento de Produtividade

O processo padrão de uso do Claude é reativo: você trabalha até receber o aviso de que "seu limite acaba em 2 horas". Isso interrompe o fluxo, quebra o raciocínio e gera estresse de entrega.

O **Claude Operational HUD** inverte essa lógica. Ele transforma o limite abstrato da Anthropic em um **recurso alocável**. Através da métrica exclusiva de **COT (Cota Diária)**, você deixa de ser um passageiro dos resets semanais para se tornar o gestor do seu próprio fluxo de trabalho. Se você está dentro da cota diária, você tem a garantia de combustível para a semana toda.

## 🩸 Por que usar o HUD?

1. **Visão de Cockpit:** Interface neobrutalista pensada para estado de alerta e foco. Bateu o olho, entendeu o consumo.
2. **Métrica COT (Daily Quota):** O HUD divide seu limite semanal por 7, criando um orçamento diário. Mantenha-se no verde e nunca mais seja bloqueado na quinta-feira.
3. **Latência Zero:** Sem abas de navegador, sem cliques. Um comando de 5 letras no terminal e você tem a "Single Source of Truth".
4. **Resiliência Nativa:** Sistema de telemetria com rescan automático a cada 60 segundos e recuperação automática de sessão.

---

## 🛠️ Engenharia e Funcionalidades

O HUD v1.0.0 não é apenas um script de visualização, é um motor resiliente construído em TypeScript:

* **Command Registry:** Arquitetura modular para flags de comando (Standard POSIX).
* **Auto-Recovery:** Detecção inteligente de erro 403. Se sua chave expirar, o HUD pausa e oferece o setup na hora.
* **Graceful Shutdown:** Encerramento limpo de processos, respeitando os sinais do sistema (sem erros de memória no Windows).
* **Update Checker:** Antena assíncrona que avisa sobre novas versões sem atrasar a inicialização.
* **Health Score:** Cálculos decimais de porcentagem e timestamps literais de reset.

---

## 🚀 Instalação e Setup Rápido

### 1. Preparação
```bash
git clone https://github.com/igorcol/claude-stats-cli.git
cd claude-stats-cli
npm install
npm run build
npm link
```

### 2. Primeiro Acesso (Wizard)
Diferente das versões anteriores, você não precisa editar arquivos JSON manualmente. Basta rodar:
```bash
stats --setup
```

O Wizard irá validar sua `sessionKey` em tempo real e configurar seu ambiente de forma segura.

---

## 🎮 Comandos Disponíveis

O HUD utiliza um motor de triagem de comandos profissional:

| Comando | Descrição |
| :--- | :--- |
| `stats` | Inicia a telemetria em tempo real (Loop de 60s). |
| `stats --once` | Realiza um scan único e encerra (ideal para logs rápidos). |
| `stats --setup` | Força a reconfiguração da chave de acesso. |
| `stats --reset` | Remove as configurações locais do sistema. |
| `stats --version` | Exibe a versão atual da engine. |
| `stats --help` | Mostra a central de ajuda. |

---

## 🎨 Estética Disruptiva
O design foi projetado para ser **TDAH-friendly** e **High-Contrast**. O uso de Neon sobre Dark Mode não é apenas estético; é funcional para destacar métricas críticas de "Overburn" (excesso de uso) instantaneamente, permitindo uma tomada de decisão rápida sobre qual tarefa priorizar.

---

## 🛡️ Segurança e Privacidade
Sua `sessionKey` nunca sai da sua máquina. O HUD comunica-se exclusivamente com os endpoints oficiais da Anthropic e armazena suas credenciais localmente em um "cofre" (arquivo de configuração) no diretório home do usuário (`~/.claude_stats_config.json`).

---

**Desenvolvido por Igor Colombini**