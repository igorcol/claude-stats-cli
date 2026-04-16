// Tipagem
export interface UsageWindow {
  utilization: number;
  resets_at: string;
}

export interface ClaudeUsage {
  five_hour: UsageWindow;
  seven_day: UsageWindow;
}

export async function getClaudeUsage(sessionKey: string): Promise<ClaudeUsage> {
  const headers = {
    Cookie: `sessionKey=${sessionKey}`,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json",
    Referer: "https://claude.ai/chats",
    Origin: "https://claude.ai",
  };

  try {
    // ------- Busca a Org ID -------
    const orgsRes = await fetch("https://claude.ai/api/organizations", {
      headers,
    });

    if (!orgsRes.ok) {
      throw new Error(
        `Falha no Auth/Cloudflare (Orgs). Status: ${orgsRes.status}`,
      );
    }

    const orgs = await orgsRes.json();
    const targetOrg = orgs.find((org: { capabilities: string | string[]; }) =>
      org.capabilities.includes("claude_pro"),
    );

    if (!targetOrg) {
      throw new Error("Organização 'claude_pro' não encontrada na sua conta.");
    }

    // ------- Busca USAGE -------
    const usageRes = await fetch(
      `https://claude.ai/api/organizations/${targetOrg.uuid}/usage`,
      { headers },
    );

    if (!usageRes.ok) {
      throw new Error(
        `Falha no Cloudflare (Usage). Status: ${usageRes.status}`,
      );
    }

    const usageData = (await usageRes.json()) as ClaudeUsage;
    return usageData;
  } catch (error) {
    console.error("\x1b[31m[!] ERRO DE REDE OU AUTENTICAÇÃO:\x1b[0m");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
