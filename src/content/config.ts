// 1. Import utilities from `astro:content`
import { z, defineCollection, reference } from 'astro:content';

// 2. Define a `type` and `schema` for each collection
const presentationsCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    date: z.date(),
    speaker: z.string(),
    linkedin: z.string().optional(),
    website: z.string().optional(),
    slides: z.string().optional(),
    slidesSource: z.string().optional(),
  }),
});

const eventsCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    date: z.date(),
    banner: z.string(),
    title: z.string(),
    presentations: z.array(reference('presentations')),
    meetup: z.string()
  }),
});

const feedCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    publishedAt: z.date(),
    event: reference('events'),
  }),
});

// 3. Export a single `collections` object to register your collection(s)
export const collections = {
  'presentations': presentationsCollection,
  'events': eventsCollection,
  "feed": feedCollection
};
