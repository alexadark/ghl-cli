import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const opportunitiesCommand = new Command("opportunities")
  .alias("opp")
  .description("Manage opportunities");

opportunitiesCommand
  .command("search")
  .description("Search opportunities")
  .option("-q, --query <query>", "Search query")
  .option("--pipeline <id>", "Pipeline ID filter")
  .option("--status <status>", "Status filter (open|won|lost|abandoned|all)")
  .option("-l, --limit <n>", "Limit results", "20")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = { limit: opts.limit };
    if (opts.query) params.q = opts.query;
    if (opts.pipeline) params.pipeline_id = opts.pipeline;
    if (opts.status) params.status = opts.status;
    const data = await client().searchOpportunities(params);
    print(data.opportunities ?? data, opts);
  });

opportunitiesCommand
  .command("get <id>")
  .description("Get an opportunity by ID")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const data = await client().getOpportunity(id);
    print(data.opportunity ?? data, opts);
  });

opportunitiesCommand
  .command("create")
  .description("Create a new opportunity")
  .requiredOption("--name <name>", "Opportunity name")
  .requiredOption("--pipeline <id>", "Pipeline ID")
  .requiredOption("--contact <id>", "Contact ID")
  .option("--stage <id>", "Pipeline stage ID")
  .option("--value <amount>", "Monetary value")
  .option("--status <status>", "Status (open|won|lost|abandoned)", "open")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      name: opts.name,
      pipelineId: opts.pipeline,
      contactId: opts.contact,
      status: opts.status,
    };
    if (opts.stage) body.pipelineStageId = opts.stage;
    if (opts.value) body.monetaryValue = Number(opts.value);
    const data = await client().createOpportunity(body);
    print(data.opportunity ?? data, opts);
  });

opportunitiesCommand
  .command("update <id>")
  .description("Update an opportunity")
  .option("--name <name>", "Opportunity name")
  .option("--stage <id>", "Pipeline stage ID")
  .option("--status <status>", "Status (open|won|lost|abandoned)")
  .option("--value <amount>", "Monetary value")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts.name) body.name = opts.name;
    if (opts.stage) body.pipelineStageId = opts.stage;
    if (opts.status) body.status = opts.status;
    if (opts.value) body.monetaryValue = Number(opts.value);
    const data = await client().updateOpportunity(id, body);
    print(data.opportunity ?? data, opts);
  });

opportunitiesCommand
  .command("delete <id>")
  .description("Delete an opportunity")
  .action(async (id) => {
    const data = await client().deleteOpportunity(id);
    print(data, {});
  });

opportunitiesCommand
  .command("pipeline")
  .description("List pipelines and stages")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().getPipelines();
    print(data.pipelines ?? data, opts);
  });
