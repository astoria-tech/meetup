import { withLink, type Props } from "./render";

export default (props: Props) => withLink(props, ({ event, permalink, link}) => `
# [Save the date - ${event.data.title}](${link(permalink)})

Our next Event will be on ${event.data.date}

Be sure to RSVP on meetup [Event Link on Meetup](${event.data.meetup}).
`)