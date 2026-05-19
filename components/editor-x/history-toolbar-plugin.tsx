import { useEffect, useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { IS_APPLE, mergeRegister } from "@lexical/utils";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  REDO_COMMAND,
  UNDO_COMMAND,
} from "lexical";

import { RedoIcon, UndoIcon } from "lucide-react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

export function HistoryToolbarPlugin() {
  const { dictionary } = useLocalization();
  const [editor] = useLexicalComposerContext();
  const { activeEditor, $updateToolbar } = useToolbarContext();
  const [isEditable, setIsEditable] = useState(editor.isEditable());
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          { editor: activeEditor },
        );
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [$updateToolbar, activeEditor, editor]);

  return (
    <ButtonGroup>
      <Button
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? dictionary.editor.toolbar.undoMac : dictionary.editor.toolbar.undoWindows}
        type="button"
        aria-label={dictionary.editor.toolbar.undo}
        size="icon-sm"
        variant={"outline"}
      >
        <UndoIcon className="size-4" />
      </Button>
      <Button
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title={IS_APPLE ? dictionary.editor.toolbar.redoMac : dictionary.editor.toolbar.redoWindows}
        type="button"
        aria-label={dictionary.editor.toolbar.redo}
        variant={"outline"}
        size="icon-sm"
      >
        <RedoIcon className="size-4" />
      </Button>
    </ButtonGroup>
  );
}
