import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";

import { useLocalization } from "@/app/lib/i18n/provider";
import { useToolbarContext } from "@/components/editor-x/toolbar-context";
import {
  EmbedConfigs,
  getEmbedContentName,
} from "@/components/editor-x/auto-embed-plugin";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function InsertEmbeds() {
  const { dictionary } = useLocalization();
  const { activeEditor } = useToolbarContext();
  return EmbedConfigs.map((embedConfig) => (
    <DropdownMenuItem
      key={embedConfig.type}
      onClick={() => {
        activeEditor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type);
      }}
    >
      <div className="flex items-center gap-1">
        {embedConfig.icon}
        <span>{getEmbedContentName(embedConfig, dictionary)}</span>
      </div>
    </DropdownMenuItem>
  ));
}
