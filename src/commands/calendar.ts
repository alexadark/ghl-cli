import { Command } from "commander";
import { GhlClient } from "../client.js";
import { getLocationId, getToken } from "../config.js";
import { print } from "../output.js";

const client = () => new GhlClient(getToken(), getLocationId());

export const calendarCommand = new Command("calendar")
  .alias("cal")
  .description("Manage calendars and appointments");

calendarCommand
  .command("list")
  .description("List calendars")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const data = await client().getCalendars();
    print(data.calendars ?? data, opts);
  });

calendarCommand
  .command("events <calendarId>")
  .description("List events for a calendar")
  .option("--start <date>", "Start date (ISO 8601)")
  .option("--end <date>", "End date (ISO 8601)")
  .option("-l, --limit <n>", "Limit results", "50")
  .option("--json", "Output raw JSON")
  .action(async (calendarId, opts) => {
    const params: Record<string, string> = { limit: opts.limit };
    if (opts.start) params.startDate = opts.start;
    if (opts.end) params.endDate = opts.end;
    const data = await client().getCalendarEvents(calendarId, params);
    print(data.events ?? data, opts);
  });

calendarCommand
  .command("slots <calendarId>")
  .description("Get free slots for a calendar")
  .requiredOption("--start <date>", "Start date (ISO 8601)")
  .requiredOption("--end <date>", "End date (ISO 8601)")
  .requiredOption("--duration <minutes>", "Slot duration in minutes")
  .option("--timezone <tz>", "Timezone")
  .option("--json", "Output raw JSON")
  .action(async (calendarId, opts) => {
    const body: Record<string, unknown> = {
      startDate: opts.start,
      endDate: opts.end,
      duration: Number(opts.duration),
    };
    if (opts.timezone) body.timezone = opts.timezone;
    const data = await client().getFreeSlots(calendarId, body);
    print(data.slots ?? data, opts);
  });

calendarCommand
  .command("book")
  .description("Book an appointment")
  .requiredOption("--calendar <id>", "Calendar ID")
  .requiredOption("--contact <id>", "Contact ID")
  .requiredOption("--title <title>", "Appointment title")
  .requiredOption("--start <date>", "Start time (ISO 8601)")
  .requiredOption("--end <date>", "End time (ISO 8601)")
  .option("--description <text>", "Description")
  .option("--timezone <tz>", "Timezone")
  .option("--json", "Output raw JSON")
  .action(async (opts) => {
    const body: Record<string, unknown> = {
      calendarId: opts.calendar,
      contactId: opts.contact,
      title: opts.title,
      startTime: opts.start,
      endTime: opts.end,
    };
    if (opts.description) body.description = opts.description;
    if (opts.timezone) body.timezone = opts.timezone;
    const data = await client().createAppointment(body);
    print(data.appointment ?? data, opts);
  });

calendarCommand
  .command("cancel <appointmentId>")
  .description("Cancel an appointment")
  .action(async (id) => {
    const data = await client().deleteAppointment(id);
    print(data, {});
  });
