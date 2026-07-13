import type { APIRoute } from "astro";
import { iconVersion } from "../utils/assetVersion";

// Generated so the icon URLs carry the build-time ?v=<hash> (see
// utils/assetVersion). Prerendered to /manifest.webmanifest in the static
// build. Root-absolute icon paths are safe because base is "/" on both
// deployments (astoria.app and meetup.astoria.app).
export const GET: APIRoute = () => {
  const v = iconVersion;
  const manifest = {
    name: "Astoria Tech Meetup",
    short_name: "Astoria Tech",
    description:
      "Upcoming and past events for the Astoria Tech Meetup community.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: `/icon-192.png?v=${v}`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `/icon-512.png?v=${v}`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `/icon-512.png?v=${v}`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { "content-type": "application/manifest+json" },
  });
};
