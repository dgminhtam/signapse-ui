import { ImageIcon } from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { InsertImageDialog } from "@/components/editor-x/images-extension";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function ImagePickerPlugin(dictionary: Dictionary) {
  return new ComponentPickerOption(dictionary.editor.insert.image, {
    icon: <ImageIcon className="size-4" />,
    keywords: ["image", "photo", "picture", "file"],
    onSelect: (_, editor, showModal) =>
      showModal(dictionary.editor.insert.insertImage, (onClose) => (
        <InsertImageDialog activeEditor={editor} onClose={onClose} />
      )),
  });
}
