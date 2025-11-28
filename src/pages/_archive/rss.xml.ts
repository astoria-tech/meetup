import type { APIRoute } from "astro";
import rss from "@astrojs/rss";
import { getFeed } from "../data/feed";
import copy from "../copy";

export const GET: APIRoute = async (context) => {
  const site = context.site;
  const feed = await getFeed({ site: context.site });
  const items = feed.map((feedItem) => {
    return {
      link: feedItem.permalink,
      pubDate: feedItem.data.publishedAt,
      content: feedItem.content,
      title: feedItem.title,
      description: `<![CDATA[<html><body>${feedItem.content}</body></html>]]>`,
    };
  });
  return rss({
    title: copy.rssTitle,
    description: copy.rssDescription,
    site,
    items,
  });
};
