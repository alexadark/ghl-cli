import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const objectsCommand = new Command("objects")
  .alias("obj")
  .description("Manage custom objects");

objectsCommand
  .command("list")
  .description("List custom objects")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().listObjects();
    print(data.objects ?? data, opts);
  });

objectsCommand
  .command("schema <key>")
  .description("Get object schema by key")
  .option("--json", "Output raw JSON")
  .action(async (key, opts) => {
    const data = await client().getObjectSchema(key);
    print(data.schema ?? data, opts);
  });

objectsCommand
  .command("records <schemaKey>")
  .description("Search records for a schema")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (schemaKey, opts) => {
    const body: Record<string, unknown> = {
      locationId: getLocationId(),
      limit: parseInt(opts.limit),
      offset: parseInt(opts.offset),
    };
    const data = await client().searchObjectRecords(schemaKey, body);
    print(data.records ?? data, opts);
  });

objectsCommand
  .command("record-get <schemaKey> <recordId>")
  .description("Get a specific record")
  .option("--json", "Output raw JSON")
  .action(async (schemaKey, recordId, opts) => {
    const data = await client().getObjectRecord(schemaKey, recordId);
    print(data.record ?? data, opts);
  });

objectsCommand
  .command("record-create <schemaKey>")
  .description("Create a record")
  .requiredOption("--data <json>", "Record data as JSON string")
  .option("--json", "Output raw JSON")
  .action(async (schemaKey, opts) => {
    const recordData = JSON.parse(opts.data);
    const body: Record<string, unknown> = {
      locationId: getLocationId(),
      ...recordData,
    };
    const data = await client().createObjectRecord(schemaKey, body);
    print(data.record ?? data, opts);
  });

objectsCommand
  .command("record-delete <schemaKey> <recordId>")
  .description("Delete a record")
  .action(async (schemaKey, recordId) => {
    const data = await client().deleteObjectRecord(schemaKey, recordId);
    print(data, {});
  });
