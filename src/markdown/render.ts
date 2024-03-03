import MarkdownIt from "markdown-it"

export const render = (markdown: string) => {
  const parser = new MarkdownIt({
    html: true,
  });
  return parser.render(markdown)
}
