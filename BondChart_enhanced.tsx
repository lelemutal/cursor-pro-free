import React, { useMemo, useState } from 'react';
import { ResponsiveContainer, ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Scatter } from 'recharts';
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
  const step = (maxX - minX) / 100;
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
      <div className="bg-gradient-to-r from-dark-card/95 to-gray-800/95 backdrop-blur-lg p-4 border border-brand-accent/30 rounded-xl shadow-2xl transform transition-all duration-200 animate-fadeIn">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-brand-accent to-sky-400 animate-pulse"></div>
          <p className="font-bold text-brand-accent text-lg">{data.ticker}</p>
        </div>
        <div className="space-y-1 text-sm">
          <p className="text-light-text flex justify-between">
            <span className="text-medium-text">Días:</span> 
            <span className="font-semibold">{data.days}</span>
          </p>
          <p className="text-light-text flex justify-between">
            <span className="text-medium-text">TNA:</span> 
            <span className="font-semibold text-green-400">{data.tna.toFixed(2)}%</span>
          </p>
          <p className="text-light-text flex justify-between">
            <span className="text-medium-text">Precio:</span> 
            <span className="font-semibold">${data.last.toFixed(2)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (cx == null || cy == null) return null;
  
  // Colores según el tipo de instrumento
  const getColor = (type: string) => {
    switch(type) {
      case 'lecap': return '#10b981'; // emerald-500
      case 'boncap': return '#8b5cf6'; // violet-500
      case 'dual': return '#f59e0b'; // amber-500
      default: return '#38bdf8'; // sky-400
    }
  };

  const color = getColor(payload.type);
  
  return (
    <g>
      {/* Glow effect */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={8} 
        fill={color} 
        opacity={0.3}
        className="animate-pulse"
      />
      {/* Main dot */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={5} 
        fill={color}
        stroke="#1f2937" 
        strokeWidth={2}
        className="hover:animate-bounce transition-all duration-200 cursor-pointer"
      />
      {/* Inner highlight */}
      <circle 
        cx={cx} 
        cy={cy} 
        r={2} 
        fill="white"
        opacity={0.8}
      />
    </g>
  );
};

const TrendLine = ({ data }: { data: TrendlineData[] }) => {
  if (data.length === 0) return null;
  
  const pathData = data.map((point, index) => {
    const x = ((point.days - Math.min(...data.map(d => d.days))) / 
              (Math.max(...data.map(d => d.days)) - Math.min(...data.map(d => d.days)))) * 100;
    const y = 100 - ((point.y - Math.min(...data.map(d => d.y))) / 
              (Math.max(...data.map(d => d.y)) - Math.min(...data.map(d => d.y)))) * 100;
    return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
  }).join(' ');

  return (
    <svg 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none' 
      }}
    >
      <defs>
        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.8} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path
        d={pathData}
        stroke="url(#trendGradient)"
        strokeWidth={3}
        fill="none"
        filter="url(#glow)"
        className="animate-pulse"
        style={{
          strokeDasharray: '5,5',
          animation: 'dash 2s linear infinite'
        }}
      />
    </svg>
  );
};

const LegendContent = () => (
  <div className="flex justify-center items-center gap-6 mt-4 p-3 bg-gradient-to-r from-dark-bg/50 to-dark-card/50 rounded-lg border border-gray-700/50">
    <div className="flex items-center gap-2 group cursor-pointer transition-all duration-200 hover:scale-105">
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 animate-pulse group-hover:animate-bounce"></div>
      <span className="text-sm font-medium text-light-text">LECAPs</span>
    </div>
    <div className="flex items-center gap-2 group cursor-pointer transition-all duration-200 hover:scale-105">
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-violet-500 to-violet-400 animate-pulse group-hover:animate-bounce"></div>
      <span className="text-sm font-medium text-light-text">BONCAPs</span>
    </div>
    <div className="flex items-center gap-2 group cursor-pointer transition-all duration-200 hover:scale-105">
      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 animate-pulse group-hover:animate-bounce"></div>
      <span className="text-sm font-medium text-light-text">DUALES</span>
    </div>
    <div className="flex items-center gap-2 group cursor-pointer transition-all duration-200 hover:scale-105">
      <div className="w-4 h-1 bg-gradient-to-r from-amber-500 to-amber-400 animate-pulse rounded-full"></div>
      <span className="text-sm font-medium text-light-text">Tendencia</span>
    </div>
  </div>
);

