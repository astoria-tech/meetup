import type { CollectionEntry } from 'astro:content';

export type HydratedEvent = CollectionEntry<'events'> & {
  presentations: (CollectionEntry<'presentations'> & {
    speaker: CollectionEntry<'speakers'>
  })[]
}

export const POST_EVENT = 'post-event'
export const EVENT = 'event'