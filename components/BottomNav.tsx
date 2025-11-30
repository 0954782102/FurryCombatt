import React from 'react';
import { Pickaxe, Gamepad2, Trophy, Wallet } from 'lucide-react';
import { GameTab } from '../types';

interface BottomNavProps {
  currentTab: GameTab;
  setTab: (tab: GameTab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setTab }) => {
  const navItems = [
    { id: GameTab.EXCHANGE, icon: Gamepad2, label: 'Игра' },
    { id: GameTab.MINE, icon: Pickaxe, label: 'Улучшения' },
    { id: GameTab.TOP, icon: Trophy, label: 'Топ' },
    { id: GameTab.AIRDROP, icon: Wallet, label: 'Airdrop' },
  ];

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-[#1c1c1e]/90 backdrop-blur-md border border-white/10 rounded-2xl p-2 flex justify-between items-center z-50 shadow-lg">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setTab(item.id)}
          className={`flex flex-col items-center justify-center w-full py-2 rounded-xl transition-all duration-200 ${
            currentTab === item.id
              ? 'bg-[#2c2c2e] text-blue-400'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <item.icon size={24} className="mb-1" />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;