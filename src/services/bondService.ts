import { BondData } from '../types';

// Mock data for demonstration - replace with real API calls
const mockBondData: BondData[] = [
  { ticker: 'T15E7', last: 85.25, change: 2.1, days: 547, tna: 45.2, tem: 3.5, tea: 47.8 },
  { ticker: 'T25E7', last: 78.50, change: -1.2, days: 912, tna: 48.1, tem: 3.8, tea: 51.2 },
  { ticker: 'T30E7', last: 72.80, change: 0.8, days: 1278, tna: 50.3, tem: 4.1, tea: 54.1 },
  { ticker: 'T35E7', last: 68.90, change: 1.5, days: 1643, tna: 52.1, tem: 4.3, tea: 56.8 },
  { ticker: 'T40E7', last: 65.20, change: -0.5, days: 2009, tna: 53.8, tem: 4.5, tea: 59.2 },
];

export const fetchBondData = async (): Promise<BondData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Add some randomness to simulate real-time data
  return mockBondData.map(bond => ({
    ...bond,
    last: bond.last + (Math.random() - 0.5) * 2,
    change: bond.change + (Math.random() - 0.5) * 1,
  }));
};

export const fetchMepRate = async (): Promise<number> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock MEP rate with some variation
  const baseMepRate = 1342.89;
  return baseMepRate + (Math.random() - 0.5) * 20;
};