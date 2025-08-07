import React, { useMemo } from 'react';
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Scatter, Line } from 'recharts';
import { BondData } from '../types';

interface BondChartProps {
  data: BondData[];
}

interface TrendlineData {
    days: number;
    y: number;
}

// Helper function to calculate logarithmic regression for the trendline
const calculateLogarithmicTrendline = (data: BondData[]): TrendlineData[] => {
  const filteredData = data.filter(d => d.days > 0 && d.tna > 0);
  if (filteredData.length < 2) return [];

  let sumLnX = 0;
  let sumY = 0;
  let sumLnXY = 0;
  let sumLnX2 = 0;
  const n = filteredData.length;

  filteredData.forEach(({ days, tna }) => {
    const lnX = Math.log(days);
    sumLnX += lnX;
    sumY += tna;
    sumLnXY += lnX * tna;
    sumLnX2 += lnX * lnX;
  });
  
  const b = (n * sumLnXY - sumLnX * sumY) / (n * sumLnX2 - sumLnX * sumLnX);
  const a = (sumY - b * sumLnX) / n;

  if (isNaN(a) || isNaN(b)) return [];

  const xValues = filteredData.map(d => d.days);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);

  const points: TrendlineData[] = [];
  const step = (maxX - minX) / 100; // Generate 100 points for a smooth curve
  for (let i = 0; i <= 100; i++) {
    const daysValue = minX + i * step;
    if (daysValue > 0) {
      points.push({ days: daysValue, y: a + b * Math.log(daysValue) });
    }
  }
  return points;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as BondData;
    return (
      <div className="bg-gray-800/90 backdrop-blur-sm p-3 border border-gray-600 rounded-lg shadow-lg">
        <p className="font-bold text-blue-400">{data.ticker}</p>
        <p className="text-sm text-gray-200">{`Días: ${data.days}`}</p>
        <p className="text-sm text-gray-200">{`TNA: ${data.tna.toFixed(2)}%`}</p>
      </div>
    );
  }
  return null;
};

const BondChart: React.FC<BondChartProps> = ({ data }) => {
  const logarithmicTrendlineData = useMemo(() => calculateLogarithmicTrendline(data), [data]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart
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
            unit="" 
            stroke="#9ca3af" 
            tick={{ fill: '#9ca3af' }}
            domain={['dataMin - 5', 'dataMax + 5']}
        >
             <text x={250} y={40} textAnchor="middle" fill="#f3f4f6">Días hasta Vencimiento</text>
        </XAxis>
        <YAxis 
            type="number" 
            dataKey="tna" 
            name="TNA" 
            stroke="#9ca3af" 
            tick={{ fill: '#9ca3af' }}
            domain={['dataMin - 2', 'dataMax + 2']}
            tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
        >
             <text x={-190} y={15} transform="rotate(-90)" textAnchor="middle" fill="#f3f4f6">Tasa Nominal Anual (TNA)</text>
        </YAxis>
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
        <Legend wrapperStyle={{ color: '#f3f4f6', paddingTop: '10px' }} />
        <Scatter name="Bonos" data={data} fill="#38bdf8" />
        {logarithmicTrendlineData.length > 0 && (
           <Line
            dataKey="y"
            data={logarithmicTrendlineData}
            dot={false}
            activeDot={false}
            name="Tendencia Logarítmica"
            stroke="#f59e0b" // Amber color
            strokeWidth={2}
            type="monotone"
          />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default BondChart;