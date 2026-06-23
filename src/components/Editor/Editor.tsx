import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ChartBlock } from "./ChartBlock/ChartBlock";
import { ExploreBlock } from "./ExploreBlock/ExploreBlock";
import { SlashCommand } from "./SlashCommand/SlashCommand";
import { StaticToolbar } from "./StaticToolbar";
import { YoutubeShortBlock } from "./YoutubeShortBlock/YoutubeShortBlock";
import "./editor.scss";

const extensions = [StarterKit, TextStyleKit, SlashCommand, ChartBlock, YoutubeShortBlock, ExploreBlock];

type EditorProps = {
  content?: string;
  onChange?: (content: string) => void;
};

export const Editor = ({ content, onChange }: EditorProps) => {
  const editor = useEditor({
    extensions,
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
  });

  return (
    <div className="editor w-full h-full border border-gray-300 rounded-md flex flex-col overflow-hidden">
      <StaticToolbar editor={editor} />
      <EditorContent className="w-full flex-1 min-h-0 overflow-y-auto p-2" editor={editor} />
    </div>
  );
};
