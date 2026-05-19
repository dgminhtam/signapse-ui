import { useEffect } from "react";

import {
  type SerializedDocument,
  editorStateFromSerializedDocument,
  serializedDocumentFromEditorState,
} from "@lexical/file";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CLEAR_HISTORY_COMMAND } from "lexical";

import { SendIcon } from "lucide-react";
import { toast } from "sonner";

import { useLocalization } from "@/app/lib/i18n/provider";
import {
  docFromHash,
  docToHash,
} from "@/components/editor-x/doc-serialization";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ShareContentPlugin() {
  const { dictionary } = useLocalization();
  const [editor] = useLexicalComposerContext();
  async function shareDoc(doc: SerializedDocument): Promise<void> {
    const url = new URL(window.location.toString());
    url.hash = await docToHash(doc);
    const newUrl = url.toString();
    window.history.replaceState({}, "", newUrl);
    await window.navigator.clipboard.writeText(newUrl);
  }
  useEffect(() => {
    docFromHash(window.location.hash).then((doc) => {
      if (doc && doc.source === "editor") {
        editor.setEditorState(editorStateFromSerializedDocument(editor, doc));
        editor.dispatchCommand(CLEAR_HISTORY_COMMAND, undefined);
      }
    });
  }, [editor]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={"ghost"}
          onClick={() =>
            shareDoc(
              serializedDocumentFromEditorState(editor.getEditorState(), {
                source: "editor",
              }),
            ).then(
              () => toast.success(dictionary.editor.share.copied),
              () => toast.error(dictionary.editor.share.copyError),
            )
          }
          title={dictionary.editor.share.title}
          aria-label={dictionary.editor.share.aria}
          size={"sm"}
          className="p-2"
        >
          <SendIcon className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{dictionary.editor.share.tooltip}</TooltipContent>
    </Tooltip>
  );
}
