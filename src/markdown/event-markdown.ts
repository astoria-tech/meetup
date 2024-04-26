import type {HydratedFeedItemPreHtml} from '../types'

export default ({event, permalink}: HydratedFeedItemPreHtml) => `
# [Save the date - ${event.data.title}](${permalink})

Our next Event will be on ${event.data.date}

Be sure to RSVP on meetup [Event Link on Meetup](${event.data.meetup}).

${event.data.googleCal ? `* [Add to Google Calendar](${event.data.googleCal})` : ''}
${event.data.ical ? `* [iCal](${event.data.ical})` : ''}
`
