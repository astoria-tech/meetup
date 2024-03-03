import type { HydratedEvent } from "../types";
import { initializeLink } from "./render";

export default ({event, permalink, site}: {event: HydratedEvent, permalink: string, site: URL}) => {
  const link = initializeLink(site)
  return `
# [Slides for - ${event.data.title}](${permalink})

${ event.data.banner && `<img src="${link(event.data.banner)}" style="width:500px"/>`}

Special thanks to our presenters ${event.presentations.map(p => p.speaker.data.name).join(', ')} for sharing their knowledge with us.

${event.presentations.map(p => (
`* ${p.speaker.data.name} - ${p.data.title} - [slides](${link(p.data.slides)})`
)).join('\n')}
`
}