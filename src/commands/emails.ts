import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const emailsCommand = new Command("emails").description(
  "Manage email campaigns and templates",
);

emailsCommand
  .command("campaigns")
  .description("List email campaigns")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().getEmailCampaigns();
    print(data.campaigns ?? data, opts);
  });

emailsCommand
  .command("templates")
  .description("List email templates")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().getEmailTemplates();
    print(data.templates ?? data, opts);
  });

emailsCommand
  .command("template-create")
  .description("Create an email template")
  .requiredOption("--name <name>", "Template name")
  .requiredOption("--html <html>", "Template HTML content")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      name: opts.name,
      html: opts.html,
    };
    const data = await client().createEmailTemplate(body);
    print(data.template ?? data, opts);
  });

emailsCommand
  .command("template-delete <id>")
  .description("Delete an email template")
  .action(async (id) => {
    const data = await client().deleteEmailTemplate(id);
    print(data, {});
  });
