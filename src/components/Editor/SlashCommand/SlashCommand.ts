import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionKeyDownProps, type SuggestionOptions } from "@tiptap/suggestion";
import { editorTools, type EditorTool } from "../editorTools";
import { SlashCommandList, type SlashCommandListRef } from "./SlashCommandList";

const filterTools = (query: string): EditorTool[] => {
  const search = query.trim().toLowerCase();
  if (!search) return editorTools;

  return editorTools.filter((tool) => {
    const haystack = [tool.title, tool.id, ...(tool.keywords ?? [])].join(" ").toLowerCase();
    return haystack.includes(search);
  });
};

export const SlashCommand = Extension.create({
  name: "slashCommand",

  addOptions() {
    return {
      suggestion: {
        char: "/",
        allowSpaces: false,
        startOfLine: false,
        items: ({ query }) => filterTools(query),
        command: ({ editor, range, props }) => {
          editor.chain().focus().deleteRange(range).run();
          props.run(editor);
        },
        render: () => {
          let component: ReactRenderer<SlashCommandListRef, { items: EditorTool[]; command: (item: EditorTool) => void }> | null = null;
          let unmount: (() => void) | null = null;

          return {
            onStart: (props) => {
              component = new ReactRenderer(SlashCommandList, {
                props: {
                  items: props.items,
                  command: (item: EditorTool) => props.command(item),
                },
                editor: props.editor,
              });

              unmount = props.mount(component.element as HTMLElement);
            },

            onUpdate: (props) => {
              component?.updateProps({
                items: props.items,
                command: (item: EditorTool) => props.command(item),
              });
            },

            onKeyDown: (props: SuggestionKeyDownProps) => {
              if (props.event.key === "Escape") {
                unmount?.();
                return true;
              }

              return component?.ref?.onKeyDown({ event: props.event }) ?? false;
            },

            onExit: () => {
              unmount?.();
              component?.destroy();
              component = null;
              unmount = null;
            },
          };
        },
      } satisfies Partial<SuggestionOptions<EditorTool, EditorTool>>,
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
