import type { Knex } from "knex";

// text-embedding-3-large produces 3072-dimensional vectors.
const EMBEDDING_DIMENSIONS = 3072;

export const up = async (knex: Knex): Promise<void> => {
  await knex.raw("create extension if not exists vector");
  await knex.raw(
    `alter table "news" alter column "embedding" type vector(${EMBEDDING_DIMENSIONS}) using "embedding"::vector(${EMBEDDING_DIMENSIONS})`,
  );
};

export const down = async (knex: Knex): Promise<void> => {
  await knex.raw(`alter table "news" alter column "embedding" type text`);
};
