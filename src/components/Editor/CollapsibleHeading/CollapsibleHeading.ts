import Heading from "@tiptap/extension-heading";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { CollapsibleHeadingView } from "./CollapsibleHeadingView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    collapsibleHeading: {
      toggleHeadingCollapsed: () => ReturnType;
    };
  }
}

export const CollapsibleHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      collapsed: {
        default: false,
        parseHTML: (element) => element.getAttribute("data-collapsed") === "true",
        renderHTML: (attributes) => (attributes.collapsed ? { "data-collapsed": "true" } : {}),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(CollapsibleHeadingView);
  },

  addCommands() {
    return {
      ...this.parent?.(),
      toggleHeadingCollapsed:
        () =>
        ({ editor }) => {
          if (!editor.isActive(this.name)) return false;

          const collapsed = editor.getAttributes(this.name).collapsed as boolean;
          return editor.commands.updateAttributes(this.name, { collapsed: !collapsed });
        },
    };
  },

  addProseMirrorPlugins() {
    const parentPlugins = this.parent?.() ?? [];

    return [
      ...parentPlugins,
      new Plugin({
        key: new PluginKey("collapsibleHeadingFold"),
        props: {
          decorations(state) {
            const { doc } = state;
            const decorations: Decoration[] = [];
            let hideUntilLevel: number | null = null;

            doc.forEach((node, offset) => {
              if (node.type.name === "heading") {
                if (hideUntilLevel !== null && (node.attrs.level as number) <= hideUntilLevel) {
                  hideUntilLevel = null;
                }

                if (hideUntilLevel !== null) {
                  decorations.push(Decoration.node(offset, offset + node.nodeSize, { class: "is-folded" }));
                  return;
                }

                if (node.attrs.collapsed) {
                  hideUntilLevel = node.attrs.level as number;
                }

                return;
              }

              if (hideUntilLevel !== null) {
                decorations.push(Decoration.node(offset, offset + node.nodeSize, { class: "is-folded" }));
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});
