import { FORMAT_ELEMENT_COMMAND } from "lexical";

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function AlignmentPickerPlugin({
  alignment,
  dictionary,
}: {
  alignment: "left" | "center" | "right" | "justify";
  dictionary: Dictionary;
}) {
  const title =
    alignment === "left"
      ? dictionary.editor.toolbar.leftAlign
      : alignment === "center"
        ? dictionary.editor.toolbar.centerAlign
        : alignment === "right"
          ? dictionary.editor.toolbar.rightAlign
          : dictionary.editor.toolbar.justifyAlign;

  return new ComponentPickerOption(title, {
    icon: <AlignIcons alignment={alignment} />,
    keywords: ["align", "justify", alignment],
    onSelect: (_, editor) =>
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment),
  });
}

function AlignIcons({
  alignment,
}: {
  alignment: "left" | "center" | "right" | "justify";
}) {
  switch (alignment) {
    case "left":
      return <AlignLeftIcon className="size-4" />;
    case "center":
      return <AlignCenterIcon className="size-4" />;
    case "right":
      return <AlignRightIcon className="size-4" />;
    case "justify":
      return <AlignJustifyIcon className="size-4" />;
  }
}
