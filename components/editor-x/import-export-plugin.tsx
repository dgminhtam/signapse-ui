import { exportFile, importFile } from "@lexical/file";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { DownloadIcon, UploadIcon } from "lucide-react";

import { useLocalization } from "@/app/lib/i18n/provider";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ImportExportPlugin() {
  const { dictionary } = useLocalization();
  const [editor] = useLexicalComposerContext();
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            onClick={() => importFile(editor)}
            title={dictionary.editor.importExport.importTitle}
            aria-label={dictionary.editor.importExport.importAria}
            size={"sm"}
            className="p-2"
          >
            <UploadIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{dictionary.editor.importExport.importTooltip}</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={"ghost"}
            onClick={() =>
              exportFile(editor, {
                fileName: `${dictionary.editor.importExport.fileNamePrefix} ${new Date().toISOString()}`,
                source: dictionary.editor.importExport.source,
              })
            }
            title={dictionary.editor.importExport.exportTitle}
            aria-label={dictionary.editor.importExport.exportAria}
            size={"sm"}
            className="p-2"
          >
            <DownloadIcon className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{dictionary.editor.importExport.exportTooltip}</TooltipContent>
      </Tooltip>
    </>
  );
}
