import { ImageIcon } from "lucide-react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import { InsertImageDialog } from "@/components/editor-x/images-extension";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function InsertImage() {
  const { dictionary } = useLocalization();
  const { activeEditor, showModal } = useToolbarContext();

  return (
    <DropdownMenuItem
      onClick={() => {
        showModal(dictionary.editor.insert.insertImage, (onClose) => (
          <InsertImageDialog activeEditor={activeEditor} onClose={onClose} />
        ));
      }}
    >
      <div className="flex items-center gap-1">
        <ImageIcon className="size-4" />
        <span>{dictionary.editor.insert.image}</span>
      </div>
    </DropdownMenuItem>
  );
}
