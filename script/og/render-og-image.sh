#!/usr/bin/env bash
# Renders script/og/og-image.html to public/og-image.png (1200x630), the
# image every page advertises in og:image / twitter:image. Not part of the
# build: the PNG is committed. Re-run by hand after changing the template.
# Needs chromium (headless) and the repo's sharp devDependency (palette
# quantization keeps the photo-heavy PNG well under 300KB).
set -euo pipefail
cd "$(dirname "$0")/../.."

profile="$(mktemp -d /tmp/chromeprofile-meetup-og.XXXXXX)"
raw="$(mktemp /tmp/meetup-og-raw.XXXXXX.png)"
trap 'rm -rf "$profile" "$raw"' EXIT

# setsid + kill of the whole process group so no renderer/GPU children survive.
setsid chromium --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --allow-file-access-from-files \
  --user-data-dir="$profile" --window-size=1200,630 \
  --virtual-time-budget=4000 --screenshot="$raw" \
  "file://$PWD/script/og/og-image.html" >/dev/null 2>&1 &
pid=$!
wait "$pid" || true
kill -- -"$pid" 2>/dev/null || true

node -e '
const sharp = require("sharp");
sharp(process.argv[1])
  .resize(1200, 630)
  .png({ palette: true, quality: 90, effort: 10, compressionLevel: 9 })
  .toFile("public/og-image.png")
  .then((i) => console.log(`public/og-image.png ${i.width}x${i.height} ${i.size} bytes`));
' "$raw"
