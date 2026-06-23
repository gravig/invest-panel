import React, { type ComponentType } from "react";
import clsx from "clsx";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { Panel, type IRenderable } from "@src/PanelRegistry";
import type { NewsLabel, NewsModel } from "@src/server/model/news.model";
import type { NoteModel } from "@src/server/model/note.model";
import { DataTable } from "./DataTable";
import { useNewsService } from "@src/services/news/NewsServiceProvider";
import { useNotebookService } from "@src/services/notebook/NotebookServiceProvider";
import { AddNewsDrawer } from "./AddNewsDrawer";

const newsColumnHelper = createColumnHelper<NewsModel>();

const newsColumns: ColumnDef<NewsModel, any>[] = [
  newsColumnHelper.accessor("title", { header: "Title" }),
  newsColumnHelper.accessor("description", {
    header: "Description",
    cell: (info) => info.getValue() ?? "—",
  }),
  newsColumnHelper.accessor("date", {
    header: "Date",
    cell: (info) => info.getValue() ?? "—",
  }),
  newsColumnHelper.accessor("url", {
    header: "URL",
    cell: (info) => (
      <a
        href={info.getValue()}
        target="_blank"
        rel="noreferrer"
        className="text-blue-600 underline"
      >
        {info.getValue()}
      </a>
    ),
  }),
  newsColumnHelper.accessor("labels", {
    header: "Labels",
    cell: (info) =>
      info
        .getValue()
        ?.map((label: NewsLabel) => label.value)
        .join(", ") ?? "—",
  }),
  newsColumnHelper.accessor("embeddingModel", {
    header: "Embedding Model",
    cell: (info) => info.getValue() ?? "—",
  }),
  newsColumnHelper.display({
    id: "hasEmbedding",
    header: "Embedded",
    cell: (info) => (
      <span
        className={clsx(
          "font-mono text-xs font-medium",
          info.row.original.embedding ? "text-green-600" : "text-red-500",
        )}
      >
        {info.row.original.embedding ? "true" : "false"}
      </span>
    ),
  }),
  newsColumnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
];

const notesColumnHelper = createColumnHelper<NoteModel>();

const notesColumns: ColumnDef<NoteModel, any>[] = [
  notesColumnHelper.accessor("title", { header: "Title" }),
  notesColumnHelper.accessor("content", {
    header: "Content",
    cell: (info) => {
      const content = info.getValue();
      return content.length > 120 ? `${content.slice(0, 120)}…` : content;
    },
  }),
  notesColumnHelper.accessor("createdAt", {
    header: "Created",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
  notesColumnHelper.accessor("updatedAt", {
    header: "Updated",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
  }),
];

type Tab = "news" | "notes";

@Panel({
  id: "admin",
  icon: "🛠️",
  title: "Admin",
  color: "green",
})
export class Admin implements IRenderable {
  component: ComponentType<any> = () => {
    const [tab, setTab] = React.useState<Tab>("news");
    const { news } = useNewsService();
    const { notes } = useNotebookService();
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    return (
      <div className="flex flex-1 flex-col p-4 gap-4 overflow-auto">
        <div className="flex flex-row gap-2 items-center">
          <button
            className={clsx(
              "border rounded px-2 py-0.5 cursor-pointer",
              tab === "news" ? "bg-gray-200" : "hover:bg-gray-100",
            )}
            onClick={() => setTab("news")}
          >
            News ({news.length})
          </button>
          <button
            className={clsx(
              "border rounded px-2 py-0.5 cursor-pointer",
              tab === "notes" ? "bg-gray-200" : "hover:bg-gray-100",
            )}
            onClick={() => setTab("notes")}
          >
            Notes ({notes.length})
          </button>

          {tab === "news" && (
            <button
              className="ml-auto border rounded px-2 py-0.5 cursor-pointer bg-blue-600 text-white hover:bg-blue-700 text-sm"
              onClick={() => setDrawerOpen(true)}
            >
              + Add News
            </button>
          )}
        </div>

        <div className="overflow-auto">
          {tab === "news" ? (
            <DataTable columns={newsColumns} data={news} />
          ) : (
            <DataTable columns={notesColumns} data={notes} />
          )}
        </div>

        <AddNewsDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onSuccess={() => {}}
        />
      </div>
    );
  };
}
