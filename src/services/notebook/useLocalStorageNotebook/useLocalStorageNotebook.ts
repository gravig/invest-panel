import { nanoid } from "nanoid";
import { useLocalStorage } from "@hooks/useLocalStorage";
import type { IDocument } from "@panels/Notebook";
import type { IUseNotebookService } from "../UseNotebookService";

export const useLocalStorageNotebook = (): IUseNotebookService => {
  const key = "notebook-documents" as const;
  const [storedDocuments, setDocuments] = useLocalStorage<IDocument[]>(key, []);

  const update = async (id: string, document: Omit<IDocument, "id">): Promise<void> => {
    setDocuments((docs) => {
      return docs.map((doc) => (doc.id === id ? { ...doc, ...document } : doc));
    });
  };

  const create = async (document: Omit<IDocument, "id">): Promise<void> => {
    const newDocument: IDocument = { id: nanoid(), ...document };
    setDocuments((docs) => [...docs, newDocument]);
  };

  const remove = async (id: string): Promise<void> => {
    setDocuments((docs) => docs.filter((doc) => doc.id !== id));
  };

  return {
    documents: storedDocuments,
    update,
    create,
    remove,
  };
};
