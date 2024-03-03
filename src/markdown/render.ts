import MarkdownIt from "markdown-it"
import nodePath from 'path'

export const render = (markdown: string) => {
  const parser = new MarkdownIt({
    html: true,
  });
  return parser.render(markdown)
}

export const initializeLink = (site: URL) => (path: string) => {
  if (!import.meta.env.BASE_URL) throw new Error('import.meta.env.BASE_URL is not defined')
  const pathname = nodePath.join(import.meta.env.BASE_URL, path)
  return new URL(pathname, site).toString()
}