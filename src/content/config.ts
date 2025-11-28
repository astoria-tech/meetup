// Content collections config
// Note: The static event/speaker/presentation/feed collections have been archived
// to src/content/_archive/ since we now use the Meetup API for event data.

// If you need to re-enable static content collections, uncomment the code below:

/*
import { defineCollection, reference, z } from "astro:content";

const eventsCollection = defineCollection({
  type: "content",
  schema: z.object({
    banner: z.string().optional(),
    meetupImage: z.string().optional(),
    date: z.date(),
    meetup: z.string(),
    presentations: z.array(reference("presentations")),
    title: z.string(),
    googleCal: z.string().optional(),
    ical: z.string().optional(),
  }),
});

const feedCollection = defineCollection({
  type: "content",
  schema: z.object({
    event: reference("events"),
    publishedAt: z.date(),
  }),
});

const presentationsCollection = defineCollection({
  type: "content",
  schema: z.object({
    date: z.date(),
    slides: z.string().optional(),
    slidesSource: z.string().optional(),
    speaker: reference("speakers"),
    title: z.string().optional(),
  }),
});

const speakersCollection = defineCollection({
  type: "content",
  schema: z.object({
    githubUsername: z.string().optional(),
    linkedin: z.string().optional(),
    name: z.string(),
    profileImage: z.string().optional(),
    website: z.string().optional(),
  }),
});

export const collections = {
  events: eventsCollection,
  feed: feedCollection,
  presentations: presentationsCollection,
  speakers: speakersCollection,
};
*/

// Currently no active collections - all content comes from Meetup API
export const collections = {};
