import { TestBondData } from '../types';

const mockTestData: TestBondData[] = [
  { ticker: 'TEST1', price: 95.50, yield: 8.2, maturityDate: '2025-12-31' },
  { ticker: 'TEST2', price: 87.25, yield: 9.8, maturityDate: '2026-06-30' },
  { ticker: 'TEST3', price: 92.10, yield: 7.5, maturityDate: '2027-03-15' },
];

export const fetchScrapedData = async (): Promise<TestBondData[]> => {
  // Simulate scraping delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return mockTestData.map(data => ({
    ...data,
    price: data.price + (Math.random() - 0.5) * 5,
    yield: data.yield + (Math.random() - 0.5) * 1,
  }));
};