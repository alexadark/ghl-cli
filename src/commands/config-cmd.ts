import { Command } from "commander";
import { loadConfig, saveConfig } from "../config.js";

export const configCommand = new Command("config").description(
  "Manage GHL CLI configuration",
);

configCommand
  .command("set <key> <value>")
  .description("Set a config value (token, location)")
  .action((key: string, value: string) => {
    const config = loadConfig();
    if (key === "token") {
      config.token = value;
    } else if (key === "location") {
      config.locationId = value;
    } else {
      console.error(`Unknown key: ${key}. Use 'token' or 'location'.`);
      process.exit(1);
    }
    saveConfig(config);
    console.log(`${key} saved.`);
  });

configCommand
  .command("show")
  .description("Show current configuration")
  .action(() => {
    const config = loadConfig();
    console.log(
      JSON.stringify(
        {
          token: config.token ? `${config.token.slice(0, 8)}...` : "(not set)",
          locationId: config.locationId || "(not set)",
        },
        null,
        2,
      ),
    );
  });
