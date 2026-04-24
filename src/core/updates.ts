import { APP_VERSION } from "../utils/theme";
import semver from "semver"; // Importa o mestre das versões

const REMOTE_PKG_URL = "https://raw.githubusercontent.com/igorcol/claude-stats-cli/main/package.json";

export async function checkForUpdates(): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500).unref();

    // Adiciona um timestamp para burlar o cache do GitHub
    const response = await fetch(`${REMOTE_PKG_URL}?t=${Date.now()}`, { 
      signal: controller.signal 
    });
    
    clearTimeout(timeout);

    if (!response.ok) return null;

    const remotePkg = await response.json();
    const latestVersion = remotePkg.version;

    // semver.gt 
    if (semver.gt(latestVersion, APP_VERSION)) {
      return latestVersion;
    }

    return null;
  } 
  catch {
    return null;
  }
}