import React from "react";
import type { IDocument } from "../Notebook";
import "./sidebar.scss";
import clsx from "clsx";

export const Sidebar = ({
  documents,
  onDocumentClick,
}: {
  documents: IDocument[];
  onDocumentClick: (doc: IDocument) => void;
}) => {
  const [expanded, setExpanded] = React.useState(true);

  return (
    <div className={clsx("sidebar flex flex-col pb-6", { "sidebar--collapsed": !expanded })}>
      <ul className="sidebar__list text-start px-1 py-2 flex-1">
        {documents.map((doc, index) => (
          <li key={index}>
            <button
              className="text-left w-full hover:bg-gray-100 px-2 py-1 cursor-pointer rounded-sm"
              onClick={() => onDocumentClick(doc)}
            >
              {doc.title}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-end">
        <button
          className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer border border-gray-300"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};
