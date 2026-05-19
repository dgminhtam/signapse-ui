import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";

import { ScissorsIcon } from "lucide-react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function InsertHorizontalRule() {
  const { dictionary } = useLocalization();
  const { activeEditor } = useToolbarContext();

  return (
    <DropdownMenuItem
      onClick={() =>
        activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
      }
    >
      <div className="flex items-center gap-1">
        <ScissorsIcon className="size-4" />
        <span>{dictionary.editor.insert.horizontalRule}</span>
      </div>
    </DropdownMenuItem>
  );
}
