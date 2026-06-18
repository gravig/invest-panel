import { Fragment } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import { editorTools } from "./editorTools";

const toolbarEntries = editorTools.map((tool, index) => ({
  tool,
  showDivider: index > 0 && editorTools[index - 1].group !== tool.group,
}));

type StaticToolbarProps = {
  editor: Editor | null;
};

type ToolbarButtonProps = {
  label: string;
  title: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

const ToolbarButton = ({ label, title, isActive, disabled, onClick }: ToolbarButtonProps) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={[
      "min-w-8 h-8 px-2 rounded-md text-sm font-medium transition-colors",
      "hover:bg-(--accent-bg) disabled:opacity-40 disabled:hover:bg-transparent",
      isActive ? "bg-(--accent-bg) text-(--accent)" : "text-(--text-h)",
    ].join(" ")}
  >
    {label}
  </button>
);

const ToolbarDivider = () => <div className="w-px h-6 bg-(--border) mx-1" />;

export const StaticToolbar = ({ editor }: StaticToolbarProps) => {
  const toolState = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null;
      return editorTools.reduce<Record<string, { isActive: boolean; canRun: boolean }>>((acc, tool) => {
        acc[tool.id] = {
          isActive: tool.isActive?.(editor) ?? false,
          canRun: tool.canRun?.(editor) ?? true,
        };
        return acc;
      }, {});
    },
  });

  if (!editor || !toolState) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-1 border-b border-(--border) shrink-0">
      {toolbarEntries.map(({ tool, showDivider }) => (
        <Fragment key={tool.id}>
          {showDivider && <ToolbarDivider />}
          <ToolbarButton
            label={tool.label}
            title={tool.title}
            isActive={toolState[tool.id]?.isActive}
            disabled={!toolState[tool.id]?.canRun}
            onClick={() => tool.run(editor)}
          />
        </Fragment>
      ))}
    </div>
  );
};
