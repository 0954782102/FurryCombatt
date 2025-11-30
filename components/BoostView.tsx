import React from 'react';
import { Boost, GameState } from '../types';
import { UPGRADEABLE_BOOSTS, DAILY_BOOSTS } from '../constants';
import { Zap, Rocket, Battery, Gauge } from 'lucide-react';
import { formatNumber } from './Formatters';

interface BoostViewProps {
  state: GameState;
  onBuyBoost: (boost: Boost) => void;
}

const BoostView: React.FC<BoostViewProps> = ({ state, onBuyBoost }) => {
  
  const getLevel = (type: string) => {
      if (type === 'multitap') return state.multitapLevel;
      if (type === 'limit') return state.energyLimitLevel;
      if (type === 'regen') return state.energyRegenLevel;
      return 0;
  };

  const getCost = (boost: Boost) => {
      if (boost.isDaily) return 0;
      const level = getLevel(boost.type);
      return boost.baseCost * Math.pow(2, level - 1);
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'energy': return <Zap size={24} />;
          case 'multitap': return <Rocket size={24} />;
          case 'limit': return <Battery size={24} />;
          case 'regen': return <Gauge size={24} />;
          default: return <Zap size={24} />;
      }
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto p-4 pt-6 overflow-y-auto pb-24 relative z-10">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-display font-bold text-white mb-1">Усилители</h2>
        <p className="text-gray-400 text-sm">Прокачивай аккаунт эффективнее</p>
      </div>

      {/* Daily Boosts */}
      <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Бесплатные ежедневные</h3>
          <div className="grid grid-cols-1 gap-3">
            {DAILY_BOOSTS.map((boost) => (
                <button
                    key={boost.id}
                    onClick={() => onBuyBoost(boost)}
                    className="bg-neutral-800 rounded-xl p-3 flex items-center gap-4 border border-neutral-700 active:scale-95 transition-all hover:bg-neutral-750"
                >
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                        {getIcon(boost.type)}
                    </div>
                    <div className="text-left flex-1">
                        <div className="font-bold text-white text-sm">{boost.name}</div>
                        <div className="text-xs text-gray-400">{boost.effectDesc}</div>
                    </div>
                    <div className="text-sm font-bold text-white bg-neutral-700 px-3 py-1 rounded-lg">
                        Бесплатно
                    </div>
                </button>
            ))}
          </div>
      </div>

      {/* Upgradeable Boosts */}
      <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Прокачка</h3>
          <div className="space-y-3">
             {UPGRADEABLE_BOOSTS.map((boost) => {
                 const level = getLevel(boost.type);
                 const cost = getCost(boost);
                 const canAfford = state.balance >= cost;

                 return (
                    <div key={boost.id} className="bg-neutral-800 rounded-xl p-3 flex items-center gap-3 border border-neutral-700">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 flex items-center justify-center shrink-0 border border-white/5">
                            {getIcon(boost.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-sm text-white truncate">{boost.name}</span>
                                <span className="text-xs font-mono text-yellow-500">Ур. {level}</span>
                            </div>
                            <div className="text-xs text-gray-400 truncate mb-1">{boost.description}</div>
                            <div className="text-[10px] text-gray-500">{boost.effectDesc}</div>
                        </div>

                        <button 
                            onClick={() => onBuyBoost(boost)}
                            disabled={!canAfford}
                            className={`
                                flex flex-col items-center justify-center px-3 py-2 rounded-lg min-w-[80px] transition-all
                                ${canAfford 
                                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-95' 
                                    : 'bg-neutral-700 text-gray-500 cursor-not-allowed opacity-70'}
                            `}
                        >
                            <span className="text-xs font-bold">{formatNumber(cost)}</span>
                            <div className="flex items-center gap-1 text-[10px] opacity-80">
                                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                            </div>
                        </button>
                    </div>
                 );
             })}
          </div>
      </div>
      
    </div>
  );
};

export default BoostView;