import { defineCollection, reference, z } from "astro:content";

const eventsCollection = defineCollection({
  type: "content",
  schema: z.object({
    banner: z.string().optional(),
    date: z.date(),
    meetup: z.string(),
    presentations: z.array(reference("presentations")),
    title: z.string(),
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
    linkedin: z.string().optional(),
    slides: z.string().optional(),
    slidesSource: z.string().optional(),
    speaker: z.string(),
    title: z.string(),
    website: z.string().optional(),
  }),
});


export const collections = {
  "events": eventsCollection,
  "feed": feedCollection,
  "presentations": presentationsCollection,
};
