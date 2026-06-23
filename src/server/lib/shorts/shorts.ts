import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import OpenAI from "openai";
import ytDlp from "yt-dlp-exec";
import type { ShortModel } from "../../model/short.model";
import { config } from "../../config";

const loadShortsData = async (): Promise<ShortModel[]> => {
  const location = path.resolve(config.dataDir, "shorts.json");
  if (fs.existsSync(location)) {
    const data = fs.readFileSync(location, "utf-8");
    return JSON.parse(data) as ShortModel[];
  }
  return [];
};

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const VIDEO_URLS = [
  "https://www.youtube.com/shorts/o2kAqIyhHUI",
  "https://www.youtube.com/shorts/xhVGpGS0zJE",
];

const downloadVideo = async (url: string, destPath: string): Promise<void> => {
  await ytDlp(url, { output: destPath, format: "mp4" });
};

/**
 * Loads a YouTube Shorts video and saves the video data.
 * Creates a transcription of the video using OpenAI's Whisper API.
 */
export const shorts = async (urls: string[]): Promise<ShortModel[]> => {
  const shortsData = await loadShortsData();
  const results: ShortModel[] = [];

  for (const [_index, url] of urls.entries()) {
    if (shortsData.some((short: ShortModel) => short.url === url)) {
      console.log(`[Skipping] Short already processed: ${url}`);
      continue;
    }
    const videoId = url.split("/").pop();
    const videoPath = path.resolve(config.shortsDir, `short-${videoId}.mp4`);
    await downloadVideo(url, videoPath);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(videoPath),
      model: "whisper-1",
    });

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: transcription.text,
    });

    results.push({
      url,
      videoPath,
      transcript: transcription.text,
      embedding: embeddingResponse.data[0].embedding,
    });
  }

  fs.writeFileSync(
    path.resolve(config.dataDir, "shorts.json"),
    JSON.stringify(results, null, 2),
  );

  return results;
};
