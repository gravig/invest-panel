import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

export const ExploreBlockView = ({ node, updateAttributes }: NodeViewProps) => {
  const query = node.attrs.query as string;

  return (
    <NodeViewWrapper className="explore-block" contentEditable={false}>
      <div className="flex flex-col gap-2 border border-(--border) rounded-md p-2">
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(event) => updateAttributes({ query: event.target.value })}
          placeholder="Search..."
          className="w-full px-2 py-1 text-sm rounded-md border border-(--border) bg-transparent outline-none focus:border-(--accent)"
        />
      </div>
    </NodeViewWrapper>
  );
};
