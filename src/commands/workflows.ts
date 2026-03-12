import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const workflowsCommand = new Command("workflows")
  .alias("wf")
  .description("Manage workflows");

workflowsCommand
  .command("list")
  .description("List workflows")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().getWorkflows();
    print(data, opts);
  });