const BondChart: React.FC<BondChartProps> = ({ data }) => {
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const logarithmicTrendlineData = useMemo(() => calculateLogarithmicTrendline(data), [data]);

  return (
    <div className="relative">
      {/* Header con estadísticas */}
      <div className="mb-6 p-4 bg-gradient-to-r from-dark-bg/30 to-dark-card/30 rounded-lg border border-brand-accent/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="group hover:scale-105 transition-all duration-200">
            <p className="text-xs text-medium-text uppercase tracking-wide">Total Bonos</p>
            <p className="text-2xl font-bold text-brand-accent">{data.length}</p>
          </div>
          <div className="group hover:scale-105 transition-all duration-200">
            <p className="text-xs text-medium-text uppercase tracking-wide">TNA Promedio</p>
            <p className="text-2xl font-bold text-green-400">
              {data.length ? (data.reduce((acc, bond) => acc + bond.tna, 0) / data.length).toFixed(1) : 0}%
            </p>
          </div>
          <div className="group hover:scale-105 transition-all duration-200">
            <p className="text-xs text-medium-text uppercase tracking-wide">Días Mín</p>
            <p className="text-2xl font-bold text-orange-400">
              {data.length ? Math.min(...data.map(b => b.days)) : 0}
            </p>
          </div>
          <div className="group hover:scale-105 transition-all duration-200">
            <p className="text-xs text-medium-text uppercase tracking-wide">Días Máx</p>
            <p className="text-2xl font-bold text-purple-400">
              {data.length ? Math.max(...data.map(b => b.days)) : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Chart container con efectos */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-dark-card/50 to-dark-bg/50 backdrop-blur-sm border border-brand-accent/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-sky-500/5 animate-pulse"></div>
        
        <ResponsiveContainer width="100%" height={450}>
          <ScatterChart
            margin={{ top: 30, right: 30, bottom: 50, left: 50 }}
            onMouseMove={(e: any) => {
              if (e && e.activePayload && e.activePayload[0]) {
                setHoveredPoint(e.activePayload[0].payload.ticker);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id="gridGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4a5568" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#2d3748" stopOpacity={0.1} />
              </linearGradient>
              <filter id="chartGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="url(#gridGradient)" 
              strokeOpacity={0.6}
              className="animate-pulse"
            />
            
            <XAxis 
              type="number" 
              dataKey="days" 
              name="Días hasta vencimiento" 
              stroke="#9ca3af" 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={['dataMin - 10', 'dataMax + 10']}
              className="transition-all duration-300"
            />
            
            <YAxis 
              type="number" 
              dataKey="tna" 
              name="TNA" 
              stroke="#9ca3af" 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
              className="transition-all duration-300"
            />
            
            <Tooltip 
              content={<CustomTooltip />} 
              cursor={{ 
                stroke: '#38bdf8', 
                strokeWidth: 2,
                strokeDasharray: '5,5',
                filter: 'url(#chartGlow)'
              }} 
            />
            
            <Scatter 
              name="Bonos" 
              data={data} 
              shape={<CustomDot />}
              className="transition-all duration-500"
            />
          </ScatterChart>
        </ResponsiveContainer>

        {/* Trend line overlay */}
        <TrendLine data={logarithmicTrendlineData} />
      </div>

      {/* Custom Legend */}
      <LegendContent />

      {/* Floating info panel cuando hay hover */}
      {hoveredPoint && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-dark-card/90 to-gray-800/90 backdrop-blur-lg p-3 rounded-lg border border-brand-accent/30 animate-fadeIn">
          <p className="text-sm font-semibold text-brand-accent">Hover: {hoveredPoint}</p>
        </div>
      )}
    </div>
  );
};

export default BondChart;