# Astoria Tech Meetup Website

## Overview

Astro-based static site for the Astoria Tech Meetup community, deployed at `astoria.app`. Showcases upcoming and past events fetched from the Meetup API.

## Tech Stack

- **Framework**: Astro 4.7.0 (Static Site Generator)
- **Styling**: TailwindCSS with custom themes
- **Typography**: Noto Sans + Playfair Display fonts
- **Content Source**: Meetup API (`meetup-api.astoria.app`) — no static content collections
- **Build Optimization**: Jampack for post-build optimization
- **Package Management**: npm

## Project Structure

```
├── src/
│   ├── components/         # Reusable Astro components
│   ├── layouts/            # Page layouts (Layout.astro, MainLayout.astro)
│   ├── pages/              # Route pages
│   ├── styles/             # CSS styling system
│   └── utils/              # Meetup API client, event formatting helpers
├── public/                 # Static assets (images, fonts, etc.)
└── archive/                # Archived assets (old content, photos, design files)
```

## Data Architecture

### Meetup API (`src/utils/meetupApi.ts`)

All event data comes from `meetup-api.astoria.app`:

- **`fetchMeetupEvents()`**: Fetches all upcoming + paginated past events, categorizes them
- **`getUpcomingEvents()`**: Returns future events sorted by date ascending
- **`getPastEvents(limit?)`**: Returns past events sorted by most recent first
- **`getEventsByType(type)`**: Filters events by category
- **`categorizeEvent()`**: Categorizes by title matching ("morning tech" → mornings, "meetup #" → evenings, "hackathon" → hackathons)

### Event Types

Three event categories with distinct visual styling:

- **Mornings** (☀️): Weekly Thursday morning coffee chats — orange theme
- **Evenings** (🌙): Monthly technical presentations — slate theme
- **Hackathons** (🚀): Focused building sessions — purple theme

### MeetupEvent Interface

```ts
{
  id, title, description, dateTime, endTime,
  location: { name, address, city, state },
  eventUrl, going, status: "ACTIVE" | "PAST"
}
```

## Components

- **EventCard.astro**: Main event display card with responsive layout, type badges, collapsible descriptions, RSVP/calendar buttons
- **ImageCarousel.astro**: Draggable photo film strip on homepage hero, auto-scrolls with momentum physics
- **Card.astro**: Base card layout wrapper
- **Footer.astro**: Site footer
- **Link.astro**: URL handling with base path support (`getLink()` helper)
- **ThemeToggle.astro**: Dark/light mode switcher

## Pages

- **`/`** — Homepage: hero section + image carousel + upcoming events + recent past events
- **`/events`** — Event types grid (mornings, evenings, hackathons, Project: Project)
- **`/events/[type]`** — Paginated event listing by type
- **`/sponsors`** — Sponsor information
- **`/links`** — Community links
- **`/donate`** — Redirect to Zeffy donation form
- **`/donations`** — Donation info, progress, and donor acknowledgments
- **`/discord`** — Discord redirect
- **`/project-project`** — Project: Project program details
- **`/intake`** — Speaker/talk intake form
- **`/styleguide`** — Design system reference

## Utility Functions (`src/utils/`)

### `eventFormatting.ts`

- **formatCompactDate()**: "Wed 9/28/25" format
- **formatTime()**: "6:30 PM" in America/New_York timezone
- **getGoogleCalendarLink()**: Google Calendar "Add to Calendar" URLs
- **renderMarkdown()**: Markdown → HTML via MarkdownIt
- **getPreviewText()**: First paragraph extraction
- **getEventEmoji()** / **getEventColors()**: Visual theming per event type

### `link.ts`

- Base path URL resolution

## Styling

- Green/emerald gradient background with wavy SVG pattern
- White/90 frosted glass header with sticky positioning
- Event cards: white with hover shadows, color-coded by type
- Mobile-first responsive design
- Noto Sans (body) + Playfair Display (headings)

## Development

```bash
npm run dev       # Local dev server
npm run build     # check + astro build + jampack optimization
npm run check     # Lint packages + prettier + astro check
npm run fix       # Auto-fix formatting
```

## Deployment

**`meetup.astoria.app` is the live home of this site.** The `astoria.app` apex now
issues a temporary 302 redirect to `meetup.astoria.app` (done in `http-routing`:
Caddy `redir`, apex DNS moved off GitHub Pages onto the Pi tunnel), freeing the apex
to become its own community resource later. The GitHub Pages build
(`.github/workflows/deploy.yml`, `CNAME` = astoria.app) still runs but no longer
serves the apex — it's effectively orphaned until repurposed or removed.

- **`meetup.astoria.app`** — self-hosted on the Pi (fleet at `~/projects/personal`),
  fronted by the `http-routing` Caddy + cloudflared tunnel. Served by a systemd
  unit (`systemd/meetup-web.service`) running `python3 -m http.server 8782
--bind 127.0.0.1` from `dist/`; Caddy reverse-proxies `meetup.astoria.app` →
  `127.0.0.1:8782`. Events come from `meetup-api.astoria.app` (also Pi-hosted;
  see the `meetup-api` repo).
  - **Content is baked at build time.** `src/pages/*.astro` call
    `getUpcomingEvents()`/`getPastEvents()` in frontmatter, so the API is hit
    during `astro build`, not in the browser. The live site is a snapshot —
    **refresh it by rebuilding**, no restart of `meetup-web` needed (files read live):
    ```bash
    ASTRO_CONFIG_SITE=https://meetup.astoria.app NODE_ENV=production npm run build
    ```
  - **Auto-refresh:** `systemd/meetup-web-rebuild.{service,timer}` rebuild the
    site every 4h so events stay current. The timer runs a **lean** build
    (`optimize-photos → astro build → jampack`) that deliberately **skips
    `npm run check`** — a lint/format nit in a doc must never block a content
    refresh. `astro build` clears `dist/` first, so there's a ~1–2 min window per
    rebuild where the site may 404 (acceptable for this low-traffic site; a
    build-to-staging + swap would remove it).
  - Install/enable the units (one-time, sudo): `sudo bash /tmp/install-meetup-units.sh`,
    or manually `sudo cp systemd/meetup-web.service /etc/systemd/system/ &&
sudo systemctl enable --now meetup-web.service` (plus the `-rebuild.timer`).

- Build pipeline (both targets): photo optimize → TypeScript check → Astro build → Jampack.

## Git Conventions

- Simple present tense one-line commit messages
- Use gitconfig identity (no overrides)
- Don't commit/push unless explicitly asked
