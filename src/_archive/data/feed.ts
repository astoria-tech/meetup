import { getCollection } from "astro:content";
import eventMarkdown from "../markdown/event-markdown";
import postEventMarkdown from "../markdown/post-event-markdown";
import { FeedItemType, type HydratedFeedItem } from "../types";
import MarkdownIt from "markdown-it";
import nodePath from "path";
import { load as cheerio } from "cheerio";

const render = (markdown: string) => {
  const parser = new MarkdownIt({
    html: true,
  });
  return parser.render(markdown);
};

export const initializeLink = (site: URL) => (path: string) => {
  const pathname = nodePath.join(import.meta.env.BASE_URL, path);
  return new URL(pathname, site).toString();
};

const markdownMap = {
  [FeedItemType.EVENT]: eventMarkdown,
  [FeedItemType.POST_EVENT]: postEventMarkdown,
};

// this is to get the H1 tag from the markdown for the "title" of a feed post
// also content is the html without the H1 for RSS
const forRss = (html: string) => {
  const $ = cheerio(html);
  const title = $("h1").text();
  $("h1").remove();
  const content = $("body").html();
  return { title, content };
};

export async function getFeed(props: {
  site?: URL;
}): Promise<HydratedFeedItem[]> {
  const { site } = props;
  const link = initializeLink(site || new URL("http://localhost:4321"));

  const [events, feed, presentations, speakers] = await Promise.all([
    getCollection("events"),
    getCollection("feed"),
    getCollection("presentations"),
    getCollection("speakers"),
  ]);

  const presentationsWithSpeakers = presentations.map((presentation) => {
    const speaker = speakers.find(
      (s) => s.slug === presentation.data.speaker.slug,
    );
    return {
      ...presentation,
      data: {
        ...presentation.data,
        slides: presentation.data.slides && link(presentation.data.slides),
        slidesSource:
          presentation.data.slidesSource && presentation.data.slidesSource,
      },
      speaker,
    };
  });

  const eventsWithPresentations = events.map((event) => {
    const presentations = event.data.presentations.map((presentationId) => {
      return presentationsWithSpeakers.find(
        (p) => p.slug === presentationId.slug,
      );
    });
    return {
      ...event,
      data: {
        ...event.data,
        banner: event.data.banner && link(event.data.banner),
      },
      presentations,
    };
  });

  const feedWithEvents = feed
    .map((feedItem) => {
      const event = eventsWithPresentations.find(
        (e) => feedItem.data.event.slug === e.slug,
      );
      const type = feedItem.slug.endsWith(FeedItemType.POST_EVENT)
        ? FeedItemType.POST_EVENT
        : FeedItemType.EVENT;
      const hydrated = {
        ...feedItem,
        event,
        type,
        permalink: link(`/feed/${feedItem.slug}`),
      };
      const markdown = markdownMap[type](hydrated);
      const html = render(markdown);
      const breakdown = forRss(html);
      return { ...hydrated, ...breakdown, html };
    })
    .sort((a, b) => {
      return (
        new Date(b.data.publishedAt).getTime() -
        new Date(a.data.publishedAt).getTime()
      );
    });

  return feedWithEvents;
}
