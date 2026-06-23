import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("notes", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("title").notNullable();
    table.text("content").notNullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("notes");
};
