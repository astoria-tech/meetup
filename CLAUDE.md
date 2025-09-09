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
- **FeedItem.astro**: Event/post display component
- **Link.astro**: URL handling with base path support
- **ThemeToggle.astro**: Dark/light mode switcher

#### Layout System
- **Layout.astro**: Base HTML layout
- **MainLayout.astro**: Main site layout with navigation

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
- GitHub issue templates for content creation
- Comprehensive README with development instructions
- CONTRIBUTING.md for community guidelines