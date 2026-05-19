import { INSERT_EMBED_COMMAND } from "@lexical/react/LexicalAutoEmbedPlugin";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import {
  type CustomEmbedConfig,
  EmbedConfigs,
  getEmbedContentName,
} from "@/components/editor-x/auto-embed-plugin";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";

export function EmbedsPickerPlugin({
  dictionary,
  embed,
  formatMessage,
}: {
  dictionary: Dictionary;
  embed: "tweet" | "youtube-video";
  formatMessage: (
    message: string,
    values?: Record<string, string | number>,
  ) => string;
}) {
  const embedConfig = EmbedConfigs.find(
    (config) => config.type === embed,
  ) as CustomEmbedConfig;
  const contentName = getEmbedContentName(embedConfig, dictionary);

  return new ComponentPickerOption(
    formatMessage(dictionary.editor.insert.embedContent, {
      content: contentName,
    }),
    {
    icon: embedConfig.icon,
    keywords: [...embedConfig.keywords, "embed"],
    onSelect: (_, editor) =>
      editor.dispatchCommand(INSERT_EMBED_COMMAND, embedConfig.type),
    },
  );
}
