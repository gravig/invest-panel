import { useEffect } from "react";
import type { NewsModel } from "@src/server/model/news.model";
import { config } from "@src/config";
import type { CreateNewsFunction, UseNewsService } from "../UseNewsService";
import { Observable } from "@src/utils/observable";
import { useObservable } from "@src/utils/observable/useObservable";

const NEWS_API_URL = `${config.server}/api/news`;

const _news = new Observable<NewsModel[]>([]);
const _loading = new Observable<boolean>(false);
const _called = new Observable<boolean>(false);

export const useNews = ({ lazy = false }: { lazy?: boolean } = {}): UseNewsService => {
  const [called, setCalled] = useObservable(_called);
  const [loading, setLoading] = useObservable(_loading);
  const [news, setNews] = useObservable(_news);

  const get = async (pagination?: { limit?: number; offset?: number }): Promise<NewsModel[]> => {
    const query = new URLSearchParams();
    query.set("limit", pagination?.limit?.toString() || "100");
    query.set("offset", pagination?.offset?.toString() || "0");

    return fetch(`${NEWS_API_URL}?${query.toString()}`).then((r) => r.json());
  };

  const create: CreateNewsFunction = async (
    news: Pick<NewsModel, "title" | "labels" | "url" | "description">,
  ): Promise<NewsModel> => {
    const response = await fetch(NEWS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(news),
    });

    if (!response.ok) {
      throw new Error("Failed to create news");
    }

    const createdNews: NewsModel = await response.json();
    setNews((prevNews) => [...prevNews, createdNews]);
    return createdNews;
  };

  useEffect(() => {
    if (lazy || called || loading) return;

    setLoading(true);
    get({ limit: 10, offset: 0 })
      .then(setNews)
      .finally(() => {
        setLoading(false);
        setCalled(true);
      });
  }, [called, loading, lazy]);

  return {
    loading,
    news,
    create,
  };
};
