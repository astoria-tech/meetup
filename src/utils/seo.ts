import type { CategorizedEvent, EventType } from "./meetupApi";
import { getEventsByType } from "./meetupApi";

export const SITE_NAME = "Astoria Tech Meetup";

// Link-share preview image (1200x630). Source: script/og/og-image.html,
// rendered by script/og/render-og-image.sh. Committed, not built.
export const OG_IMAGE = {
  path: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Astoria Tech Meetup: a packed room watching a talk in Astoria, Queens.",
};

export const SAME_AS = [
  "https://www.meetup.com/astoria-tech-meetup/",
  "https://discord.gg/fSjneA8qwh",
  "https://www.instagram.com/astoria.tech/",
  "https://github.com/astoria-tech",
];

/** Absolute URL on the site. Directory paths get a trailing slash, since that
 * is the form the static server answers with 200 (no-slash is a 301). */
export function absoluteUrl(site: URL | undefined, pathname: string): string {
  const base = site ?? new URL("https://meetup.astoria.app");
  let path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const last = path.split("/").pop() ?? "";
  if (!path.endsWith("/") && !last.includes(".")) path += "/";
  return new URL(path, base).toString();
}

export const EVENTS_PER_PAGE = 10;
export const EVENT_TYPES: EventType[] = ["mornings", "evenings", "hackathons"];

/** Number of past-event pages for a type, shared by the listing route and
 * the sitemap so the two can't drift. */
export function pastPageCount(events: CategorizedEvent[]): number {
  const now = new Date();
  const past = events.filter((e) => new Date(e.dateTime) < now);
  return Math.max(1, Math.ceil(past.length / EVENTS_PER_PAGE));
}

export async function eventTypePageCounts(): Promise<
  Record<EventType, number>
> {
  const counts = {} as Record<EventType, number>;
  for (const type of EVENT_TYPES) {
    counts[type] = pastPageCount(await getEventsByType(type));
  }
  return counts;
}

export function organizationJsonLd(site: URL | undefined) {
  return {
    "@type": "Organization",
    "@id": `${absoluteUrl(site, "/")}#organization`,
    name: SITE_NAME,
    url: absoluteUrl(site, "/"),
    logo: absoluteUrl(site, "/icon-512.png"),
    description:
      "Grassroots tech community in Astoria, Queens. Weekly morning coffee, monthly evening talks, and hackathons.",
    sameAs: SAME_AS,
  };
}

/** Strip markdown to a short plain-text summary. */
function plainSummary(markdown: string, max = 300): string {
  const text = markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`#>]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

/** schema.org Event, or null when the event has no physical location (Event
 * requires one). Only emitted for upcoming events. */
export function eventJsonLd(event: CategorizedEvent, site: URL | undefined) {
  const loc = event.location;
  if (!loc?.name) return null;
  return {
    "@type": "Event",
    name: event.title,
    startDate: event.dateTime,
    ...(event.endTime ? { endDate: event.endTime } : {}),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: event.eventUrl,
    description: plainSummary(event.description ?? ""),
    image: absoluteUrl(site, OG_IMAGE.path),
    location: {
      "@type": "Place",
      name: loc.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: loc.address,
        addressLocality: loc.city,
        addressRegion: loc.state,
        addressCountry: "US",
      },
    },
    organizer: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl(site, "/"),
    },
  };
}
