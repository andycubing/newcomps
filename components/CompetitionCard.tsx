import React from 'react';
import { WCACompetition, COUNTRY_EMOJIS, COUNTRY_NAMES } from '../types';

interface CompetitionCardProps {
  competition: WCACompetition;
  onAskAI: (comp: WCACompetition) => void;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const getEventIcon = (eventId: string) => {
  // Simple mapping for common events to just show text or use a generic cube icon
  // In a real app we would use WCA font or SVGs
  return eventId;
};

const CompetitionCard: React.FC<CompetitionCardProps> = ({ competition, onAskAI }) => {
  const isMultiDay = competition.start_date !== competition.end_date;
  const emoji = COUNTRY_EMOJIS[competition.country_iso2];
  const countryName = COUNTRY_NAMES[competition.country_iso2];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col h-full group">
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
            <span>{emoji}</span>
            <span>{countryName}</span>
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            new Date(competition.start_date) < new Date(new Date().setDate(new Date().getDate() + 7)) 
            ? 'bg-green-100 text-green-700' 
            : 'bg-indigo-50 text-indigo-600'
          }`}>
             {isMultiDay 
               ? `${formatDate(competition.start_date)} - ${formatDate(competition.end_date)}`
               : formatDate(competition.start_date)
             }
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
          <a href={competition.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {competition.name}
          </a>
        </h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4 text-sm">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="truncate">{competition.city}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {competition.event_ids.slice(0, 5).map(event => (
            <span key={event} className="text-[10px] uppercase font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
              {event}
            </span>
          ))}
          {competition.event_ids.length > 5 && (
            <span className="text-[10px] text-gray-400 px-1.5 py-0.5">
              +{competition.event_ids.length - 5} more
            </span>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 flex gap-3">
        <a 
          href={competition.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 text-center py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Details
        </a>
        <button 
          onClick={() => onAskAI(competition)}
          className="flex-1 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-indigo-200 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ask AI
        </button>
      </div>
    </div>
  );
};

export default CompetitionCard;
