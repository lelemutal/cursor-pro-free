import React, { useState, useRef, useEffect } from 'react';
import { BondData, MarketDataItem } from '../types';
import { getAIInsightStream } from '../services/aiService';

type DataType = 'lecap' | 'acciones' | 'cedears' | 'bonos';

interface AIInsightsProps {
    data: BondData[] | MarketDataItem[];
    dataType: DataType;
}

const suggestionsMap: Record<DataType, { query: string; text: string }[]> = {
    lecap: [
        { query: '¿Cuál es el bono con la TEA más alta?', text: 'TEA más alta' },
        { query: '¿Qué bono vence antes?', text: 'Vencimiento más próximo' },
        { query: 'Compara la TNA y TEA del bono T15E7.', text: 'Comparar TNA vs TEA' },
        { query: 'Resume los 3 bonos con mayor TNA.', text: 'Top 3 TNA' },
    ],
    acciones: [
        { query: '¿Qué acción tuvo el mejor rendimiento hoy?', text: 'Mejor rendimiento' },
        { query: '¿Cuál es la acción con la peor variación diaria?', text: 'Peor rendimiento' },
        { query: 'Compara el precio de GGAL y BMA.', text: 'Comparar GGAL vs BMA' },
        { query: 'Resume las 3 acciones con mayor suba.', text: 'Top 3 Acciones' },
    ],
    cedears: [
        { query: '¿Qué CEDEAR tuvo la mayor suba hoy?', text: 'Mayor suba' },
        { query: '¿Cuál es el CEDEAR más caro?', text: 'Más caro' },
        { query: 'Compara el rendimiento de AAPL y MSFT.', text: 'Comparar AAPL vs MSFT' },
        { query: 'Resume los 3 CEDEARs con peor rendimiento.', text: 'Top 3 Peores' },
    ],
    bonos: [
        { query: '¿Qué bono tiene la mayor variación positiva?', text: 'Mayor suba' },
        { query: '¿Cuál es el bono más barato?', text: 'Bono más barato' },
        { query: 'Compara AL30D y GD30D.', text: 'Comparar AL30D vs GD30D' },
        { query: 'Resume los bonos con variación negativa.', text: 'Bonos en baja' },
    ],
};

const AIInsights: React.FC<AIInsightsProps> = ({ data, dataType }) => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const responseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (responseRef.current) {
            responseRef.current.scrollTop = responseRef.current.scrollHeight;
        }
    }, [response]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setResponse('');
        
        try {
            const stream = await getAIInsightStream(data, query, dataType);
            for await (const chunk of stream) {
                setResponse(prev => prev + chunk.text);
            }
        } catch (err) {
            console.error(err);
            setError('Hubo un error al contactar al analista de IA. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
    }
    
    const currentSuggestions = suggestionsMap[dataType];

    return (
        <section className="w-full bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 mt-8" aria-labelledby="ai-analyst-heading">
            <h2 id="ai-analyst-heading" className="text-xl font-semibold mb-4 text-blue-400">Pregúntale al Analista AI</h2>
            
            <div className="mb-4 p-4 bg-gray-900/50 rounded-lg max-h-48 overflow-y-auto" ref={responseRef} aria-live="polite">
                {isLoading && !response && <p className="text-gray-400 animate-pulse">Analizando datos...</p>}
                {response && <p className="text-gray-200 whitespace-pre-wrap">{response}</p>}
                {!isLoading && !response && !error && <p className="text-gray-400">El Analista AI está listo para tu consulta. Puedes usar las sugerencias o escribir tu propia pregunta.</p>}
                {error && <p className="text-red-500">{error}</p>}
            </div>

            {!isLoading && !response && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {currentSuggestions.map((suggestion) => (
                        <button 
                          key={suggestion.text} 
                          onClick={() => handleSuggestionClick(suggestion.query)} 
                          className="bg-gray-600/50 hover:bg-gray-600 text-xs text-gray-200 px-3 py-1 rounded-full transition-colors"
                        >
                          {suggestion.text}
                        </button>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ej: ¿Qué bono tiene la TEA más baja?"
                    className="flex-grow bg-gray-700 text-gray-200 border border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow"
                    disabled={isLoading}
                    aria-label="Pregunta para el Analista AI"
                />
                <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    aria-label="Enviar pregunta"
                >
                    {isLoading ? (
                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : 'Preguntar'}
                </button>
            </form>
        </section>
    );
};

export default AIInsights;