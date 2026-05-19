import { Columns3Icon } from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { InsertLayoutDialog } from "@/components/editor-x/layout-plugin";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function ColumnsLayoutPickerPlugin(dictionary: Dictionary) {
  return new ComponentPickerOption(dictionary.editor.insert.columnsLayout, {
    icon: <Columns3Icon className="size-4" />,
    keywords: ["columns", "layout", "grid"],
    onSelect: (_, editor, showModal) =>
      showModal(dictionary.editor.insert.insertColumnsLayout, (onClose) => (
        <InsertLayoutDialog activeEditor={editor} onClose={onClose} />
      )),
  });
}
