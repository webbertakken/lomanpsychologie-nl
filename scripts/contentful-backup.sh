#!/usr/bin/env bash
# Backs up the whole Contentful space before any change to live content:
#   1. a full management export (drafts, archived entries, asset files),
#   2. the exact live state as the website reads it (delivery API, all locales).
# Usage: scripts/contentful-backup.sh [backup-root]
# Reads CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN from .env.local and the
# management token from ~/.secrets/contentful-api-token.
set -euo pipefail
cd "$(dirname "$0")/.."

root="${1:-$HOME/Backups/contentful-lomanpsychologie}"
dir="$root/$(date -u +%Y-%m-%dT%H-%M-%SZ)"
env_value() { grep "^$1=" .env.local | cut -d= -f2- | tr -d '"'; }
space="$(env_value CONTENTFUL_SPACE_ID)"
delivery="$(env_value CONTENTFUL_ACCESS_TOKEN)"
management="$(cat "$HOME/.secrets/contentful-api-token")"

mkdir -p "$dir/management" "$dir/delivery"
chmod 700 "$root" "$dir"
echo "[backup] writing to $dir"

echo "[backup] 1/2 management export"
npx -y contentful-cli@4.0.14 space export --space-id "$space" --environment-id master \
  --management-token "$management" --include-drafts --include-archived --download-assets \
  --export-dir "$dir/management" --content-file space.json \
  --error-log-file "$dir/management/errors.log" > "$dir/management/export.log" 2>&1
grep -q "The export was successful" "$dir/management/export.log"

echo "[backup] 2/2 live state"
for kind in entries assets content_types locales; do
  skip=0
  part=0
  while :; do
    file="$dir/delivery/$kind-$part.json"
    curl -sf "https://cdn.contentful.com/spaces/$space/environments/master/$kind?access_token=$delivery&locale=*&limit=1000&skip=$skip" -o "$file" ||
      curl -sf "https://cdn.contentful.com/spaces/$space/environments/master/$kind?access_token=$delivery&limit=1000&skip=$skip" -o "$file"
    total=$(jq '.total // (.items | length)' "$file")
    count=$(jq '.items | length' "$file")
    skip=$((skip + count))
    part=$((part + 1))
    if [ "$count" -eq 0 ] || [ "$skip" -ge "$total" ]; then break; fi
  done
  echo "[backup] $kind: $skip"
done

chmod -R go-rwx "$dir"
jq -r '"[backup] export: \(.entries | length) entries, \(.assets | length) assets, \(.contentTypes | length) content types"' "$dir/management/space.json"
echo "$dir"
