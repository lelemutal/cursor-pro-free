import { MarketDataItem } from '../types';

export const fetchMarketData = async (url: string, tickers: string[]): Promise<MarketDataItem[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock data generation based on tickers
  return tickers.map(ticker => ({
    ticker,
    last: Math.random() * 1000 + 50,
    change: (Math.random() - 0.5) * 10,
    volume: Math.floor(Math.random() * 1000000),
    high: Math.random() * 1000 + 50,
    low: Math.random() * 1000 + 50,
  }));
};