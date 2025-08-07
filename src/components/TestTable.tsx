import React from 'react';
import { TestBondData } from '../types';

interface TestTableProps {
  data: TestBondData[];
}

const TestTable: React.FC<TestTableProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-400">Test de Scraping de Datos</h2>
      <div className="overflow-y-auto max-h-[500px]">
        <table className="min-w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-200 uppercase bg-gray-800 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-3 py-3">Ticker</th>
              <th scope="col" className="px-3 py-3 text-right">Precio</th>
              <th scope="col" className="px-3 py-3 text-right">Rendimiento</th>
              <th scope="col" className="px-3 py-3 text-right">Vencimiento</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.ticker} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150">
                <th scope="row" className="px-3 py-4 font-medium text-gray-200 whitespace-nowrap">
                  {item.ticker}
                </th>
                <td className="px-3 py-4 text-right">${item.price.toFixed(2)}</td>
                <td className="px-3 py-4 text-right text-blue-400 font-medium">
                  {item.yield.toFixed(2)}%
                </td>
                <td className="px-3 py-4 text-right">{item.maturityDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestTable;