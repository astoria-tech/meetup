# Astoria Tech Meetup Website

## Overview

Astro-based static site for the Astoria Tech Meetup community, deployed at `astoria.app`. Showcases upcoming and past events fetched from the Meetup API.

## Tech Stack

- **Framework**: Astro 4.7.0 (Static Site Generator)
- **Styling**: TailwindCSS with custom themes
- **Typography**: Noto Sans + Playfair Display fonts
- **Content Source**: Meetup API (`meetup-api.astoria.app`) — no static content collections
- **Build Optimization**: Jampack for post-build optimization
- **Package Management**: npm with workspaces

## Project Structure

```
├── src/
│   ├── components/         # Reusable Astro components
│   ├── content/            # Archived content collections (unused, all data from API)
│   │   └── _archive/       # Old static events, speakers, presentations, feed
│   ├── layouts/            # Page layouts (Layout.astro, MainLayout.astro)
│   ├── pages/              # Route pages
│   ├── styles/             # CSS styling system
│   └── utils/              # Meetup API client, event formatting helpers
├── public/                 # Static assets (images, fonts, etc.)
├── design/                 # Design files and fonts
├── packages/               # Workspace packages (image-generator)
└── script/                 # Build and utility scripts
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
- **InteractiveTerminal.astro**: Legacy terminal animation (replaced by ImageCarousel)

## Pages

- **`/`** — Homepage: hero section + image carousel + upcoming events + recent past events
- **`/events`** — Event types grid (mornings, evenings, hackathons, Project: Project)
- **`/events/[type]`** — Paginated event listing by type
- **`/sponsors`** — Sponsor information
- **`/links`** — Community links
- **`/donate`** — Donation page
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

- Static site hosted at `astoria.app`
- GitHub Actions CI/CD pipeline
- Build: TypeScript check → Astro build → Jampack optimization

## Git Conventions

- Simple present tense one-line commit messages
- Use gitconfig identity (no overrides)
- Don't commit/push unless explicitly asked
