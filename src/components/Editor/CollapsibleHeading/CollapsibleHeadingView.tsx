import type { NodeViewProps } from "@tiptap/react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export const CollapsibleHeadingView = ({ node, updateAttributes }: NodeViewProps) => {
  const level = node.attrs.level as number;
  const collapsed = node.attrs.collapsed as boolean;
  const Tag = `h${level}` as HeadingTag;

  return (
    <NodeViewWrapper className="collapsible-heading" data-level={level} data-collapsed={collapsed}>
      <button
        type="button"
        contentEditable={false}
        className="collapsible-heading__toggle"
        title={collapsed ? "Expand" : "Collapse"}
        onClick={() => updateAttributes({ collapsed: !collapsed })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      <NodeViewContent<HeadingTag> as={Tag} className="collapsible-heading__content" />
    </NodeViewWrapper>
  );
};
