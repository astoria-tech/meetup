import { getCollection } from 'astro:content';
import { type HydratedFeedItem, FeedItemType } from '../types';

export async function getFeed (): Promise<HydratedFeedItem[]> {
  const [events, feed, presentations, speakers] = await Promise.all([
    getCollection('events'),
    getCollection('feed'),
    getCollection('presentations'),
    getCollection('speakers'),
  ])

  const presentationsWithSpeakers = presentations.map(presentation => {
    const speaker = speakers.find(s => s.slug === presentation.data.speaker.slug)
    return {
      ...presentation,
      speaker
    }
  })
  
  const eventsWithPresentations = events.map(event => {
    const presentations = event.data.presentations.map(presentationId => {
      return presentationsWithSpeakers.find(p => p.slug === presentationId.slug)
    })
    return {
      ...event,
      presentations
    }
  })
  
  const feedWithEvents = feed.map(feedItem => {
    const event = eventsWithPresentations.find(e => feedItem.data.event.slug === e.slug)
    const type = feedItem.slug.endsWith(FeedItemType.POST_EVENT) ? FeedItemType.POST_EVENT : FeedItemType.EVENT
    return {
      ...feedItem,
      event,
      type
    }
  }).sort((a, b) => {
    return new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
  })

  return feedWithEvents
}