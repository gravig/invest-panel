import { useEditorState, type Editor } from "@tiptap/react";

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
  const state = useEditorState({
    editor,
    selector: ({ editor }) => {
      if (!editor) return null;
      return {
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
        isBold: editor.isActive("bold"),
        isItalic: editor.isActive("italic"),
        isUnderline: editor.isActive("underline"),
        isStrike: editor.isActive("strike"),
        isCode: editor.isActive("code"),
        isParagraph: editor.isActive("paragraph"),
        isHeading1: editor.isActive("heading", { level: 1 }),
        isHeading2: editor.isActive("heading", { level: 2 }),
        isHeading3: editor.isActive("heading", { level: 3 }),
        isHeading4: editor.isActive("heading", { level: 4 }),
        isHeading5: editor.isActive("heading", { level: 5 }),
        isHeading6: editor.isActive("heading", { level: 6 }),
        isBulletList: editor.isActive("bulletList"),
        isOrderedList: editor.isActive("orderedList"),
        isBlockquote: editor.isActive("blockquote"),
        isCodeBlock: editor.isActive("codeBlock"),
        isLink: editor.isActive("link"),
      };
    },
  });

  if (!editor || !state) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previousUrl ?? "");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-1 border-b border-(--border) shrink-0">
      <ToolbarButton
        label="↺"
        title="Undo"
        disabled={!state.canUndo}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarButton
        label="↻"
        title="Redo"
        disabled={!state.canRedo}
        onClick={() => editor.chain().focus().redo().run()}
      />

      <ToolbarDivider />

      <ToolbarButton
        label="P"
        title="Paragraph"
        isActive={state.isParagraph}
        onClick={() => editor.chain().focus().setParagraph().run()}
      />
      <ToolbarButton
        label="H1"
        title="Heading 1"
        isActive={state.isHeading1}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        label="H2"
        title="Heading 2"
        isActive={state.isHeading2}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        label="H3"
        title="Heading 3"
        isActive={state.isHeading3}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />
      <ToolbarButton
        label="H4"
        title="Heading 4"
        isActive={state.isHeading4}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      />
      <ToolbarButton
        label="H5"
        title="Heading 5"
        isActive={state.isHeading5}
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
      />
      <ToolbarButton
        label="H6"
        title="Heading 6"
        isActive={state.isHeading6}
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
      />

      <ToolbarDivider />

      <ToolbarButton
        label="B"
        title="Bold"
        isActive={state.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="I"
        title="Italic"
        isActive={state.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="U"
        title="Underline"
        isActive={state.isUnderline}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        label="S"
        title="Strikethrough"
        isActive={state.isStrike}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        label="</>"
        title="Inline code"
        isActive={state.isCode}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />

      <ToolbarDivider />

      <ToolbarButton
        label="•—"
        title="Bullet list"
        isActive={state.isBulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="1—"
        title="Ordered list"
        isActive={state.isOrderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        label="❝"
        title="Blockquote"
        isActive={state.isBlockquote}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        label="{ }"
        title="Code block"
        isActive={state.isCodeBlock}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <ToolbarDivider />

      <ToolbarButton label="🔗" title="Link" isActive={state.isLink} onClick={setLink} />
      <ToolbarButton
        label="―"
        title="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <ToolbarButton
        label="Clear"
        title="Clear formatting"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      />
    </div>
  );
};
