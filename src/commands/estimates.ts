import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const estimatesCommand = new Command("estimates")
  .alias("est")
  .description("Manage estimates/quotes");

estimatesCommand
  .command("list")
  .description("List estimates")
  .option("-l, --limit <n>", "Limit results", "10")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      limit: opts.limit,
      offset: opts.offset,
    };
    const data = await client().listEstimates(params);
    print(data.estimates ?? data, opts);
  });

estimatesCommand
  .command("create")
  .description("Create an estimate")
  .requiredOption("--contact <id>", "Contact ID")
  .requiredOption("--title <title>", "Estimate title")
  .option("--currency <code>", "Currency code", "USD")
  .option("--due <date>", "Expiry date (ISO 8601)")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      contactId: opts.contact,
      title: opts.title,
      currency: opts.currency,
    };
    if (opts.due) body.expiryDate = opts.due;
    const data = await client().createEstimate(body);
    print(data.estimate ?? data, opts);
  });

estimatesCommand
  .command("send <id>")
  .description("Send an estimate by email")
  .option("--to <email>", "Recipient email")
  .option("--subject <subject>", "Email subject")
  .option("--message <text>", "Email message")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts.to) body.emailTo = opts.to;
    if (opts.subject) body.subject = opts.subject;
    if (opts.message) body.message = opts.message;
    const data = await client().sendEstimate(id, body);
    print(data, opts);
  });
