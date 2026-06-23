import { db } from "../db/knex";
import { EmbeddingService } from "../services/embedding.service";
import { NewsService } from "../services/news.service";

const BATCH_SIZE = 100;

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const run = async (): Promise<void> => {
  const pending = await NewsService.getUnembedded(BATCH_SIZE * 10);

  if (pending.length === 0) {
    console.log("[generateNewsEmbeddings] no news pending embedding");
    return;
  }

  console.log(`[generateNewsEmbeddings] embedding ${pending.length} news`);

  for (const batch of chunk(pending, BATCH_SIZE)) {
    const embeddings = await EmbeddingService.generateBatch(
      batch.map((news) => news.embedded as string),
    );

    await Promise.all(
      batch.map((news, i) =>
        NewsService.updateEmbedding(
          news.id,
          embeddings[i].embedding,
          embeddings[i].model,
        ),
      ),
    );

    console.log(`[generateNewsEmbeddings] embedded batch of ${batch.length}`);
  }
};

run()
  .catch((err) => {
    console.error("[generateNewsEmbeddings] failed:", err);
    process.exitCode = 1;
  })
  .finally(() => db.destroy());
