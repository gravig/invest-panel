import { Node, mergeAttributes, nodeInputRule, nodePasteRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { YoutubeShortBlockView } from "./YoutubeShortBlockView";

const YOUTUBE_SHORT_URL_PATTERN = "https?://(?:www\\.)?youtube\\.com/shorts/([a-zA-Z0-9_-]+)(?:\\?\\S*)?";

/** Matches every occurrence in pasted text; `matchAll` requires the global flag. */
const PASTE_REGEX = new RegExp(YOUTUBE_SHORT_URL_PATTERN, "g");

/**
 * Fires once the URL is followed by whitespace while typing.
 * Group 1 is the full URL (used to locate the replace range), group 2 is the short id.
 */
const INPUT_REGEX = new RegExp(`(?:^|\\s)(${YOUTUBE_SHORT_URL_PATTERN})\\s$`);

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    youtubeShortBlock: {
      insertYoutubeShort: (shortId: string) => ReturnType;
    };
  }
}

export const YoutubeShortBlock = Node.create({
  name: "youtubeShortBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      shortId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-short-id"),
        renderHTML: (attributes) => ({ "data-short-id": attributes.shortId }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="youtube-short-block"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "youtube-short-block" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(YoutubeShortBlockView);
  },

  addCommands() {
    return {
      insertYoutubeShort:
        (shortId: string) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { shortId } }),
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => ({ shortId: match[2] }),
      }),
    ];
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: PASTE_REGEX,
        type: this.type,
        getAttributes: (match) => ({ shortId: match[1] }),
      }),
    ];
  },
});
