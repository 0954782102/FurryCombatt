
import React, { useState, useRef } from 'react';
import { GameState } from '../types';
import { formatCurrency, formatNumber } from './Formatters';
import { Zap, PawPrint } from 'lucide-react';
import { LEVEL_THRESHOLDS } from '../constants';

interface ClickerAreaProps {
  state: GameState;
  onTap: (x: number, y: number) => void;
  onCheatDetected: () => void;
}

const ClickerArea: React.FC<ClickerAreaProps> = ({ state, onTap }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const coinRef = useRef<HTMLDivElement>(null);
  
  // Logic for Level Progress Bar
  const currentLevelObj = LEVEL_THRESHOLDS.find(l => l.level === state.level);
  const nextLevelObj = LEVEL_THRESHOLDS.find(l => l.level === state.level + 1);
  
  const currentLevelThreshold = currentLevelObj?.threshold || 0;
  const nextLevelThreshold = nextLevelObj?.threshold || (currentLevelThreshold * 10);
  
  // Calculate progress relative to current level range
  const levelProgress = Math.min(
    100, 
    Math.max(0, ((state.balance - currentLevelThreshold) / (nextLevelThreshold - currentLevelThreshold)) * 100)
  );
  
  const progressText = nextLevelObj 
    ? `${formatNumber(Math.floor(state.balance))} / ${formatNumber(nextLevelThreshold)}`
    : 'MAX LEVEL';

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); // Prevent default browser zooming/scrolling

    // Simple interaction logic without anti-cheat
    const rect = coinRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const processTap = (clientX: number, clientY: number) => {
      const tiltX = (clientY - centerY) / 10;
      const tiltY = (centerX - clientX) / 10;
      setTilt({ x: tiltX, y: tiltY });
      setTimeout(() => setTilt({ x: 0, y: 0 }), 150);
      onTap(clientX, clientY);
    };

    if ('touches' in e) {
      for (let i = 0; i < e.changedTouches.length; i++) {
        processTap(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
      }
    } else {
      processTap((e as React.MouseEvent).clientX, (e as React.MouseEvent).clientY);
    }
  };

  const energyPercentage = Math.min((state.energy / state.maxEnergy) * 100, 100);

  return (
    <div className="flex-1 flex flex-col items-center justify-between py-4 w-full max-w-md mx-auto relative z-10 select-none">
      
      {/* Top Info */}
      <div className="flex flex-col items-center w-full px-4 mb-2">
        
        {/* Level Progress */}
        <div className="w-full flex flex-col gap-1 mb-4">
            <div className="flex justify-between text-xs font-bold px-1">
                <div className="flex items-center gap-2">
                    <span className="text-gray-300">{state.characterName} (Ур. {state.level})</span>
                </div>
                <span className="text-gray-400">{state.level + 1} &gt;</span>
            </div>
            <div className="w-full h-4 bg-neutral-800 rounded-full border border-neutral-700 overflow-hidden relative">
                <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    style={{ width: `${levelProgress}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                    {progressText}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)] border-2 bg-gradient-to-br from-yellow-500 to-orange-600 border-yellow-300">
               <PawPrint className="text-white drop-shadow-md" size={24} />
            </div>
            <h1 className="text-5xl font-display font-bold text-white tracking-wide drop-shadow-xl">
                {formatCurrency(state.balance)}
            </h1>
        </div>
        <div className="text-xs text-yellow-500 font-bold mt-1">
            +{state.clickDamage} за тап
        </div>
      </div>

      {/* Main Coin Button */}
      <div className="flex-1 flex items-center justify-center w-full relative">
        <div 
            ref={coinRef}
            className="relative w-[280px] h-[280px] cursor-pointer touch-manipulation perspective-1000"
            onMouseDown={handleInteraction}
            onTouchStart={handleInteraction}
            style={{ 
                WebkitTapHighlightColor: 'transparent',
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
             {/* Glow Behind */}
             <div className="absolute inset-0 rounded-full blur-[60px] animate-pulse bg-orange-500/30"></div>

             {/* The Coin */}
             <div className="w-full h-full rounded-full bg-gradient-to-b shadow-[0_10px_0_#78350f,0_20px_20px_rgba(0,0,0,0.5)] flex items-center justify-center border-[8px] relative overflow-hidden group from-[#ffd700] via-[#f59e0b] to-[#b45309] border-[#fbbf24]">
                
                {/* Inner Ring */}
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#fcd34d]/50 animate-[spin_60s_linear_infinite]"></div>
                
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Center Graphic */}
                <div className="flex flex-col items-center justify-center z-10 text-[#78350f]">
                    <PawPrint size={130} fill="currentColor" className="drop-shadow-lg" />
                    <span className="font-display font-bold text-2xl mt-2 drop-shadow-sm opacity-80">FURY</span>
                </div>
             </div>
        </div>
      </div>

      {/* Energy & Stats */}
      <div className="w-full px-6 mb-4">
        <div className="flex justify-between items-center mb-1 text-sm font-bold">
            <div className="flex items-center gap-1.5 text-yellow-400">
                <Zap size={20} fill="currentColor" />
                <span className="text-lg">{Math.floor(state.energy)}</span>
                <span className="text-gray-500 text-xs mt-1">/ {state.maxEnergy}</span>
            </div>
            <div className="text-xs text-gray-500">
                {state.energyRegenRate}/сек
            </div>
        </div>
        <div className="w-full h-4 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700 shadow-inner">
            <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-100 ease-out"
                style={{ width: `${energyPercentage}%` }}
            ></div>
        </div>
      </div>

    </div>
  );
};

export default ClickerArea;
