import type { HydratedFeedItemPreHtml } from "../types";
const simplifiedDateOptions: Intl.DateTimeFormatOptions = {
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
};

export default ({ event, permalink }: HydratedFeedItemPreHtml) => `
# [${event.data.title}](${permalink})

${event.data.meetupImage ? `![event banner for ${event.data.date}](${event.data.meetupImage})` : ""}

Join us on ${event.data.date.toLocaleDateString("en-US", simplifiedDateOptions)}!
`;
