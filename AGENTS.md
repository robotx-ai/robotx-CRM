# Repo instructions for Codex

## Always
- Before making Jumbo (Jumbo Next.js / Jumbo components / layout / theme / auth) changes, consult the offline docs:
  `.skills/jumbo-docs/references/jumbo/**`
- Prefer references over guesses. If uncertain, search the references first.

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