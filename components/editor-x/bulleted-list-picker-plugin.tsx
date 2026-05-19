import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";

import { ListIcon } from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function BulletedListPickerPlugin(dictionary: Dictionary) {
  return new ComponentPickerOption(dictionary.editor.block.bulletedList, {
    icon: <ListIcon className="size-4" />,
    keywords: ["bulleted list", "unordered list", "ul"],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
  });
}
