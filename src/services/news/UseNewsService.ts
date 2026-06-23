import type { NewsModel } from "@src/server/model/news.model";

export type CreateNewsFunction = (
  news: Pick<
    NewsModel,
    "title" | "labels" | "date" | "imageUrl" | "url" | "description"
  >,
) => Promise<NewsModel>;

export interface UseNewsService {
  loading: boolean;
  news: NewsModel[];
  create: CreateNewsFunction;
}
