import { useCallback, useState } from "react";

import { $isTableSelection } from "@lexical/table";
import {
  $isRangeSelection,
  type BaseSelection,
  FORMAT_TEXT_COMMAND,
  type TextFormatType,
} from "lexical";

import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor-x/use-update-toolbar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const FORMATS = [
  { format: "bold", icon: BoldIcon, labelKey: "bold" },
  { format: "italic", icon: ItalicIcon, labelKey: "italic" },
  { format: "underline", icon: UnderlineIcon, labelKey: "underline" },
  { format: "strikethrough", icon: StrikethroughIcon, labelKey: "strikethrough" },
] as const;

export function FontFormatToolbarPlugin() {
  const { dictionary } = useLocalization();
  const { activeEditor } = useToolbarContext();
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const $updateToolbar = useCallback((selection: BaseSelection) => {
    if ($isRangeSelection(selection) || $isTableSelection(selection)) {
      const formats: string[] = [];
      FORMATS.forEach(({ format }) => {
        if (selection.hasFormat(format as TextFormatType)) {
          formats.push(format);
        }
      });
      setActiveFormats((prev) => {
        // Only update if formats have changed
        if (
          prev.length !== formats.length ||
          !formats.every((f) => prev.includes(f))
        ) {
          return formats;
        }
        return prev;
      });
    }
  }, []);

  useUpdateToolbarHandler($updateToolbar);

  return (
    <ToggleGroup
      type="multiple"
      value={activeFormats}
      onValueChange={setActiveFormats}
      variant="outline"
      size="sm"
    >
      {FORMATS.map(({ format, icon: Icon, labelKey }) => (
        <ToggleGroupItem
          key={format}
          value={format}
          aria-label={dictionary.editor.toolbar[labelKey]}
          onClick={() => {
            activeEditor.dispatchCommand(
              FORMAT_TEXT_COMMAND,
              format as TextFormatType,
            );
          }}
        >
          <Icon className="size-4" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
