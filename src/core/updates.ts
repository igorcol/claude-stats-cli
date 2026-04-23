import { APP_VERSION, COLORS } from "../utils/theme";

// URL Exemplo:
const REMOTE_PKG_URL = "https://raw.githubusercontent.com/igorcol/claude-stats-cli/main/package.json";
const CURRENT_VERSION = APP_VERSION; 

export async function checkForUpdates(): Promise<string | null> {
  try {
    // Timeout de 1.5s 
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);

    const response = await fetch(REMOTE_PKG_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) return null;

    const remotePkg = await response.json();
    const latestVersion = remotePkg.version;

    if (isNewer(latestVersion, CURRENT_VERSION)) {
      return latestVersion;
    }

    return null;
  } catch {
    // Falha silenciosa: se estiver sem rede ou der timeout, ignoramos.
    return null;
  }
}

/**
 * Comparador simples de SemVer (v1.2.3)
 */
function isNewer(remote: string, local: string): boolean {
  const r = remote.split('.').map(Number);
  const l = local.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (r[i] > l[i]) return true;
    if (r[i] < l[i]) return false;
  }
  return false;
}