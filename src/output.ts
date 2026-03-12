import chalk from "chalk";

type OutputFormat = "json" | "table";

const COLUMN_DEFS: Record<string, string[]> = {
  contacts: [
    "id",
    "contactName",
    "email",
    "phone",
    "type",
    "source",
    "tags",
    "dateAdded",
  ],
  opportunities: [
    "id",
    "name",
    "status",
    "monetaryValue",
    "pipelineStageId",
    "dateAdded",
  ],
  conversations: ["id", "contactId", "type", "lastMessageDate"],
  invoices: ["id", "name", "status", "total", "contactId", "dateAdded"],
  products: ["id", "name", "price", "currency", "dateAdded"],
  default: ["id", "name", "email", "status", "dateAdded"],
};

const truncate = (str: string, max: number): string =>
  str.length > max ? str.slice(0, max - 1) + "\u2026" : str;

const formatTable = (
  rows: Record<string, unknown>[],
  domain?: string,
): string => {
  if (rows.length === 0) return chalk.yellow("(no results)");

  const allKeys = Object.keys(rows[0]);
  const preferredKeys = COLUMN_DEFS[domain ?? "default"] ?? COLUMN_DEFS.default;
  const keys = preferredKeys.filter((k) => allKeys.includes(k));
  if (keys.length === 0) return JSON.stringify(rows, null, 2);

  const MAX_COL = 30;
  const formatted = rows.map((r) =>
    Object.fromEntries(
      keys.map((k) => {
        let val = r[k];
        if (Array.isArray(val)) val = val.join(", ");
        if (val instanceof Date) val = val.toISOString().slice(0, 10);
        if (typeof val === "string" && /^\d{4}-\d{2}-\d{2}T/.test(val))
          val = val.slice(0, 10);
        return [k, truncate(String(val ?? "-"), MAX_COL)];
      }),
    ),
  );

  const widths = keys.map((k) =>
    Math.min(
      MAX_COL,
      Math.max(k.length, ...formatted.map((r) => String(r[k]).length)),
    ),
  );

  const headerLine = keys
    .map((k, i) => chalk.bold.cyan(k.padEnd(widths[i])))
    .join("  ");
  const separator = widths.map((w) => chalk.dim("-".repeat(w))).join("  ");
  const body = formatted
    .map((r) => keys.map((k, i) => String(r[k]).padEnd(widths[i])).join("  "))
    .join("\n");

  const count = chalk.dim(
    `\n${rows.length} result${rows.length === 1 ? "" : "s"}`,
  );
  return `${headerLine}\n${separator}\n${body}${count}`;
};

const formatSingle = (data: Record<string, unknown>): string => {
  const lines: string[] = [];
  for (const [key, val] of Object.entries(data)) {
    if (val === null || val === undefined || val === "") continue;
    if (Array.isArray(val) && val.length === 0) continue;
    if (
      typeof val === "object" &&
      !Array.isArray(val) &&
      Object.keys(val as object).length === 0
    )
      continue;
    const display = Array.isArray(val) ? val.join(", ") : String(val);
    lines.push(`${chalk.cyan(key.padEnd(20))} ${display}`);
  }
  return lines.join("\n");
};

export const formatOutput = (
  data: unknown,
  format: OutputFormat = "table",
  domain?: string,
): string => {
  if (format === "json") {
    return JSON.stringify(data, null, 2);
  }
  if (Array.isArray(data)) {
    return formatTable(data, domain);
  }
  if (typeof data === "object" && data !== null) {
    return formatSingle(data as Record<string, unknown>);
  }
  return String(data);
};

export const print = (
  data: unknown,
  opts: { json?: boolean },
  domain?: string,
): void => {
  console.log(formatOutput(data, opts.json ? "json" : "table", domain));
};
