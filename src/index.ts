#!/usr/bin/env node
import { program } from "commander";
import { showBanner } from "./banner.js";
import { calendarCommand } from "./commands/calendar.js";
import { configCommand } from "./commands/config-cmd.js";
import { contactsCommand } from "./commands/contacts.js";
import { conversationsCommand } from "./commands/conversations.js";
import { invoicesCommand } from "./commands/invoices.js";
import { locationsCommand } from "./commands/locations.js";
import { opportunitiesCommand } from "./commands/opportunities.js";
import { socialCommand } from "./commands/social.js";
import { surveysCommand } from "./commands/surveys.js";
import { workflowsCommand } from "./commands/workflows.js";
import { blogCommand } from "./commands/blog.js";
import { productsCommand } from "./commands/products.js";
import { paymentsCommand } from "./commands/payments.js";
import { mediaCommand } from "./commands/media.js";
import { emailsCommand } from "./commands/emails.js";
import { objectsCommand } from "./commands/objects.js";

program
  .name("ghl")
  .description("GoHighLevel CLI — CRM operations from the terminal")
  .version("0.1.0");

// Show banner on `ghl` (no args) or `ghl --help`
const args = process.argv.slice(2);
const hasSubcommand = args.some((a) => !a.startsWith("-"));
if (!hasSubcommand) {
  showBanner();
}

program.addCommand(configCommand);
program.addCommand(contactsCommand);
program.addCommand(opportunitiesCommand);
program.addCommand(conversationsCommand);
program.addCommand(calendarCommand);
program.addCommand(invoicesCommand);
program.addCommand(blogCommand);
program.addCommand(socialCommand);
program.addCommand(locationsCommand);
program.addCommand(workflowsCommand);
program.addCommand(surveysCommand);
program.addCommand(productsCommand);
program.addCommand(paymentsCommand);
program.addCommand(mediaCommand);
program.addCommand(emailsCommand);
program.addCommand(objectsCommand);

program.parseAsync().catch((err) => {
  if (err.response?.data) {
    console.error(JSON.stringify(err.response.data, null, 2));
  } else {
    console.error(err.message || err);
  }
  process.exit(1);
});
