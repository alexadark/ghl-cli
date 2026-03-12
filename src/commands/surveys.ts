import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const surveysCommand = new Command("surveys").description(
  "Manage surveys",
);

surveysCommand
  .command("list")
  .description("List surveys")
  .option("--type <type>", "Survey type")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("-s, --skip <n>", "Skip results", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string | number> = {
      locationId: getLocationId(),
      limit: opts.limit,
      skip: opts.skip,
    };
    if (opts.type) params.type = opts.type;
    const data = await client().getSurveys(params);
    print(data, opts);
  });

surveysCommand
  .command("submissions")
  .description("Get survey submissions")
  .option("--surveyId <id>", "Survey ID")
  .option("-q, --query <query>", "Search query")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--page <n>", "Page number", "1")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string | number> = {
      locationId: getLocationId(),
      limit: opts.limit,
      page: opts.page,
    };
    if (opts.surveyId) params.surveyId = opts.surveyId;
    if (opts.query) params.q = opts.query;
    const data = await client().getSurveySubmissions(params);
    print(data, opts);
  });
