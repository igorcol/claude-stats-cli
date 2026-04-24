import fs from 'fs';
import path from 'path';
import { APP_VERSION, COLORS } from '../utils/theme';

export function getLatestChangelog(): string | null {
  try {
    const changelogPath = path.join(__dirname, '../../CHANGELOG.md');
    if (!fs.existsSync(changelogPath)) return null;

    const content = fs.readFileSync(changelogPath, 'utf8');
    const lines = content.split('\n');
    const versionHeader = `## [${APP_VERSION}]`;
    let startIndex = lines.findIndex(line => line.startsWith(versionHeader));

    if (startIndex === -1) return null;

    let result = [];
    for (let i = startIndex + 1; i < lines.length; i++) {
      if (lines[i].startsWith('## ')) break;
      
      let line = lines[i].trim();
      if (line === "") continue;

      // 1. FORMATAR HEADERS (Added, Fixed, etc)
      if (line.startsWith('### Added')) line = `\n${COLORS.MAGENTA}✨ Added${COLORS.RESET}`;
      else if (line.startsWith('### Fixed')) line = `\n${COLORS.CYAN}🛠️  Fixed${COLORS.RESET}`;
      else if (line.startsWith('### Changed')) line = `\n${COLORS.YELLOW}🔄 Changed${COLORS.RESET}`;
      else if (line.startsWith('### Known Issues')) line = `\n${COLORS.RED_BOLD}⚠️  Known Issues${COLORS.RESET}`;

      // 2. POLIR NEGRITOS (**texto** -> Cor Branca Negrito)
      // O Regex abaixo encontra o que está entre ** e substitui pelas cores do seu tema
      line = line.replace(/\*\*(.*?)\*\*/g, `${COLORS.WHITE_BOLD}$1${COLORS.RESET}${COLORS.GRAY}`);

      // 3. POLIR INLINE CODE (`codigo` -> Cor Cyan)
      line = line.replace(/`(.*?)`/g, `${COLORS.CYAN}$1${COLORS.RESET}${COLORS.GRAY}`);

      // 4. FORMATAR LISTAS (- item ->  • item)
      if (line.startsWith('- ')) {
        line = `${COLORS.GRAY} • ${line.substring(2)}${COLORS.RESET}`;
      }

      result.push(line);
    }

    return result.join('\n');
  } catch {
    return null;
  }
}