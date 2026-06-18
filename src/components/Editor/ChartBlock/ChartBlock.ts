import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ChartBlockView } from "./ChartBlockView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    chartBlock: {
      insertChart: () => ReturnType;
    };
  }
}

export const ChartBlock = Node.create({
  name: "chartBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  parseHTML() {
    return [{ tag: 'div[data-type="chart-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "chart-block" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ChartBlockView);
  },

  addCommands() {
    return {
      insertChart:
        () =>
        ({ commands }) =>
          commands.insertContent({ type: this.name }),
    };
  },
});
