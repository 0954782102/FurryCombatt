import React, { useState } from 'react';
import { GameState } from '../types';
import { getCoachAdvice } from '../services/geminiService';
import { MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { LEVEL_THRESHOLDS } from '../constants';

interface CoachViewProps {
  gameState: GameState;
}

const CoachView: React.FC<CoachViewProps> = ({ gameState }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentRankName = LEVEL_THRESHOLDS.find(l => l.level === gameState.level)?.name || "Fighter";

  const handleGetAdvice = async () => {
    setLoading(true);
    const result = await getCoachAdvice(currentRankName, gameState.famePerHour);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col p-4 w-full max-w-md mx-auto pt-8 relative z-10">
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg border-2 border-white/10">
          <Sparkles size={40} className="text-white" />
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-2">AI Head Coach</h2>
        <p className="text-gray-400 text-sm">Get tactical advice powered by Google Gemini</p>
      </div>

      <div className="bg-neutral-800/50 rounded-2xl p-6 border border-neutral-700 flex-1 flex flex-col items-center justify-center min-h-[200px]">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-indigo-400">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-sm font-medium">Analyzing fight data...</span>
          </div>
        ) : advice ? (
          <div className="text-center animate-fade-in">
             <MessageSquare className="mx-auto text-indigo-400 mb-3" size={24} />
             <p className="text-lg font-medium text-white italic">"{advice}"</p>
          </div>
        ) : (
          <p className="text-gray-500 text-center">Tap the button below to ask your coach for guidance on your next move.</p>
        )}
      </div>

      <button
        onClick={handleGetAdvice}
        disabled={loading}
        className="mt-6 w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-700 rounded-xl font-bold text-white shadow-lg shadow-indigo-900/20 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        {loading ? 'Thinking...' : 'Get Tactical Advice'}
      </button>
    </div>
  );
};

export default CoachView;