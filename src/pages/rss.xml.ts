import rss from '@astrojs/rss';
import { FeedItemType} from '../types'
import { getFeed } from '../data/feed';
import eventMarkdown from '../markdown/event-markdown';
import postEventMarkdown from '../markdown/post-event-markdown';
import { load as cheerio} from 'cheerio'
import MarkdownIt from "markdown-it"
const parser = new MarkdownIt({
  html: true,
});

const markdownMap = {
  [FeedItemType.EVENT]: eventMarkdown,
  [FeedItemType.POST_EVENT]: postEventMarkdown
}

export async function GET(context) {
  const site = context.site
  const feed = await getFeed();
  const items = await Promise.all(feed.map(async (feedItem) => {
    const markdown = markdownMap[feedItem.type](feedItem.event, site)
    const rawContent = await parser.render(markdown)
    const $ = cheerio(rawContent)
    const title = $('h1').text()
    $('h1').remove()
    const content = $('body').html()
    return {
      link: 'xxx',
      pubDate: feedItem.data.publishedAt,
      content,
      title,
    }
  }))
  return rss({
    title: 'Astoria Tech Meetup',
    description: 'A feed of upcomming meetups and presentations.',
    site,
    items,
  });
}