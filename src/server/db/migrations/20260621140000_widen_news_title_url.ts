import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("news", (table) => {
    table.text("title").notNullable().alter();
    table.text("url").notNullable().alter();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("news", (table) => {
    table.string("title").notNullable().alter();
    table.string("url").notNullable().alter();
  });
};
