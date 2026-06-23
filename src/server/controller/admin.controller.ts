import { Router } from "express";
import { NotesController } from "./notes.controller";
import { NewsController } from "./news.controller";

export class AdminController {
  static router = Router();
}

AdminController.router.use("/notes", NotesController.router);
AdminController.router.use("/news", NewsController.router);
