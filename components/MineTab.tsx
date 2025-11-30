import React from 'react';
import { TabProps, Upgrade } from '../types';
import { Palette, Cpu, Ticket, Zap, CircleDollarSign, Briefcase, Bot, Rocket, Music, Image } from 'lucide-react';

const MineTab: React.FC<TabProps> = ({ userState, setUserState, upgrades, setUpgrades }) => {
  const categories = ['Tech', 'Art', 'Events', 'Crypto'];
  const [activeCategory, setActiveCategory] = React.useState('Tech');

  const calculateCost = (baseCost: number, level: number) => {
    return Math.floor(baseCost * Math.pow(1.2, level)); // Increased scaling slightly for late game
  };

  const handleBuy = (upgrade: Upgrade) => {
    const cost = calculateCost(upgrade.baseCost, upgrade.level);
    if (userState.balance >= cost) {
      setUserState(prev => ({
        ...prev,
        balance: prev.balance - cost,
        profitPerHour: prev.profitPerHour + upgrade.baseProfit,
      }));

      setUpgrades(prev => prev.map(u => 
        u.id === upgrade.id 
          ? { ...u, level: u.level + 1 }
          : u
      ));
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const getIcon = (iconName: string, category: string) => {
      // Simplified icon mapping
      switch(category) {
          case 'Tech': return <Cpu size={24} className="text-blue-400" />;
          case 'Art': return <Palette size={24} className="text-pink-400" />;
          case 'Events': return <Ticket size={24} className="text-purple-400" />;
          case 'Crypto': return <Zap size={24} className="text-yellow-400" />;
          default: return <CircleDollarSign size={24} />;
      }
  };

  return (
    <div className="flex flex-col w-full h-full pb-24 overflow-hidden bg-black">
        
      {/* PPH Header */}
      <div className="w-full p-4 bg-[#1c1c1e] z-10 shadow-lg border-b border-white/5">
        <div className="flex justify-between items-center bg-gradient-to-r from-yellow-600/20 to-orange-600/20 p-4 rounded-2xl border border-yellow-500/20">
            <div className="flex flex-col">
                <span className="text-[10px] text-yellow-500 uppercase font-bold tracking-widest mb-1">Прибыль в час</span>
                <div className="flex items-center gap-2">
                    <div className="bg-yellow-500 rounded-full p-0.5"><CircleDollarSign size={14} className="text-black" /></div>
                    <span className="text-2xl font-black text-white tracking-tight">+{formatNumber(userState.profitPerHour)}</span>
                </div>
            </div>
            <div className="bg-yellow-500/10 p-3 rounded-full border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                <Zap className="text-yellow-500" size={24} fill="currentColor"/>
            </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex px-4 py-4 gap-2 overflow-x-auto no-scrollbar border-b border-white/5 bg-[#101010]">
        {categories.map(cat => (
            <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat 
                    ? 'bg-white text-black scale-105 shadow-lg' 
                    : 'bg-[#2c2c2e] text-gray-400 hover:text-white hover:bg-[#3c3c3e]'
                }`}
            >
                {cat === 'Tech' && 'Технологии'}
                {cat === 'Art' && 'Арт'}
                {cat === 'Events' && 'Ивенты'}
                {cat === 'Crypto' && 'Крипта'}
            </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 gap-3 p-4 overflow-y-auto pb-32">
        {upgrades.filter(u => u.category === activeCategory).map((upgrade) => {
            const currentCost = calculateCost(upgrade.baseCost, upgrade.level);
            const canAfford = userState.balance >= currentCost;

            return (
                <button
                    key={upgrade.id}
                    disabled={!canAfford}
                    onClick={() => handleBuy(upgrade)}
                    className={`relative flex flex-col p-3 rounded-2xl border transition-all active:scale-95 text-left h-auto min-h-[160px] justify-between group overflow-hidden
                        ${canAfford 
                            ? 'bg-[#2c2c2e] border-white/5 hover:border-blue-500/50 hover:bg-[#323235]' 
                            : 'bg-[#1c1c1e] border-white/5 opacity-60'
                        }`}
                >
                    {/* Gradient Overlay for hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                    <div className="flex justify-between items-start w-full mb-3 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-[#1a1a1c] border border-white/10 flex items-center justify-center shadow-inner">
                             {getIcon(upgrade.icon, upgrade.category)}
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ур. {upgrade.level}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1 mb-3 relative z-10">
                        <span className="text-sm font-bold leading-tight pr-1">{upgrade.name}</span>
                        <span className="text-[10px] text-gray-400 leading-tight line-clamp-2">{upgrade.description}</span>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/5 pt-2 relative z-10">
                        <div className="flex justify-between items-center text-[10px] text-gray-400">
                             <span>Доход/ч</span>
                             <span className="text-white font-bold">+{formatNumber(upgrade.baseProfit)}</span>
                        </div>
                         <div className="flex items-center gap-1.5">
                            <CircleDollarSign size={16} className={canAfford ? "text-yellow-400" : "text-gray-600"} />
                            <span className={`text-sm font-bold ${canAfford ? 'text-white' : 'text-gray-500'}`}>
                                {formatNumber(currentCost)}
                            </span>
                        </div>
                    </div>
                </button>
            );
        })}
      </div>
    </div>
  );
};

export default MineTab;