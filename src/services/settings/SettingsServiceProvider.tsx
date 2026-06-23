import { createService } from "@src/utils/createService";
import type { UseSettingsService } from "./UseSettingsService";

export const {
  SettingsServiceContext,
  SettingsServiceProvider,
  useSettingsService,
} = createService<UseSettingsService>("Settings");
