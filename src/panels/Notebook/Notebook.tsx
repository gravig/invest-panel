import React, { useEffect, type ComponentType } from "react";
import { Editor } from "@components/Editor";
import { Button } from "@components/Button";
import { Panel, type IRenderable } from "@src/PanelRegistry";
import type { NoteModel } from "@src/server/model/note.model";
import { Sidebar } from "./Sidebar";
import { useNotebookService } from "@src/services/notebook/NotebookServiceProvider";
import { useDebounce } from "@hooks/useDebounce";

@Panel({
  id: "notebook",
  icon: "📖",
  title: "Notebook",
  color: "red",
})
export class Notebook implements IRenderable {
  component: ComponentType<any> = () => {
    const [note, setNote] = React.useState<NoteModel | null>(null);
    const [debouncedNote] = useDebounce(note, 500);
    const services = {
      notebook: useNotebookService(),
    };

    const handleIDocumentClick = (doc: NoteModel): void => {
      setNote(doc);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setNote((doc) => (doc ? { ...doc, title: event.target.value } : doc));
    };

    const handleSave = (note: NoteModel): void => {
      if (!note) return;

      services.notebook.update(note.id, {
        title: note.title,
        content: note.content,
      });
    };

    const handleChange = (content: string): void => {
      setNote((doc) => (doc ? { ...doc, content } : doc));
    };

    const handleCreate = (): void => {
      services.notebook.create({ title: "New Document", content: "" });
    };

    const handleRemove = (): void => {
      if (!note) return;

      services.notebook.remove(note.id);
      setNote(null);
    };

    const handleExport = (): void => {
      const documents = services.notebook.notes;
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(documents));
      const downloadAnchorNode = window.document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "notebook.json");
      window.document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    useEffect(() => {
      if (debouncedNote) {
        handleSave(debouncedNote);
      }
    }, [debouncedNote]);

    return (
      <div className="flex flex-row flex-1 h-full overflow-x-hidden">
        <Sidebar documents={services.notebook.notes} onDocumentClick={handleIDocumentClick} />

        <div className="flex flex-col flex-1 gap-4 p-4 text-start">
          <div className="flex flex-row items-center justify-between gap-6">
            <input
              placeholder="Title"
              value={note?.title || ""}
              onChange={handleTitleChange}
              className="flex-1 p-2 border border-gray-300 rounded"
            />
            <div className="flex flex-row gap-2">
              <Button onClick={handleCreate}>New</Button>
              <Button onClick={handleExport}>Export</Button>
              <Button disabled={!note} onClick={handleRemove}>
                Remove
              </Button>
            </div>
          </div>

          <Editor key={note?.id} content={note?.content} onChange={handleChange} />
        </div>
      </div>
    );
  };
}
