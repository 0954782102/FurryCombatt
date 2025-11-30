import React, { useState, useRef } from 'react';
import { UserState, Skin } from '../types';
import { LEVEL_NAMES, LEVEL_THRESHOLDS, SKINS } from '../constants';
import { Zap, CircleDollarSign, Palette, Check, Bitcoin, Gem, Box, Triangle, Hexagon } from 'lucide-react';

interface GameTabProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
}

const GameTab: React.FC<GameTabProps> = ({ userState, setUserState }) => {
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number; val: number }[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [showSkins, setShowSkins] = useState(false);
  
  const clickerRef = useRef<HTMLDivElement>(null);

  const currentSkin = SKINS.find(s => s.id === userState.currentSkin) || SKINS[0];

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (userState.energy <= 0) return;

    let clientX, clientY;
    if ('touches' in e) {
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    const rect = clickerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -15; 
      const rotateY = ((x - centerX) / centerX) * 15;

      setTilt({ x: rotateX, y: rotateY });
      setTimeout(() => setTilt({ x: 0, y: 0 }), 100);

      const id = Date.now();
      setClicks((prev) => [...prev, { id, x, y, val: userState.tapPower }]);
      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
      }, 1000);
    }

    setUserState((prev) => ({
      ...prev,
      balance: prev.balance + prev.tapPower,
      energy: Math.max(0, prev.energy - 1),
    }));
  };

  const buySkin = (skin: Skin) => {
    if (userState.unlockedSkins.includes(skin.id)) {
      setUserState(prev => ({ ...prev, currentSkin: skin.id }));
    } else if (userState.balance >= skin.cost) {
      setUserState(prev => ({
        ...prev,
        balance: prev.balance - skin.cost,
        unlockedSkins: [...prev.unlockedSkins, skin.id],
        currentSkin: skin.id
      }));
    }
  };

  const progressToNextLevel = () => {
    const currentThreshold = LEVEL_THRESHOLDS[userState.level];
    const nextThreshold = LEVEL_THRESHOLDS[userState.level + 1] || currentThreshold * 2;
    const progress = userState.balance - currentThreshold;
    const range = nextThreshold - currentThreshold;
    return Math.min(100, Math.max(0, (progress / range) * 100));
  };

  const renderSkinIcon = (skinId: string) => {
    switch(skinId) {
        case 'btc': return <Bitcoin size={120} className="text-white drop-shadow-md" />;
        case 'ton': return <Gem size={100} className="text-white drop-shadow-md" />;
        case 'eth': return <Triangle size={100} className="text-white drop-shadow-md" fill="currentColor" />;
        case 'bnb': return <Box size={100} className="text-white drop-shadow-md" />;
        case 'not': return <div className="text-8xl font-black text-white">NOT</div>;
        default: return <div className="text-8xl font-black text-white">$FUR</div>;
    }
  };

  return (
    <div className="flex flex-col items-center w-full pb-24 px-4 h-full overflow-y-auto no-select bg-gradient-to-b from-black to-[#0a0a0a]">
      
      {/* Top Header */}
      <div className="w-full flex justify-between items-center mt-6 mb-6">
        <div className="flex items-center gap-3 bg-[#1c1c1e] p-2 pr-4 rounded-full border border-white/5 shadow-md">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center border border-white/20">
                 <span className="font-bold text-white text-xs">{userState.username ? userState.username.charAt(0).toUpperCase() : 'U'}</span>
            </div>
            <span className="font-bold text-sm tracking-wide max-w-[100px] truncate">{userState.username || 'Игрок'}</span>
        </div>
        <button 
          onClick={() => setShowSkins(!showSkins)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1c1c1e] rounded-full text-xs font-bold border border-white/10 hover:bg-[#2c2c2e] active:scale-95 transition-all shadow-md"
        >
            <Palette size={14} className="text-purple-400" />
            <span>Скины</span>
        </button>
      </div>

      {/* Stats Card */}
      <div className="w-full bg-[#1c1c1e] rounded-3xl p-5 mb-8 border border-white/5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
        
        <div className="flex justify-between items-end mb-3 relative z-10">
          <div>
              <div className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Ваш статус</div>
              <span className="text-xl font-black text-white tracking-wide">{LEVEL_NAMES[userState.level]}</span>
          </div>
          <span className="text-xs text-gray-500 font-mono font-bold bg-black/30 px-2 py-1 rounded-lg border border-white/5">
              Уровень {userState.level + 1}
          </span>
        </div>
        
        <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden border border-white/5 relative z-10">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-all duration-300"
            style={{ width: `${progressToNextLevel()}%` }}
          />
        </div>
      </div>

      {/* Balance */}
      <div className="flex flex-col items-center gap-1 mb-8">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                 <span className="font-bold text-black text-xl">$</span>
            </div>
            <span className="text-5xl font-black tracking-tighter drop-shadow-2xl">{Math.floor(userState.balance).toLocaleString('ru-RU')}</span>
        </div>
        <span className="text-gray-500 text-sm font-medium tracking-widest uppercase opacity-70">Баланс токенов</span>
      </div>

      {/* Main Clicker - REALISTIC COIN */}
      <div className="flex-1 flex items-center justify-center w-full mb-8 relative perspective-1000">
        <div 
          ref={clickerRef}
          className="relative w-80 h-80 cursor-pointer touch-manipulation z-10 transition-transform duration-100 ease-out"
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${tilt.x !== 0 ? 0.98 : 1})`,
            transformStyle: 'preserve-3d',
          }}
          onMouseDown={handleInteraction}
          onTouchStart={handleInteraction}
        >
            {/* Outer Ring */}
            <div className={`w-full h-full rounded-full bg-gradient-to-b ${currentSkin.color} p-1 shadow-[0_10px_60px_-10px_${currentSkin.borderColor}]`}>
                <div className="w-full h-full rounded-full bg-[#151515] p-2">
                    {/* Coin Body */}
                    <div className={`w-full h-full rounded-full bg-gradient-to-br ${currentSkin.color} flex items-center justify-center relative shadow-inner overflow-hidden border border-white/10`}>
                        
                        {/* Metallic Shine Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-50 pointer-events-none rounded-full"></div>
                        <div className="absolute -inset-4 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.5),transparent)] pointer-events-none"></div>

                        {/* Symbol */}
                        <div className="relative z-10 transform drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                             {renderSkinIcon(currentSkin.id)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Numbers */}
            {clicks.map((click) => (
            <div
                key={click.id}
                className="float-text text-4xl font-black text-white stroke-black drop-shadow-lg pointer-events-none z-50"
                style={{ left: click.x, top: click.y }}
            >
                +{click.val}
            </div>
            ))}
        </div>
      </div>

      {/* Energy Bar */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-[#1c1c1e] flex items-center justify-center border border-white/10">
                <Zap className="text-yellow-400 fill-yellow-400" size={20} />
             </div>
             <div className="flex flex-col">
                <span className="text-lg font-bold tabular-nums leading-none">{Math.floor(userState.energy)}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">/ {userState.maxEnergy} Energy</span>
            </div>
        </div>
      </div>

      {/* Skins Modal */}
      {showSkins && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col p-6 animate-in fade-in duration-200">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Биржа Скинов</h2>
                <button onClick={() => setShowSkins(false)} className="w-10 h-10 rounded-full bg-[#2c2c2e] flex items-center justify-center text-gray-400 hover:text-white">✕</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 overflow-y-auto pb-10 no-scrollbar">
                {SKINS.map(skin => {
                    const isUnlocked = userState.unlockedSkins.includes(skin.id);
                    const isSelected = userState.currentSkin === skin.id;
                    const canAfford = userState.balance >= skin.cost;

                    return (
                        <button 
                            key={skin.id}
                            onClick={() => buySkin(skin)}
                            disabled={!isUnlocked && !canAfford}
                            className={`relative p-4 rounded-3xl border flex flex-col items-center gap-4 transition-all overflow-hidden group ${
                                isSelected 
                                ? 'border-green-500 bg-green-900/10' 
                                : isUnlocked 
                                    ? 'border-[#2c2c2e] bg-[#1c1c1e]'
                                    : 'border-[#1c1c1e] bg-black opacity-60'
                            }`}
                        >
                            {/* Card Background Glow */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${skin.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>

                            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${skin.color} shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
                                {renderSkinIcon(skin.id)}
                            </div>
                            
                            <div className="text-center relative z-10">
                                <div className="font-bold text-lg mb-1">{skin.name}</div>
                                {!isUnlocked && <div className="text-sm text-yellow-500 font-mono bg-yellow-900/20 px-2 py-0.5 rounded">{skin.cost.toLocaleString()}</div>}
                                {isSelected && <div className="flex items-center gap-1 text-xs text-green-500 font-bold bg-green-900/20 px-3 py-1 rounded-full"><Check size={12}/> ACTIVE</div>}
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
      )}

    </div>
  );
};

export default GameTab;