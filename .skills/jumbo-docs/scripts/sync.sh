#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAGES="$ROOT/pages.txt"
IN_MD="$ROOT/.cache/md"
REF="$ROOT/references/jumbo"

mkdir -p "$REF"/{get-started,structure,settings,components,root}

while IFS= read -r path; do
  [[ -z "$path" ]] && continue

  safe="$(echo "$path" | sed 's|^/||; s|/|__|g')"
  [[ -z "$safe" ]] && safe="__root"

  src="$IN_MD/${safe}.md"
  [[ ! -f "$src" ]] && continue

  case "$path" in
    /get-started/*)  dst="$REF/get-started/${safe}.md" ;;
    /structure/*)    dst="$REF/structure/${safe}.md" ;;
    /settings/*)     dst="$REF/settings/${safe}.md" ;;
    /components/*)   dst="$REF/components/${safe}.md" ;;
    /)               dst="$REF/root/__root.md" ;;
    *)               dst="$REF/root/${safe}.md" ;;
  esac

  cp "$src" "$dst"
done < "$PAGES"

echo "Synced to: $REF"
