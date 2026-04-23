// src/api.ts
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

  // ------- Busca a Org ID -------
  const orgsRes = await fetch("https://claude.ai/api/organizations", { headers });

  if (!orgsRes.ok) {
    throw new Error(`Falha no Auth (Orgs). Status: ${orgsRes.status}`);
  }

  const orgs = await orgsRes.json();
  const targetOrg = orgs.find((org: any) =>
    org.capabilities.includes("claude_pro")
  );

  if (!targetOrg) {
    throw new Error("Organização 'claude_pro' não encontrada.");
  }

  // ------- Busca USAGE -------
  const usageRes = await fetch(
    `https://claude.ai/api/organizations/${targetOrg.uuid}/usage`,
    { headers }
  );

  if (!usageRes.ok) {
    throw new Error(`Falha no Usage. Status: ${usageRes.status}`);
  }

  return (await usageRes.json()) as ClaudeUsage;
  // try/catch removido para que o erro suba para o Setup ou Index.
}