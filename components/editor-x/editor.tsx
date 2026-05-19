"use client";

import * as React from "react";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import {
  AutoFocusExtension,
  ClearEditorExtension,
  DecoratorTextExtension,
  HorizontalRuleExtension,
} from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { ClickableLinkExtension, LinkExtension } from "@lexical/link";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { OverflowNode } from "@lexical/overflow";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";
import { RichTextExtension } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import {
  $createParagraphNode,
  $getRoot,
  $insertNodes,
  configExtension,
  defineExtension,
} from "lexical";

import type { Dictionary } from "@/app/lib/i18n/dictionary-types";
import { useLocalization } from "@/app/lib/i18n/provider";
import { ActionsPlugin } from "@/components/editor-x/actions-plugin";
import { AutoCompletePlugin } from "@/components/editor-x/auto-complete-plugin";
import { AutoEmbedPlugin } from "@/components/editor-x/auto-embed-plugin";
import { AutoLinkExtension } from "@/components/editor-x/auto-link-extension";
import { AutocompleteNode } from "@/components/editor-x/autocomplete-node";
import { BlockFormatDropDown } from "@/components/editor-x/block-format-toolbar-plugin";
import { BlockInsertPlugin } from "@/components/editor-x/block-insert-plugin";
import { BulletedListPickerPlugin } from "@/components/editor-x/bulleted-list-picker-plugin";
import { CheckListPickerPlugin } from "@/components/editor-x/check-list-picker-plugin";
import { ClearEditorActionPlugin } from "@/components/editor-x/clear-editor-plugin";
import { ClearFormattingToolbarPlugin } from "@/components/editor-x/clear-formatting-toolbar-plugin";
import { CodeActionMenuPlugin } from "@/components/editor-x/code-action-menu-plugin";
import { CodeHighlightPlugin } from "@/components/editor-x/code-highlight-plugin";
import { CodeLanguageToolbarPlugin } from "@/components/editor-x/code-language-toolbar-plugin";
import { CodePickerPlugin } from "@/components/editor-x/code-picker-plugin";
import { ColumnsLayoutPickerPlugin } from "@/components/editor-x/columns-layout-picker-plugin";
import { ComponentPickerMenuPlugin } from "@/components/editor-x/component-picker-menu-plugin";
import { ComponentPickerOption } from "@/components/editor-x/component-picker-option";
import { ContentEditable } from "@/components/editor-x/content-editable";
import { ContextMenuPlugin } from "@/components/editor-x/context-menu-plugin";
import { CounterCharacterPlugin } from "@/components/editor-x/counter-character-plugin";
import { DateTimeExtension } from "@/components/editor-x/date-time-extension";
import { DateTimeNode } from "@/components/editor-x/date-time-node";
import { DateTimePickerPlugin } from "@/components/editor-x/date-time-picker-plugin";
import { DividerPickerPlugin } from "@/components/editor-x/divider-picker-plugin";
import { DragDropPasteExtension } from "@/components/editor-x/drag-drop-paste-extension";
import { DraggableBlockPlugin } from "@/components/editor-x/draggable-block-plugin";
import { EditModeTogglePlugin } from "@/components/editor-x/edit-mode-toggle-plugin";
import { ElementFormatToolbarPlugin } from "@/components/editor-x/element-format-toolbar-plugin";
import { EmbedsPickerPlugin } from "@/components/editor-x/embeds-picker-plugin";
import { EmojiNode } from "@/components/editor-x/emoji-node";
import { EmojiPickerPlugin } from "@/components/editor-x/emoji-picker-plugin";
import { EmojisExtension } from "@/components/editor-x/emojis-extension";
import { editorTheme } from "@/components/editor-x/editor-theme";
import { FloatingLinkEditorPlugin } from "@/components/editor-x/floating-link-editor-plugin";
import { FloatingTextFormatToolbarPlugin } from "@/components/editor-x/floating-text-format-plugin";
import { FontBackgroundToolbarPlugin } from "@/components/editor-x/font-background-toolbar-plugin";
import { FontColorToolbarPlugin } from "@/components/editor-x/font-color-toolbar-plugin";
import { FontFamilyToolbarPlugin } from "@/components/editor-x/font-family-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor-x/font-format-toolbar-plugin";
import { FontSizeToolbarPlugin } from "@/components/editor-x/font-size-toolbar-plugin";
import { FormatBulletedList } from "@/components/editor-x/format-bulleted-list";
import { FormatCheckList } from "@/components/editor-x/format-check-list";
import { FormatCodeBlock } from "@/components/editor-x/format-code-block";
import { FormatHeading } from "@/components/editor-x/format-heading";
import { FormatNumberedList } from "@/components/editor-x/format-numbered-list";
import { FormatParagraph } from "@/components/editor-x/format-paragraph";
import { FormatQuote } from "@/components/editor-x/format-quote";
import { HeadingPickerPlugin } from "@/components/editor-x/heading-picker-plugin";
import { HistoryToolbarPlugin } from "@/components/editor-x/history-toolbar-plugin";
import { MaxLengthExtension } from "@/components/editor-x/max-length-extension";
import { MentionNode } from "@/components/editor-x/mention-node";
import { MentionsPlugin } from "@/components/editor-x/mentions-plugin";
import { NumberedListPickerPlugin } from "@/components/editor-x/numbered-list-picker-plugin";
import { ParagraphPickerPlugin } from "@/components/editor-x/paragraph-picker-plugin";
import { QuotePickerPlugin } from "@/components/editor-x/quote-picker-plugin";
import { SpecialTextNode } from "@/components/editor-x/special-text-node";
import { SpecialTextPlugin } from "@/components/editor-x/special-text-plugin";
import { SpeechToTextPlugin } from "@/components/editor-x/speech-to-text-plugin";
import {
  DynamicTablePickerPlugin,
  TablePickerPlugin,
} from "@/components/editor-x/table-picker-plugin";
import { LayoutContainerNode } from "@/components/editor-x/layout-container-node";
import { LayoutItemNode } from "@/components/editor-x/layout-item-node";
import { LayoutPlugin } from "@/components/editor-x/layout-plugin";
import { ImageNode } from "@/components/editor-x/image-node";
import { ImagePickerPlugin } from "@/components/editor-x/image-picker-plugin";
import { ImagesExtension } from "@/components/editor-x/images-extension";
import { ImportExportPlugin } from "@/components/editor-x/import-export-plugin";
import { InsertColumnsLayout } from "@/components/editor-x/insert-columns-layout";
import { InsertEmbeds } from "@/components/editor-x/insert-embeds";
import { InsertHorizontalRule } from "@/components/editor-x/insert-horizontal-rule";
import { InsertImage } from "@/components/editor-x/insert-image";
import { InsertTable } from "@/components/editor-x/insert-table";
import { KeywordNode } from "@/components/editor-x/keyword-node";
import { KeywordsExtension } from "@/components/editor-x/keywords-extension";
import { TabFocusPlugin } from "@/components/editor-x/tab-focus-plugin";
import { ToolbarPlugin } from "@/components/editor-x/toolbar-plugin";
import { TwitterPlugin } from "@/components/editor-x/twitter-plugin";
import { TweetNode } from "@/components/editor-x/tweet-node";
import { validateUrl } from "@/components/editor-x/url";
import { YouTubeNode } from "@/components/editor-x/youtube-node";
import { YouTubePlugin } from "@/components/editor-x/youtube-plugin";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const EMPTY_HTML = "<p></p>";
const NOTE_MAX_LENGTH = 50_000;

