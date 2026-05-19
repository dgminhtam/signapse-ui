import { INSERT_CHECK_LIST_COMMAND } from "@lexical/list";

import { ListTodoIcon } from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function CheckListPickerPlugin(dictionary: Dictionary) {
  return new ComponentPickerOption(dictionary.editor.block.checkList, {
    icon: <ListTodoIcon className="size-4" />,
    keywords: ["check list", "todo list"],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
  });
}
