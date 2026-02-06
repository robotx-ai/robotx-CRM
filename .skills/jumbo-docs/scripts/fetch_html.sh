#!/usr/bin/env bash
set -euo pipefail

BASE="https://docs-jumbo.g-axon.work"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAGES="$ROOT/pages.txt"

OUT_HTML="$ROOT/.cache/html"
mkdir -p "$OUT_HTML"

echo "Downloading HTML from $BASE"
while IFS= read -r path; do
  [[ -z "$path" ]] && continue

  safe="$(echo "$path" | sed 's|^/||; s|/|__|g')"
  [[ -z "$safe" ]] && safe="__root"

  url="$BASE$path"
  out="$OUT_HTML/${safe}.html"

  echo "GET $url"
  curl -sL --retry 3 --retry-delay 1 "$url" -o "$out"
done < "$PAGES"

echo "Done: $OUT_HTML"