function normalizeHtml(value: string) {
  return value.trim().length > 0 ? value : EMPTY_HTML;
}

function createPickerOptions(
  dictionary: Dictionary,
  formatMessage: (
    message: string,
    values?: Record<string, string | number>,
  ) => string,
) {
  return [
    ParagraphPickerPlugin(dictionary),
    HeadingPickerPlugin({ dictionary, n: 1 }),
    HeadingPickerPlugin({ dictionary, n: 2 }),
    HeadingPickerPlugin({ dictionary, n: 3 }),
    BulletedListPickerPlugin(dictionary),
    NumberedListPickerPlugin(dictionary),
    CheckListPickerPlugin(dictionary),
    QuotePickerPlugin(dictionary),
    CodePickerPlugin(dictionary),
    DividerPickerPlugin(dictionary),
    TablePickerPlugin(dictionary),
    ImagePickerPlugin(dictionary),
    ColumnsLayoutPickerPlugin(dictionary),
    DateTimePickerPlugin(dictionary),
    EmbedsPickerPlugin({ dictionary, embed: "youtube-video", formatMessage }),
    EmbedsPickerPlugin({ dictionary, embed: "tweet", formatMessage }),
  ];
}

function HtmlBridgePlugin({
  onChange,
  readOnly,
  value,
}: {
  onChange?: (html: string) => void;
  readOnly: boolean;
  value: string;
}) {
  const [editor] = useLexicalComposerContext();
  const isImportingRef = React.useRef(false);
  const lastEmittedHtmlRef = React.useRef<string | null>(null);
  const lastImportedHtmlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  React.useEffect(() => {
    const nextHtml = normalizeHtml(value);

    if (
      nextHtml === lastImportedHtmlRef.current ||
      nextHtml === lastEmittedHtmlRef.current
    ) {
      return;
    }

    isImportingRef.current = true;
    editor.update(() => {
      const root = $getRoot();
      const parser = new DOMParser();
      const dom = parser.parseFromString(nextHtml, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);

      root.clear();
      root.select();

      if (nodes.length > 0) {
        $insertNodes(nodes);
      } else {
        root.append($createParagraphNode());
      }
    });

    lastImportedHtmlRef.current = nextHtml;
    queueMicrotask(() => {
      isImportingRef.current = false;
    });
  }, [editor, value]);

  return (
    <OnChangePlugin
      ignoreSelectionChange
      onChange={(editorState, activeEditor) => {
        if (isImportingRef.current || readOnly) {
          return;
        }

        editorState.read(
          () => {
            const html = $generateHtmlFromNodes(activeEditor, null);
            lastEmittedHtmlRef.current = html;
            onChange?.(html);
          },
          { editor: activeEditor },
        );
      }}
    />
  );
}

