import type { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("news", (table) => {
    table.text("embedded").nullable();
    table.text("embedding").nullable();
    table.string("embeddingModel").nullable();
  });
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.schema.alterTable("news", (table) => {
    table.dropColumn("embedded");
    table.dropColumn("embedding");
    table.dropColumn("embeddingModel");
  });
};
