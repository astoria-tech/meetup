import type { APIRoute } from 'astro';
import rss from '@astrojs/rss';
import { FeedItemType} from '../types'
import { getFeed } from '../data/feed';
import eventMarkdown from '../markdown/event-markdown';
import postEventMarkdown from '../markdown/post-event-markdown';
import { load as cheerio} from 'cheerio'
import { initializeLink, render } from '../markdown/render';

const markdownMap = {
  [FeedItemType.EVENT]: eventMarkdown,
  [FeedItemType.POST_EVENT]: postEventMarkdown
}

export const GET: APIRoute = async (context) => {
  const site = context.site
  const feed = await getFeed();
  const items = await Promise.all(feed.map(async (feedItem) => {
    const markdown = markdownMap[feedItem.type](feedItem.event, site)
    const rawContent = render(markdown)
    const $ = cheerio(rawContent)
    const title = $('h1').text()
    $('h1').remove()
    const content = $('body').html()
    return {
      link: initializeLink(site)(`/feed/${feedItem.slug}`),
      pubDate: feedItem.data.publishedAt,
      content,
      title,
      description: `<![CDATA[<html><body>${content}</body></html>]]>`
    }
  }))
  return rss({
    title: 'Astoria Tech Meetup',
    description: 'A feed of upcomming meetups and presentations.',
    site,
    items,
  });
}
