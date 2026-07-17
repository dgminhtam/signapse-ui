import Markdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

import { Separator } from "@/components/ui/separator"

interface NewsArticleMarkdownProps {
  content: string
}

const markdownComponents: Components = {
  h1: ({ children }) => <h2>{children}</h2>,
  h2: ({ children }) => <h3>{children}</h3>,
  h3: ({ children }) => <h4>{children}</h4>,
  h4: ({ children }) => <h5>{children}</h5>,
  h5: ({ children }) => <h6>{children}</h6>,
  hr: () => (
    <Separator
      decorative={false}
      className="mt-[calc(var(--typeset-flow)*2.4)]"
    />
  ),
  table: ({ children }) => (
    <div className="typeset-scroll">
      <table>{children}</table>
    </div>
  ),
}

export function NewsArticleMarkdown({ content }: NewsArticleMarkdownProps) {
  return (
    <article className="typeset typeset-article w-full max-w-[72ch] pb-10">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={markdownComponents}
      >
        {content}
      </Markdown>
    </article>
  )
}
