import { Router } from "express";
import { NewsService } from "../services/news.service";

export class NewsController {
  static router = Router();
}

interface Pagination {
  limit?: number;
  offset?: number;
}

NewsController.router.get("/", async (_req, res) => {
  const pagination: Pagination = {};
  const limit = _req.query.limit
    ? parseInt(_req.query.limit as string, 10)
    : undefined;

  const offset = _req.query.offset
    ? parseInt(_req.query.offset as string, 10)
    : undefined;

  if (limit !== undefined) {
    pagination.limit = limit;
  }
  if (offset !== undefined) {
    pagination.offset = offset;
  }

  const response = (await NewsService.getMany(pagination)).map((news) => {
    const description = news.description?.substring(0, 100) || null;

    return {
      ...news,
      description: `${description}${description && description.length === 100 ? "..." : ""}`,
    };
  });

  res.json(response);
});

NewsController.router.get("/search", async (req, res) => {
  const query = req.query.q as string;

  if (!query) {
    res.status(400).json({ error: "Missing query parameter 'q'" });
    return;
  }

  const maxDistance = req.query.maxDistance
    ? parseFloat(req.query.maxDistance as string)
    : undefined;

  if (maxDistance !== undefined && Number.isNaN(maxDistance)) {
    res.status(400).json({ error: "maxDistance must be a number" });
    return;
  }

  const rows = await NewsService.search(query, maxDistance);

  const response = rows.map((news) => {
    const description = news.description?.substring(0, 100) || null;

    return {
      ...news,
      description: `${description}${description && description.length === 100 ? "..." : ""}`,
      embedding: undefined,
    };
  });

  res.json(response);
});

NewsController.router.get("/:id", async (req, res) => {
  const news = await NewsService.getOne(req.params.id);

  if (!news) {
    res.status(404).json({ error: "News not found" });
    return;
  }

  res.json(news);
});

NewsController.router.post("/", async (req, res) => {
  const { title, description, date, url, imageUrl, labels } = req.body;

  if (typeof title !== "string" || typeof url !== "string") {
    res.status(400).json({ error: "title and url are required" });
    return;
  }

  res.status(201).json(
    await NewsService.create({
      title,
      description,
      date,
      url,
      imageUrl,
      labels,
    }),
  );
});

NewsController.router.put("/:id", async (req, res) => {
  const { title, description, date, url, imageUrl, labels } = req.body;

  if (title !== undefined && typeof title !== "string") {
    res.status(400).json({ error: "title must be a string" });
    return;
  }

  if (url !== undefined && typeof url !== "string") {
    res.status(400).json({ error: "url must be a string" });
    return;
  }

  const news = await NewsService.update(req.params.id, {
    title,
    description,
    date,
    url,
    imageUrl,
    labels,
  });

  if (!news) {
    res.status(404).json({ error: "News not found" });
    return;
  }

  res.json(news);
});

NewsController.router.delete("/:id", async (req, res) => {
  const removed = await NewsService.remove(req.params.id);

  if (!removed) {
    res.status(404).json({ error: "News not found" });
    return;
  }

  res.status(204).end();
});
