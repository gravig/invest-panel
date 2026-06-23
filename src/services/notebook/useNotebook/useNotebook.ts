import { useEffect } from "react";
import type {
  CreateFunction,
  RemoveFunction,
  UpdateFunction,
  UseNotebookService,
} from "../UseNotebookService";
import type { NoteModel } from "@src/server/model/note.model";
import { config } from "@src/config";
import { Observable } from "@src/utils/observable";
import { useObservable } from "@src/utils/observable/useObservable";

const NOTES_API_URL = `${config.server}/api/notes`;

const _notes = new Observable<NoteModel[]>([]);
const _loading = new Observable<boolean>(false);
const _called = new Observable<boolean>(false);

export const useNotebook = (): UseNotebookService => {
  const [called, setCalled] = useObservable(_called);
  const [loading, setLoading] = useObservable(_loading);
  const [notes, setNotes] = useObservable(_notes);

  useEffect(() => {
    if (called || loading) return;

    fetch(NOTES_API_URL)
      .then((response) => response.json())
      .then(setNotes)
      .finally(() => {
        setLoading(false);
        setCalled(true);
      });
  }, [called, loading]);

  const update: UpdateFunction = async (id, note): Promise<void> => {
    const response = await fetch(`${NOTES_API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    const updated: NoteModel = await response.json();

    setNotes((docs) => docs.map((doc) => (doc.id === id ? updated : doc)));
  };

  const create: CreateFunction = async (note) => {
    const response = await fetch(NOTES_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    const created: NoteModel = await response.json();

    setNotes((docs) => [...docs, created]);
  };

  const remove: RemoveFunction = async (id) => {
    await fetch(`${NOTES_API_URL}/${id}`, { method: "DELETE" });
    setNotes((docs) => docs.filter((doc) => doc.id !== id));
  };

  return {
    notes,
    update,
    create,
    remove,
  };
};
