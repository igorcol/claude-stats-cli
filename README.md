# ⚡ CLAUDE OPERATIONAL HUD
![Version](https://img.shields.io/badge/version-1.0.0--beta.3-magenta?style=for-the-badge)
[![Changelog](https://img.shields.io/badge/What's_New%3F-Click_Here-00f2ff?style=for-the-badge)](./CHANGELOG.md)

> Pare de ser um passageiro dos limites da Anthropic e assuma o controle do seu combustível de produtividade.

---

## 🧠 A Filosofia: Gerenciamento de Orçamento de Produtividade

O processo padrão de uso do Claude é reativo: você trabalha até receber o aviso "você usou 78% do seu limite". Isso interrompe o fluxo, quebra o raciocínio e gera estresse de entrega.

O **Claude Operational HUD** inverte essa lógica. Ele transforma o limite abstrato da Anthropic em um **recurso alocável**. Através da métrica exclusiva de **COT (Cota Diária)**, você deixa de esperar pelos resets semanais para se tornar o gestor do seu próprio fluxo de trabalho. Se você está dentro da cota diária, você tem a garantia de combustível para a semana toda.

---

## 🧭 Sumário
1. [Principais Diferenciais](#-principais-diferenciais)
2. [Instalação](#-instalação)
3. [Setup Inicial](#-setup-inicial-wizard)
4. [Manual de Voo (Comandos)](#-manual-de-voo-comandos)
5. [A Ciência por trás do HUD](#-a-ciência-por-trás-do-hud)
6. [Segurança e Privacidade](#-segurança-e-privacidade)

---

## 🩸 Principais Diferenciais

* **Visão de Cockpit:** Interface neobrutalista (High-Contrast) projetada para estado de alerta e redução de carga cognitiva (ADHD-friendly).
* **Métrica COT (Daily Quota):** O HUD divide seu limite semanal em 7 partes, criando um orçamento diário seguro.
* **Update Checker via SemVer:** Sistema inteligente que avisa sobre novas melhorias no firmware sem atrasar o boot.
* **Resiliência Nativa:** Telemetria com rescan automático e recuperação de sessão (Auto-Recovery) em caso de erro 403.

---

## 📦 Instalação

### Fast Track (Recomendado)
Para usuários que desejam apenas a ferramenta operacional pronta para uso:

```bash
npm install -g @igorcol/claude-stats
```

### Engineer Track (Desenvolvedores)
Para quem deseja buildar a partir do código-fonte ou contribuir com o laboratório:

```bash
git clone https://github.com/igorcol/claude-stats-cli.git
cd claude-stats-cli
npm install
npm run build
npm link
```

---

## 🛠️ Setup Inicial (Wizard)

Diferente de scripts genéricos, você não precisa editar arquivos JSON. O HUD possui um assistente de configuração interativo:

```bash
stats --setup
```

**Como obter sua Session Key:**
1. Acesse [Claude.ai](https://claude.ai) e faça login.
2. Pressione `F12` -> `Application` -> `Cookies`.
3. Procure pelo valor de `sessionKey` (começa com `sk-ant-sid...`).

---

## 🎮 Manual de Voo (Comandos)

O HUD utiliza um motor de triagem de comandos profissional para garantir que você tenha a informação exata no momento certo.

| Comando | Descrição |
| :--- | :--- |
| `stats` | Inicia a telemetria em tempo real (Loop de 60s). |
| `stats --once` | Realiza um scan único e encerra. |
| `stats --guide` | Explica o que significa cada métrica exibida. |
| `stats --changelog`| Exibe as novidades da versão atual. |
| `stats --update` | Verifica manualmente se há novos updates. |
| `stats --setup` | Força a reconfiguração da chave de acesso. |
| `stats --reset` | Destrói as configurações e limpa o sistema. |
| `stats --help` | Exibe o mapa de comandos. |

---

## 🧪 A Ciência por trás do HUD

O HUD não apenas lê dados; ele interpreta sua **Saúde de Ciclo**. 

* **COT (Daily Limit):** Nossa engine analisa sua fonte de oportunidade. Se você gastar mais que 1/7 do seu limite semanal hoje, o HUD entrará em estado de alerta, sugerindo que você priorize tarefas críticas.
* **Pace (Ritmo):** Uma comparação em tempo real entre seu uso real e o uso ideal. Se o seu ritmo estiver "STABLE", você está operando na zona de alta performance.

---

## 🛡️ Segurança e Privacidade

Sua **sessionKey** é tratada como um segredo de estado.
1. **Local-Only:** Suas credenciais são armazenadas localmente em `~/.claude_stats_config.json`.
2. **Zero Analytics:** Não rastreamos seu uso. A comunicação é feita exclusivamente entre seu terminal e os endpoints oficiais da Anthropic.

---

## 📡 Comunidade e Suporte

Desenvolvido por **Igor Colombini**. 
Se este projeto te ajuda, considere deixar uma ⭐ no repositório.

**[GitHub](https://github.com/igorcol) | [LinkedIn](https://linkedin.com/in/igorcolombini) | [Instagram](https://instagram.com/igorcolombini)**