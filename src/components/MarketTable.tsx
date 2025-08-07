import React from 'react';
import { MarketDataItem } from '../types';
import { UpArrowIcon, DownArrowIcon } from './IconComponents';

interface MarketTableProps {
  data: MarketDataItem[];
}

const MarketTable: React.FC<MarketTableProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => b.change - a.change);

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6">
      <div className="overflow-y-auto max-h-[600px]">
        <table className="min-w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-200 uppercase bg-gray-800 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-3 py-3">Ticker</th>
              <th scope="col" className="px-3 py-3 text-right">Último</th>
              <th scope="col" className="px-3 py-3 text-right">Var %</th>
              <th scope="col" className="px-3 py-3 text-right">Volumen</th>
              <th scope="col" className="px-3 py-3 text-right">Máximo</th>
              <th scope="col" className="px-3 py-3 text-right">Mínimo</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.ticker} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150">
                <th scope="row" className="px-3 py-4 font-medium text-gray-200 whitespace-nowrap">
                  {item.ticker}
                </th>
                <td className="px-3 py-4 text-right">${item.last.toFixed(2)}</td>
                <td className={`px-3 py-4 text-right font-semibold ${item.change >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                  <div className="flex items-center justify-end gap-1">
                    {item.change > 0 ? <UpArrowIcon /> : item.change < 0 ? <DownArrowIcon /> : null}
                    {item.change.toFixed(2)}%
                  </div>
                </td>
                <td className="px-3 py-4 text-right">
                  {item.volume ? item.volume.toLocaleString() : 'N/A'}
                </td>
                <td className="px-3 py-4 text-right">
                  {item.high ? `$${item.high.toFixed(2)}` : 'N/A'}
                </td>
                <td className="px-3 py-4 text-right">
                  {item.low ? `$${item.low.toFixed(2)}` : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketTable;