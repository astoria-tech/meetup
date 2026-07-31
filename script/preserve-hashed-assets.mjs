// Keep previously-built hashed assets alive across rebuilds.
//
// `astro build` wipes dist/ and emits content-hashed files (_astro/foo.<hash>.css).
// Any HTML still sitting in a browser or Cloudflare cache points at the PREVIOUS
// hash, so a rebuild that changes CSS makes those pages load with no styles at
// all (404 on the stylesheet). Cache headers (see http-routing's Caddyfile) stop
// stale HTML from being served, but they can't reach copies already cached; this
// keeps the old files on disk so those pages keep rendering until they expire.
//
// Runs LAST in the build, after jampack — restored files were already optimized
// by the build that produced them.

import fs from "node:fs";
import path from "node:path";

const DIST = "dist/_astro";
const CACHE = ".asset-cache";
const GRACE_DAYS = 30;

if (!fs.existsSync(DIST)) {
  console.error(
    `preserve-hashed-assets: ${DIST} missing — did the build fail?`,
  );
  process.exit(1);
}
fs.mkdirSync(CACHE, { recursive: true });

const now = Date.now();
const graceMs = GRACE_DAYS * 24 * 60 * 60 * 1000;
const built = new Set(fs.readdirSync(DIST));

// Every asset from this build goes into the cache, with its mtime bumped to now
// so the grace period counts from the last build that still referenced it.
for (const name of built) {
  const dest = path.join(CACHE, name);
  fs.copyFileSync(path.join(DIST, name), dest);
  fs.utimesSync(dest, new Date(now), new Date(now));
}

let restored = 0;
let pruned = 0;
for (const name of fs.readdirSync(CACHE)) {
  if (built.has(name)) continue; // superseded this build, already refreshed above
  const cached = path.join(CACHE, name);
  if (now - fs.statSync(cached).mtimeMs > graceMs) {
    fs.unlinkSync(cached); // older than any plausible cached HTML
    pruned++;
  } else {
    fs.copyFileSync(cached, path.join(DIST, name));
    restored++;
  }
}

console.log(
  `preserve-hashed-assets: ${built.size} current, ${restored} older restored, ${pruned} pruned (>${GRACE_DAYS}d)`,
);
