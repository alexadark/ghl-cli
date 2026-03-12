import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const invoicesCommand = new Command("invoices")
  .alias("inv")
  .description("Manage invoices");

invoicesCommand
  .command("list")
  .description("List invoices")
  .option("--status <status>", "Filter by status")
  .option("--contact <id>", "Filter by contact ID")
  .option("-q, --search <query>", "Search query")
  .option("-l, --limit <n>", "Limit results", "10")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      limit: opts.limit,
      offset: opts.offset,
    };
    if (opts.status) params.status = opts.status;
    if (opts.contact) params.contactId = opts.contact;
    if (opts.search) params.search = opts.search;
    const data = await client().listInvoices(params);
    print(data.invoices ?? data, opts);
  });

invoicesCommand
  .command("get <id>")
  .description("Get an invoice by ID")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const data = await client().getInvoice(id);
    print(data.invoice ?? data, opts);
  });

invoicesCommand
  .command("create")
  .description("Create a new invoice")
  .requiredOption("--contact <id>", "Contact ID")
  .requiredOption("--title <title>", "Invoice title")
  .option("--currency <code>", "Currency code", "USD")
  .option("--due <date>", "Due date (ISO 8601)")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      contactId: opts.contact,
      title: opts.title,
      currency: opts.currency,
    };
    if (opts.due) body.dueDate = opts.due;
    const data = await client().createInvoice(body);
    print(data.invoice ?? data, opts);
  });

invoicesCommand
  .command("send <id>")
  .description("Send an invoice by email")
  .option("--to <email>", "Recipient email")
  .option("--subject <subject>", "Email subject")
  .option("--message <text>", "Email message")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts.to) body.emailTo = opts.to;
    if (opts.subject) body.subject = opts.subject;
    if (opts.message) body.message = opts.message;
    const data = await client().sendInvoice(id, body);
    print(data, opts);
  });

invoicesCommand
  .command("delete <id>")
  .description("Delete an invoice")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const data = await client().deleteInvoice(id);
    print(data, opts);
  });

invoicesCommand
  .command("void <id>")
  .description("Void an invoice")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const data = await client().voidInvoice(id);
    print(data, opts);
  });

invoicesCommand
  .command("record-payment <id>")
  .description("Record a manual payment on an invoice")
  .requiredOption("--amount <cents>", "Amount in cents")
  .option("--method <method>", "Payment method (cash|check|other)", "cash")
  .option("--note <text>", "Payment note")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const body: Record<string, unknown> = {
      amount: Number(opts.amount),
      method: opts.method,
    };
    if (opts.note) body.notes = opts.note;
    const data = await client().recordPayment(id, body);
    print(data, opts);
  });

invoicesCommand
  .command("number")
  .description("Generate the next invoice number")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().generateInvoiceNumber();
    print(data, opts);
  });

invoicesCommand
  .command("templates")
  .description("List invoice templates")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = { limit: opts.limit };
    const data = await client().listInvoiceTemplates(params);
    print(data.templates ?? data, opts);
  });
