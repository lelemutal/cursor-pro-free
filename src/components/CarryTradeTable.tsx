import React from 'react';
import { CarryTradeData } from '../types';

interface CarryTradeTableProps {
  data: CarryTradeData[];
  mepRate: number;
}

const CarryTradeTable: React.FC<CarryTradeTableProps> = ({ data, mepRate }) => {
  const sortedData = [...data].sort((a, b) => b.annualizedReturn - a.annualizedReturn);

  return (
    <div className="overflow-y-auto max-h-[600px]">
      <div className="mb-4 p-3 bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-300">
          <span className="font-medium">Tipo de Cambio MEP:</span> ${mepRate.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Los cálculos se basan en la conversión de pesos a dólares usando el tipo de cambio MEP actual.
        </p>
      </div>
      
      <table className="min-w-full text-sm text-left text-gray-400">
        <thead className="text-xs text-gray-200 uppercase bg-gray-800 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-3 py-3">Ticker</th>
            <th scope="col" className="px-3 py-3 text-right">Precio ARS</th>
            <th scope="col" className="px-3 py-3 text-right">Precio USD</th>
            <th scope="col" className="px-3 py-3 text-right">Días</th>
            <th scope="col" className="px-3 py-3 text-right">TNA</th>
            <th scope="col" className="px-3 py-3 text-right">TEA</th>
            <th scope="col" className="px-3 py-3 text-right">Días Ganancia</th>
            <th scope="col" className="px-3 py-3 text-right">Ganancia %</th>
            <th scope="col" className="px-3 py-3 text-right">Retorno Anualizado</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800">
          {sortedData.map((item) => (
            <tr key={item.ticker} className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-150">
              <th scope="row" className="px-3 py-4 font-medium text-gray-200 whitespace-nowrap">
                {item.ticker}
              </th>
              <td className="px-3 py-4 text-right">${item.bondPrice.toFixed(2)}</td>
              <td className="px-3 py-4 text-right font-medium text-green-400">
                ${item.dollarPrice.toFixed(2)}
              </td>
              <td className="px-3 py-4 text-right">{item.days}</td>
              <td className="px-3 py-4 text-right">{item.tna.toFixed(2)}%</td>
              <td className="px-3 py-4 text-right">{item.tea.toFixed(2)}%</td>
              <td className="px-3 py-4 text-right">
                <span className={item.profitDays > 0 ? 'text-green-400' : 'text-red-500'}>
                  {item.profitDays}
                </span>
              </td>
              <td className="px-3 py-4 text-right">
                <span className={item.profitPercent > 0 ? 'text-green-400' : 'text-red-500'}>
                  {item.profitPercent.toFixed(2)}%
                </span>
              </td>
              <td className="px-3 py-4 text-right font-bold">
                <span className={item.annualizedReturn > 0 ? 'text-blue-400' : 'text-red-500'}>
                  {item.annualizedReturn.toFixed(2)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CarryTradeTable;