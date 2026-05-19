import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
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

const BLOCK_FORMAT_VALUE = "bullet";

export function FormatBulletedList() {
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

  const formatBulletedList = () => {
    if (blockType !== "bullet") {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      formatParagraph();
    }
  };

  return (
    <DropdownMenuItem onClick={formatBulletedList}>
      <div className="flex items-center gap-1 font-normal">
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].label}
      </div>
    </DropdownMenuItem>
  );
}
