import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ExploreBlockView } from "./ExploreBlockView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    exploreBlock: {
      insertExplore: () => ReturnType;
    };
  }
}

export const ExploreBlock = Node.create({
  name: "exploreBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      query: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-query") ?? "",
        renderHTML: (attributes) => ({ "data-query": attributes.query }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="explore-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "explore-block" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExploreBlockView);
  },

  addCommands() {
    return {
      insertExplore:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});
