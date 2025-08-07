import React, { useState } from 'react';
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Scatter, Area, ComposedChart } from 'recharts';
import { CarryTradeData, ChartBandData } from '../types';

interface CarryTradeChartProps {
  data: CarryTradeData[];
  bandsData: ChartBandData[];
  mepRate: number;
  onMepRateChange: (rate: number) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CarryTradeData;
    return (
      <div className="bg-gray-800/90 backdrop-blur-sm p-3 border border-gray-600 rounded-lg shadow-lg">
        <p className="font-bold text-blue-400">{data.ticker}</p>
        <p className="text-sm text-gray-200">{`Días: ${data.days}`}</p>
        <p className="text-sm text-gray-200">{`TNA: ${data.tna.toFixed(2)}%`}</p>
        <p className="text-sm text-gray-200">{`Precio USD: $${data.dollarPrice.toFixed(2)}`}</p>
        <p className="text-sm text-gray-200">{`Retorno Anualizado: ${data.annualizedReturn.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const CarryTradeChart: React.FC<CarryTradeChartProps> = ({ data, bandsData, mepRate, onMepRateChange }) => {
  const [inputMepRate, setInputMepRate] = useState(mepRate.toString());

  const handleMepRateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRate = parseFloat(inputMepRate);
    if (!isNaN(newRate) && newRate > 0) {
      onMepRateChange(newRate);
    }
  };

  return (
    <section className="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-semibold text-blue-400">Análisis de Carry Trade</h2>
        <form onSubmit={handleMepRateSubmit} className="flex items-center gap-2">
          <label htmlFor="mep-rate" className="text-sm text-gray-300">MEP Rate:</label>
          <input
            id="mep-rate"
            type="number"
            step="0.01"
            value={inputMepRate}
            onChange={(e) => setInputMepRate(e.target.value)}
            className="w-24 px-2 py-1 text-sm bg-gray-700 text-gray-200 border border-gray-600 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
          >
            Actualizar
          </button>
        </form>
      </div>
      
      <ResponsiveContainer width="100%" height={500}>
        <ComposedChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          <XAxis 
            type="number" 
            dataKey="days" 
            name="Días hasta vencimiento" 
            stroke="#9ca3af" 
            tick={{ fill: '#9ca3af' }}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <YAxis 
            type="number" 
            dataKey="annualizedReturn" 
            name="Retorno Anualizado" 
            stroke="#9ca3af" 
            tick={{ fill: '#9ca3af' }}
            domain={['dataMin - 5', 'dataMax + 5']}
            tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Legend wrapperStyle={{ color: '#f3f4f6', paddingTop: '10px' }} />
          
          {/* Chart bands */}
          <Area
            dataKey="upperBound"
            data={bandsData}
            fill="#3b82f6"
            fillOpacity={0.1}
            stroke="none"
            name="Banda Superior"
          />
          <Area
            dataKey="lowerBound"
            data={bandsData}
            fill="#3b82f6"
            fillOpacity={0.1}
            stroke="none"
            name="Banda Inferior"
          />
          
          <Scatter 
            name="Carry Trade Opportunities" 
            data={data} 
            fill="#38bdf8"
            shape="circle"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  );
};

export default CarryTradeChart;