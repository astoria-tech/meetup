import type { HydratedFeedItemPreHtml } from "../types";

export default ({ event, permalink }: HydratedFeedItemPreHtml) => `
# [Slides for - ${event.data.title}](${permalink})

${ event.data.banner && `<img src="${event.data.banner}" style="width:500px"/>`}

Special thanks to our presenters ${event.presentations.map(p => p.speaker.data.name).join(', ')} for sharing their knowledge with us.

${event.presentations.map(p => (
`* ${p.speaker.data.name} - ${p.data.title} - [slides](${p.data.slides})`
)).join('\n')}
`