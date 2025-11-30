
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Users, Pickaxe, Brain, Wallet, Zap, Rocket, Crown, ShieldAlert } from 'lucide-react';
import ClickerArea from './components/ClickerArea';
import AcademyView from './components/AcademyView';
import CoachView from './components/CoachView';
import BoostView from './components/BoostView';
import FriendsView from './components/FriendsView';
import AirdropView from './components/AirdropView';
import LeaderboardView from './components/LeaderboardView';
import AdminView from './components/AdminView';
import { INITIAL_STATE, INITIAL_UPGRADES, LEVEL_THRESHOLDS, ADMIN_USERNAMES } from './constants';
import { GameState, Tab, Upgrade, Boost } from './types';
import { formatNumber } from './components/Formatters';
import { dbService } from './services/mockDb';

function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(INITIAL_UPGRADES);
  const [activeTab, setActiveTab] = useState<Tab>('train');
  const [floatingTexts, setFloatingTexts] = useState<{id: number, x: number, y: number, text: string}[]>([]);
  const [offlineEarnings, setOfflineEarnings] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [referralBonus, setReferralBonus] = useState<string | null>(null);
  
  // Telegram User ID for DB storage
  const [tgUserId, setTgUserId] = useState<string>('default');

  // --- Initialization & Telegram Setup ---
  
  useEffect(() => {
    // 1. Initialize Telegram Web App
    if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        tg.setHeaderColor('#0f0f11'); // Match body bg

        // Get User Data
        const user = tg.initDataUnsafe?.user;
        const startParam = tg.initDataUnsafe?.start_param;

        if (user) {
            setTgUserId(user.id.toString());
            // Check Admin Privileges
            if (user.username && ADMIN_USERNAMES.includes(user.username)) {
                setIsAdmin(true);
            }
        }

        // Handle Deep Linking (Referrals)
        if (startParam && startParam.startsWith('ref_') && user) {
            const referrerId = startParam.split('ref_')[1];
            if (referrerId && referrerId !== user.id.toString()) {
                console.log("Joined via referrer:", referrerId);
                // In a real app, this ensures the referrer gets credit
                dbService.processReferral(referrerId, user.id.toString(), user.first_name);
                setReferralBonus(referrerId);
            }
        }
    }

    // 2. Load Data from DB
    const initGame = async () => {
        // Use the ID from Telegram if available, otherwise 'default'
        const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || 'default';
        const { state, upgrades } = await dbService.getUserData(userId);
        
        // Update name from Telegram if it's the default name
        let characterName = state.characterName;
        if (window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name && state.characterName === 'Новичок') {
             characterName = window.Telegram.WebApp.initDataUnsafe.user.first_name;
        }

        // Calculate offline earnings
        const now = Date.now();
        const secondsPassed = (now - state.lastSyncTime) / 1000;
        
        let earned = 0;
        // Earn passive income if offline for more than 1 minute
        if (secondsPassed > 60 && state.famePerHour > 0) {
            earned = Math.floor(secondsPassed * (state.famePerHour / 3600));
            setOfflineEarnings(earned);
        }

        // Energy Regen simulation offline
        const currentRegenRate = 3 + (state.energyRegenLevel - 1);
        const energyRegen = secondsPassed * currentRegenRate; 
        const newEnergy = Math.min(state.maxEnergy, state.energy + energyRegen);

        setGameState({
            ...state,
            characterName,
            balance: state.balance + earned,
            energy: newEnergy,
            energyRegenRate: currentRegenRate,
            lastSyncTime: now
        });
        
        // Merge updates into upgrades
        const mergedUpgrades = upgrades.map(u => {
            const initial = INITIAL_UPGRADES.find(init => init.id === u.id);
            return { ...initial, ...u };
        });
        
        setUpgrades(mergedUpgrades as Upgrade[]);
    };

    initGame();
  }, []);

  // Save loop
  useEffect(() => {
    const interval = setInterval(() => {
      // Pass tgUserId to save function
      dbService.saveProgress(tgUserId, { ...gameState, lastSyncTime: Date.now() }, upgrades);
    }, 5000);
    return () => clearInterval(interval);
  }, [gameState, upgrades, tgUserId]);

  // --- Game Loop ---

  useEffect(() => {
    const loop = setInterval(() => {
      setGameState(prev => {
        const incomePerSecond = prev.famePerHour / 3600;
        const currentRegenRate = 3 + (prev.energyRegenLevel - 1);
        const newEnergy = Math.min(prev.maxEnergy, prev.energy + currentRegenRate);

        return {
          ...prev,
          balance: prev.balance + incomePerSecond,
          energy: newEnergy,
          energyRegenRate: currentRegenRate
        };
      });
    }, 1000);

    return () => clearInterval(loop);
  }, []);

  // --- Level Check ---
  useEffect(() => {
     const nextLevel = LEVEL_THRESHOLDS.slice().reverse().find(t => gameState.balance >= t.threshold);
     if (nextLevel && nextLevel.level > gameState.level) {
         setGameState(prev => ({
             ...prev,
             level: nextLevel.level,
         }));
     }
  }, [gameState.balance, gameState.level]);


  // --- User Actions ---

  const handleCheatDetected = useCallback(() => {
      setGameState(prev => ({ ...prev, isCheater: true }));
  }, []);

  const handleTap = useCallback((clientX: number, clientY: number) => {
    // If user is a cheater, they earn nothing (or reduced?) - let's allow tapping but show badge
    
    // Haptic Feedback
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    setGameState(prev => {
      const energyCost = 1; 
      if (prev.energy < energyCost) return prev;
      return {
        ...prev,
        balance: prev.balance + prev.clickDamage,
        energy: prev.energy - energyCost
      };
    });

    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, x: clientX, y: clientY, text: `+${gameState.clickDamage}` }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
    }, 800);
  }, [gameState.clickDamage]);

  const handleBuyUpgrade = (id: string) => {
    const upgradeIndex = upgrades.findIndex(u => u.id === id);
    if (upgradeIndex === -1) return;

    const upgrade = upgrades[upgradeIndex];
    if (gameState.balance < upgrade.cost) return;

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }

    setGameState(prev => ({
        ...prev,
        balance: prev.balance - upgrade.cost,
        famePerHour: prev.famePerHour + upgrade.baseProfit
    }));

    const newUpgrades = [...upgrades];
    newUpgrades[upgradeIndex] = {
        ...upgrade,
        level: upgrade.level + 1,
        cost: Math.floor(upgrade.cost * 1.5),
        currentProfit: upgrade.currentProfit + upgrade.baseProfit
    };
    setUpgrades(newUpgrades);
  };

  const handleBuyBoost = (boost: Boost) => {
      if (boost.isDaily) {
          if (boost.type === 'energy') {
              setGameState(prev => ({ ...prev, energy: prev.maxEnergy }));
              if (window.Telegram?.WebApp?.HapticFeedback) {
                 window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
              }
          }
          return;
      }

      let currentLevel = 1;
      if (boost.type === 'multitap') currentLevel = gameState.multitapLevel;
      if (boost.type === 'limit') currentLevel = gameState.energyLimitLevel;
      if (boost.type === 'regen') currentLevel = gameState.energyRegenLevel;

      const cost = boost.baseCost * Math.pow(2, currentLevel - 1);

      if (gameState.balance < cost) return;

      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.selectionChanged();
      }

      setGameState(prev => {
          let updates: Partial<GameState> = {
              balance: prev.balance - cost
          };

          if (boost.type === 'multitap') {
              updates.multitapLevel = prev.multitapLevel + 1;
              updates.clickDamage = prev.clickDamage + 1;
          }
          if (boost.type === 'limit') {
              updates.energyLimitLevel = prev.energyLimitLevel + 1;
              updates.maxEnergy = prev.maxEnergy + 500;
          }
          if (boost.type === 'regen') {
              updates.energyRegenLevel = prev.energyRegenLevel + 1;
          }

          return { ...prev, ...updates };
      });
  };

  const handleConnectWallet = (address: string) => {
      setGameState(prev => ({ ...prev, walletAddress: address }));
      dbService.saveWallet(tgUserId, address);
  };

  const claimOfflineBonus = () => {
      setOfflineEarnings(null);
      if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
  };

  // --- Layout ---

  const TabButton = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: any }) => (
    <button 
        onClick={() => {
            setActiveTab(id);
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.selectionChanged();
            }
        }}
        className={`flex flex-col items-center justify-center w-full py-2 transition-all duration-200 relative
            ${activeTab === id ? 'text-yellow-400 -translate-y-1' : 'text-gray-500 hover:text-gray-300'}`}
    >
        <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 2} />
        <span className="text-[9px] font-medium mt-1 whitespace-nowrap">{label}</span>
        {activeTab === id && (
            <div className="absolute -bottom-2 w-1 h-1 bg-yellow-400 rounded-full shadow-[0_0_10px_orange]"></div>
        )}
    </button>
  );

  return (
    <div className="flex flex-col h-[100dvh] bg-neutral-900 text-white overflow-hidden relative font-sans">
      
      {/* Offline Bonus Modal */}
      {offlineEarnings !== null && offlineEarnings > 0 && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6 animate-fade-in">
              <div className="bg-gradient-to-b from-neutral-800 to-neutral-900 border border-yellow-600/30 w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
                   <div className="w-20 h-20 bg-yellow-500/20 rounded-full mx-auto flex items-center justify-center mb-4 text-4xl shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                       💤
                   </div>
                   <h2 className="text-2xl font-bold mb-2">Вы пока спали</h2>
                   <p className="text-gray-400 mb-6">Ваша академия заработала для вас</p>
                   <div className="text-4xl font-display font-bold text-yellow-400 mb-8 drop-shadow-md">
                       +{formatNumber(offlineEarnings)}
                   </div>
                   <button 
                    onClick={claimOfflineBonus}
                    className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-lg shadow-[0_5px_0_#b45309] active:translate-y-1 active:shadow-none transition-all"
                   >
                       Забрать
                   </button>
              </div>
          </div>
      )}

      {/* Referral Welcome Modal (Simulated) */}
      {referralBonus && (
           <div className="absolute top-4 inset-x-4 z-50 animate-bounce-in">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-xl shadow-lg border border-white/10 flex items-center gap-3">
                    <Users className="text-white" size={24} />
                    <div className="text-white text-sm">
                        <span className="font-bold">Welcome!</span> You were invited by a friend.
                    </div>
                    <button onClick={() => setReferralBonus(null)} className="ml-auto text-white/50 hover:text-white">✕</button>
                </div>
           </div>
      )}

      {/* Floating Text Overlay */}
      {floatingTexts.map(ft => (
          <div 
            key={ft.id} 
            className="float-text font-display drop-shadow-[0_2px_0_rgba(0,0,0,0.5)]"
            style={{ left: ft.x, top: ft.y }}
          >
            {ft.text}
          </div>
      ))}

      {/* Top HUD */}
      <div className="flex justify-between items-center px-4 py-3 bg-neutral-900/90 backdrop-blur border-b border-neutral-800 z-20 shrink-0">
        <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Прибыль в час</span>
            <div className="flex items-center gap-1 text-green-400 font-bold">
                <span className="text-[10px] opacity-70">FPH</span>
                <span>+{formatNumber(gameState.famePerHour)}</span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            {gameState.isCheater && (
                <div className="bg-red-900/50 px-2 py-1 rounded text-[10px] font-bold text-red-400 border border-red-800 animate-pulse">
                    ⚠️ Cheater
                </div>
            )}
            <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#3b82f6]"></div>
                <span className="text-xs font-bold tracking-wider text-gray-200">TON</span>
            </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[length:200px] bg-fixed">
        <div className="absolute inset-0 bg-neutral-900/95 pointer-events-none"></div>
        
        {activeTab === 'train' && (
            <ClickerArea state={gameState} onTap={handleTap} onCheatDetected={handleCheatDetected} />
        )}
        {activeTab === 'academy' && (
            <AcademyView balance={gameState.balance} upgrades={upgrades} onBuyUpgrade={handleBuyUpgrade} famePerHour={gameState.famePerHour} />
        )}
        {activeTab === 'coach' && (
            <CoachView gameState={gameState} />
        )}
        {activeTab === 'boost' && (
            <BoostView state={gameState} onBuyBoost={handleBuyBoost} />
        )}
        {activeTab === 'friends' && (
            <FriendsView referrals={gameState.referrals} />
        )}
        {activeTab === 'airdrop' && (
            <AirdropView state={gameState} onConnectWallet={handleConnectWallet} />
        )}
        {activeTab === 'leaderboard' && (
            <LeaderboardView currentUserState={gameState} />
        )}
        {activeTab === 'admin' && isAdmin && (
            <AdminView />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="h-20 pb-4 bg-neutral-900/95 backdrop-blur-xl border-t border-neutral-800 flex justify-between items-center px-1 z-30 shrink-0 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] overflow-x-auto">
         <TabButton id="train" label="Тап" icon={Pickaxe} />
         <TabButton id="academy" label="Академия" icon={Trophy} />
         <TabButton id="coach" label="Тренер" icon={Brain} />
         <TabButton id="boost" label="Бусты" icon={Rocket} />
         <TabButton id="friends" label="Друзья" icon={Users} />
         <TabButton id="leaderboard" label="Топ" icon={Crown} />
         <TabButton id="airdrop" label="Airdrop" icon={Wallet} />
         {isAdmin && <TabButton id="admin" label="Admin" icon={ShieldAlert} />}
      </div>

    </div>
  );
}

export default App;
