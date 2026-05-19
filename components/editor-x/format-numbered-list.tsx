import { INSERT_ORDERED_LIST_COMMAND } from "@lexical/list";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import { getBlockTypeToBlockName } from "@/components/editor-x/block-format-data";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const BLOCK_FORMAT_VALUE = "number";

export function FormatNumberedList() {
  const { dictionary } = useLocalization();
  const { activeEditor, blockType } = useToolbarContext();
  const blockTypeToBlockName = getBlockTypeToBlockName(dictionary);

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatNumberedList = () => {
    if (blockType !== "number") {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  return (
    <DropdownMenuItem onClick={formatNumberedList}>
      <div className="flex items-center gap-1 font-normal">
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].label}
      </div>
    </DropdownMenuItem>
  );
}
