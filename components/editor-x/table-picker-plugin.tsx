import { INSERT_TABLE_COMMAND } from "@lexical/table";

import { TableIcon } from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";
import { InsertTableDialog } from "@/components/editor-x/table-plugin";

export function TablePickerPlugin(dictionary: Dictionary) {
  return new ComponentPickerOption(dictionary.editor.insert.table, {
    icon: <TableIcon className="size-4" />,
    keywords: ["table", "grid", "spreadsheet", "rows", "columns"],
    onSelect: (_, editor, showModal) =>
      showModal(dictionary.editor.insert.insertTable, (onClose) => (
        <InsertTableDialog activeEditor={editor} onClose={onClose} />
      )),
  });
}

export function DynamicTablePickerPlugin({
  dictionary,
  formatMessage,
  queryString,
}: {
  dictionary: Dictionary;
  formatMessage: (
    message: string,
    values?: Record<string, string | number>,
  ) => string;
  queryString: string;
}) {
  const options: Array<ComponentPickerOption> = [];

  if (queryString == null) {
    return options;
  }

  const tableMatch = queryString.match(/^([1-9]\d?)(?:x([1-9]\d?)?)?$/);

  if (tableMatch !== null) {
    const rows = tableMatch[1];
    const colOptions = tableMatch[2]
      ? [tableMatch[2]]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(String);

    options.push(
      ...colOptions.map(
        (columns) =>
          new ComponentPickerOption(
            formatMessage(dictionary.editor.table.sizeOption, {
              columns,
              rows,
            }),
            {
            icon: <i className="icon table" />,
            keywords: ["table"],
            onSelect: (_, editor) =>
              editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns, rows }),
            },
          ),
      ),
    );
  }

  return options;
}
