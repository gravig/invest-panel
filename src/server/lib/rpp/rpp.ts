import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import dotenv from "dotenv";
import { z } from "zod";
import fs from "fs";
import { Website } from "../website/Website";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const NewsSchema = z.object({
  articles: z.array(
    z.object({
      title: z.string(),
      description: z.string().nullable(),
      date: z.string().nullable(),
      url: z.string(),
      image_url: z.string().nullable(),
      labels: z
        .array(z.object({ key: z.string(), value: z.string() }))
        .nullable(),
    }),
  ),
});

// Walks a zod type and renders it as a TS-style type string (e.g. "string | null", "Array<{ key: string }>").
const zodTypeToString = (schema: z.ZodType): string => {
  const def = (schema as unknown as { def: Record<string, unknown> }).def;

  switch (def.type) {
    case "string":
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      return stringifyShape(schema as z.ZodObject<z.ZodRawShape>);
    case "array":
      return `Array<${zodTypeToString(def.element as z.ZodType)}>`;
    case "nullable":
      return `${zodTypeToString(def.innerType as z.ZodType)} | null`;
    case "optional":
      return `${zodTypeToString(def.innerType as z.ZodType)} | undefined`;
    default:
      return "any";
  }
};

// Renders a zod object's shape as `{ key: "type" }`, used to describe the expected
// response shape to the model in plain language alongside the strict json_schema response_format.
const stringifyShape = (schema: z.ZodObject<z.ZodRawShape>): string => {
  const entries = Object.entries(schema.shape).map(
    ([key, value]) => `${key}: ${zodTypeToString(value as z.ZodType)}`,
  );
  return `{ ${entries.join("; ")} }`;
};

export const stringifyNewsSchema = (): string => stringifyShape(NewsSchema);

const prompt = `
  Extract articles from the page.
  Respond ONLY with valid JSON matching this shape: ${stringifyNewsSchema()}
`;

console.log({ prompt });

export const main = async () => {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
  const url = "https://nbp.pl/kategoria/aktualnosci/rpp/";
  const fileName = "rpp.json";

  const content = await Website.open(url).getContent();

  console.log("Scraped content length:", content.length);

  const completion = await openai.chat.completions.parse({
    model: "gpt-4o-mini",
    response_format: zodResponseFormat(NewsSchema, "news"),
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content,
      },
    ],
  });

  const message = completion.choices[0].message;

  if (message.refusal) {
    throw new Error(`Model refused to respond: ${message.refusal}`);
  }

  if (!message.parsed) {
    throw new Error("Failed to parse response");
  }

  const news = message.parsed.articles;

  console.log({ news });

  fs.writeFileSync(fileName, JSON.stringify(news, null, 2));
};
