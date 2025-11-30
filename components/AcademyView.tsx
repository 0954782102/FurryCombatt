import React, { useState } from 'react';
import { Upgrade, UpgradeCategory } from '../types';
import UpgradeCard from './UpgradeCard';
import { formatNumber } from './Formatters';
import { ArrowUpCircle } from 'lucide-react';

interface AcademyViewProps {
  balance: number;
  upgrades: Upgrade[];
  onBuyUpgrade: (id: string) => void;
  famePerHour: number;
}

const AcademyView: React.FC<AcademyViewProps> = ({ balance, upgrades, onBuyUpgrade, famePerHour }) => {
  const [activeCategory, setActiveCategory] = useState<UpgradeCategory>(UpgradeCategory.TRAINING);

  const filteredUpgrades = upgrades.filter(u => u.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto h-full overflow-hidden bg-neutral-900 relative z-10">
      
      {/* Header */}
      <div className="p-4 bg-gradient-to-b from-neutral-800 to-neutral-900 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-display font-bold text-white">Академия</h2>
             <div className="text-right">
                <div className="text-xs text-gray-400">Прибыль в час</div>
                <div className="font-bold text-green-400">+{formatNumber(famePerHour)}</div>
             </div>
        </div>
        
        <div className="bg-neutral-800/50 rounded-xl p-3 flex justify-between items-center border border-neutral-700 backdrop-blur-sm">
            <span className="text-gray-300 text-sm font-medium">Ваш баланс:</span>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-[10px]">🐾</div>
                <span className="font-bold text-xl text-white">{formatNumber(balance)}</span>
            </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex px-4 gap-2 overflow-x-auto py-3 scrollbar-hide border-b border-neutral-800">
        {Object.values(UpgradeCategory).map((cat) => (
            <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                    px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200
                    ${activeCategory === cat 
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/20' 
                        : 'bg-neutral-800 text-gray-400 hover:bg-neutral-700 hover:text-gray-200'}
                `}
            >
                {cat}
            </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-2 px-1">
            Инвестируй для пассивного дохода
        </div>
        {filteredUpgrades.map(upgrade => (
            <UpgradeCard 
                key={upgrade.id}
                upgrade={upgrade}
                onBuy={onBuyUpgrade}
                canAfford={balance >= upgrade.cost}
            />
        ))}
        {filteredUpgrades.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <p>В этом разделе пока пусто.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default AcademyView;