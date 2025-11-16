# Astoria Tech Meetup Website - Architecture & Knowledge Base

## Overview

This is an Astro-based static site for the Astoria Tech Meetup community. The website showcases events, presentations, and speakers while maintaining a clean, performant architecture.

## Tech Stack

- **Framework**: Astro 4.7.0 (Static Site Generator)
- **Styling**: TailwindCSS with custom themes
- **Typography**: Noto Sans + Playfair Display fonts
- **Content Management**: Astro Content Collections
- **Build Optimization**: Jampack for optimization
- **Package Management**: npm with workspaces

## Project Structure

### Core Directories

```
├── src/
│   ├── components/         # Reusable Astro components
│   ├── content/           # Content collections (events, speakers, presentations, feed)
│   ├── data/              # Data processing logic
│   ├── layouts/           # Page layouts
│   ├── pages/             # Route pages
│   ├── styles/            # CSS styling system
│   └── types.ts           # TypeScript type definitions
├── public/                # Static assets
├── design/                # Design files and fonts
├── packages/              # Workspace packages (image-generator)
├── script/                # Build and utility scripts
└── .specstory/            # Project documentation history
```

### Content Architecture

#### Content Collections (src/content/)

1. **Events** (`events/`)

   - Event metadata and details
   - Links to presentations and meetup pages
   - Banner images and meetup links

2. **Speakers** (`speakers/`)

   - Speaker profiles and contact information
   - GitHub usernames, LinkedIn, websites
   - Profile images

3. **Presentations** (`presentations/`)

   - Slides and presentation metadata
   - Links to speakers and source code
   - PDF slide files

4. **Feed** (`feed/`)
   - Timeline posts for events
   - References to events
   - Publication dates

#### Data Relationships

- Events → Multiple Presentations
- Presentations → Single Speaker
- Feed Items → Single Event
- Complex data hydration in `src/data/feed.ts`

### Component Architecture

#### Core Components

- **Card.astro**: Base card layout wrapper
- **EventCard.astro**: Reusable event card component with responsive design, emoji badges, and collapsible details
- **FeedItem.astro**: Event/post display component
- **Link.astro**: URL handling with base path support
- **ThemeToggle.astro**: Dark/light mode switcher

#### Layout System

- **Layout.astro**: Base HTML layout
- **MainLayout.astro**: Main site layout with navigation

### Utility Functions

#### Event Formatting (`src/utils/eventFormatting.ts`)

Centralized utilities for event display:

- **formatCompactDate()**: Formats dates as "Wed 9/28/25"
- **formatTime()**: Formats time as "6:30 PM" in America/New_York timezone
- **getGoogleCalendarLink()**: Generates Google Calendar "Add to Calendar" links
- **renderMarkdown()**: Renders markdown descriptions to HTML
- **getPreviewText()**: Extracts first paragraph for previews
- **getEventEmoji()**: Returns emoji for event type (☀️ mornings, 🌙 evenings, 🚀 hackathons)
- **getEventColors()**: Returns color scheme object for event types with warm, cohesive palette

### Styling System

#### Theme Support

- Light/dark mode toggle functionality
- TailwindCSS-based responsive design
- Custom font integration via Astro aliases
- Wavy background SVG graphics

#### Font System

- **Noto Sans**: Primary body text (medium, bold)
- **Playfair Display**: Headings and accents (regular, bold)
- Multiple format support (.otf, .woff, .woff2)

### Build & Optimization

#### Scripts & Automation

- **Build Pipeline**: TypeScript checking → Astro build → Jampack optimization
- **Content Scripts**: Event creation, speaker management, presentation handling
- **Style Management**: Prettier + sort-package-json
- **YAML Linting**: Custom script for content validation

#### Performance Optimizations

- Static site generation
- Jampack post-build optimization
- Font preloading with multiple formats
- Image optimization pipeline

### Development Workflow

#### Key Commands

- `npm run dev`: Local development server
- `npm run build`: Production build with optimization
- `npm run check`: Full linting and type checking
- `npm run fix`: Auto-fix formatting and linting issues

#### Content Management Workflow

1. Create speaker profiles (`script/mkspeaker`)
2. Add presentations (`script/mkpresentation`)
3. Generate events (`script/mkevent`)
4. Automated feed generation
5. Image generation via workspace package

### Static Assets Structure

#### Public Directory Organization

