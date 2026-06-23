import OpenAI from "openai";
import { getEncoding } from "js-tiktoken";

const EMBEDDING_MODEL = "text-embedding-3-large";

// text-embedding-3-large uses the cl100k_base encoding and caps input at 8192 tokens.
const MAX_INPUT_TOKENS = 8191;
const encoding = getEncoding("cl100k_base");

const truncateToTokenLimit = (text: string): string => {
  const tokens = encoding.encode(text);
  return tokens.length <= MAX_INPUT_TOKENS
    ? text
    : encoding.decode(tokens.slice(0, MAX_INPUT_TOKENS));
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class EmbeddingService {
  static async generate(
    text: string,
  ): Promise<{ embedding: string; model: string }> {
    const [result] = await EmbeddingService.generateBatch([text]);
    return result;
  }

  static async generateBatch(
    texts: string[],
  ): Promise<{ embedding: string; model: string }[]> {
    if (texts.length === 0) return [];

    const response = await openai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: texts.map(truncateToTokenLimit),
    });

    return response.data.map((item) => ({
      embedding: JSON.stringify(item.embedding),
      model: response.model,
    }));
  }
}
