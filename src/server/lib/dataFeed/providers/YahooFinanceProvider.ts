import type { Bar, DataFeedProvider, HistoryParams, Resolution, SymbolInfo } from "../types";

const RESOLUTION_TO_YAHOO_INTERVAL: Record<Resolution, string> = {
  "1": "1m",
  "5": "5m",
  "15": "15m",
  "30": "30m",
  "60": "60m",
  D: "1d",
  W: "1wk",
  M: "1mo",
};

// Yahoo Finance uses its own ticker conventions for indices (e.g. "^GSPC" for the S&P 500).
const SYMBOL_TO_YAHOO_TICKER: Record<string, string> = {
  SPX: "^GSPC",
};

interface YahooChartResponse {
  chart: {
    result:
      | Array<{
          meta: { exchangeName: string; instrumentType: string; timezone: string };
          timestamp: number[];
          indicators: {
            quote: Array<{
              open: number[];
              high: number[];
              low: number[];
              close: number[];
              volume: number[];
            }>;
          };
        }>
      | null;
    error: { code: string; description: string } | null;
  };
}

export class YahooFinanceProvider implements DataFeedProvider {
  private resolveTicker(symbol: string): string {
    return SYMBOL_TO_YAHOO_TICKER[symbol] ?? symbol;
  }

  async getSymbolInfo(symbol: string): Promise<SymbolInfo> {
    return {
      symbol,
      full_name: symbol,
      description: symbol,
      exchange: "INDEX",
      type: "index",
      session: "24x7",
      timezone: "Etc/UTC",
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      supported_resolutions: Object.keys(RESOLUTION_TO_YAHOO_INTERVAL) as Resolution[],
    };
  }

  async getBars({ symbol, resolution, from, to }: HistoryParams): Promise<Bar[]> {
    const ticker = this.resolveTicker(symbol);
    const interval = RESOLUTION_TO_YAHOO_INTERVAL[resolution] ?? "1d";

    const url = new URL(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}`);
    url.searchParams.set("period1", String(from));
    url.searchParams.set("period2", String(to));
    url.searchParams.set("interval", interval);

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance request failed: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as YahooChartResponse;

    if (data.chart.error) {
      throw new Error(data.chart.error.description);
    }

    const result = data.chart.result?.[0];
    if (!result) {
      return [];
    }

    const { timestamp, indicators } = result;
    const quote = indicators.quote[0];

    return timestamp.reduce<Bar[]>((bars, time, index) => {
      const open = quote.open[index];
      const high = quote.high[index];
      const low = quote.low[index];
      const close = quote.close[index];

      if (open == null || high == null || low == null || close == null) {
        return bars;
      }

      bars.push({ time, open, high, low, close, volume: quote.volume[index] ?? undefined });
      return bars;
    }, []);
  }
}
