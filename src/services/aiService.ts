import { BondData, MarketDataItem, AIStreamChunk } from '../types';

type DataType = 'lecap' | 'acciones' | 'cedears' | 'bonos';

export async function* getAIInsightStream(
  data: BondData[] | MarketDataItem[], 
  query: string, 
  dataType: DataType
): AsyncGenerator<AIStreamChunk> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const response = generateInsightResponse(data, query, dataType);
  const words = response.split(' ');
  
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    yield {
      text: words[i] + ' ',
      isComplete: i === words.length - 1
    };
  }
}

function generateInsightResponse(
  data: BondData[] | MarketDataItem[], 
  query: string, 
  dataType: DataType
): string {
  const lowerQuery = query.toLowerCase();
  
  if (dataType === 'lecap' && isBondData(data)) {
    if (lowerQuery.includes('tea') && lowerQuery.includes('alta')) {
      const maxTea = Math.max(...data.map(b => b.tea));
      const bondWithMaxTea = data.find(b => b.tea === maxTea);
      return `El bono con la TEA más alta es ${bondWithMaxTea?.ticker} con una TEA del ${maxTea.toFixed(2)}%. Esto indica un rendimiento efectivo anual superior al resto de la cartera de LECAPs.`;
    }
    
    if (lowerQuery.includes('vence') && lowerQuery.includes('antes')) {
      const minDays = Math.min(...data.map(b => b.days));
      const bondWithMinDays = data.find(b => b.days === minDays);
      return `El bono que vence antes es ${bondWithMinDays?.ticker} en ${minDays} días. Los bonos de corto plazo suelen ofrecer menor volatilidad pero también menor rendimiento.`;
    }
    
    if (lowerQuery.includes('tna') && lowerQuery.includes('mayor')) {
      const sortedByTna = [...data].sort((a, b) => b.tna - a.tna).slice(0, 3);
      return `Los 3 bonos con mayor TNA son: ${sortedByTna.map(b => `${b.ticker} (${b.tna.toFixed(2)}%)`).join(', ')}. Estos bonos ofrecen las tasas nominales más atractivas del portafolio.`;
    }
  }
  
  if (dataType === 'acciones' && isMarketData(data)) {
    if (lowerQuery.includes('mejor rendimiento')) {
      const maxChange = Math.max(...data.map(s => s.change));
      const bestStock = data.find(s => s.change === maxChange);
      return `La acción con mejor rendimiento hoy es ${bestStock?.ticker} con una variación del ${maxChange.toFixed(2)}%. Un buen rendimiento diario puede indicar noticias positivas o momentum alcista.`;
    }
    
    if (lowerQuery.includes('peor') && lowerQuery.includes('variación')) {
      const minChange = Math.min(...data.map(s => s.change));
      const worstStock = data.find(s => s.change === minChange);
      return `La acción con peor variación es ${worstStock?.ticker} con ${minChange.toFixed(2)}%. Es importante analizar las causas fundamentales de esta caída.`;
    }
  }
  
  // Generic response
  return `Basándome en los datos disponibles de ${dataType}, puedo ver que hay ${data.length} instrumentos en el análisis. Para obtener insights más específicos, puedes preguntarme sobre rendimientos, comparaciones entre instrumentos, o tendencias particulares que te interesen.`;
}

function isBondData(data: any[]): data is BondData[] {
  return data.length > 0 && 'tna' in data[0];
}

function isMarketData(data: any[]): data is MarketDataItem[] {
  return data.length > 0 && 'ticker' in data[0] && !('tna' in data[0]);
}