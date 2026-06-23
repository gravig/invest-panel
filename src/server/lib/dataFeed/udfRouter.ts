import { Router } from "express";
import type { DataFeedProvider, Resolution } from "./types";

const SUPPORTED_RESOLUTIONS: Resolution[] = ["1", "5", "15", "30", "60", "D", "W", "M"];

/**
 * Implements the subset of TradingView's UDF (Universal Data Feed) protocol
 * needed to drive a charting widget, backed by an injected DataFeedProvider.
 */
export const createUdfRouter = (provider: DataFeedProvider): Router => {
  const router = Router();

  router.get("/config", (_req, res) => {
    res.json({
      supports_search: false,
      supports_group_request: false,
      supported_resolutions: SUPPORTED_RESOLUTIONS,
      supports_marks: false,
      supports_timescale_marks: false,
      supports_time: true,
    });
  });

  router.get("/symbols", async (req, res) => {
    const { symbol } = req.query;
    if (typeof symbol !== "string") {
      res.status(400).json({ s: "error", errmsg: "symbol is required" });
      return;
    }

    try {
      res.json(await provider.getSymbolInfo(symbol));
    } catch (error) {
      res.status(500).json({ s: "error", errmsg: (error as Error).message });
    }
  });

  router.get("/history", async (req, res) => {
    const { symbol, resolution, from, to } = req.query;

    if (
      typeof symbol !== "string" ||
      typeof resolution !== "string" ||
      typeof from !== "string" ||
      typeof to !== "string"
    ) {
      res.status(400).json({ s: "error", errmsg: "symbol, resolution, from and to are required" });
      return;
    }

    try {
      const bars = await provider.getBars({
        symbol,
        resolution: resolution as Resolution,
        from: Number(from),
        to: Number(to),
      });

      if (bars.length === 0) {
        res.json({ s: "no_data" });
        return;
      }

      res.json({
        s: "ok",
        t: bars.map((bar) => bar.time),
        o: bars.map((bar) => bar.open),
        h: bars.map((bar) => bar.high),
        l: bars.map((bar) => bar.low),
        c: bars.map((bar) => bar.close),
        v: bars.map((bar) => bar.volume ?? 0),
      });
    } catch (error) {
      res.status(500).json({ s: "error", errmsg: (error as Error).message });
    }
  });

  router.get("/time", (_req, res) => {
    res.send(String(Math.floor(Date.now() / 1000)));
  });

  return router;
};
