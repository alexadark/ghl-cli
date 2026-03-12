import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const socialCommand = new Command("social").description(
  "Manage social media posts",
);

socialCommand
  .command("list")
  .description("Search/list social posts")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().searchSocialPosts({});
    print(data, opts);
  });

socialCommand
  .command("post")
  .description("Create a social post")
  .requiredOption("--content <content>", "Post content")
  .option("--platforms <platforms>", "Comma-separated platform list")
  .option("--scheduleDate <date>", "Schedule date (ISO string)")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      locationId: getLocationId(),
      content: opts.content,
    };
    if (opts.platforms) body.platforms = opts.platforms.split(",");
    if (opts.scheduleDate) body.scheduleDate = opts.scheduleDate;
    const data = await client().createSocialPost(body);
    print(data, opts);
  });

socialCommand
  .command("get <postId>")
  .description("Get a social post by ID")
  .option("--json", "Output raw JSON")
  .action(async (postId, opts) => {
    const data = await client().getSocialPost(postId);
    print(data, opts);
  });

socialCommand
  .command("update <postId>")
  .description("Update a social post")
  .option("--content <content>", "Post content")
  .option("--json", "Output raw JSON")
  .action(async (postId, opts) => {
    const body: Record<string, unknown> = {};
    if (opts.content) body.content = opts.content;
    const data = await client().updateSocialPost(postId, body);
    print(data, opts);
  });

socialCommand
  .command("delete <postId>")
  .description("Delete a social post")
  .action(async (postId) => {
    const data = await client().deleteSocialPost(postId);
    print(data, {});
  });

socialCommand
  .command("accounts")
  .description("List social media accounts")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().getSocialAccounts();
    print(data, opts);
  });

socialCommand
  .command("schedule")
  .description("Create a scheduled social post")
  .requiredOption("--content <content>", "Post content")
  .requiredOption("--scheduleDate <date>", "Schedule date (ISO string)")
  .option("--platforms <platforms>", "Comma-separated platform list")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      locationId: getLocationId(),
      content: opts.content,
      scheduleDate: opts.scheduleDate,
    };
    if (opts.platforms) body.platforms = opts.platforms.split(",");
    const data = await client().createSocialPost(body);
    print(data, opts);
  });
