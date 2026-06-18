import React, { type ComponentType } from "react";
import { Editor } from "@components/Editor";
import { Button } from "@components/Button";
import { Panel, type IRenderable } from "@src/PanelRegistry";
import { useLocalStorageNotebook } from "@src/services/notebook/useLocalStorageNotebook";
import { Sidebar } from "./Sidebar";

export type IDocument = {
  id: string;
  title: string;
  content: string;
};

@Panel({
  id: "notebook",
  icon: "📖",
  title: "Notebook",
  color: "red",
})
export class Notebook implements IRenderable {
  component: ComponentType<any> = () => {
    const [document, setDocument] = React.useState<IDocument | null>(null);
    const services = {
      notebook: useLocalStorageNotebook(),
    };
    const handleIDocumentClick = (doc: IDocument): void => {
      setDocument(doc);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
      setDocument((doc) => (doc ? { ...doc, title: event.target.value } : doc));
    };

    const handleSave = (): void => {
      if (!document) return;

      services.notebook.update(document.id, { title: document.title, content: document.content });
    };

    const handleChange = (content: string): void => {
      setDocument((doc) => (doc ? { ...doc, content } : doc));
    };

    const handleCreate = (): void => {
      services.notebook.create({ title: "New Document", content: "" });
    };

    const handleRemove = (): void => {
      if (!document) return;

      services.notebook.remove(document.id);
      setDocument(null);
    };

    const handleExport = (): void => {
      const documents = services.notebook.documents;
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(documents));
      const downloadAnchorNode = window.document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "notebook.json");
      window.document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    };

    return (
      <div className="flex flex-row flex-1 h-full overflow-x-hidden">
        <Sidebar documents={services.notebook.documents} onDocumentClick={handleIDocumentClick} />

        <div className="flex flex-1 p-4 flex-col text-start gap-4">
          <div className="flex flex-row items-center gap-6 justify-between">
            <input
              placeholder="Title"
              value={document?.title || ""}
              onChange={handleTitleChange}
              className="p-2 flex-1 border rounded border-gray-300"
            />
            <div className="flex flex-row gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button onClick={handleCreate}>New</Button>
              <Button onClick={handleExport}>Export</Button>
              <Button disabled={!document} onClick={handleRemove}>
                Remove
              </Button>
            </div>
          </div>
          <Editor key={document?.id} content={document?.content} onChange={handleChange} />
        </div>
      </div>
    );
  };
}
