'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BondData, MarketDataItem, TestBondData, CarryTradeData, ChartBandData } from '../types';
import { fetchBondData, fetchMepRate } from '../services/bondService';
import { fetchMarketData } from '../services/marketDataService';
import { fetchScrapedData } from '../services/testScrapingService';
import { calculateAllCarryTradeMetrics, generateChartBands } from '../services/carryTradeService';
import { stockTickers, cedearTickers, bondTickers } from '../services/staticMarketData';
import BondChart from '../components/BondChart';
import BondTable from '../components/BondTable';
import MarketTable from '../components/MarketTable';
import TestTable from '../components/TestTable';
import AIInsights from '../components/AIInsights';
import { RefreshIcon } from '../components/IconComponents';
import CarryTradeChart from '../components/CarryTradeChart';
import CarryTradeTable from '../components/CarryTradeTable';

const REFRESH_INTERVAL_MS = 60000; // Update every 1 minute
type Tab = 'lecap' | 'carrytrade' | 'acciones' | 'cedears' | 'bonos' | 'test';

const App: React.FC = () => {
  const [lecapData, setLecapData] = useState<BondData[]>([]);
  const [stocksData, setStocksData] = useState<MarketDataItem[]>([]);
  const [cedearsData, setCedearsData] = useState<MarketDataItem[]>([]);
  const [bondsData, setBondsData] = useState<MarketDataItem[]>([]);
  const [testData, setTestData] = useState<TestBondData[]>([]);
  
  const [activeTab, setActiveTab] = useState<Tab>('carrytrade');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [mepRate, setMepRate] = useState<number>(1342.89);

  const loadData = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    
    const lecapPromise = fetchBondData();
    const stocksPromise = fetchMarketData('https://data912.com/live/arg_stocks', stockTickers);
    const cedearsPromise = fetchMarketData('https://data912.com/live/arg_cedears', cedearTickers);
    const bondsPromise = fetchMarketData('https://data912.com/live/arg_bonds', bondTickers);
    const testPromise = fetchScrapedData();
    const mepRatePromise = fetchMepRate();

    try {
      const results = await Promise.allSettled([lecapPromise, stocksPromise, cedearsPromise, bondsPromise, testPromise, mepRatePromise]);
      
      let hasError = false;
      const errorMessages: string[] = [];

      if (results[0].status === 'fulfilled') {
        const rawLecapData = results[0].value as BondData[];
        setLecapData(rawLecapData);
      } else {
        hasError = true;
        errorMessages.push('LECAPs');
        console.error("Error fetching LECAP data:", results[0].reason);
      }

      if (results[1].status === 'fulfilled') {
        setStocksData(results[1].value as MarketDataItem[]);
      } else {
        hasError = true;
        errorMessages.push('Acciones');
        console.error("Error fetching stock data:", results[1].reason);
      }
      
      if (results[2].status === 'fulfilled') {
        setCedearsData(results[2].value as MarketDataItem[]);
      } else {
        hasError = true;
        errorMessages.push('CEDEARs');
        console.error("Error fetching CEDEAR data:", results[2].reason);
      }

      if (results[3].status === 'fulfilled') {
        setBondsData(results[3].value as MarketDataItem[]);
      } else {
        hasError = true;
        errorMessages.push('Bonos');
        console.error("Error fetching bond data:", results[3].reason);
      }

       if (results[4].status === 'fulfilled') {
        setTestData(results[4].value as TestBondData[]);
      } else {
        hasError = true;
        errorMessages.push('Test Scraping');
        console.error("Error fetching scraped test data:", results[4].reason);
      }

      if (results[5].status === 'fulfilled') {
        const newMepRate = results[5].value;
        if (newMepRate) {
          setMepRate(newMepRate);
        }
      } else {
        console.error("Error fetching MEP rate:", (results[5] as PromiseRejectedResult).reason);
      }

      if (hasError) {
        throw new Error(`Fallo al cargar datos para: ${errorMessages.join(', ')}.`);
      }

      setLastUpdated(new Date());

    } catch (err: any) {
      setError(err.message || 'Error al cargar datos en vivo.');
      console.error(err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const intervalId = setInterval(loadData, REFRESH_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [loadData]);

  const carryTradeData = useMemo(() => {
    if (!lecapData || lecapData.length === 0) return [];
    return calculateAllCarryTradeMetrics(lecapData, mepRate);
  }, [lecapData, mepRate]);

  const chartBandsData = useMemo(() => {
    if (!lecapData || lecapData.length === 0) return [];
    const maxDays = Math.max(...lecapData.map(b => b.days), 0);
    return generateChartBands(maxDays);
  }, [lecapData]);

  const formattedLastUpdated = lastUpdated 
    ? lastUpdated.toLocaleTimeString('es-AR')
    : 'Cargando...';

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-gray-400 text-lg animate-pulse">Cargando datos del mercado...</p>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'lecap':
        return lecapData.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <section className="lg:col-span-3 bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4 text-blue-400">Curva de Rendimiento</h2>
                <BondChart data={lecapData} />
              </section>
              <section className="lg:col-span-2 bg-gray-800 rounded-xl shadow-2xl">
                <div className="p-4 sm:p-6">
                  <h2 className="text-xl font-semibold mb-4 text-blue-400">Tabla de Datos</h2>
                  <BondTable data={lecapData} />
                </div>
              </section>
            </div>
            <AIInsights data={lecapData} dataType="lecap" />
          </>
        ) : <p className="text-center py-10">No se pudieron cargar los datos para LECAPs.</p>;
      
      case 'carrytrade':
        return carryTradeData.length > 0 ? (
          <>
            <CarryTradeChart 
              data={carryTradeData} 
              bandsData={chartBandsData}
              mepRate={mepRate}
              onMepRateChange={setMepRate}
            />
            <section className="bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4 text-blue-400">Tabla de Análisis de Carry Trade</h2>
              <CarryTradeTable data={carryTradeData} mepRate={mepRate} />
            </section>
          </>
        ) : <p className="text-center py-10">Datos de LECAP no disponibles para análisis de Carry Trade.</p>;

      case 'acciones':
        return stocksData.length > 0 ? (
          <>
            <MarketTable data={stocksData} />
            <AIInsights data={stocksData} dataType="acciones" />
          </>
        ) : <p className="text-center py-10">No se pudieron cargar los datos de Acciones.</p>;
      case 'cedears':
        return cedearsData.length > 0 ? (
           <>
            <MarketTable data={cedearsData} />
            <AIInsights data={cedearsData} dataType="cedears" />
          </>
        ) : <p className="text-center py-10">No se pudieron cargar los datos de CEDEARs.</p>;
      case 'bonos':
        return bondsData.length > 0 ? (
          <>
            <MarketTable data={bondsData} />
            <AIInsights data={bondsData} dataType="bonos" />
          </>
        ) : <p className="text-center py-10">No se pudieron cargar los datos de Bonos.</p>;
      case 'test':
        return testData.length > 0 ? <TestTable data={testData} /> : <p className="text-center py-10">No se pudieron cargar los datos de la prueba de scraping.</p>;
      default:
        return null;
    }
  };
  
  const TabButton: React.FC<{tab: Tab; label: string}> = ({ tab, label }) => (
     <button
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ease-in-out border-b-2
          ${activeTab === tab 
            ? 'text-blue-400 border-blue-400' 
            : 'text-gray-400 border-transparent hover:text-gray-200'}`
        }
      >
        {label}
      </button>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-900">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-200 tracking-tight">
          Dashboard <span className="text-blue-400">Financiero</span>
        </h1>
        <div className="flex items-center justify-center mt-2 text-sm text-gray-400 gap-4">
            <div className="flex items-center">
                <span className="relative flex h-3 w-3 mr-2">
                    <span className={`absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 ${isRefreshing ? 'animate-ping' : ''}`}></span>
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${error ? 'bg-red-500' : 'bg-green-500'}`}></span>
                </span>
                <span>Última actualización: {formattedLastUpdated}</span>
            </div>
            <button 
                onClick={loadData} 
                disabled={isRefreshing} 
                className="flex items-center justify-center p-1 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-wait transition-colors"
                aria-label="Actualizar datos manualmente"
            >
                <RefreshIcon className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
        </div>
        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
      </header>

      <nav className="flex flex-wrap justify-center border-b border-gray-700 mb-8">
          <TabButton tab="lecap" label="LECAP & DUAL" />
          <TabButton tab="carrytrade" label="Carry Trade" />
          <TabButton tab="acciones" label="Acciones" />
          <TabButton tab="cedears" label="CEDEARs" />
          <TabButton tab="bonos" label="Bonos" />
          <TabButton tab="test" label="Test Scraping" />
      </nav>

      <main className="space-y-8">
        {renderContent()}
      </main>
      
      <footer className="text-center text-xs text-gray-500 mt-8">
        <p>Datos de mercado en vivo. Los cálculos derivados son solo para fines informativos y no constituyen asesoramiento financiero.</p>
      </footer>
    </div>
  );
};

export default App;