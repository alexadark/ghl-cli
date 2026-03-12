# GHL CLI

CLI tool that wraps GoHighLevel's API v2 for terminal-based CRM operations. JSON output by default, pipe-friendly, built for AI agents and power users.

## Install

```bash
npm install -g @alexadark/ghl-cli
```

Or clone and link locally:

```bash
git clone https://github.com/alexadark/ghl-cli.git
cd ghl-cli
npm install
npm run build
npm link
```

## Setup

Configure your API token and location ID:

```bash
ghl config set token <your-ghl-api-token>
ghl config set location <your-location-id>
```

Or use environment variables:

```bash
export GHL_PRIVATE_TOKEN=your-token
export GHL_LOCATION_ID=your-location-id
```

Verify your config:

```bash
ghl config show
```

## Usage

Every command outputs JSON by default. Add `--pretty` for table-formatted output.

### Contacts

```bash
ghl contacts list                              # List all contacts
ghl contacts list -q "john" --pretty           # Search with table output
ghl contacts get <id>                          # Get a contact by ID
ghl contacts create --email john@doe.com --firstName John --lastName Doe
ghl contacts update <id> --phone "+1234567890"
ghl contacts delete <id>
ghl contacts tag <id> --add "vip,lead"         # Add tags
ghl contacts note <id> --add "Called today"    # Add a note
ghl contacts note <id>                         # List notes
```

### Opportunities

```bash
ghl opp search -q "deal"                       # Search opportunities
ghl opp get <id>                               # Get opportunity details
ghl opp create --name "New Deal" --pipelineId <pid> --stageId <sid>
ghl opp update <id> --status won
ghl opp delete <id>
ghl opp pipeline list                          # List pipelines
ghl opp pipeline get <id>                      # Get pipeline with stages
```

### Conversations

```bash
ghl conv search -q "support"                   # Search conversations
ghl conv messages <id>                         # Get messages in a conversation
ghl conv send <id> --type sms --message "Hello"
ghl conv send <id> --type email --message "Hi" --subject "Follow up"
```

### Calendar

```bash
ghl cal list                                   # List calendars
ghl cal events <calendarId>                    # List events
ghl cal slots <calendarId> --start 2026-03-12 --end 2026-03-15
ghl cal book <calendarId> --contactId <cid> --slot "2026-03-13T10:00:00"
ghl cal appointments                           # List appointments
ghl cal appointments get <id>
ghl cal appointments update <id> --status confirmed
```

### Invoices

```bash
ghl inv list                                   # List invoices
ghl inv get <id>
ghl inv create --name "March Invoice" --contactId <cid>
ghl inv update <id> --status sent
ghl inv send <id>
ghl inv delete <id>
```

### Blog

```bash
ghl blog sites                                 # List blog sites
ghl blog posts <siteId>                        # List posts for a site
ghl blog posts get <postId>
ghl blog posts create <siteId> --title "My Post" --content "<p>Hello</p>"
ghl blog posts update <postId> --title "Updated"
ghl blog posts delete <postId>
ghl blog authors <siteId>                      # List authors
ghl blog categories <siteId>                   # List categories
```

### Social Media

```bash
ghl social list                                # List social posts
ghl social get <id>
ghl social create --type post --content "Hello world"
ghl social delete <id>
ghl social accounts                            # List connected accounts
```

### Locations

```bash
ghl loc get                                    # Get current location
ghl loc tags                                   # List tags
ghl loc fields                                 # List custom fields
ghl loc field-values <fieldId>                 # List custom field values
ghl loc templates --type sms                   # List templates (sms|email)
```

### Workflows

```bash
ghl wf list                                    # List workflows
```

### Surveys

```bash
ghl surveys list                               # List surveys
ghl surveys submissions <id>                   # Get survey submissions
```

### Products

```bash
ghl prod list                                  # List products
ghl prod get <id>
ghl prod create --name "Widget" --price 2999   # Price in cents
ghl prod update <id> --name "Super Widget"
ghl prod delete <id>
ghl prod prices <productId>                    # List prices
ghl prod collections                           # List collections
ghl prod inventory <productId>                 # Get inventory
```

### Payments

```bash
ghl pay orders                                 # List orders
ghl pay orders get <id>
ghl pay transactions                           # List transactions
ghl pay subscriptions                          # List subscriptions
ghl pay coupons                                # List coupons
```

### Media

```bash
ghl media list                                 # List media files
ghl media upload <filePath>                    # Upload a file
ghl media delete <id>
```

### Emails

```bash
ghl emails campaigns                           # List email campaigns
ghl emails templates                           # List email templates
```

### Custom Objects

```bash
ghl obj schemas                                # List custom object schemas
ghl obj schemas get <schemaKey>
ghl obj records <schemaKey>                    # List records
ghl obj records get <schemaKey> <recordId>
ghl obj records create <schemaKey> --data '{"field":"value"}'
ghl obj records update <schemaKey> <recordId> --data '{"field":"new"}'
ghl obj records delete <schemaKey> <recordId>
```

## Pipe-Friendly

JSON output works with `jq` and other tools:

```bash
ghl contacts list -q "john" | jq '.[].email'
ghl opp search | jq '.[] | select(.status == "open")'
ghl inv list | jq '[.[] | .total] | add'
```

## API Reference

- Base URL: `https://services.leadconnectorhq.com`
- Auth: Bearer token
- Rate limits: 100 requests/10s, 200K requests/day
- [GoHighLevel API Docs](https://highlevel.stoplight.io/docs/integrations)

## License

MIT