interface XEditorProps {
  className?: string;
  editorClassName?: string;
  placeholder?: string;
  readOnly?: boolean;
  value: string;
  onChange?: (value: string) => void;
}

function XEditor({
  className,
  editorClassName,
  placeholder,
  readOnly = false,
  value,
  onChange,
}: XEditorProps) {
  const { dictionary, formatMessage } = useLocalization();
  const [floatingAnchorElem, setFloatingAnchorElem] =
    React.useState<HTMLDivElement | null>(null);
  const [isLinkEditMode, setIsLinkEditMode] = React.useState(false);

  const pickerOptions = React.useMemo<ComponentPickerOption[]>(
    () => createPickerOptions(dictionary, formatMessage),
    [dictionary, formatMessage],
  );
  const editorPlaceholder = placeholder ?? dictionary.editor.placeholder;

  const appExtension = React.useMemo(
    () =>
      defineExtension({
        dependencies: [
          RichTextExtension,
          AutoFocusExtension,
          HistoryExtension,
          configExtension(LinkExtension, {
            validateUrl,
            attributes: { rel: "noopener noreferrer", target: "_blank" },
          }),
          AutoLinkExtension,
          ClickableLinkExtension,
          configExtension(MaxLengthExtension, {
            disabled: false,
            maxLength: NOTE_MAX_LENGTH,
          }),
          ClearEditorExtension,
          EmojisExtension,
          DecoratorTextExtension,
          configExtension(ListExtension, { shouldPreserveNumbering: false }),
          CheckListExtension,
          HorizontalRuleExtension,
          ImagesExtension,
          DragDropPasteExtension,
          DateTimeExtension,
          KeywordsExtension,
        ],
        name: "@signapse/personal-note-x-editor",
        namespace: "SignapsePersonalNote",
        nodes: [
          OverflowNode,
          EmojiNode,
          MentionNode,
          AutocompleteNode,
          SpecialTextNode,
          CodeNode,
          CodeHighlightNode,
          TableNode,
          TableCellNode,
          TableRowNode,
          LayoutContainerNode,
          LayoutItemNode,
          TweetNode,
          YouTubeNode,
          ImageNode,
          DateTimeNode,
          KeywordNode,
        ],
        theme: editorTheme,
      }),
    [],
  );

  const setAnchorRef = React.useCallback((element: HTMLDivElement | null) => {
    if (element) {
      setFloatingAnchorElem(element);
    }
  }, []);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border bg-card",
        className,
      )}
    >
      <LexicalExtensionComposer extension={appExtension} contentEditable={null}>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          {!readOnly ? (
            <ToolbarPlugin>
              {({ blockType }) => (
                <div className="sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-1">
                  <HistoryToolbarPlugin />
                  <Separator orientation="vertical" className="h-7!" />
                  <BlockFormatDropDown>
                    <FormatParagraph />
                    <FormatHeading levels={["h1", "h2", "h3"]} />
                    <FormatNumberedList />
                    <FormatBulletedList />
                    <FormatCheckList />
                    <FormatCodeBlock />
                    <FormatQuote />
                  </BlockFormatDropDown>
                  {blockType === "code" ? (
                    <CodeLanguageToolbarPlugin />
                  ) : (
                    <>
                      <FontFamilyToolbarPlugin />
                      <Separator orientation="vertical" className="h-7!" />
                      <FontSizeToolbarPlugin />
                      <FontFormatToolbarPlugin />
                      <ClearFormattingToolbarPlugin />
                      <FontColorToolbarPlugin />
                      <FontBackgroundToolbarPlugin />
                      <ElementFormatToolbarPlugin />
                      <BlockInsertPlugin>
                        <InsertHorizontalRule />
                        <InsertImage />
                        <InsertTable />
                        <InsertColumnsLayout />
                        <InsertEmbeds />
                      </BlockInsertPlugin>
                    </>
                  )}
                </div>
              )}
            </ToolbarPlugin>
          ) : null}

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div className="min-h-0 h-full" ref={setAnchorRef}>
              <ContentEditable
                placeholder={editorPlaceholder}
                className={cn(
                  "h-full min-h-[320px] max-w-none text-sm leading-7",
                  readOnly && "cursor-default",
                  editorClassName,
                )}
              />
            </div>

            {!readOnly ? (
              <>
                <ComponentPickerMenuPlugin
                  baseOptions={pickerOptions}
                  dynamicOptionsFn={({ queryString }) =>
                    DynamicTablePickerPlugin({
                      dictionary,
                      formatMessage,
                      queryString,
                    })
                  }
                />
                <EmojiPickerPlugin />
                <AutoEmbedPlugin />
                <MentionsPlugin />
                <AutoCompletePlugin />
                <ContextMenuPlugin />
                <SpecialTextPlugin />
                <TabFocusPlugin />
                <TabIndentationPlugin />
                <CodeHighlightPlugin />
                <LexicalTablePlugin />
                <LayoutPlugin />
                <TwitterPlugin />
                <YouTubePlugin />
                <DraggableBlockPlugin
                  anchorElem={floatingAnchorElem}
                  baseOptions={pickerOptions}
                  dynamicOptionsFn={({ queryString }) =>
                    DynamicTablePickerPlugin({
                      dictionary,
                      formatMessage,
                      queryString,
                    })
                  }
                />
                <FloatingTextFormatToolbarPlugin
                  anchorElem={floatingAnchorElem}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
                <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
              </>
            ) : null}
          </div>

          {!readOnly ? (
            <ActionsPlugin>
              <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
                <div className="flex flex-1 justify-start text-xs text-gray-500">
                  <CharacterLimitPlugin
                    maxLength={NOTE_MAX_LENGTH}
                    charset="UTF-16"
                  />
                </div>
                <CounterCharacterPlugin charset="UTF-16" />
                <div className="flex flex-1 justify-end">
                  <SpeechToTextPlugin />
                  <ImportExportPlugin />
                  <EditModeTogglePlugin />
                  <ClearEditorActionPlugin />
                </div>
              </div>
            </ActionsPlugin>
          ) : null}

          <HtmlBridgePlugin
            value={value}
            readOnly={readOnly}
            onChange={onChange}
          />
        </div>
      </LexicalExtensionComposer>
    </div>
  );
}

export { XEditor };
