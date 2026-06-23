export type Resolution = "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M";

export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export interface SymbolInfo {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  type: string;
  session: string;
  timezone: string;
  minmov: number;
  pricescale: number;
  has_intraday: boolean;
  supported_resolutions: Resolution[];
}

export interface HistoryParams {
  symbol: string;
  resolution: Resolution;
  from: number;
  to: number;
}

export interface DataFeedProvider {
  getSymbolInfo(symbol: string): Promise<SymbolInfo>;
  getBars(params: HistoryParams): Promise<Bar[]>;
}
