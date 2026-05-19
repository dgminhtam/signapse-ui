import { Columns3Icon } from "lucide-react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import { InsertLayoutDialog } from "@/components/editor-x/layout-plugin";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function InsertColumnsLayout() {
  const { dictionary } = useLocalization();
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <DropdownMenuItem
      onClick={() =>
        showModal(dictionary.editor.insert.insertColumnsLayout, (onClose) => (
          <InsertLayoutDialog activeEditor={activeEditor} onClose={onClose} />
        ))
      }
    >
      <div className="flex items-center gap-1">
        <Columns3Icon className="size-4" />
        <span>{dictionary.editor.insert.columnsLayout}</span>
      </div>
    </DropdownMenuItem>
  );
}
