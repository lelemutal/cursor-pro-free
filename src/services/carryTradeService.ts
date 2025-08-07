import { BondData, CarryTradeData, ChartBandData } from '../types';

export const calculateAllCarryTradeMetrics = (
  lecapData: BondData[], 
  mepRate: number
): CarryTradeData[] => {
  return lecapData.map(bond => {
    const dollarPrice = bond.last / mepRate;
    const profitDays = Math.max(0, 365 - bond.days);
    const profitPercent = (bond.tna / 100) * (profitDays / 365);
    const annualizedReturn = profitPercent * (365 / Math.max(1, profitDays));

    return {
      ticker: bond.ticker,
      bondPrice: bond.last,
      days: bond.days,
      tna: bond.tna,
      tea: bond.tea,
      dollarPrice,
      profitDays,
      profitPercent,
      annualizedReturn,
    };
  });
};

export const generateChartBands = (maxDays: number): ChartBandData[] => {
  const bands: ChartBandData[] = [];
  const step = Math.max(1, Math.floor(maxDays / 50));
  
  for (let days = 0; days <= maxDays; days += step) {
    const middle = 40 + (days / maxDays) * 20; // Base yield curve from 40% to 60%
    const spread = 5; // ±5% bands
    
    bands.push({
      days,
      lowerBound: middle - spread,
      upperBound: middle + spread,
      middle,
    });
  }
  
  return bands;
};