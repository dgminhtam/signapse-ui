import { useState } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { LockIcon, UnlockIcon } from "lucide-react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function EditModeTogglePlugin() {
  const { dictionary } = useLocalization();
  const [editor] = useLexicalComposerContext();
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={"ghost"}
          onClick={() => {
            editor.setEditable(!editor.isEditable());
            setIsEditable(editor.isEditable());
          }}
          title={dictionary.editor.editMode.readOnlyTitle}
          aria-label={
            !isEditable
              ? dictionary.editor.editMode.unlock
              : dictionary.editor.editMode.lock
          }
          size={"sm"}
          className="p-2"
        >
          {isEditable ? (
            <LockIcon className="size-4" />
          ) : (
            <UnlockIcon className="size-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isEditable
          ? dictionary.editor.editMode.viewOnly
          : dictionary.editor.editMode.edit}
      </TooltipContent>
    </Tooltip>
  );
}
