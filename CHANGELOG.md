# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## Added:
- **Busca dinamica por organização** - Antes lia apenas plano pro, agora inclui plano gratuito.


## [1.0.0-beta.3.2]

### Fixed:
- **HOTFIX: Comando de update errado corrigido**

## [1.0.0-beta.3.1]

### Changed:
- **README.md oficial com guias de instalação e uso.**

## [1.0.0-beta.3]

### Added:
- **Flag `--guide` (ou `-g`) para instrução sobre os dados exibidos do scan.**
- **Flag `--changelog` (ou `-c`) exibe as alterações da versão instalada.**
- **Flag `--reset` (ou `-r`) para limpar a session key e arquivos de config.**
- **Flag `--update` (ou `-u`) para verificar se há atualizações pendentes.**
- **Update Log** - mostra o changelog da versão atual após uma atualização.


## [1.0.0-beta.2] - 2026-04-23

### Added
- **Core Engine:** Migração total do motor de .bat/.ps1 para TypeScript, garantindo maior estabilidade e tipagem estática.
- **CLI Command Registry:** Arquitetura modular para tratamento de flags (ex: `--setup`, `--once`, `--version`).
- **Métrica COT (Daily Quota):** Implementação do "Gerenciador de Orçamento de Produtividade", dividindo o limite semanal em cotas diárias seguras.
- **Auto-Recovery System:** Detector inteligente de expiração de sessão (Erro 403) com gatilho automático para o Wizard de configuração.
- **Wizard de Setup:** Interface interativa para configuração inicial da `sessionKey` com validação em tempo real.
- **Graceful Shutdown:** Interceptação de sinal `SIGINT` (Ctrl+C) para encerramento limpo do processo, evitando erros de memória no Windows.
- **Update Checker:** Sistema assíncrono em background para verificar novas versões via GitHub sem impactar o tempo de inicialização.
- **UI Neobrutalista:** Dashboard em High-Contrast com cores ANSI, focado em redução de carga cognitiva e alerta visual (TDAH-friendly).

### Changed
- Refatoração do fluxo de dados: agora o script localiza o UUID da organização `claude_pro` de forma dinâmica.
- Persistência de dados: migração do `claude_config.json` local para um arquivo de configuração global no diretório home do usuário.

### Known Issues (Working on for v1.0.0)
- **Flag --reset:** A rotina de limpeza de cache e arquivos de configuração local não possui implementação funcional.
- **Telemetry Loop:** O intervalo de auto-rescan de 60 segundos ainda não funciona.
- **Update Log:** Disponibilizar o changelod da versão atual através da flag --changelog ou --updates.

---
**Desenvolvido por Igor Colombini**