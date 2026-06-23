import path from "path";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(`Config directory: ${__dirname}`);

export const config = {
  dataDir: path.resolve(__dirname, "../../data"),
  shortsDir: path.resolve(__dirname, "../../data/shorts"),
};
