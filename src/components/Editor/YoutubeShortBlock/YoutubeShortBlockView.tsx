import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";

const SHORT_WIDTH = 160;
const SHORT_HEIGHT = (SHORT_WIDTH / 9) * 16;

export const YoutubeShortBlockView = ({ node }: NodeViewProps) => {
  const shortId = node.attrs.shortId as string;
  const transcription = "Example transcription text for the YouTube short.";

  return (
    <NodeViewWrapper className="youtube-short-block" contentEditable={false}>
      <div className="flex flex-row gap-2 border border-gray-300 rounded-md p-2 items-start justify-start">
        <div
          className="rounded-md border border-(--border) overflow-hidden"
          style={{ width: SHORT_WIDTH, height: SHORT_HEIGHT }}
        >
          <iframe
            width={SHORT_WIDTH}
            height={SHORT_HEIGHT}
            src={`https://www.youtube.com/embed/${shortId}`}
            title="YouTube Short"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <div className="flex flex-col">
          <div className="text-sm text-gray-600">
            <span className="font-bold">Transcription:</span>
            <p className="m-0!">{transcription}</p>
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
