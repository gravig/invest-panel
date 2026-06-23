import { createService } from "@src/utils/createService";
import type { UseNewsService } from "./UseNewsService";

export const { SettingsServiceContext, NewsServiceProvider, useNewsService } =
  createService<UseNewsService>("News");
