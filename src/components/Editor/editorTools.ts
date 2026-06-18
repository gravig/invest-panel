import type { Editor } from "@tiptap/react";

export type EditorToolGroup = "history" | "heading" | "mark" | "block" | "insert";

export type EditorTool = {
  id: string;
  label: string;
  title: string;
  group: EditorToolGroup;
  keywords?: string[];
  isActive?: (editor: Editor) => boolean;
  canRun?: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
};

const setLink = (editor: Editor) => {
  const previousUrl = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("URL", previousUrl ?? "");

  if (url === null) return;

  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
};

export const editorTools: EditorTool[] = [
  {
    id: "undo",
    label: "↺",
    title: "Undo",
    group: "history",
    canRun: (editor) => editor.can().undo(),
    run: (editor) => editor.chain().focus().undo().run(),
  },
  {
    id: "redo",
    label: "↻",
    title: "Redo",
    group: "history",
    canRun: (editor) => editor.can().redo(),
    run: (editor) => editor.chain().focus().redo().run(),
  },
  {
    id: "paragraph",
    label: "P",
    title: "Paragraph",
    group: "heading",
    isActive: (editor) => editor.isActive("paragraph"),
    run: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    id: "heading1",
    label: "H1",
    title: "Heading 1",
    group: "heading",
    keywords: ["h1", "title"],
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    id: "heading2",
    label: "H2",
    title: "Heading 2",
    group: "heading",
    keywords: ["h2"],
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    id: "heading3",
    label: "H3",
    title: "Heading 3",
    group: "heading",
    keywords: ["h3"],
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    id: "heading4",
    label: "H4",
    title: "Heading 4",
    group: "heading",
    keywords: ["h4"],
    isActive: (editor) => editor.isActive("heading", { level: 4 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
  },
  {
    id: "heading5",
    label: "H5",
    title: "Heading 5",
    group: "heading",
    keywords: ["h5"],
    isActive: (editor) => editor.isActive("heading", { level: 5 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 5 }).run(),
  },
  {
    id: "heading6",
    label: "H6",
    title: "Heading 6",
    group: "heading",
    keywords: ["h6"],
    isActive: (editor) => editor.isActive("heading", { level: 6 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 6 }).run(),
  },
  {
    id: "bold",
    label: "B",
    title: "Bold",
    group: "mark",
    isActive: (editor) => editor.isActive("bold"),
    run: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    id: "italic",
    label: "I",
    title: "Italic",
    group: "mark",
    isActive: (editor) => editor.isActive("italic"),
    run: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    id: "underline",
    label: "U",
    title: "Underline",
    group: "mark",
    isActive: (editor) => editor.isActive("underline"),
    run: (editor) => editor.chain().focus().toggleUnderline().run(),
  },
  {
    id: "strike",
    label: "S",
    title: "Strikethrough",
    group: "mark",
    keywords: ["strikethrough"],
    isActive: (editor) => editor.isActive("strike"),
    run: (editor) => editor.chain().focus().toggleStrike().run(),
  },
  {
    id: "code",
    label: "</>",
    title: "Inline code",
    group: "mark",
    isActive: (editor) => editor.isActive("code"),
    run: (editor) => editor.chain().focus().toggleCode().run(),
  },
  {
    id: "bulletList",
    label: "•—",
    title: "Bullet list",
    group: "block",
    keywords: ["ul"],
    isActive: (editor) => editor.isActive("bulletList"),
    run: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    id: "orderedList",
    label: "1—",
    title: "Ordered list",
    group: "block",
    keywords: ["ol", "numbered list"],
    isActive: (editor) => editor.isActive("orderedList"),
    run: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    id: "blockquote",
    label: "❝",
    title: "Blockquote",
    group: "block",
    keywords: ["quote"],
    isActive: (editor) => editor.isActive("blockquote"),
    run: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    id: "codeBlock",
    label: "{ }",
    title: "Code block",
    group: "block",
    isActive: (editor) => editor.isActive("codeBlock"),
    run: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    id: "link",
    label: "🔗",
    title: "Link",
    group: "insert",
    isActive: (editor) => editor.isActive("link"),
    run: setLink,
  },
  {
    id: "horizontalRule",
    label: "―",
    title: "Horizontal rule",
    group: "insert",
    keywords: ["hr", "divider"],
    run: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    id: "clear",
    label: "Clear",
    title: "Clear formatting",
    group: "insert",
    run: (editor) => editor.chain().focus().clearNodes().unsetAllMarks().run(),
  },
  {
    id: "chart",
    label: "📊",
    title: "Insert Chart",
    group: "insert",
    run: (editor) => editor.chain().focus().insertChart().run(),
  },
];
