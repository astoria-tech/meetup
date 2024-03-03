import MarkdownIt from "markdown-it"

export const render = (markdown: string) => {
  const parser = new MarkdownIt({
    html: true,
  });
  return parser.render(markdown)
}

export const initializeLink = (site: URL) => (path: string) => {
// console.log(site)
 return `${site.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`
}