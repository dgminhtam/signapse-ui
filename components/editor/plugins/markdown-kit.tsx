import {
  BaseFootnoteDefinitionPlugin,
  BaseFootnoteReferencePlugin,
} from "@platejs/footnote"
import { MarkdownPlugin, remarkMdx, remarkMention } from "@platejs/markdown"
import remarkEmoji from "remark-emoji"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

export const MarkdownKit = [
  BaseFootnoteReferencePlugin,
  BaseFootnoteDefinitionPlugin,
  MarkdownPlugin.configure({
    options: {
      remarkPlugins: [
        remarkMath,
        remarkGfm,
        remarkEmoji as unknown as typeof remarkMdx,
        remarkMdx,
        remarkMention,
      ],
    },
  }),
]
