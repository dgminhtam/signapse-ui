import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";

import { TextIcon } from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function ParagraphPickerPlugin(dictionary: Dictionary) {
  return new ComponentPickerOption(dictionary.editor.block.paragraph, {
    icon: <TextIcon className="size-4" />,
    keywords: ["normal", "paragraph", "p", "text"],
    onSelect: (_, editor) =>
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      }),
  });
}
