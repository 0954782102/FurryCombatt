import React from 'react';
import { Upgrade } from '../types';
import { formatNumber } from './Formatters';
import { Coins, Zap } from 'lucide-react';

interface UpgradeCardProps {
  upgrade: Upgrade;
  onBuy: (id: string) => void;
  canAfford: boolean;
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({ upgrade, onBuy, canAfford }) => {
  return (
    <div className="bg-neutral-800 rounded-xl p-3 flex items-center gap-3 border border-neutral-700 shadow-lg">
      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-neutral-900">
        <img src={upgrade.image} alt={upgrade.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
            <h3 className="font-bold text-sm text-gray-100 truncate">{upgrade.name}</h3>
            <span className="text-xs text-blue-400 font-mono">Lvl {upgrade.level}</span>
        </div>
        <p className="text-xs text-gray-400 truncate mb-2">{upgrade.description}</p>
        
        <div className="flex justify-between items-end">
            <div className="text-xs text-gray-300">
                <div className="flex items-center gap-1">
                    <span className="text-purple-400">Profit:</span>
                    <span className="font-bold">+{formatNumber(upgrade.baseProfit)}/h</span>
                </div>
            </div>
            
            <button
                onClick={() => onBuy(upgrade.id)}
                disabled={!canAfford}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all
                    ${canAfford 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white active:scale-95' 
                        : 'bg-neutral-600 text-neutral-400 cursor-not-allowed'
                    }`}
            >
                <Coins size={12} />
                {formatNumber(upgrade.cost)}
            </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeCard;
