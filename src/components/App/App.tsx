import { FlexLayout } from "@components/FlexLayout";
import { NewsServiceProvider } from "@src/services/news/NewsServiceProvider";
import { useNews } from "@src/services/news/useNews";
import { NotebookServiceProvider } from "@src/services/notebook/NotebookServiceProvider";
import { useNotebook } from "@src/services/notebook/useNotebook";
import { SettingsServiceProvider } from "@src/services/settings/SettingsServiceProvider";
import type { UseSettingsService } from "@src/services/settings/UseSettingsService";

const useSettings = (): UseSettingsService => {
  // Placeholder for actual settings logic
  return {};
};

export const App = () => {
  return (
    <SettingsServiceProvider service={useSettings}>
      <NotebookServiceProvider service={useNotebook}>
        <NewsServiceProvider service={useNews}>
          <FlexLayout />
        </NewsServiceProvider>
      </NotebookServiceProvider>
    </SettingsServiceProvider>
  );
};
