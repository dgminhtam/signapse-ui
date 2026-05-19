import { useCallback, useState } from "react";

import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isRangeSelection,
  // COMMAND_PRIORITY_NORMAL,
  // KEY_MODIFIER_COMMAND,
  type BaseSelection,
} from "lexical";

import { LinkIcon } from "lucide-react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import { useUpdateToolbarHandler } from "@/components/editor-x/use-update-toolbar";
import { getSelectedNode } from "@/components/editor-x/get-selected-node";
import { sanitizeUrl } from "@/components/editor-x/url";
import { Toggle } from "@/components/ui/toggle";

export function LinkToolbarPlugin({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: (isEditMode: boolean) => void;
}) {
  const { dictionary } = useLocalization();
  const { activeEditor } = useToolbarContext();
  const [isLink, setIsLink] = useState(false);

  const $updateToolbar = (selection: BaseSelection) => {
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  };

  useUpdateToolbarHandler($updateToolbar);

  // useEffect(() => {
  //   return activeEditor.registerCommand(
  //     KEY_MODIFIER_COMMAND,
  //     (payload) => {
  //       const event: KeyboardEvent = payload
  //       const { code, ctrlKey, metaKey } = event

  //       if (code === "KeyK" && (ctrlKey || metaKey)) {
  //         event.preventDefault()
  //         let url: string | null
  //         if (!isLink) {
  //           setIsLinkEditMode(true)
  //           url = sanitizeUrl("https://")
  //         } else {
  //           setIsLinkEditMode(false)
  //           url = null
  //         }
  //         return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url)
  //       }
  //       return false
  //     },
  //     COMMAND_PRIORITY_NORMAL
  //   )
  // }, [activeEditor, isLink, setIsLinkEditMode])

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl("https://"),
      );
    } else {
      setIsLinkEditMode(false);
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink, setIsLinkEditMode]);

  return (
    <Toggle
      variant={"outline"}
      size="sm"
      aria-label={dictionary.editor.toolbar.toggleLink}
      onClick={insertLink}
    >
      <LinkIcon className="h-4 w-4" />
    </Toggle>
  );
}
