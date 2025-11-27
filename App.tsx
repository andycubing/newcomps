import React, { useState, useEffect, useMemo } from 'react';
import { WCACompetition, CountryCode, COUNTRY_NAMES, COUNTRY_EMOJIS } from './types';
import { fetchUpcomingCompetitions } from './services/wcaService';
import { getCompetitionAnalysis } from './services/geminiService';
import CompetitionCard from './components/CompetitionCard';
import StatsChart from './components/StatsChart';
import TravelGuide from './components/TravelGuide';

const App: React.FC = () => {
  const [competitions, setCompetitions] = useState<WCACompetition[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [activeTravelGuideComp, setActiveTravelGuideComp] = useState<WCACompetition | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchUpcomingCompetitions();
      setCompetitions(data);
      setLoading(false);
      
      // Get AI High-level Analysis
      const analysis = await getCompetitionAnalysis(data);
      setAiAnalysis(analysis);
    };
    loadData();
  }, []);

  const filteredCompetitions = useMemo(() => {
    if (selectedCountry === 'ALL') return competitions;
    return competitions.filter(c => c.country_iso2 === selectedCountry);
  }, [competitions, selectedCountry]);

  const countryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    competitions.forEach(c => {
      counts[c.country_iso2] = (counts[c.country_iso2] || 0) + 1;
    });
    return counts;
  }, [competitions]);

  const availableCountries = useMemo(() => {
    return Object.keys(countryCounts).sort((a, b) => countryCounts[b] - countryCounts[a]);
  }, [countryCounts]);

  return (
    <div className="min-h-screen pb-12">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-lg bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 rounded-lg p-1.5">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">AsiaCube<span className="text-indigo-600">Events</span></h1>
            </div>
            <div className="text-sm text-gray-500 hidden sm:block">
              Upcoming WCA Competitions
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">Fetching upcoming competitions...</p>
          </div>
        ) : (
          <>
            {/* Header Stats */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <StatsChart competitions={competitions} />
                </div>
                <div className="md:w-1/3 bg-indigo-900 rounded-xl p-6 text-white shadow-lg flex flex-col justify-center relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-indigo-200 text-sm font-semibold uppercase tracking-wider mb-2">AI Insights</h3>
                    {aiAnalysis ? (
                       <p className="text-indigo-50 leading-relaxed text-sm">{aiAnalysis}</p>
                    ) : (
                       <div className="animate-pulse space-y-2">
                         <div className="h-4 bg-indigo-700 rounded w-3/4"></div>
                         <div className="h-4 bg-indigo-700 rounded w-full"></div>
                         <div className="h-4 bg-indigo-700 rounded w-5/6"></div>
                       </div>
                    )}
                  </div>
                  {/* Decorative blobs */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-700 rounded-full blur-2xl opacity-50"></div>
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-600 rounded-full blur-2xl opacity-30"></div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
               <div className="flex space-x-2">
                <button
                  onClick={() => setSelectedCountry('ALL')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCountry === 'ALL'
                      ? 'bg-indigo-600 text-white shadow-md scale-105'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  All Regions ({competitions.length})
                </button>
                {availableCountries.map(code => (
                  <button
                    key={code}
                    onClick={() => setSelectedCountry(code)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 ${
                      selectedCountry === code
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span>{COUNTRY_EMOJIS[code]}</span>
                    <span>{COUNTRY_NAMES[code]}</span>
                    <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${selectedCountry === code ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {countryCounts[code]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            {filteredCompetitions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCompetitions.map(comp => (
                  <CompetitionCard 
                    key={comp.id} 
                    competition={comp} 
                    onAskAI={(c) => setActiveTravelGuideComp(c)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-xl border border-gray-200 border-dashed">
                <p className="text-gray-500 text-lg">No competitions found for this selection.</p>
                <button 
                  onClick={() => setSelectedCountry('ALL')}
                  className="mt-4 text-indigo-600 font-medium hover:underline"
                >
                  View all events
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Data provided by <a href="https://www.worldcubeassociation.org" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">World Cube Association</a>.</p>
          <p className="mt-2">AI insights powered by Google Gemini.</p>
        </div>
      </footer>

      {/* AI Modal */}
      {activeTravelGuideComp && (
        <TravelGuide 
          competition={activeTravelGuideComp} 
          onClose={() => setActiveTravelGuideComp(null)} 
        />
      )}
    </div>
  );
};

export default App;
