import { ImageIcon } from "lucide-react";

import { InsertImageDialog } from "@/components/editor-x/images-extension";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function ImagePickerPlugin() {
  return new ComponentPickerOption("Image", {
    icon: <ImageIcon className="size-4" />,
    keywords: ["image", "photo", "picture", "file"],
    onSelect: (_, editor, showModal) =>
      showModal("Insert Image", (onClose) => (
        <InsertImageDialog activeEditor={editor} onClose={onClose} />
      )),
  });
}
