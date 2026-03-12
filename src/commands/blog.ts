import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const blogCommand = new Command("blog").description("Manage blog posts");

blogCommand
  .command("sites")
  .description("List blog sites")
  .option("-q, --search <query>", "Search query")
  .option("-l, --limit <n>", "Limit results", "10")
  .option("-s, --skip <n>", "Skip results", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string | number> = {
      limit: opts.limit,
      skip: opts.skip,
    };
    if (opts.search) params.search = opts.search;
    const data = await client().getBlogSites(params);
    print(data, opts);
  });

blogCommand
  .command("posts <blogId>")
  .description("List posts for a blog")
  .option("-q, --search <query>", "Search query")
  .option("--status <status>", "Filter by status")
  .option("-l, --limit <n>", "Limit results", "10")
  .option("--offset <n>", "Offset results", "0")
  .option("--json", "Output raw JSON")
  .action(async (blogId, opts) => {
    const params: Record<string, string | number> = {
      limit: opts.limit,
      offset: opts.offset,
    };
    if (opts.search) params.search = opts.search;
    if (opts.status) params.status = opts.status;
    const data = await client().getBlogPosts(blogId, params);
    print(data, opts);
  });

blogCommand
  .command("create")
  .description("Create a blog post")
  .requiredOption("--blogId <id>", "Blog ID")
  .requiredOption("--title <title>", "Post title")
  .option("--content <content>", "Post content")
  .option("--status <status>", "Post status")
  .option("--slug <slug>", "Post slug")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      blogId: opts.blogId,
      title: opts.title,
    };
    if (opts.content) body.content = opts.content;
    if (opts.status) body.status = opts.status;
    if (opts.slug) body.slug = opts.slug;
    const data = await client().createBlogPost(body);
    print(data, opts);
  });

blogCommand
  .command("update <postId>")
  .description("Update a blog post")
  .option("--title <title>", "Post title")
  .option("--content <content>", "Post content")
  .option("--status <status>", "Post status")
  .option("--json", "Output raw JSON")
  .action(async (postId, opts) => {
    const body: Record<string, unknown> = {};
    if (opts.title) body.title = opts.title;
    if (opts.content) body.content = opts.content;
    if (opts.status) body.status = opts.status;
    const data = await client().updateBlogPost(postId, body);
    print(data, opts);
  });

blogCommand
  .command("authors")
  .description("List blog authors")
  .option("-l, --limit <n>", "Limit results", "10")
  .option("--offset <n>", "Offset results", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string | number> = {
      limit: opts.limit,
      offset: opts.offset,
    };
    const data = await client().getBlogAuthors(params);
    print(data, opts);
  });

blogCommand
  .command("categories")
  .description("List blog categories")
  .option("-l, --limit <n>", "Limit results", "10")
  .option("--offset <n>", "Offset results", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string | number> = {
      limit: opts.limit,
      offset: opts.offset,
    };
    const data = await client().getBlogCategories(params);
    print(data, opts);
  });
