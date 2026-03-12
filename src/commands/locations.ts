import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const locationsCommand = new Command("locations")
  .alias("loc")
  .description("Manage locations");

locationsCommand
  .command("get [id]")
  .description("Get a location (defaults to current locationId)")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const locationId = id || getLocationId();
    const data = await client().getLocation(locationId);
    print(data, opts);
  });

locationsCommand
  .command("search")
  .description("Search locations")
  .option("--email <email>", "Filter by email")
  .option("-l, --limit <n>", "Limit results", "10")
  .option("-s, --skip <n>", "Skip results", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string | number> = {
      limit: opts.limit,
      skip: opts.skip,
    };
    if (opts.email) params.email = opts.email;
    const data = await client().searchLocations(params);
    print(data, opts);
  });

locationsCommand
  .command("tags")
  .description("List location tags")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().getLocationTags(getLocationId());
    print(data, opts);
  });

locationsCommand
  .command("tag-create")
  .description("Create a location tag")
  .requiredOption("--name <name>", "Tag name")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().createLocationTag(getLocationId(), {
      name: opts.name,
    });
    print(data, opts);
  });

locationsCommand
  .command("tag-delete <tagId>")
  .description("Delete a location tag")
  .action(async (tagId) => {
    const data = await client().deleteLocationTag(getLocationId(), tagId);
    print(data, {});
  });

locationsCommand
  .command("fields")
  .description("List custom fields")
  .option("--model <model>", "Model type (contact|opportunity|all)")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {};
    if (opts.model) params.model = opts.model;
    const data = await client().getLocationCustomFields(
      getLocationId(),
      params,
    );
    print(data, opts);
  });

locationsCommand
  .command("values")
  .description("List custom values")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().getLocationCustomValues(getLocationId());
    print(data, opts);
  });

locationsCommand
  .command("templates")
  .description("List templates")
  .requiredOption("--originId <id>", "Origin ID")
  .option("--type <type>", "Template type (sms|email|whatsapp)")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string | number> = {
      originId: opts.originId,
      limit: opts.limit,
    };
    if (opts.type) params.type = opts.type;
    const data = await client().getLocationTemplates(getLocationId(), params);
    print(data, opts);
  });
