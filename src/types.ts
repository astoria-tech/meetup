import type { CollectionEntry } from 'astro:content';

export type HydratedEvent = CollectionEntry<'events'> & {
  presentations: (CollectionEntry<'presentations'> & {
    speaker: CollectionEntry<'speakers'>
  })[]
}