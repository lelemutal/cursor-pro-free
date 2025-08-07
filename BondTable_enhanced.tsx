import React, { useState, useMemo } from 'react';
import { BondData } from '../types';
import { UpArrowIcon, DownArrowIcon } from './IconComponents';

interface BondTableProps {
  data: BondData[];
}

type SortField = 'ticker' | 'last' | 'change' | 'days' | 'tna' | 'tem' | 'tea';
type SortDirection = 'asc' | 'desc';

const BondTable: React.FC<BondTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField>('days');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'lecap' | 'boncap' | 'dual'>('all');

  const sortedAndFilteredData = useMemo(() => {
    let filtered = data;
    
    if (filter !== 'all') {
      filtered = data.filter(bond => bond.type === filter);
    }

    return [...filtered].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [data, sortField, sortDirection, filter]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-brand-accent transition-colors duration-200 group"
    >
      {children}
      <div className="flex flex-col">
        <div className={`w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent transition-all duration-200 ${
          sortField === field && sortDirection === 'asc' ? 'border-b-brand-accent' : 'border-b-gray-500 group-hover:border-b-brand-accent'
        }`} style={{ borderBottomWidth: '4px', marginBottom: '1px' }} />
        <div className={`w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent transition-all duration-200 ${
          sortField === field && sortDirection === 'desc' ? 'border-t-brand-accent' : 'border-t-gray-500 group-hover:border-t-brand-accent'
        }`} style={{ borderTopWidth: '4px' }} />
      </div>
    </button>
  );

  const FilterButton = ({ type, label }: { type: typeof filter; label: string }) => (
    <button
      onClick={() => setFilter(type)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
        filter === type
          ? 'bg-gradient-to-r from-brand-accent to-sky-500 text-white shadow-lg'
          : 'bg-gray-600/50 text-medium-text hover:bg-gray-600 hover:text-light-text'
      }`}
    >
      {label}
    </button>
  );

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'lecap': return 'from-emerald-500 to-emerald-400';
      case 'boncap': return 'from-violet-500 to-violet-400';
      case 'dual': return 'from-amber-500 to-amber-400';
      default: return 'from-gray-500 to-gray-400';
    }
  };

  const TypeBadge = ({ type }: { type: string }) => (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getTypeColor(type)} shadow-lg animate-pulse`}>
      {type.toUpperCase()}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Header con filtros y estadísticas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-dark-bg/30 to-dark-card/30 rounded-lg border border-brand-accent/20">
        <div className="flex flex-wrap gap-2">
          <FilterButton type="all" label="Todos" />
          <FilterButton type="lecap" label="LECAPs" />
          <FilterButton type="boncap" label="BONCAPs" />
          <FilterButton type="dual" label="DUALES" />
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <p className="text-medium-text">Mostrando</p>
            <p className="text-brand-accent font-bold">{sortedAndFilteredData.length}</p>
          </div>
          <div className="text-center">
            <p className="text-medium-text">TNA Prom.</p>
            <p className="text-green-400 font-bold">
              {sortedAndFilteredData.length 
                ? (sortedAndFilteredData.reduce((acc, bond) => acc + bond.tna, 0) / sortedAndFilteredData.length).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Table container */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-dark-card/50 to-dark-bg/50 backdrop-blur-sm border border-brand-accent/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-sky-500/5 animate-pulse"></div>
        
        <div className="relative overflow-y-auto max-h-[500px] custom-scrollbar">
          <table className="min-w-full text-sm text-left text-medium-text">
            {/* Header */}
            <thead className="text-xs text-light-text uppercase bg-gradient-to-r from-dark-card to-dark-bg sticky top-0 z-10 border-b border-brand-accent/30">
              <tr>
                <th scope="col" className="px-4 py-4">
                  <SortButton field="ticker">Ticker</SortButton>
                </th>
                <th scope="col" className="px-4 py-4">Tipo</th>
                <th scope="col" className="px-4 py-4 text-right">
                  <SortButton field="last">Último</SortButton>
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  <SortButton field="change">Var %</SortButton>
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  <SortButton field="days">Días</SortButton>
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  <SortButton field="tna">TNA</SortButton>
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  <SortButton field="tem">TEM</SortButton>
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  <SortButton field="tea">TEA</SortButton>
                </th>
              </tr>
            </thead>
            
            {/* Body */}
            <tbody className="divide-y divide-gray-700/50">
              {sortedAndFilteredData.map((bond, index) => (
                <tr 
                  key={bond.ticker} 
                  className={`group transition-all duration-300 transform hover:scale-[1.02] hover:z-10 relative ${
                    hoveredRow === bond.ticker 
                      ? 'bg-gradient-to-r from-brand-accent/10 to-sky-500/10 shadow-lg' 
                      : 'hover:bg-gradient-to-r hover:from-brand-accent/5 hover:to-sky-500/5'
                  }`}
                  onMouseEnter={() => setHoveredRow(bond.ticker)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'slideInFromLeft 0.5s ease-out forwards'
                  }}
                >
                  {/* Glow effect on hover */}
                  {hoveredRow === bond.ticker && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 to-transparent rounded-lg animate-pulse"></div>
                  )}
                  
                  <th scope="row" className="relative px-4 py-4 font-bold text-light-text whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-8 bg-gradient-to-b ${getTypeColor(bond.type)} rounded-full opacity-70 group-hover:opacity-100 transition-opacity duration-200`}></div>
                      <span className="group-hover:text-brand-accent transition-colors duration-200">{bond.ticker}</span>
                    </div>
                  </th>
                  
                  <td className="relative px-4 py-4">
                    <TypeBadge type={bond.type} />
                  </td>
                  
                  <td className="relative px-4 py-4 text-right font-semibold">
                    <span className="bg-gradient-to-r from-light-text to-gray-300 bg-clip-text text-transparent">
                      ${bond.last.toFixed(2)}
                    </span>
                  </td>
                  
                  <td className={`relative px-4 py-4 text-right font-bold ${bond.change >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                    <div className="flex items-center justify-end gap-2">
                      <div className={`p-1 rounded-full ${bond.change >= 0 ? 'bg-green-400/20' : 'bg-red-500/20'} group-hover:animate-bounce`}>
                        {bond.change > 0 ? <UpArrowIcon /> : bond.change < 0 ? <DownArrowIcon /> : null}
                      </div>
                      <span className="min-w-[60px]">{bond.change.toFixed(2)}%</span>
                    </div>
                  </td>
                  
                  <td className="relative px-4 py-4 text-right">
                    <span className="font-medium text-orange-400">{bond.days}</span>
                  </td>
                  
                  <td className="relative px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-brand-accent text-lg">{bond.tna.toFixed(2)}%</span>
                      <div className="w-16 h-1 bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-brand-accent to-sky-400 transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min((bond.tna / 50) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="relative px-4 py-4 text-right font-medium text-purple-400">
                    {bond.tem.toFixed(2)}%
                  </td>
                  
                  <td className="relative px-4 py-4 text-right font-medium text-emerald-400">
                    {bond.tea.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BondTable;