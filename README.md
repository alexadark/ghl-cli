# GHL CLI

Command-line interface for GoHighLevel API v2. JSON output by default, pipe-friendly, built for AI agents and power users.

**17 command domains** | **80+ operations** | Works with Claude Code, scripts, and CI/CD pipelines.

## Install

```bash
npm install -g @alexadark/ghl-cli
```

Or clone and link locally:

```bash
git clone https://github.com/alexadark/ghl-cli.git
cd ghl-cli
npm install && npx tsc
npm link
```

## Setup

### Option 1: Config file

```bash
ghl config set token <your-ghl-api-token>
ghl config set location <your-location-id>
ghl config show   # verify
```

### Option 2: Environment variables

```bash
export GHL_PRIVATE_TOKEN=your-token
export GHL_LOCATION_ID=your-location-id
```

### Getting your credentials

1. **API Token**: GHL Settings > Business Profile > API Key (or create a Private Integration app)
2. **Location ID**: GHL Settings > Business Profile > scroll to "Company ID"

## Output modes

Every command outputs **JSON by default** (ideal for piping to `jq` or other tools).

```bash
ghl contacts list                  # JSON output
ghl contacts list | jq '.[].email' # pipe to jq
```

Add `--json` explicitly when needed (some commands default to table format for readability).

---

## Command Reference

### Contacts

Manage contacts (leads, clients, prospects).

```bash
# List & Search
ghl contacts list                              # List all contacts
ghl contacts list -q "john"                    # Search by name/email/phone
ghl contacts list -l 50                        # Limit results (default: 25)
ghl contacts list --after <id>                 # Paginate (start after ID)

# CRUD
ghl contacts get <id>                          # Get contact details
ghl contacts create --email john@doe.com --firstName John --lastName Doe
ghl contacts create --email j@d.com --phone "+1234567890" --tags "lead,webinar"
ghl contacts update <id> --phone "+1234567890" --firstName "Jonathan"
ghl contacts delete <id>

# Upsert (create or update - matches on email/phone)
ghl contacts upsert --email john@doe.com --firstName John --tags "client,premium"

# Tags
ghl contacts tag <id> --add "vip,client"       # Add tags
ghl contacts tag <id> --add "vip" --remove "lead"  # Add and remove in one call

# Notes
ghl contacts note <id>                         # List all notes
ghl contacts note <id> --add "Called today, interested in premium plan"

# Tasks
ghl contacts tasks <id>                        # List tasks for a contact
ghl contacts tasks <id> --add "Follow up call" --due "2026-03-15"
ghl contacts tasks <id> --add "Send proposal" --description "Include pricing for Premium tier"
```

### Opportunities (Sales Pipeline)

Track deals through pipeline stages.

```bash
# Search & Filter
ghl opp search                                 # List all opportunities
ghl opp search -q "acme"                       # Search by name
ghl opp search --pipeline <id>                 # Filter by pipeline
ghl opp search --status open                   # Filter: open|won|lost|abandoned|all

# CRUD
ghl opp get <id>
ghl opp create --name "Acme Corp Deal" --pipeline <pid> --contact <cid>
ghl opp create --name "Big Deal" --pipeline <pid> --contact <cid> --stage <sid> --value 5000
ghl opp update <id> --status won --value 7500
ghl opp delete <id>

# Pipelines
ghl opp pipeline                               # List all pipelines with stages
```

### Conversations

Manage conversations and send messages.

```bash
# Search
ghl conv search                                # List all conversations
ghl conv search -q "support"                   # Search by keyword
ghl conv search --status unread                # Filter: all|read|unread|starred|recents
ghl conv search --contact <id>                 # Filter by contact

# Messages
ghl conv messages <conversationId>             # Get messages (default: 20)
ghl conv messages <id> -l 50                   # Get more messages

# Send messages
ghl conv send --contact <id> --message "Hello!"                           # SMS (default)
ghl conv send --contact <id> --type email --subject "Follow up" --message "<p>Hi there</p>"
```

### Calendar

Manage calendars, appointments, and availability.

```bash
# Calendars
ghl cal list                                   # List all calendars

# Events
ghl cal events <calendarId>                    # List events
ghl cal events <calId> --start 2026-03-01 --end 2026-03-31

# Free slots (availability)
ghl cal slots <calId> --start 2026-03-12 --end 2026-03-15 --duration 30
ghl cal slots <calId> --start 2026-03-12 --end 2026-03-15 --duration 60 --timezone "America/New_York"

# Book appointments
ghl cal book --calendar <calId> --contact <cid> --title "Kickoff Call" \
  --start "2026-03-13T10:00:00" --end "2026-03-13T10:30:00"
ghl cal book --calendar <calId> --contact <cid> --title "Discovery" \
  --start "2026-03-14T14:00:00" --end "2026-03-14T15:00:00" --timezone "Europe/Paris"

# Cancel
ghl cal cancel <appointmentId>
```

### Invoices

Create, send, and manage invoices.

```bash
# List & Filter
ghl inv list                                   # List all invoices
ghl inv list --status sent                     # Filter by status
ghl inv list --contact <id>                    # Filter by contact
ghl inv list -q "march"                        # Search

# CRUD
ghl inv get <id>
ghl inv create --contact <cid> --title "March Retainer" --currency USD
ghl inv create --contact <cid> --title "Project X" --due "2026-04-01"
ghl inv delete <id>

# Actions
ghl inv send <id>                              # Send by email
ghl inv send <id> --to "john@company.com" --subject "Your invoice"
ghl inv void <id>                              # Void an invoice
ghl inv record-payment <id> --amount 5000      # Record payment ($50.00, in cents)
ghl inv record-payment <id> --amount 5000 --method check --note "Check #1234"

# Utilities
ghl inv number                                 # Generate next invoice number
ghl inv templates                              # List invoice templates
```

### Estimates / Quotes

Create and send estimates (quotes/proposals).

```bash
ghl est list                                   # List all estimates
ghl est create --contact <cid> --title "Website Redesign Quote" --currency USD
ghl est create --contact <cid> --title "Q2 Retainer" --due "2026-04-15"
ghl est send <id>                              # Send by email
ghl est send <id> --to "john@company.com" --subject "Your quote is ready"
```

### Blog

Manage blog sites, posts, authors, and categories.

```bash
# Sites
ghl blog sites                                 # List blog sites

# Posts
ghl blog posts <siteId>                        # List posts
ghl blog post <postId>                         # Get a post
ghl blog post-create <siteId> --title "My Post" --content "<p>Hello world</p>"
ghl blog post-update <postId> --title "Updated Title"
ghl blog post-delete <postId>

# Metadata
ghl blog authors <siteId>                      # List authors
ghl blog categories <siteId>                   # List categories
```

### Social Media

Manage social media posts and connected accounts.

```bash
ghl social list                                # List social posts
ghl social get <id>                            # Get a post
ghl social create --type post --content "Hello from the CLI!"
ghl social delete <id>
ghl social accounts                            # List connected accounts
```

### Locations

Manage location settings, tags, custom fields, and templates.

```bash
# Location info
ghl loc get                                    # Get current location
ghl loc search                                 # Search locations

# Tags
ghl loc tags                                   # List all tags
ghl loc tag-create --name "Premium Client"     # Create a tag
ghl loc tag-delete <tagId>                     # Delete a tag

# Custom fields
ghl loc fields                                 # List custom fields
ghl loc fields --model contact                 # Filter by model (contact|opportunity|all)

# Custom values
ghl loc values                                 # List custom values

# Templates
ghl loc templates --originId <id>              # List templates
ghl loc templates --originId <id> --type sms   # Filter by type (sms|email|whatsapp)
```

### Workflows

```bash
ghl wf list                                    # List all workflows
```

### Surveys

```bash
ghl surveys list                               # List surveys
ghl surveys submissions <surveyId>             # Get survey submissions
```

### Products

Manage products, prices, collections, and inventory.

```bash
# Products
ghl prod list                                  # List products
ghl prod list -q "widget"                      # Search
ghl prod get <id>
ghl prod create --name "Consulting Hour" --description "1h session"
ghl prod update <id> --name "Premium Consulting Hour"
ghl prod delete <id>

# Prices
ghl prod prices <productId>                    # List prices
ghl prod price-create <productId> --name "Standard" --amount 9900    # $99.00 in cents
ghl prod price-create <productId> --name "Monthly" --amount 4900 --type recurring

# Collections
ghl prod collections                           # List collections
ghl prod collection-create --name "Services"

# Inventory
ghl prod inventory                             # List inventory
```

### Payments

View orders, transactions, subscriptions, and coupons.

```bash
# Orders
ghl pay orders                                 # List orders
ghl pay order <id>                             # Get order details

# Transactions
ghl pay transactions                           # List transactions
ghl pay transaction <id>                       # Get transaction details

# Subscriptions
ghl pay subscriptions                          # List subscriptions
ghl pay subscription <id>                      # Get subscription details

# Coupons
ghl pay coupons                                # List coupons
ghl pay coupon-create --name "Summer Sale" --code SUMMER20 --type percentage --value 20
```

### Media

Upload and manage files.

```bash
ghl media list                                 # List media files
ghl media upload <filePath>                    # Upload a file
ghl media delete <id>                          # Delete a file
```

### Emails

Manage email campaigns and templates.

```bash
ghl emails campaigns                           # List email campaigns
ghl emails templates                           # List email templates
```

### Custom Objects

Create custom data structures and records.

```bash
# Schemas
ghl obj schemas                                # List custom object schemas
ghl obj schema <key>                           # Get schema details

# Records
ghl obj records <schemaKey>                    # List records
ghl obj record <schemaKey> <id>                # Get a record
ghl obj record-create <schemaKey> --data '{"name":"Acme","industry":"SaaS"}'
ghl obj record-update <schemaKey> <id> --data '{"industry":"Fintech"}'
ghl obj record-delete <schemaKey> <id>
```

### Config

```bash
ghl config set token <value>                   # Set API token
ghl config set location <value>                # Set location ID
ghl config show                                # Show current config
```

---

## Piping & Scripting

JSON output works seamlessly with `jq` and shell scripts:

```bash
# Extract emails
ghl contacts list -q "john" | jq '.[].email'

# Count open deals
ghl opp search --status open | jq 'length'

# Total invoice amounts
ghl inv list | jq '[.[] | .total] | add'

# Find contacts with specific tag
ghl contacts list | jq '[.[] | select(.tags[] == "vip")]'

# Pipeline deals worth over $1000
ghl opp search | jq '[.[] | select(.monetaryValue > 1000)]'
```

## Multi-step workflows

Chain commands for complex operations:

```bash
# Onboard a client: create contact, tag, create deal
CONTACT=$(ghl contacts upsert --email "john@acme.com" --firstName John --lastName Smith --tags "client" | jq -r '.id')
ghl contacts note $CONTACT --add "New client onboarded via CLI"
ghl opp create --name "John Smith - Premium" --pipeline <pid> --contact $CONTACT --value 5000

# Find and follow up on stale deals
ghl opp search --status open | jq -r '.[] | select(.dateAdded < "2026-02-01") | .id' | while read id; do
  echo "Stale deal: $id"
done
```

## API Reference

- **Base URL**: `https://services.leadconnectorhq.com`
- **Auth**: Bearer token
- **Rate limits**: 100 requests/10s, 200K requests/day
- **[GoHighLevel API Docs](https://highlevel.stoplight.io/docs/integrations)**

## Aliases

| Full command | Alias |
|---|---|
| `ghl contacts` | `ghl contacts` |
| `ghl opportunities` | `ghl opp` |
| `ghl conversations` | `ghl conv` |
| `ghl calendar` | `ghl cal` |
| `ghl invoices` | `ghl inv` |
| `ghl estimates` | `ghl est` |
| `ghl products` | `ghl prod` |
| `ghl payments` | `ghl pay` |
| `ghl locations` | `ghl loc` |
| `ghl workflows` | `ghl wf` |

## License

MIT
