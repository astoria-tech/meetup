import { createHash } from "crypto";
import { readFileSync } from "fs";
import nodePath from "path";

// Build-time content hash of the PWA install icon, used to cache-bust the
// manifest + icon URLs on every icon change. Files in public/ keep stable
// names (Astro only content-hashes src/ assets), so their URLs would
// otherwise get stuck in the Cloudflare edge / browser / OS icon caches.
// Appending ?v=<hash> gives each new icon a fresh URL that busts all three.
export const iconVersion = createHash("md5")
  .update(readFileSync(nodePath.join(process.cwd(), "public/icon-512.png")))
  .digest("hex")
  .slice(0, 8);
