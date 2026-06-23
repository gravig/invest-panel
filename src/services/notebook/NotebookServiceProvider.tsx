import { createService } from "@src/utils/createService";
import type { UseNotebookService } from "./UseNotebookService";

export const {
  NotebookServiceContext,
  NotebookServiceProvider,
  useNotebookService,
} = createService<UseNotebookService>("Notebook");
