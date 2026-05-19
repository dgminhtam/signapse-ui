import { INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";

import { ListOrderedIcon } from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function NumberedListPickerPlugin(dictionary: Dictionary) {
  return new ComponentPickerOption(dictionary.editor.block.numberedList, {
    icon: <ListOrderedIcon className="size-4" />,
    keywords: ["numbered list", "ordered list", "ol"],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
  });
}
