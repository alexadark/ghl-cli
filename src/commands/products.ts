import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const productsCommand = new Command("products")
  .alias("prod")
  .description("Manage products");

productsCommand
  .command("list")
  .description("List products")
  .option("-q, --search <query>", "Search query")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      limit: opts.limit,
      offset: opts.offset,
    };
    if (opts.search) params.search = opts.search;
    const data = await client().listProducts(params);
    print(data.products ?? data, opts);
  });

productsCommand
  .command("get <id>")
  .description("Get a product by ID")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const data = await client().getProduct(id);
    print(data.product ?? data, opts);
  });

productsCommand
  .command("create")
  .description("Create a new product")
  .requiredOption("--name <name>", "Product name")
  .option("--description <desc>", "Product description")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      name: opts.name,
      locationId: getLocationId(),
    };
    if (opts.description) body.description = opts.description;
    const data = await client().createProduct(body);
    print(data.product ?? data, opts);
  });

productsCommand
  .command("update <id>")
  .description("Update a product")
  .option("--name <name>", "Product name")
  .option("--description <desc>", "Product description")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const body: Record<string, unknown> = {};
    if (opts.name) body.name = opts.name;
    if (opts.description) body.description = opts.description;
    const data = await client().updateProduct(id, body);
    print(data.product ?? data, opts);
  });

productsCommand
  .command("delete <id>")
  .description("Delete a product")
  .action(async (id) => {
    const data = await client().deleteProduct(id);
    print(data, {});
  });

productsCommand
  .command("prices <productId>")
  .description("List prices for a product")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (productId, opts) => {
    const params: Record<string, string> = {
      limit: opts.limit,
      offset: opts.offset,
    };
    const data = await client().listPrices(productId, params);
    print(data.prices ?? data, opts);
  });

productsCommand
  .command("price-create <productId>")
  .description("Create a price for a product")
  .requiredOption("--name <name>", "Price name")
  .requiredOption("--amount <cents>", "Amount in cents")
  .option("--currency <code>", "Currency code", "USD")
  .option("--type <type>", "Price type (one_time|recurring)", "one_time")
  .option("--json", "Output raw JSON")
  .action(async (productId, opts) => {
    const body: Record<string, unknown> = {
      name: opts.name,
      amount: Number(opts.amount),
      currency: opts.currency,
      type: opts.type,
    };
    const data = await client().createPrice(productId, body);
    print(data.price ?? data, opts);
  });

productsCommand
  .command("collection-create")
  .description("Create a product collection")
  .requiredOption("--name <name>", "Collection name")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = { name: opts.name };
    const data = await client().createProductCollection(body);
    print(data.collection ?? data, opts);
  });

productsCommand
  .command("collections")
  .description("List product collections")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      limit: opts.limit,
      offset: opts.offset,
    };
    const data = await client().listProductCollections(params);
    print(data.collections ?? data, opts);
  });

productsCommand
  .command("inventory")
  .description("List inventory")
  .option("-q, --search <query>", "Search query")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      limit: opts.limit,
      offset: opts.offset,
    };
    if (opts.search) params.search = opts.search;
    const data = await client().listInventory(params);
    print(data.inventory ?? data, opts);
  });
