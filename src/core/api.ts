// src/core/api.ts

export interface UsageWindow {
  utilization: number;
  resets_at: string;
}

export interface ClaudeUsage {
  five_hour: UsageWindow;
  seven_day: UsageWindow;
  account_alias: string;
  plan_tier: "PRO" | "FREE";
  organization_id: string; // Novo campo para persistência
}

/**
 * Busca os dados de utilização na Anthropic.
 * @param sessionKey Chave de sessão do usuário.
 * @param cachedOrg Objeto opcional contendo dados já salvos no .cfg para evitar requisições extras.
 */
export async function getClaudeUsage(
  sessionKey: string,
  cachedOrg?: { id: string; alias: string; tier: "PRO" | "FREE" }
): Promise<ClaudeUsage> {
  const headers = {
    Cookie: `sessionKey=${sessionKey}`,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json",
    Referer: "https://claude.ai/chats",
    Origin: "https://claude.ai",
  };

  let orgId = cachedOrg?.id;
  let accountAlias = cachedOrg?.alias;
  let planTier = cachedOrg?.tier;

  // ------- Lógica de Orquestração (Cache vs Network) -------
  
  // Se não temos o ID no cache, precisamos descobrir quem é o usuário
  if (!orgId || !accountAlias || !planTier) {
    const orgsRes = await fetch("https://claude.ai/api/organizations", {
      headers,
    });

    if (!orgsRes.ok) {
      throw new Error(`AUTH_EXPIRED:${orgsRes.status}`);
    }

    const orgs = await orgsRes.json();

    // Priorização de Organização: PRO > FREE > FIRST
    let targetOrg = orgs.find((org: any) =>
      org.capabilities.includes("claude_pro"),
    );
    if (!targetOrg) {
      targetOrg = orgs.find((org: any) => org.capabilities.includes("chat"));
    }
    if (!targetOrg && orgs.length > 0) {
      targetOrg = orgs[0];
    }

    if (!targetOrg) {
      throw new Error("Nenhuma organização válida encontrada na Anthropic.");
    }

    orgId = targetOrg.uuid;
    planTier = targetOrg.capabilities.includes("claude_pro") ? "PRO" : "FREE";
    accountAlias = (targetOrg.name || "").split("@")[0] || "operator";
  }

  // ------- Busca de Utilização Real -------
  const usageRes = await fetch(
    `https://claude.ai/api/organizations/${orgId}/usage`,
    { headers },
  );

  if (!usageRes.ok) {
    throw new Error(`Falha no Usage. Status: ${usageRes.status}`);
  }

  const usageData = await usageRes.json();

  return {
    ...usageData,
    account_alias: accountAlias,
    plan_tier: planTier,
    organization_id: orgId,
  } as ClaudeUsage;
}