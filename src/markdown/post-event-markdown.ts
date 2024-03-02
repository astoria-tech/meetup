import type { HydratedEvent } from "../types";

export default (event: HydratedEvent, site: string) => `
# Slides for - ${event.data.title}

${ event.data.banner && `<img src="${new URL(event.data.banner, site)}" style="width:500px"/>`}

Special thanks to our presenters ${event.presentations.map(p => p.speaker.data.name).join(', ')} for sharing their knowledge with us.

${event.presentations.map(p => (
`* ${p.speaker.data.name} - ${p.data.title} - [slides](${new URL(p.data.slides, site)})`
)).join('\n')}
`