import { db } from "../db/knex";
import type { NoteModel } from "../model/note.model";

interface NoteRow {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const toNoteModel = (row: NoteRow): NoteModel => ({
  id: row.id,
  title: row.title,
  content: row.content,
  createdAt: row.createdAt.getTime(),
  updatedAt: row.updatedAt.getTime(),
});

export class NotesService {
  static async getMany(): Promise<NoteModel[]> {
    const rows = await db<NoteRow>("notes").select().orderBy("createdAt", "desc");
    return rows.map(toNoteModel);
  }

  static async getOne(id: string): Promise<NoteModel | undefined> {
    const row = await db<NoteRow>("notes").where({ id }).first();
    return row && toNoteModel(row);
  }

  static async create(input: { title: string; content: string }): Promise<NoteModel> {
    const [row] = await db<NoteRow>("notes").insert(input).returning("*");
    return toNoteModel(row);
  }

  static async update(
    id: string,
    input: Partial<{ title: string; content: string }>,
  ): Promise<NoteModel | undefined> {
    const [row] = await db<NoteRow>("notes")
      .where({ id })
      .update({ ...input, updatedAt: db.fn.now() })
      .returning("*");
    return row && toNoteModel(row);
  }

  static async remove(id: string): Promise<boolean> {
    const deletedCount = await db<NoteRow>("notes").where({ id }).del();
    return deletedCount > 0;
  }
}
