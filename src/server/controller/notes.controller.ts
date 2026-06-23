import { Router } from "express";
import { NotesService } from "../services/notes.service";

export class NotesController {
  static router = Router();
}

NotesController.router.get("/", async (_req, res) => {
  res.json(await NotesService.getMany());
});

NotesController.router.get("/:id", async (req, res) => {
  const note = await NotesService.getOne(req.params.id);

  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.json(note);
});

NotesController.router.post("/", async (req, res) => {
  const { title, content } = req.body;

  if (typeof title !== "string" || typeof content !== "string") {
    res.status(400).json({ error: "title and content are required" });
    return;
  }

  res.status(201).json(await NotesService.create({ title, content }));
});

NotesController.router.put("/:id", async (req, res) => {
  const { title, content } = req.body;

  if (title !== undefined && typeof title !== "string") {
    res.status(400).json({ error: "title must be a string" });
    return;
  }

  if (content !== undefined && typeof content !== "string") {
    res.status(400).json({ error: "content must be a string" });
    return;
  }

  const note = await NotesService.update(req.params.id, { title, content });

  if (!note) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.json(note);
});

NotesController.router.delete("/:id", async (req, res) => {
  const removed = await NotesService.remove(req.params.id);

  if (!removed) {
    res.status(404).json({ error: "Note not found" });
    return;
  }

  res.status(204).end();
});
