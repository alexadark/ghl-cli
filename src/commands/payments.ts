import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const paymentsCommand = new Command("payments")
  .alias("pay")
  .description("Manage payments");

paymentsCommand
  .command("orders")
  .description("List orders")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      altId: getLocationId(),
      altType: "location",
      limit: opts.limit,
      offset: opts.offset,
    };
    const data = await client().listOrders(params);
    print(data.orders ?? data, opts);
  });

paymentsCommand
  .command("order <id>")
  .description("Get an order by ID")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const params: Record<string, string> = {
      altId: getLocationId(),
      altType: "location",
    };
    const data = await client().getOrder(id, params);
    print(data.order ?? data, opts);
  });

paymentsCommand
  .command("transactions")
  .description("List transactions")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      altId: getLocationId(),
      altType: "location",
      limit: opts.limit,
      offset: opts.offset,
    };
    const data = await client().listTransactions(params);
    print(data.transactions ?? data, opts);
  });

paymentsCommand
  .command("transaction <id>")
  .description("Get a transaction by ID")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const params: Record<string, string> = {
      altId: getLocationId(),
      altType: "location",
    };
    const data = await client().getTransaction(id, params);
    print(data.transaction ?? data, opts);
  });

paymentsCommand
  .command("subscriptions")
  .description("List subscriptions")
  .option("-l, --limit <n>", "Limit results", "25")
  .option("--offset <n>", "Offset for pagination", "0")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      altId: getLocationId(),
      altType: "location",
      limit: opts.limit,
      offset: opts.offset,
    };
    const data = await client().listSubscriptions(params);
    print(data.subscriptions ?? data, opts);
  });

paymentsCommand
  .command("subscription <id>")
  .description("Get a subscription by ID")
  .option("--json", "Output raw JSON")
  .action(async (id, opts) => {
    const params: Record<string, string> = {
      altId: getLocationId(),
      altType: "location",
    };
    const data = await client().getSubscription(id, params);
    print(data.subscription ?? data, opts);
  });

paymentsCommand
  .command("coupons")
  .description("List coupons")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const params: Record<string, string> = {
      altId: getLocationId(),
      altType: "location",
    };
    const data = await client().listCoupons(params);
    print(data.coupons ?? data, opts);
  });

paymentsCommand
  .command("coupon-create")
  .description("Create a coupon")
  .requiredOption("--name <name>", "Coupon name")
  .requiredOption("--code <code>", "Coupon code")
  .option("--type <type>", "Discount type (percentage|fixed)", "percentage")
  .option("--value <value>", "Discount value")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      name: opts.name,
      code: opts.code,
      type: opts.type,
    };
    if (opts.value) body.value = parseFloat(opts.value);
    const data = await client().createCoupon(body);
    print(data.coupon ?? data, opts);
  });
