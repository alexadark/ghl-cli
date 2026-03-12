import { config as loadEnv } from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

loadEnv({ quiet: true });

const CONFIG_DIR = join(homedir(), ".ghl");
const CONFIG_FILE = join(CONFIG_DIR, "config.json");

interface GhlConfig {
  token?: string;
  locationId?: string;
}

export const loadConfig = (): GhlConfig => {
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
  } catch {
    return {};
  }
};

export const saveConfig = (config: GhlConfig): void => {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
};

export const getToken = (): string => {
  const token = process.env.GHL_PRIVATE_TOKEN || loadConfig().token;
  if (!token) {
    console.error(
      "No Private Integration Token. Set GHL_PRIVATE_TOKEN or run: ghl config set token <token>",
    );
    process.exit(1);
  }
  return token;
};

export const getLocationId = (): string => {
  const id = process.env.GHL_LOCATION_ID || loadConfig().locationId;
  if (!id) {
    console.error(
      "No location ID. Set GHL_LOCATION_ID or run: ghl config set location <id>",
    );
    process.exit(1);
  }
  return id;
};
