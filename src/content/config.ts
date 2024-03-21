import { defineCollection, reference, z } from "astro:content";

const eventsCollection = defineCollection({
  type: "content",
  schema: z.object({
    banner: z.string().optional(),
    date: z.date(),
    meetup: z.string(),
    presentations: z.array(reference("presentations")),
    title: z.string(),
    google_cal: z.string().optional(),
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
    title: z.string(),
  }),
});

const speakersCollection = defineCollection({
  type: "content",
  schema: z.object({
    linkedin: z.string().optional(),
    name: z.string(),
    website: z.string().optional(),
    githubUsername: z.string().optional(),
    profileImage: z.string().optional(),
  }),
});

export const collections = {
  "events": eventsCollection,
  "feed": feedCollection,
  "presentations": presentationsCollection,
  "speakers": speakersCollection,
};
