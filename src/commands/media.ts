import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const mediaCommand = new Command("media").description(
  "Manage media files",
);

mediaCommand
  .command("list")
  .description("List media files")
  .option("--type <type>", "Filter by file type")
  .option("-q, --query <query>", "Search query")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      sortBy: "createdAt",
      sortOrder: "desc",
      altType: "location",
      altId: getLocationId(),
      limit: opts.limit,
      offset: opts.offset,
    };
    if (opts.type) params.type = opts.type;
    if (opts.query) params.query = opts.query;
    const data = await client().getMediaFiles(params);
    print(data.files ?? data, opts);
  });

mediaCommand
  .command("upload")
  .description("Upload a file from URL")
  .requiredOption("--url <url>", "File URL to upload")
  .option("--name <name>", "File name")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      hosted: true,
      fileUrl: opts.url,
    };
    if (opts.name) body.name = opts.name;
    const data = await client().uploadMediaFile(body);
    print(data, opts);
  });

mediaCommand
  .command("delete <id>")
  .description("Delete a media file")
  .action(async (id) => {
    const params: Record<string, string> = {
      altType: "location",
      altId: getLocationId(),
    };
    const data = await client().deleteMediaFile(id, params);
    print(data, {});
  });
