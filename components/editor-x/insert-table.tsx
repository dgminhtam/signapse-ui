import { TableIcon } from "lucide-react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import { InsertTableDialog } from "@/components/editor-x/table-plugin";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function InsertTable() {
  const { dictionary } = useLocalization();
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <DropdownMenuItem
      onClick={() =>
        showModal(dictionary.editor.insert.insertTable, (onClose) => (
          <InsertTableDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
    >
      <div className="flex items-center gap-1">
        <TableIcon className="size-4" />
        <span>{dictionary.editor.insert.table}</span>
      </div>
    </DropdownMenuItem>
  );
}
