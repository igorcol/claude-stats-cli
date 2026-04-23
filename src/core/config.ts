// src/core/config.ts
import path from "path";
import os from "os";
import fs from "fs";
import { runWizard, Config } from "../ui/wizard";

export const CONFIG_PATH = path.join(os.homedir(), ".claude_stats_config.json");

export async function forceSetup(): Promise<Config> {
  return await runWizard(CONFIG_PATH);
}

export async function loadConfig(): Promise<Config> {
  if (!fs.existsSync(CONFIG_PATH)) {
    return await forceSetup();
  }
  const fileContent = fs.readFileSync(CONFIG_PATH, "utf-8");
  return JSON.parse(fileContent);
}