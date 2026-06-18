import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { EditorTool } from "../editorTools";

export type SlashCommandListProps = {
  items: EditorTool[];
  command: (item: EditorTool) => void;
};

export type SlashCommandListRef = {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
};

export const SlashCommandList = forwardRef<SlashCommandListRef, SlashCommandListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useEffect(() => {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }, [selectedIndex]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (items.length === 0) return false;

        if (event.key === "ArrowUp") {
          setSelectedIndex((index) => Math.max(index - 1, 0));
          return true;
        }

        if (event.key === "ArrowDown") {
          setSelectedIndex((index) => Math.min(index + 1, items.length - 1));
          return true;
        }

        if (event.key === "Enter") {
          command(items[selectedIndex]);
          return true;
        }

        return false;
      },
    }));

    return (
      <div className="slash-menu w-56 max-h-72 overflow-y-auto rounded-md border border-(--border) bg-(--bg) shadow-[var(--shadow)] p-1">
        {items.length === 0 ? (
          <div className="px-2 py-1.5 text-sm text-(--text)">No matching tools</div>
        ) : (
          items.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              type="button"
              onMouseEnter={() => setSelectedIndex(index)}
              onClick={() => command(item)}
              className={[
                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-left transition-colors",
                index === selectedIndex
                  ? "bg-(--accent-bg) text-(--accent)"
                  : "text-(--text-h) hover:bg-(--accent-bg)",
              ].join(" ")}
            >
              <span className="w-7 shrink-0 text-center font-medium">{item.label}</span>
              <span>{item.title}</span>
            </button>
          ))
        )}
      </div>
    );
  },
);

SlashCommandList.displayName = "SlashCommandList";
