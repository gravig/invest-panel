import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import type { Knex } from "knex";

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: resolve(__dirname, "../../../.env") });

const knexConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? "postgres",
    password: process.env.POSTGRES_PASSWORD ?? "postgres",
    database: process.env.POSTGRES_DB ?? "invest_db",
  },
  migrations: {
    directory: `${__dirname}/migrations`,
    extension: "ts",
  },
};

export default knexConfig;
