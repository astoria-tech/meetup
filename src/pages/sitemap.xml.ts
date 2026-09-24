import type { APIRoute } from "astro";
import { absoluteUrl, eventTypePageCounts } from "../utils/seo";

// Built with the site, so every rebuild (4h timer, RSVP trigger) refreshes it.
// Lists indexable pages only: redirect stubs (/discord, /donate, /intake) and
// the /styleguide dev page are left out on purpose. No <lastmod>: pages are
// re-baked from live event data on every build, so there is no honest per-page
// modification date to report.
const STATIC_PATHS = [
  "/",
  "/events/",
  "/sponsors/",
  "/links/",
  "/donations/",
  "/project-project/",
];

export const GET: APIRoute = async ({ site }) => {
  const paths = [...STATIC_PATHS];
  const pageCounts = await eventTypePageCounts();
  for (const [type, totalPages] of Object.entries(pageCounts)) {
    paths.push(`/events/${type}/`);
    for (let page = 2; page <= totalPages; page++) {
      paths.push(`/events/${type}/${page}/`);
    }
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    paths
      .map((p) => `  <url><loc>${absoluteUrl(site, p)}</loc></url>`)
      .join("\n") +
    `\n</urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
