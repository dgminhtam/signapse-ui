import { $createHeadingNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $getSelection, $isRangeSelection } from "lexical";

import { Heading1Icon, Heading2Icon, Heading3Icon } from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function HeadingPickerPlugin({
  dictionary,
  n,
}: {
  dictionary: Dictionary;
  n: 1 | 2 | 3;
}) {
  const title =
    n === 1
      ? dictionary.editor.block.heading1
      : n === 2
        ? dictionary.editor.block.heading2
        : dictionary.editor.block.heading3;

  return new ComponentPickerOption(title, {
    icon: <HeadingIcons n={n} />,
    keywords: ["heading", "header", `h${n}`],
    onSelect: (_, editor) =>
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
        }
      }),
  });
}

function HeadingIcons({ n }: { n: number }) {
  switch (n) {
    case 1:
      return <Heading1Icon className="size-4" />;
    case 2:
      return <Heading2Icon className="size-4" />;
    case 3:
      return <Heading3Icon className="size-4" />;
  }
}
