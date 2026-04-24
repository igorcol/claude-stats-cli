// src/api.ts
export interface UsageWindow {
  utilization: number;
  resets_at: string;
}

export interface ClaudeUsage {
  five_hour: UsageWindow;
  seven_day: UsageWindow;
  account_alias: string;
  plan_tier: "PRO" | "FREE";
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
  const orgsRes = await fetch("https://claude.ai/api/organizations", {
    headers,
  });

  if (!orgsRes.ok) {
    // Mensagem padronizada para o Telemetry
    throw new Error(`AUTH_EXPIRED:${orgsRes.status}`);
  }

  const orgs = await orgsRes.json();

  // Prioridade para plano PRO
  let targetOrg = orgs.find((org: any) =>
    org.capabilities.includes("claude_pro"),
  );
  // Segunda opção: plano gratuito ('chat')
  if (!targetOrg) {
    targetOrg = orgs.find((org: any) => org.capabilities.includes("chat"));
  }
  // Fallback: Se tudo falhar pega a primeira da lista
  if (!targetOrg && orgs.length > 0) {
    targetOrg = orgs[0];
  }

  if (!targetOrg) {
    throw new Error("Nenhuma organização válida encontrada na Anthropic.");
  }

  // ------- Tratamento de Metadados -------
  const isPro = targetOrg.capabilities.includes("claude_pro");
  const planTier = isPro ? "PRO" : "FREE";

  // Transforma "nome@gmail.com's Organization" em "nome"
  const rawName = targetOrg.name || "";
  const accountAlias = rawName.split("@")[0] || "operator";

  // ------- Busca USAGE -------
  const usageRes = await fetch(
    `https://claude.ai/api/organizations/${targetOrg.uuid}/usage`,
    { headers },
  );

  if (!usageRes.ok) {
    throw new Error(`Falha no Usage. Status: ${usageRes.status}`);
  }

  const usageData = await usageRes.json();

  const payload = {
    ...usageData,
    account_alias: accountAlias,
    plan_tier: planTier,
  } as ClaudeUsage;

  return payload
  // try/catch removido para que o erro suba para o Setup ou Index.
}
