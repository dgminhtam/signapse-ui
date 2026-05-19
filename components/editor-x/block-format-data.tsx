import {
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  QuoteIcon,
  TextIcon,
} from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";

export function getBlockTypeToBlockName(dictionary: Dictionary): Record<
  string,
  { label: string; icon: React.ReactNode }
> {
  return {
    paragraph: {
      label: dictionary.editor.block.paragraph,
      icon: <TextIcon className="size-4" />,
    },
    h1: {
      label: dictionary.editor.block.heading1,
      icon: <Heading1Icon className="size-4" />,
    },
    h2: {
      label: dictionary.editor.block.heading2,
      icon: <Heading2Icon className="size-4" />,
    },
    h3: {
      label: dictionary.editor.block.heading3,
      icon: <Heading3Icon className="size-4" />,
    },
    number: {
      label: dictionary.editor.block.numberedList,
      icon: <ListOrderedIcon className="size-4" />,
    },
    bullet: {
      label: dictionary.editor.block.bulletedList,
      icon: <ListIcon className="size-4" />,
    },
    check: {
      label: dictionary.editor.block.checkList,
      icon: <ListTodoIcon className="size-4" />,
    },
    code: {
      label: dictionary.editor.block.codeBlock,
      icon: <CodeIcon className="size-4" />,
    },
    quote: {
      label: dictionary.editor.block.quote,
      icon: <QuoteIcon className="size-4" />,
    },
  };
}
