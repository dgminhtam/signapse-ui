import { $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $getSelection } from "lexical";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import { getBlockTypeToBlockName } from "@/components/editor-x/block-format-data";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

const BLOCK_FORMAT_VALUE = "quote";

export function FormatQuote() {
  const { dictionary } = useLocalization();
  const { activeEditor, blockType } = useToolbarContext();
  const blockTypeToBlockName = getBlockTypeToBlockName(dictionary);

  const formatQuote = () => {
    if (blockType !== "quote") {
      activeEditor.update(() => {
        const selection = $getSelection();
        $setBlocksType(selection, () => $createQuoteNode());
      });
    }
  };

  return (
    <DropdownMenuItem onClick={formatQuote}>
      <div className="flex items-center gap-1 font-normal">
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].icon}
        {blockTypeToBlockName[BLOCK_FORMAT_VALUE].label}
      </div>
    </DropdownMenuItem>
  );
}