- `banners/`: Event banner images
- `css/`: SVG graphics and icons
- `design/`: Logo variations and branding assets
- `meetup-images/`: Social media images
- `presentations/`: PDF presentation files
- `speakers/`: Speaker profile photos
- `photos/community/`: Community photos for highlighting the meetup experience
  - 6 high-quality community images available (hero-1.jpg, hero-2.jpg, hero-3.jpg, morning-coffee.jpg, hackathon.jpg, evening-presentation.jpg)
  - These showcase actual meetup events, networking, and presentations
  - **Future enhancement**: Add image gallery or carousel to homepage to showcase community

### RSS & Feed System

- Dynamic RSS generation (`src/pages/rss.xml.ts`)
- Feed processing with markdown rendering
- Chronological sorting by publication date
- HTML content extraction for RSS descriptions

### GitHub Integration

- Issue templates for event and talk creation
- GitHub Actions for CI/CD, deployment, and automation
- Automated style fixing workflows
- Image processing pipelines

## Key Features

### Content Management

- Structured content via Astro Collections
- Type-safe data relationships
- Automated content processing
- RSS feed generation

### User Experience

- Responsive design
- Dark/light theme support
- Fast static site performance
- SEO-optimized structure

### Developer Experience

- Strong TypeScript integration
- Automated formatting and linting
- Modular component architecture
- Workspace-based package management

## Deployment

- Static site hosted at `astoria.app`
- GitHub Actions deployment pipeline
- Environment-based configuration
- Jampack optimization for production

## Documentation & History

- `.specstory/` contains detailed development history
- GitHub issue templates for event and talk creation
- Comprehensive README with development instructions
- CONTRIBUTING.md for community guidelines

## Recent Updates (November 2025)

### Homepage Redesign

**Major refresh of homepage styling and event cards** (Commits: 3abf3ee, d89f8fe, 5193238, ba4c890)

#### Homepage (`src/pages/index.astro`)

- **Hero Section**: Completely redesigned with larger, bolder typography

  - Large centered title: "Astoria Tech Meetup" (5xl-6xl responsive)
  - Simplified tagline: "Grassroots tech community"
  - Prominent CTAs for Meetup.com and Discord with icon animations
  - Removed verbose welcome text in favor of concise messaging

- **Terminal Component**: Interactive terminal-style animation

  - macOS-style window controls (close, minimize, expand)
  - Typewriter effect showing community values via `cat` commands
  - Files displayed: community.txt, skills.txt, projects.txt, network.txt
  - Auto-loops after delay with `clear` command
  - Smooth animations and transitions

- **Upcoming Events Section**: Streamlined display using EventCard component
  - Clean "See all events →" link
  - Empty state messaging when no events scheduled

#### Event Cards (`src/components/EventCard.astro`)

Complete redesign with modern, vibrant aesthetic:

- **Responsive Layout**:

  - Mobile: Stacked layout with badge and date in top row
  - Desktop: Date and badge positioned absolutely in top-right corner
  - Emoji badges positioned outside card on desktop (absolute positioning)

- **Visual Design**:

  - White cards with subtle border and hover shadow effects
  - Event type badges with vibrant colors:
    - Morning events: Orange (☀️)
    - Evening events: Slate (🌙)
    - Hackathons: Purple (🚀)
  - Large emoji icons for visual interest
  - Clean typography hierarchy

- **Event Information Display**:

  - Title in large, bold emerald text
  - Compact date format: "Wed, Nov 13"
  - Time display: "6:30 PM" format
  - Preview of first paragraph from description
  - Collapsible full description section

- **Action Buttons**:

  - Primary: "RSVP on Meetup" (external link)
  - Secondary: "Add to Calendar" (Google Calendar integration)
  - Tertiary: "Read More" (expands full description)
  - Color-coded to match event type theme

- **Props**:
  - `event`: Event object with all metadata
  - `isPast`: Boolean to show past event state (reduced opacity)

#### Event Formatting Utilities

Created `src/utils/eventFormatting.ts` to centralize all event-related formatting:

- Moved date/time formatting from inline code to reusable functions
- Consistent timezone handling (America/New_York)
- Google Calendar link generation
- Markdown rendering with MarkdownIt
- Event color schemes for all event types

#### Design Philosophy

- **Community-focused**: Emphasis on what the meetup offers (learning, networking, building)
- **Clean and modern**: Removed clutter, increased whitespace
- **Vibrant but professional**: Colorful event badges while maintaining readability
- **Mobile-first**: Responsive design that works great on all devices
- **Interactive**: Terminal animation, hover effects, collapsible content

#### Future Enhancements

- **Community Photo Gallery**: Showcase the 6 community photos from `public/photos/community/`
  - Could be carousel on homepage
  - Could be scattered background images
  - Main goal: Highlight community and actual meetup experiences
