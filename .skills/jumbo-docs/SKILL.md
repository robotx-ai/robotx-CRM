---
name: jumbo-docs
description: Offline Jumbo Next.js docs. Use these references to implement layout, routing, auth, and Jumbo components correctly.
---

## Where the docs are
All synced docs are under:
- `.skills/jumbo-docs/references/jumbo/`

## When to use
Use this skill whenever implementing or modifying:
- Next.js App Router structure and layout (Jumbo 7.x)
- Authentication & authorization / route access arrays
- Jumbo UI components under `/components/*`
- Theme customization / sidebar menus

## How to use (important)
- Prefer reading the relevant markdown file(s) in `references/jumbo/**` instead of guessing.
- Only open the minimal set of pages needed for the current task.
- If a behavior is unclear, consult the references first, then implement.

## Updating the references
Run:
- `.skills/jumbo-docs/scripts/fetch_html.sh`
- `.skills/jumbo-docs/scripts/html_to_md.sh`
- `.skills/jumbo-docs/scripts/sync.sh`

## Trigger keywords
Use this skill when the task mentions:
- Jumbo, Jumbo Nextjs, Jumbo 7.x
- AppLayout, JumboLayout, JumboTheme, JumboConfigProvider
- routes/path.ts, publicPaths, anonymousPaths, middleware
- sidebar menus, theme customization

## Minimal reading strategy
- Start with the most relevant page only (one of structure/settings/components).
- Do not read the entire references folder unless necessary.