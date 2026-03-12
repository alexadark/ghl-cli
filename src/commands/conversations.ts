import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const conversationsCommand = new Command("conversations")
  .alias("conv")
  .description("Manage conversations");

conversationsCommand
  .command("search")
  .description("Search conversations")
  .option("-q, --query <query>", "Search query")
  .option(
    "--status <status>",
    "Filter (all|read|unread|starred|recents)",
    "all",
  )
  .option("--contact <id>", "Filter by contact ID")
  .option("-l, --limit <n>", "Limit results", "20")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      limit: opts.limit,
      status: opts.status,
    };
    if (opts.query) params.q = opts.query;
    if (opts.contact) params.contact_id = opts.contact;
    const data = await client().searchConversations(params);
    print(data.conversations ?? data, opts);
  });

conversationsCommand
  .command("messages <id>")
  .description("Get messages from a conversation")
  .option("-l, --limit <n>", "Number of messages", "20")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const data = await client().getConversation(id, { limit: opts.limit });
    print(data.messages ?? data, opts);
  });

conversationsCommand
  .command("send")
  .description("Send an SMS or email")
  .requiredOption("--contact <id>", "Contact ID")
  .requiredOption("--message <text>", "Message body")
  .option("--type <type>", "Message type (sms|email)", "sms")
  .option("--subject <subject>", "Email subject (for email type)")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const c = client();
    if (opts.type === "email") {
      const data = await c.sendEmail({
        contactId: opts.contact,
        subject: opts.subject || "(no subject)",
        html: opts.message,
      });
      print(data, opts);
    } else {
      const data = await c.sendSms({
        contactId: opts.contact,
        message: opts.message,
      });
      print(data, opts);
    }
  });
