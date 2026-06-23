import { nanoid } from "nanoid";
import { useLocalStorage } from "@hooks/useLocalStorage";
import type { CreateFunction, UpdateFunction, UseNotebookService } from "../UseNotebookService";
import type { NoteModel } from "@src/server/model/note.model";

export const useLocalStorageNotebook = (): UseNotebookService => {
  const key = "notebook-documents" as const;
  const [storedNotes, setNotes] = useLocalStorage<NoteModel[]>(key, []);

  const update: UpdateFunction = async (id, note): Promise<void> => {
    setNotes((docs) => {
      return docs.map((doc) => (doc.id === id ? { ...doc, ...note } : doc));
    });
  };

  const create: CreateFunction = async (note): Promise<void> => {
    const newNote: NoteModel = {
      id: nanoid(),
      ...note,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes((docs) => [...docs, newNote]);
  };

  const remove = async (id: string): Promise<void> => {
    setNotes((docs) => docs.filter((doc) => doc.id !== id));
  };

  return {
    notes: storedNotes,
    update,
    create,
    remove,
  };
};
