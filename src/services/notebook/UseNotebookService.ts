import type { IDocument } from "@panels/Notebook";

export interface IUseNotebookService {
  documents: IDocument[];
  update: (id: string, document: Omit<IDocument, "id">) => Promise<void>;
  create: (document: Omit<IDocument, "id">) => Promise<void>;
  remove: (id: string) => Promise<void>;
}
