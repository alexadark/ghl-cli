import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const contactsCommand = new Command("contacts").description(
  "Manage contacts",
);

contactsCommand
  .command("list")
  .description("Search/list contacts")
  .option("-q, --query <query>", "Search query")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--after <id>", "Start after this contact ID (pagination)")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      limit: opts.limit,
    };
    if (opts.query) params.q = opts.query;
    if (opts.after) params.startAfterId = opts.after;
    const data = await client().searchContacts(params);
    print(data.contacts ?? data, opts, "contacts");
  });

contactsCommand
  .command("get <id>")
  .description("Get a contact by ID")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const data = await client().getContact(id);
    print(data.contact ?? data, opts, "contacts");
  });

contactsCommand
  .command("create")
  .description("Create a new contact")
  .requiredOption("--email <email>", "Email address")
  .option("--firstName <name>", "First name")
  .option("--lastName <name>", "Last name")
  .option("--phone <phone>", "Phone number")
  .option("--tags <tags>", "Comma-separated tags")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.email) body.email = opts.email;
    if (opts.firstName) body.firstName = opts.firstName;
    if (opts.lastName) body.lastName = opts.lastName;
    if (opts.phone) body.phone = opts.phone;
    if (opts.tags) body.tags = opts.tags.split(",");
    const data = await client().createContact(body);
    print(data.contact ?? data, opts, "contacts");
  });

contactsCommand
  .command("update <id>")
  .description("Update a contact")
  .option("--email <email>", "Email address")
  .option("--firstName <name>", "First name")
  .option("--lastName <name>", "Last name")
  .option("--phone <phone>", "Phone number")
  .option("--tags <tags>", "Comma-separated tags")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts.email) body.email = opts.email;
    if (opts.firstName) body.firstName = opts.firstName;
    if (opts.lastName) body.lastName = opts.lastName;
    if (opts.phone) body.phone = opts.phone;
    if (opts.tags) body.tags = opts.tags.split(",");
    const data = await client().updateContact(id, body);
    print(data.contact ?? data, opts, "contacts");
  });

contactsCommand
  .command("delete <id>")
  .description("Delete a contact")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const data = await client().deleteContact(id);
    print(data, opts);
  });

contactsCommand
  .command("tag <id>")
  .description("Add or remove tags on a contact")
  .requiredOption("--add <tags>", "Comma-separated tags to add")
  .option("--remove <tags>", "Comma-separated tags to remove")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    if (opts.add) {
      const data = await client().addContactTags(id, opts.add.split(","));
      print(data, opts);
    }
    if (opts.remove) {
      const data = await client().removeContactTags(id, opts.remove.split(","));
      print(data, opts);
    }
  });

contactsCommand
  .command("note <id>")
  .description("List or add notes on a contact")
  .option("--add <text>", "Add a note with this text")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    if (opts.add) {
      const data = await client().createContactNote(id, opts.add);
      print(data, opts);
    } else {
      const data = await client().getContactNotes(id);
      print(data.notes ?? data, opts);
    }
  });

contactsCommand
  .command("upsert")
  .description("Create or update a contact (matches on email/phone)")
  .requiredOption("--email <email>", "Email address")
  .option("--firstName <name>", "First name")
  .option("--lastName <name>", "Last name")
  .option("--phone <phone>", "Phone number")
  .option("--tags <tags>", "Comma-separated tags")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {};
    if (opts.email) body.email = opts.email;
    if (opts.firstName) body.firstName = opts.firstName;
    if (opts.lastName) body.lastName = opts.lastName;
    if (opts.phone) body.phone = opts.phone;
    if (opts.tags) body.tags = opts.tags.split(",");
    const data = await client().upsertContact(body);
    print(data.contact ?? data, opts, "contacts");
  });

contactsCommand
  .command("tasks <id>")
  .description("List or create tasks on a contact")
  .option("--add <title>", "Create a task with this title")
  .option("--due <date>", "Due date (ISO 8601)")
  .option("--description <text>", "Task description")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    if (opts.add) {
      const body: Record<string, unknown> = { title: opts.add };
      if (opts.due) body.dueDate = opts.due;
      if (opts.description) body.description = opts.description;
      const data = await client().createContactTask(id, body);
      print(data, opts);
    } else {
      const data = await client().getContactTasks(id);
      print(data.tasks ?? data, opts);
    }
  });
