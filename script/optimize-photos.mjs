#!/usr/bin/env node
// Reads originals from src/photos/events/**, writes web-optimized webp
// versions to public/images/carousel/. Skips files whose mtime hasn't
// changed since the existing output, so reruns are cheap.

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "src/photos/events";
const OUT_DIR = "public/images/carousel";
const TARGET_WIDTH = 960;
const QUALITY = 75;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });

  const sources = await walk(SRC_DIR);
  const expectedNames = new Set(
    sources.map((s) => path.basename(s).replace(/\.(jpe?g|png|webp)$/i, ".webp")),
  );

  let processed = 0;
  let skipped = 0;
  for (const src of sources) {
    const outName = path.basename(src).replace(/\.(jpe?g|png|webp)$/i, ".webp");
    const out = path.join(OUT_DIR, outName);

    try {
      const [srcStat, outStat] = await Promise.all([
        fs.stat(src),
        fs.stat(out).catch(() => null),
      ]);
      if (outStat && outStat.mtimeMs >= srcStat.mtimeMs) {
        skipped++;
        continue;
      }
    } catch {
      // fall through to processing
    }

    await sharp(src)
      .rotate()
      .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(out);
    processed++;
  }

  // Remove orphans whose source no longer exists
  const existing = await fs.readdir(OUT_DIR);
  let removed = 0;
  for (const name of existing) {
    if (!expectedNames.has(name)) {
      await fs.unlink(path.join(OUT_DIR, name));
      removed++;
    }
  }

  console.log(
    `optimize-photos: ${processed} processed, ${skipped} cached, ${removed} removed`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
