import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { StaticToolbar } from "./StaticToolbar";
import "./editor.scss";

const extensions = [StarterKit, TextStyleKit];

export const Editor = () => {
  const editor = useEditor({
    extensions,
    content: "",
  });

  return (
    <div className="editor w-full h-full border border-gray-300 rounded-md flex flex-col overflow-hidden">
      <StaticToolbar editor={editor} />
      <EditorContent className="w-full flex-1 min-h-0 overflow-y-auto p-2" editor={editor} />
    </div>
  );
};
