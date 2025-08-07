import React, { useState, useEffect } from 'react';
import { RefreshIcon } from './components/IconComponents';

interface EnhancedHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loadData: () => void;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

const EnhancedHeader: React.FC<EnhancedHeaderProps> = ({
  activeTab,
  setActiveTab,
  loadData,
  isRefreshing,
  error,
  lastUpdated
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const tabs = [
    { id: 'lecap', label: 'LECAP & DUAL', icon: '📊', color: 'emerald' },
    { id: 'carrytrade', label: 'Carry Trade', icon: '💱', color: 'blue' },
    { id: 'acciones', label: 'Acciones', icon: '📈', color: 'green' },
    { id: 'cedears', label: 'CEDEARs', icon: '🌎', color: 'purple' },
    { id: 'bonos', label: 'Bonos', icon: '🏛️', color: 'amber' },
    { id: 'test', label: 'Test Scraping', icon: '🔬', color: 'red' }
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const formattedLastUpdated = lastUpdated 
    ? lastUpdated.toLocaleTimeString('es-AR')
    : 'Cargando...';

  const getTabColorClasses = (color: string, isActive: boolean) => {
    const colors = {
      emerald: isActive 
        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-emerald-500/50' 
        : 'text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300',
      blue: isActive 
        ? 'bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-blue-500/50' 
        : 'text-blue-400 hover:bg-blue-500/10 hover:text-blue-300',
      green: isActive 
        ? 'bg-gradient-to-r from-green-500 to-green-400 text-white shadow-green-500/50' 
        : 'text-green-400 hover:bg-green-500/10 hover:text-green-300',
      purple: isActive 
        ? 'bg-gradient-to-r from-purple-500 to-purple-400 text-white shadow-purple-500/50' 
        : 'text-purple-400 hover:bg-purple-500/10 hover:text-purple-300',
      amber: isActive 
        ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-white shadow-amber-500/50' 
        : 'text-amber-400 hover:bg-amber-500/10 hover:text-amber-300',
      red: isActive 
        ? 'bg-gradient-to-r from-red-500 to-red-400 text-white shadow-red-500/50' 
        : 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background con gradientes animados */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-gray-900 to-dark-card"></div>
      
      {/* Partículas decorativas */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `hsl(${Math.random() * 60 + 180}, 70%, 60%)`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 3}s`
            }}
          />
        ))}
      </div>

      {/* Grid pattern de fondo */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 p-6 lg:p-8">
        {/* Título principal con efectos */}
        <div 
          className="text-center mb-8 relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Halo de luz que sigue el mouse */}
          {isHovering && (
            <div
              className="absolute pointer-events-none transition-all duration-300 ease-out"
              style={{
                left: mousePosition.x,
                top: mousePosition.y,
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%'
              }}
            />
          )}

          {/* Título con múltiples efectos */}
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight relative z-10">
              {/* Sombra del texto */}
              <span className="absolute inset-0 text-transparent bg-gradient-to-r from-brand-accent/20 to-sky-500/20 blur-sm">
                Dashboard Financiero
              </span>
              
              {/* Texto principal */}
              <span className="relative bg-gradient-to-r from-white via-blue-100 to-brand-accent bg-clip-text text-transparent animate-pulse">
                Dashboard{' '}
              </span>
              <span className="relative bg-gradient-to-r from-brand-accent via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Financiero
              </span>
            </h1>
            
            {/* Decoraciones laterales */}
            <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent to-brand-accent animate-pulse"></div>
            <div className="absolute -right-16 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-gradient-to-l from-transparent to-brand-accent animate-pulse"></div>
          </div>

          {/* Subtítulo animado */}
          <div className="mt-4 text-lg text-medium-text animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <span className="inline-block hover:text-brand-accent transition-colors duration-300">
              Análisis en tiempo real del mercado argentino
            </span>
          </div>
        </div>

        {/* Status bar mejorado */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
          {/* Status de conexión */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-dark-card/50 to-gray-800/30 backdrop-blur-lg rounded-2xl border border-brand-accent/20 shadow-lg">
            <div className="flex items-center gap-3">
              {/* Indicador de estado */}
              <div className="relative">
                <div className={`w-4 h-4 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'} animate-pulse`}></div>
                <div className={`absolute inset-0 w-4 h-4 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'} opacity-30 animate-ping`}></div>
              </div>
              
              <div className="text-sm">
                <p className="text-light-text font-medium">
                  {error ? 'Desconectado' : 'Conectado'}
                </p>
                <p className="text-medium-text text-xs">
                  Última actualización: {formattedLastUpdated}
                </p>
              </div>
            </div>

            {/* Botón de refresh mejorado */}
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className={`
                relative overflow-hidden p-3 rounded-xl transition-all duration-300 transform
                ${isRefreshing 
                  ? 'bg-brand-accent/20 scale-95' 
                  : 'bg-gradient-to-r from-brand-accent/10 to-sky-500/10 hover:from-brand-accent/20 hover:to-sky-500/20 hover:scale-105'
                }
                border border-brand-accent/30 shadow-lg hover:shadow-brand-accent/20
              `}
            >
              {/* Efecto shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
              
              <RefreshIcon 
                className={`w-5 h-5 text-brand-accent relative z-10 ${isRefreshing ? 'animate-spin' : 'group-hover:animate-bounce'}`} 
              />
            </button>
          </div>

          {/* Stats rápidas */}
          <div className="flex gap-4">
            {[
              { label: 'Mercados', value: '6', color: 'emerald' },
              { label: 'Activos', value: '50+', color: 'blue' },
              { label: 'Tiempo Real', value: '1min', color: 'purple' }
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className="text-center p-3 bg-gradient-to-br from-dark-card/30 to-transparent backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-brand-accent/30 transition-all duration-300 hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className={`text-xl font-bold text-${stat.color}-400`}>{stat.value}</p>
                <p className="text-xs text-medium-text">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Navegación de tabs mejorada */}
        <div className="relative">
          {/* Fondo de la navegación */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-card/30 via-gray-800/20 to-dark-card/30 backdrop-blur-xl rounded-2xl border border-brand-accent/10"></div>
          
          <nav className="relative p-2">
            <div className="flex flex-wrap justify-center gap-2 lg:gap-3">
              {tabs.map((tab, index) => {
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group relative px-4 lg:px-6 py-3 rounded-xl font-medium text-sm lg:text-base
                      transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${getTabColorClasses(tab.color, isActive)}
                      ${isActive 
                        ? 'shadow-lg scale-105 z-10' 
                        : 'text-medium-text hover:text-light-text hover:bg-white/5'
                      }
                      border border-transparent hover:border-white/10
                    `}
                    style={{ 
                      animationDelay: `${index * 0.1}s`,
                      animation: 'slideInFromLeft 0.5s ease-out forwards'
                    }}
                  >
                    {/* Efecto de hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    
                    {/* Contenido del tab */}
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="text-lg group-hover:animate-bounce">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </div>

                    {/* Indicador activo */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Error message mejorado */}
        {error && (
          <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-red-600/5 border border-red-500/20 rounded-xl backdrop-blur-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedHeader;