import { FeedItemType, type HydratedEvent } from "../types";
export default ({event, permalink}: {event: HydratedEvent, permalink: string}) => `
# [Save the date - ${event.data.title}](${permalink})

Our next Event will be on ${event.data.date}

Be sure to RSVP on meetup [Event Link on Meetup](${event.data.meetup}).
`