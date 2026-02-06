#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IN_HTML="$ROOT/.cache/html"
OUT_MD="$ROOT/.cache/md"
mkdir -p "$OUT_MD"

for f in "$IN_HTML"/*.html; do
  base="$(basename "$f" .html)"
  pandoc "$f" -o "$OUT_MD/${base}.md"
done

echo "Done: $OUT_MD"
