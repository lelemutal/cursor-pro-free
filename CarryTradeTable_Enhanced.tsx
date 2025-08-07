import React, { useState, useEffect, useRef } from 'react';
import { CarryTradeData } from '../types';

interface CarryTradeTableProps {
  data: CarryTradeData[];
  mepRate: number;
}

const CarryTradeTable: React.FC<CarryTradeTableProps> = ({ data, mepRate }) => {
  const sortedData = [...data].sort((a, b) => a.days - b.days);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    setIsUpdating(true);
    setAnimationTrigger(prev => prev + 1);
    const timer = setTimeout(() => setIsUpdating(false), 1200);
    return () => clearTimeout(timer);
  }, [mepRate]);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'lecap': return { bg: 'from-emerald-500 to-emerald-400', text: 'emerald-400', border: 'emerald-500/30' };
      case 'boncap': return { bg: 'from-violet-500 to-violet-400', text: 'violet-400', border: 'violet-500/30' };
      case 'dual': return { bg: 'from-amber-500 to-amber-400', text: 'amber-400', border: 'amber-500/30' };
      default: return { bg: 'from-gray-500 to-gray-400', text: 'gray-400', border: 'gray-500/30' };
    }
  };

  const TypeBadge = ({ type }: { type: string }) => {
    const colors = getTypeColor(type);
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${colors.bg} shadow-lg animate-pulse border border-${colors.border}`}>
        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></div>
        {type.toUpperCase()}
      </div>
    );
  };

  const PerformanceBar = ({ value, isPositive }: { value: number; isPositive: boolean }) => (
    <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden relative">
      <div 
        className={`h-full transition-all duration-1000 ease-out relative ${
          isPositive 
            ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-600' 
            : 'bg-gradient-to-r from-red-400 via-red-500 to-red-600'
        }`}
        style={{ width: `${Math.min(Math.abs(value) * 2, 100)}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
      </div>
    </div>
  );

  const AnimatedValue = ({ value, prefix = '', suffix = '', isUpdating = false, className = '' }: {
    value: number;
    prefix?: string;
    suffix?: string;
    isUpdating?: boolean;
    className?: string;
  }) => (
    <span className={`inline-block transition-all duration-300 ${isUpdating ? 'animate-pulse scale-110' : ''} ${className}`}>
      {prefix}{value.toFixed(2)}{suffix}
    </span>
  );

  return (
    <div className="relative">
      {/* Header con stats */}
      <div className="mb-6 p-4 bg-gradient-to-r from-dark-card/40 via-dark-bg/30 to-dark-card/40 backdrop-blur-lg rounded-2xl border border-brand-accent/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-light-text mb-2">Análisis de Carry Trade</h3>
            <div className="flex gap-6 text-sm">
              <div className="text-center">
                <p className="text-medium-text">Total Instrumentos</p>
                <p className="text-2xl font-bold text-brand-accent">{sortedData.length}</p>
              </div>
              <div className="text-center">
                <p className="text-medium-text">Oportunidades</p>
                <p className="text-2xl font-bold text-green-400">
                  {sortedData.filter(item => item.diferenciaPct >= 0).length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-medium-text">MEP Promedio</p>
                <p className="text-2xl font-bold text-purple-400">
                  ${(sortedData.reduce((acc, item) => acc + item.breakevenMEP, 0) / sortedData.length).toFixed(0)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Indicador de actualización */}
          <div className={`flex items-center gap-3 transition-all duration-300 ${isUpdating ? 'scale-110' : ''}`}>
            <div className="relative">
              <div className={`w-4 h-4 rounded-full ${isUpdating ? 'bg-green-400 animate-ping' : 'bg-brand-accent'}`}></div>
              <div className="absolute inset-0 w-4 h-4 rounded-full bg-green-400 opacity-30 animate-pulse"></div>
            </div>
            <span className="text-sm text-medium-text">
              {isUpdating ? 'Actualizando...' : 'Actualizado'}
            </span>
          </div>
        </div>
      </div>

      {/* Table container con efectos */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-dark-card/50 to-dark-bg/30 backdrop-blur-xl border border-brand-accent/20 shadow-2xl">
        {/* Background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-5 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                background: '#38bdf8',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 4}s`
              }}
            />
          ))}
        </div>

        <div className="relative overflow-x-auto custom-scrollbar">
          <table className="min-w-full text-sm text-left text-medium-text">
            {/* Header */}
            <thead className="text-xs text-light-text uppercase bg-gradient-to-r from-dark-card/80 to-dark-bg/60 backdrop-blur-sm sticky top-0 z-10">
              <tr className="border-b border-brand-accent/30">
                <th scope="col" className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <span>Ticker</span>
                    <div className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></div>
                  </div>
                </th>
                <th scope="col" className="px-4 py-4">Tipo</th>
                <th scope="col" className="px-4 py-4 text-right">Días</th>
                <th scope="col" className="px-4 py-4 text-right">Precio</th>
                <th scope="col" className="px-4 py-4 text-right">PR Final</th>
                <th scope="col" className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span>MEP Breakeven</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                  </div>
                </th>
                <th scope="col" className="px-4 py-4 text-right">Banda Superior</th>
                <th scope="col" className="px-4 py-4 text-right">Banda Inferior</th>
                <th scope="col" className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span>Performance</span>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                </th>
              </tr>
            </thead>
            
            {/* Body */}
            <tbody className="divide-y divide-gray-700/30">
              {sortedData.map((item, index) => {
                const isHovered = hoveredRow === item.ticker;
                const isPositive = item.diferenciaPct >= 0;
                const typeColors = getTypeColor(item.type);
                
                return (
                  <tr 
                    key={item.ticker} 
                    className={`
                      group transition-all duration-500 transform relative cursor-pointer
                      ${isHovered 
                        ? 'bg-gradient-to-r from-brand-accent/15 to-sky-500/10 scale-[1.02] z-10 shadow-lg shadow-brand-accent/20' 
                        : 'hover:bg-gradient-to-r hover:from-brand-accent/8 hover:to-sky-500/5'
                      }
                    `}
                    onMouseEnter={() => setHoveredRow(item.ticker)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animation: `slideInFromLeft 0.6s ease-out forwards`
                    }}
                  >
                    {/* Glow effect border */}
                    {isHovered && (
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 to-transparent rounded-lg pointer-events-none"></div>
                    )}
                    
                    <th scope="row" className="relative px-4 py-4 font-bold text-light-text whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 bg-gradient-to-b ${typeColors.bg} rounded-full opacity-70 group-hover:opacity-100 transition-all duration-300`}></div>
                        <span className={`group-hover:text-${typeColors.text} transition-colors duration-300 text-lg`}>
                          {item.ticker}
                        </span>
                        {isPositive && (
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        )}
                      </div>
                    </th>
                    
                    <td className="relative px-4 py-4">
                      <TypeBadge type={item.type} />
                    </td>
                    
                    <td className="relative px-4 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium text-orange-400 text-lg">{item.days}</span>
                        <div className="w-12 h-1 bg-orange-400/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-300 transition-all duration-1000"
                            style={{ width: `${Math.min((item.days / 365) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="relative px-4 py-4 text-right font-semibold">
                      <span className="bg-gradient-to-r from-light-text to-gray-300 bg-clip-text text-transparent text-lg">
                        ${item.last.toFixed(2)}
                      </span>
                    </td>
                    
                    <td className="relative px-4 py-4 text-right font-semibold text-blue-400 text-lg">
                      ${item.prFinish.toFixed(2)}
                    </td>
                    
                    <td className={`relative px-4 py-4 text-right font-bold`}>
                      <div className="flex flex-col items-end gap-1">
                        <AnimatedValue 
                          value={item.breakevenMEP} 
                          prefix="$" 
                          isUpdating={isUpdating}
                          className={`text-xl ${isUpdating ? 'text-green-400' : 'text-brand-accent'}`}
                        />
                        <div className="w-20 h-1 bg-gray-600 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${
                              isUpdating 
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse' 
                                : 'bg-gradient-to-r from-brand-accent to-sky-400'
                            }`}
                            style={{ width: `${Math.min((item.breakevenMEP / 2000) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="relative px-4 py-4 text-right font-medium text-pink-400 text-lg">
                      ${item.bandaSuperior.toFixed(2)}
                    </td>
                    
                    <td className="relative px-4 py-4 text-right font-medium text-sky-400 text-lg">
                      ${item.bandaInferior.toFixed(2)}
                    </td>
                    
                    <td className={`relative px-4 py-4 text-right font-bold`}>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xl ${isPositive ? 'text-green-400' : 'text-red-500'}`}>
                          {isPositive ? '↗' : '↘'} {Math.abs(item.diferenciaPct).toFixed(2)}%
                        </span>
                        <PerformanceBar value={item.diferenciaPct} isPositive={isPositive} />
                        
                        {/* Mini badge de performance */}
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                          isPositive 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {isPositive ? 'OPORTUNIDAD' : 'RIESGO'}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer con resumen */}
      <div className="mt-4 p-4 bg-gradient-to-r from-dark-bg/40 to-dark-card/30 backdrop-blur-lg rounded-xl border border-gray-700/50">
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-medium-text">
                Oportunidades: <span className="text-green-400 font-bold">
                  {sortedData.filter(item => item.diferenciaPct >= 0).length}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <span className="text-medium-text">
                Riesgos: <span className="text-red-400 font-bold">
                  {sortedData.filter(item => item.diferenciaPct < 0).length}
                </span>
              </span>
            </div>
          </div>
          
          <div className="text-medium-text">
            Último update: <span className="text-brand-accent font-semibold">
              {new Date().toLocaleTimeString('es-AR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarryTradeTable;