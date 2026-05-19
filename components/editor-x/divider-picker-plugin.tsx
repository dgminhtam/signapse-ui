import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";

import { MinusIcon } from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function DividerPickerPlugin(dictionary: Dictionary) {
  return new ComponentPickerOption(dictionary.editor.insert.horizontalRule, {
    icon: <MinusIcon className="size-4" />,
    keywords: ["horizontal rule", "divider", "hr"],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined),
  });
}
