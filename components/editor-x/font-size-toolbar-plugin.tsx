import { useCallback, useState } from "react";

import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import { $getSelection, $isRangeSelection, type BaseSelection } from "lexical";

import { MinusIcon, PlusIcon } from "lucide-react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor-x/use-update-toolbar";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 72;

export function FontSizeToolbarPlugin() {
  const { dictionary } = useLocalization();
  const style = "font-size";
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);

  const { activeEditor } = useToolbarContext();

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const value = $getSelectionStyleValueForProperty(
        selection,
        "font-size",
        `${DEFAULT_FONT_SIZE}px`,
      );
      setFontSize(parseInt(value) || DEFAULT_FONT_SIZE);
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  const updateFontSize = useCallback(
    (newSize: number) => {
      const size = Math.min(Math.max(newSize, MIN_FONT_SIZE), MAX_FONT_SIZE);
      activeEditor.update(() => {
        const selection = $getSelection();
        if (selection !== null) {
          $patchStyleText(selection, {
            [style]: `${size}px`,
          });
        }
      });
      setFontSize(size);
    },
    [activeEditor, style],
  );

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => updateFontSize(fontSize - 1)}
        disabled={fontSize <= MIN_FONT_SIZE}
        aria-label={dictionary.editor.toolbar.decreaseFontSize}
      >
        <MinusIcon />
      </Button>
      <Input
        value={fontSize}
        onChange={(e) =>
          updateFontSize(parseInt(e.target.value) || DEFAULT_FONT_SIZE)
        }
        className="h-7 w-12 text-center"
        min={MIN_FONT_SIZE}
        max={MAX_FONT_SIZE}
        aria-label={dictionary.editor.toolbar.fontSize}
      />
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => updateFontSize(fontSize + 1)}
        disabled={fontSize >= MAX_FONT_SIZE}
        aria-label={dictionary.editor.toolbar.increaseFontSize}
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
}
