// =============================================================================
// 🎨 CARRY TRADE CHART ENHANCED - VERSIÓN COMPLETA
// =============================================================================
// ✨ Características incluidas:
// - Sombreado hermoso entre bandas con gradientes
// - Micro animaciones en todos los elementos
// - Input con pulse cada 3 segundos
// - Dots con múltiples anillos y efectos glow
// - Partículas flotantes de fondo
// - Tooltips mejorados con barras de performance
// - Leyenda interactiva con hover effects
// - Panel flotante de información
// - ComposedChart con áreas, líneas y scatter
// =============================================================================

import React, { useMemo, useState, useEffect } from 'react';
import { ResponsiveContainer, ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, Line, Area } from 'recharts';
import { CarryTradeData, ChartBandData } from '../types';

interface CarryTradeChartProps {
  data: CarryTradeData[];
  bandsData: ChartBandData[];
  mepRate: number;
  onMepRateChange: (newRate: number) => void;
}

const instrumentColors: Record<'lecap' | 'boncap' | 'dual', string> = {
  lecap: '#10b981',   // emerald-500
  boncap: '#8b5cf6',  // violet-500
  dual: '#f59e0b',    // amber-500
};

const CarryTradeChart: React.FC<CarryTradeChartProps> = ({ data, bandsData, mepRate, onMepRateChange }) => {
  // ==================== ESTADOS ====================
  const [customMepInput, setCustomMepInput] = useState<string>(mepRate.toString());
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showPulse, setShowPulse] = useState(true);

  // ==================== EFECTOS ====================
  useEffect(() => {
    if (document.activeElement?.id !== 'custom-dollar-value') {
      setCustomMepInput(mepRate.toFixed(2));
    }
  }, [mepRate]);

  // Efecto de pulse cada 3 segundos para el input
  useEffect(() => {
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ==================== HANDLERS ====================
  const handleMepInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomMepInput(value);
    if (value.trim() === '') return;
    const parsedValue = parseFloat(value.replace(',', '.'));
    if (!isNaN(parsedValue) && parsedValue > 0) {
      onMepRateChange(parsedValue);
    }
  };

  // ==================== DATOS PROCESADOS ====================
  const chartData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();
    
    return data.map(item => ({
      ...item,
      date: todayTimestamp + item.days * 86400000,
    }));
  }, [data]);

  // Combinar datos para el gráfico compuesto
  const combinedData = useMemo(() => {
    const allDates = new Set([
      ...chartData.map(d => d.date),
      ...bandsData.map(b => b.date)
    ]);

    return Array.from(allDates).sort().map(date => {
      const bandPoint = bandsData.find(b => b.date === date);
      const dataPoint = chartData.find(d => d.date === date);
      
      return {
        date,
        bandaSuperior: bandPoint?.bandaSuperior,
        bandaInferior: bandPoint?.bandaInferior,
        breakevenMEP: dataPoint?.breakevenMEP,
        ticker: dataPoint?.ticker,
        type: dataPoint?.type,
        diferenciaPct: dataPoint?.diferenciaPct,
        days: dataPoint?.days
      };
    });
  }, [chartData, bandsData]);
  
  const yDomain = useMemo(() => {
    const itemValues = chartData.map(d => d.breakevenMEP);
    const bandLowerValues = bandsData.map(b => b.bandaInferior);
    const bandUpperValues = bandsData.map(b => b.bandaSuperior);

    const allValues = [...itemValues, ...bandLowerValues, ...bandUpperValues].filter(v => v != null && !isNaN(v));

    if (allValues.length === 0) return [800, 2000];

    let min = Math.min(...allValues);
    let max = Math.max(...allValues);
    
    const padding = (max - min) * 0.10;
    const finalMin = Math.floor((min - padding) / 50) * 50;
    const finalMax = Math.ceil((max + padding) / 50) * 50;
    
    return [finalMin > 0 ? finalMin : 0, finalMax];
  }, [chartData, bandsData]);

  // ==================== COMPONENTES CUSTOM ====================
  
  // Tooltip mejorado con información detallada
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const instrumentPayload = payload.find(p => p.payload.ticker);

      if (instrumentPayload) {
        const data = instrumentPayload.payload;
        return (
          <div className="bg-gradient-to-br from-dark-card/95 to-gray-900/95 backdrop-blur-xl p-4 border border-brand-accent/40 rounded-2xl shadow-2xl transform transition-all duration-300 animate-fadeIn">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-4 h-4 rounded-full animate-pulse`} style={{ backgroundColor: instrumentColors[data.type] || '#f3f4f6' }}></div>
              <p className="font-bold text-lg" style={{ color: instrumentColors[data.type] || '#f3f4f6' }}>{data.ticker}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-medium-text">Fecha Vto.:</span>
                <span className="text-light-text font-semibold">{new Date(data.date).toLocaleDateString('es-AR')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-medium-text">Valor Proyectado:</span>
                <span className="text-brand-accent font-bold">${data.breakevenMEP.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-medium-text">Banda Superior:</span>
                <span className="text-pink-400 font-semibold">${data.bandaSuperior?.toFixed(2) || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-medium-text">Diferencia vs Banda:</span>
                <span className={`font-bold ${data.diferenciaPct >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                  {data.diferenciaPct?.toFixed(2)}%
                </span>
              </div>
            </div>
            
            {/* Mini indicador de performance */}
            <div className="mt-3 pt-3 border-t border-gray-600/50">
              <div className="flex items-center gap-2">
                <span className="text-xs text-medium-text">Performance:</span>
                <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${data.diferenciaPct >= 0 ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500'}`}
                    style={{ width: `${Math.min(Math.abs(data.diferenciaPct || 0) * 2, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  // Dots personalizados con múltiples anillos y efectos
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (cx == null || cy == null || !payload.ticker) return null;
    
    const color = instrumentColors[payload.type as keyof typeof instrumentColors] || '#ccc';
    const isHovered = hoveredPoint === payload.ticker;
    const isPositive = payload.diferenciaPct >= 0;
    
    return (
      <g>
        {/* Outer glow ring */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={isHovered ? 16 : 12} 
          fill={color} 
          opacity={isHovered ? 0.3 : 0.2}
          className="animate-pulse"
        />
        
        {/* Middle ring */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={isHovered ? 10 : 8} 
          fill={color} 
          opacity={0.6}
          className={isHovered ? 'animate-bounce' : ''}
        />
        
        {/* Main dot */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={isHovered ? 7 : 5} 
          fill={color}
          stroke="#1f2937" 
          strokeWidth={2}
          className="transition-all duration-200 cursor-pointer"
        />
        
        {/* Inner highlight */}
        <circle 
          cx={cx} 
          cy={cy} 
          r={isHovered ? 3 : 2} 
          fill="white"
          opacity={0.9}
        />
        
        {/* Performance indicator ring para oportunidades positivas */}
        {isPositive && (
          <circle 
            cx={cx} 
            cy={cy} 
            r={isHovered ? 20 : 16} 
            fill="none"
            stroke="#10b981" 
            strokeWidth={1}
            opacity={0.6}
            strokeDasharray="3,3"
            className="animate-spin"
            style={{ animationDuration: '3s' }}
          />
        )}
      </g>
    );
  };

  // Leyenda interactiva mejorada
  const LegendContent = () => (
    <div className="flex justify-center items-center gap-8 mt-6 p-4 bg-gradient-to-r from-dark-bg/40 via-dark-card/30 to-dark-bg/40 backdrop-blur-lg rounded-2xl border border-brand-accent/20">
      <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300 hover:scale-110">
        <div className="relative">
          <div className="w-4 h-1 bg-gradient-to-r from-pink-500 to-pink-400 rounded-full"></div>
          <div className="absolute inset-0 w-4 h-1 bg-pink-500 rounded-full opacity-50 animate-pulse"></div>
        </div>
        <span className="text-sm font-medium text-light-text group-hover:text-pink-400 transition-colors">Banda Superior</span>
      </div>
      
      <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300 hover:scale-110">
        <div className="relative">
          <div className="w-4 h-1 bg-gradient-to-r from-sky-500 to-sky-400 rounded-full"></div>
          <div className="absolute inset-0 w-4 h-1 bg-sky-500 rounded-full opacity-50 animate-pulse"></div>
        </div>
        <span className="text-sm font-medium text-light-text group-hover:text-sky-400 transition-colors">Banda Inferior</span>
      </div>
      
      <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300 hover:scale-110">
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 animate-pulse"></div>
        <span className="text-sm font-medium text-light-text group-hover:text-emerald-400 transition-colors">LECAPs</span>
      </div>
      
      <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300 hover:scale-110">
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-violet-500 to-violet-400 animate-pulse"></div>
        <span className="text-sm font-medium text-light-text group-hover:text-violet-400 transition-colors">BONCAPs</span>
      </div>
      
      <div className="flex items-center gap-3 group cursor-pointer transition-all duration-300 hover:scale-110">
        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 animate-pulse"></div>
        <span className="text-sm font-medium text-light-text group-hover:text-amber-400 transition-colors">DUALES</span>
      </div>
    </div>
  );

  // ==================== RENDER PRINCIPAL ====================
  return (
    <section className="bg-gradient-to-br from-dark-card/60 to-dark-bg/40 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-brand-accent/20 relative overflow-hidden">
      {/* Partículas animadas de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              background: `hsl(${200 + Math.random() * 60}, 70%, 60%)`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 4}s`
            }}
          />
        ))}
      </div>

      {/* Header con efectos y stats */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-light-text via-brand-accent to-sky-400 bg-clip-text text-transparent">
            Proyección del Dólar
          </h2>
          <p className="text-medium-text animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            Análisis de equilibrio de instrumentos financieros
          </p>
          
          {/* Mini stats bar */}
          <div className="flex gap-4 mt-4">
            <div className="text-center p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 hover:scale-105 transition-transform duration-300">
              <p className="text-xs text-emerald-400">Instrumentos</p>
              <p className="text-lg font-bold text-emerald-300">{data.length}</p>
            </div>
            <div className="text-center p-2 bg-brand-accent/10 rounded-lg border border-brand-accent/20 hover:scale-105 transition-transform duration-300">
              <p className="text-xs text-brand-accent">Dólar Actual</p>
              <p className="text-lg font-bold text-sky-300">${mepRate.toFixed(0)}</p>
            </div>
            <div className="text-center p-2 bg-purple-500/10 rounded-lg border border-purple-500/20 hover:scale-105 transition-transform duration-300">
              <p className="text-xs text-purple-400">Oportunidades</p>
              <p className="text-lg font-bold text-purple-300">{data.filter(d => d.diferenciaPct >= 0).length}</p>
            </div>
          </div>
        </div>
        
        {/* Input mejorado con efectos */}
        <div className="flex items-center space-x-3">
          <label htmlFor="custom-dollar-value" className="text-sm font-semibold text-light-text">
            💰 Valor del Dólar:
          </label>
          <div className="relative">
            <input
              id="custom-dollar-value"
              type="text"
              value={customMepInput}
              onChange={handleMepInputChange}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              className={`
                w-32 bg-gradient-to-r from-dark-bg to-dark-card text-light-text 
                border-2 transition-all duration-300 rounded-xl px-4 py-2.5 
                focus:outline-none focus:scale-105 font-bold text-center
                ${isInputFocused 
                  ? 'border-brand-accent shadow-lg shadow-brand-accent/30 bg-dark-card' 
                  : 'border-gray-600 hover:border-brand-accent/50'
                }
                ${showPulse ? 'animate-pulse border-green-400' : ''}
              `}
              placeholder="1100"
            />
            
            {/* Efecto shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer rounded-xl pointer-events-none"></div>
            
            {/* Indicador de cambio */}
            {isInputFocused && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-brand-accent rounded-full animate-bounce"></div>
            )}
          </div>
        </div>
      </div>

      {/* Chart container mejorado */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-bg/30 to-dark-card/20 backdrop-blur-sm border border-brand-accent/10 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 via-transparent to-sky-500/5 animate-pulse"></div>
        
        <div style={{ width: '100%', height: 520 }} className="relative">
          <ResponsiveContainer>
            <ComposedChart
              data={combinedData}
              margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
              onMouseMove={(e: any) => {
                if (e && e.activePayload) {
                  const payload = e.activePayload.find(p => p.payload.ticker);
                  if (payload) {
                    setHoveredPoint(payload.payload.ticker);
                  }
                }
              }}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                {/* Gradiente hermoso para el área entre bandas */}
                <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f472b6" stopOpacity={0.4} />
                  <stop offset="30%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="70%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.3} />
                </linearGradient>
                
                {/* Gradiente animado para banda superior */}
                <linearGradient id="upperBandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f472b6" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity={1} />
                  <stop offset="100%" stopColor="#f472b6" stopOpacity={0.8} />
                </linearGradient>
                
                {/* Gradiente animado para banda inferior */}
                <linearGradient id="lowerBandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#0ea5e9" stopOpacity={1} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.8} />
                </linearGradient>

                {/* Filtros de glow */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid 
                strokeDasharray="2 4" 
                stroke="#4a5568" 
                strokeOpacity={0.3}
                className="animate-pulse"
              />
              
              <XAxis 
                type="number" 
                dataKey="date" 
                name="Fecha" 
                scale="time"
                domain={['dataMin', 'dataMax']}
                stroke="#9ca3af" 
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString('es-AR', {month: '2-digit', year: '2-digit'})}
                axisLine={{ stroke: '#6b7280', strokeWidth: 1 }}
              />
              
              <YAxis 
                type="number"
                name="Valor del Dólar" 
                stroke="#9ca3af"
                domain={yDomain}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                tickFormatter={(value) => `$${Number(value).toLocaleString('es-AR')}`}
                axisLine={{ stroke: '#6b7280', strokeWidth: 1 }}
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#38bdf8', strokeWidth: 2, strokeDasharray: '5,5', strokeOpacity: 0.8 }} />

              {/* ÁREA SOMBREADA ENTRE BANDAS - ¡La estrella del show! */}
              <Area
                dataKey="bandaSuperior"
                stroke="none"
                fill="url(#bandGradient)"
                fillOpacity={0.7}
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-out"
              />
              
              <Area
                dataKey="bandaInferior"
                stroke="none"
                fill="#1f2937"
                fillOpacity={1}
                isAnimationActive={true}
                animationDuration={2000}
              />
              
              {/* Líneas de bandas con efectos glow */}
              <Line
                dataKey="bandaSuperior"
                stroke="url(#upperBandGradient)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#f472b6', stroke: '#fff', strokeWidth: 2 }}
                filter="url(#glow)"
                isAnimationActive={true}
                animationDuration={2000}
                connectNulls={false}
              />
              
              <Line
                dataKey="bandaInferior"
                stroke="url(#lowerBandGradient)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
                filter="url(#glow)"
                isAnimationActive={true}
                animationDuration={2000}
                connectNulls={false}
              />

              {/* Scatter de instrumentos */}
              <Scatter 
                dataKey="breakevenMEP" 
                shape={<CustomDot />}
                isAnimationActive={true}
                animationDuration={1500}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leyenda mejorada */}
      <LegendContent />

      {/* Panel de información flotante */}
      {hoveredPoint && (
        <div className="absolute top-6 right-6 bg-gradient-to-br from-dark-card/90 to-gray-900/80 backdrop-blur-xl p-3 rounded-xl border border-brand-accent/30 animate-fadeIn z-20">
          <p className="text-xs text-medium-text">Instrumento activo:</p>
          <p className="text-sm font-bold text-brand-accent">{hoveredPoint}</p>
          <div className="w-full h-1 bg-brand-accent/30 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-brand-accent rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      )}

      {/* Indicador de estado en la esquina inferior */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-dark-card/70 backdrop-blur-sm px-3 py-1 rounded-full border border-brand-accent/20">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
        <span className="text-xs text-medium-text">En vivo</span>
      </div>
    </section>
  );
};

export default CarryTradeChart;