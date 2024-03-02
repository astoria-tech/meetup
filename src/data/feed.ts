import { getCollection } from 'astro:content';
import { EVENT, POST_EVENT } from '../types';

export async function getFeed () {
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
    const feedEntryType = feedItem.slug.endsWith(POST_EVENT) ? POST_EVENT : EVENT
    return {
      ...feedItem,
      event,
      feedEntryType
    }
  }).sort((a, b) => {
    return new Date(b.data.publishedAt).getTime() - new Date(a.data.publishedAt).getTime()
  })

  return feedWithEvents
}