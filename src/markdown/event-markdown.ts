import type {HydratedFeedItemPreHtml} from '../types'
const optionsTime: Intl.DateTimeFormatOptions = {timeZone: 'UTC', hour: 'numeric', minute: 'numeric'}
const optionsDate: Intl.DateTimeFormatOptions = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}

export default ({event, permalink}: HydratedFeedItemPreHtml) => `
# [Save the date - ${event.data.title}](${permalink})

${event.data.meetupImage ? `![event banner for ${event.data.date}](${event.data.meetupImage})` : ''}

Our next Event will be on ${event.data.date.toLocaleDateString('en-US', optionsDate) + ', at ' + event.data.date.toLocaleTimeString('en-US', optionsTime)}

Be sure to RSVP on meetup [Event Link on Meetup](${event.data.meetup}).

${event.data.googleCal ? `* [Add to Google Calendar](${event.data.googleCal})` : ''}
${event.data.ical ? `* [iCal](${event.data.ical})` : ''}
`
