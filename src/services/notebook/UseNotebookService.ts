import type { NoteModel } from "@src/server/model/note.model";

export type UpdateFunction = (
  id: string,
  note: Pick<NoteModel, "content" | "title">,
) => Promise<void>;
export type CreateFunction = (
  note: Pick<NoteModel, "content" | "title">,
) => Promise<void>;
export type RemoveFunction = (id: string) => Promise<void>;

export interface UseNotebookService {
  notes: NoteModel[];
  update: UpdateFunction;
  create: CreateFunction;
  remove: RemoveFunction;
}
