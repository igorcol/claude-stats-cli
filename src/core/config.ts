// src/config.ts
import fs from "fs";
import path from "path";
import os from "os";
import { Config, runWizard } from "../ui/wizard";


const CONFIG_PATH = path.join(os.homedir(), ".claude_stats_config.json");

export async function loadConfig(): Promise<Config> {
  if (!fs.existsSync(CONFIG_PATH)) {
    return await runWizard(CONFIG_PATH);
  }

  try {
    const fileContent = fs.readFileSync(CONFIG_PATH, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    // Se o JSON estiver corrompido, dispara o setup de novo
    return await runWizard(CONFIG_PATH);
  }
}