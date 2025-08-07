export interface BondData {
  ticker: string;
  last: number;
  change: number;
  days: number;
  tna: number;
  tem: number;
  tea: number;
}

export interface MarketDataItem {
  ticker: string;
  last: number;
  change: number;
  volume?: number;
  high?: number;
  low?: number;
}

export interface TestBondData {
  ticker: string;
  price: number;
  yield: number;
  maturityDate: string;
}

export interface CarryTradeData {
  ticker: string;
  bondPrice: number;
  days: number;
  tna: number;
  tea: number;
  dollarPrice: number;
  profitDays: number;
  profitPercent: number;
  annualizedReturn: number;
}

export interface ChartBandData {
  days: number;
  lowerBound: number;
  upperBound: number;
  middle: number;
}

export interface AIStreamChunk {
  text: string;
  isComplete: boolean;
}