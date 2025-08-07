import React from 'react';
import { BondData } from '../types';
import { UpArrowIcon, DownArrowIcon } from './IconComponents';

interface BondTableProps {
  data: BondData[];
}

const BondTable: React.FC<BondTableProps> = ({ data }) => {
  const sortedData = [...data].sort((a, b) => a.days - b.days);

  return (
    <div className="overflow-y-auto h-[450px]">
      <table className="min-w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-200 uppercase bg-gray-800 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-3 py-3">Ticker</th>
            <th scope="col" className="px-3 py-3 text-right">Último</th>
            <th scope="col" className="px-3 py-3 text-right">Var %</th>
            <th scope="col" className="px-3 py-3 text-right">Días</th>
            <th scope="col" className="px-3 py-3 text-right">TNA</th>
            <th scope="col" className="px-3 py-3 text-right">TEM</th>
            <th scope="col" className="px-3 py-3 text-right">TEA</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800">
          {sortedData.map((bond) => (
            <tr key={bond.ticker} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150">
              <th scope="row" className="px-3 py-4 font-medium text-gray-200 whitespace-nowrap">
                {bond.ticker}
              </th>
              <td className="px-3 py-4 text-right">${bond.last.toFixed(2)}</td>
              <td className={`px-3 py-4 text-right font-semibold ${bond.change >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                <div className="flex items-center justify-end gap-1">
                  {bond.change > 0 ? <UpArrowIcon /> : bond.change < 0 ? <DownArrowIcon /> : null}
                  {bond.change.toFixed(2)}%
                </div>
              </td>
              <td className="px-3 py-4 text-right">{bond.days}</td>
              <td className="px-3 py-4 text-right font-medium text-blue-400">{bond.tna.toFixed(2)}%</td>
              <td className="px-3 py-4 text-right">{bond.tem.toFixed(2)}%</td>
              <td className="px-3 py-4 text-right">{bond.tea.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BondTable;