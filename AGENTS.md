# Repo instructions for Codex

## Always
- Before making Jumbo (Jumbo Next.js / Jumbo components / layout / theme / auth) changes, consult the offline docs:
  `.skills/jumbo-docs/references/jumbo/**`
- Prefer references over guesses. If uncertain, search the references first.

## Repo status (current)
- Main frontend workspace is `demo/` (Next.js + Jumbo + MUI).
- Sales Leads Management is implemented in:
  - `demo/src/app/[lang]/(common)/customerCenter/salesLeads/**`
  - `demo/src/components/SalesLeadDetail/**`
- Current sales leads schema uses:
  - `organization_name`, `customer_type`
  - `address`, `city`, `state`, `zip_code`
  - `referrer_name`, `referrer_phone`, `referrer_email`
  - expanded `lead_source` and `lead_status` options
  - legacy `location` has been replaced by structured address fields.

## When working on Jumbo
Use the `jumbo-docs` skill and cite the relevant reference file(s) in your reasoning/comments.

Common entry points:
- Structure/layout: `.skills/jumbo-docs/references/jumbo/structure/**`
- Auth & route access: `.skills/jumbo-docs/references/jumbo/settings/**`
- Components: `.skills/jumbo-docs/references/jumbo/components/**`
- Get started/setup: `.skills/jumbo-docs/references/jumbo/get-started/**`

## Updating docs
If references look stale or missing, run:
- `.skills/jumbo-docs/scripts/fetch_html.sh`
- `.skills/jumbo-docs/scripts/html_to_md.sh`
- `.skills/jumbo-docs/scripts/sync.sh`

## API development path (separate repo)
- Backend API repo path: `/Users/jasonliu/Github/robotx-CRM-api`
- Sales leads backend files are primarily:
  - `app/models/sales_leads.py`
  - `app/services/sales_leads.py`
  - `app/routers/sales_leads.py`
  - SQL scripts under `sql/`
- When a frontend sales-lead field/enum/filter changes, update both repos in the same task:
  1) `robotx-CRM-api` API models/services/routers
  2) `robotx-CRM` frontend pages/components
  3) DB migration scripts in both repos (`demo/supabase/migrations` and `robotx-CRM-api/sql`).

## Supabase access policy
- Agents are allowed to use `.env.local` credentials to access Supabase for migration and verification tasks.
- Preferred env source: `/Users/jasonliu/Github/robotx-CRM-api/.env.local`
  - `SUPABASE_PROJECT_REF`
  - `SUPABASE_DB_PASSWORD`
  - `SUPABASE_ACCESS_TOKEN` (if CLI is used)
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Never print secrets in outputs or commit credential files.
- Any DB mutation should be done via migration SQL files first, then applied to remote.
