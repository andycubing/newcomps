import React, { useState, useEffect } from 'react';
import { WCACompetition } from '../types';
import { getTravelGuide } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // Assuming standard markdown rendering or basic text

interface TravelGuideProps {
  competition: WCACompetition;
  onClose: () => void;
}

const TravelGuide: React.FC<TravelGuideProps> = ({ competition, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchGuide = async () => {
      setLoading(true);
      const guide = await getTravelGuide(competition);
      if (isMounted) {
        setContent(guide);
        setLoading(false);
      }
    };
    fetchGuide();
    return () => { isMounted = false; };
  }, [competition]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-indigo-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>✨</span> Gemini Travel Guide
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              For {competition.name} in {competition.city}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 animate-pulse">Consulting the AI knowledge base...</p>
            </div>
          ) : (
            <div className="prose prose-indigo prose-sm max-w-none text-gray-700 leading-relaxed">
               {/* Simple markdown rendering by splitting newlines if no library is preferred, but raw text works well with whitespace-pre-wrap */}
               <div className="whitespace-pre-wrap font-medium font-sans">
                 {content}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm hover:shadow-md"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelGuide;
