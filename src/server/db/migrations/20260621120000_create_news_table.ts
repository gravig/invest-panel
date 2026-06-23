import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.createTable("news", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("title").notNullable();
    table.text("description").nullable();
    table.string("date").nullable();
    table.string("url").notNullable();
    table.string("imageUrl").nullable();
    table.jsonb("labels").nullable();
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now());
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.dropTable("news");
};
