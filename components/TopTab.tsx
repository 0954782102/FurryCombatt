import React, { useState, useEffect } from 'react';
import { UserState } from '../types';
import { LEVEL_NAMES, GLOBAL_DB_USERS } from '../constants';
import { Crown, User, Loader2, ShieldCheck, Globe } from 'lucide-react';

interface TopTabProps {
  userState: UserState;
}

const TopTab: React.FC<TopTabProps> = ({ userState }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLeague, setActiveLeague] = useState(userState.level);

  useEffect(() => {
    // Immediate load, no fake delay
    setLoading(false);
    
    const currentUser = {
        id: 'me',
        name: userState.username || 'Unknown',
        balance: userState.balance,
        profitPerHour: userState.profitPerHour,
        isBot: false
    };

    // Filter users from the "Global DB" (which is now empty)
    let leagueUsers: any[] = [...GLOBAL_DB_USERS];

    // Add current user to the global list
    leagueUsers.push(currentUser);
    
    // Sort by balance (Descending)
    leagueUsers.sort((a, b) => b.balance - a.balance);
    
    setUsers(leagueUsers);
  }, [activeLeague, userState.balance, userState.username]);

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  return (
    <div className="flex flex-col w-full h-full pb-24 overflow-hidden bg-black">
        
        {/* Premium Header */}
        <div className="w-full pt-8 pb-6 px-6 bg-gradient-to-b from-[#1c1c1e] to-black text-center border-b border-white/5 relative">
             <div className="absolute top-4 right-4 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
                <span className="text-[10px] text-green-500 font-bold">LIVE</span>
             </div>
             <h1 className="text-3xl font-black italic uppercase tracking-wider mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Топ Игроков</h1>
             <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-mono bg-[#2c2c2e] px-3 py-1 rounded-full mx-auto w-fit">
                <Globe size={12} />
                <span>Global Leaderboard</span>
             </div>
        </div>

        {/* League Slider */}
        <div className="flex items-center justify-center py-6 bg-black relative">
            <button 
                onClick={() => setActiveLeague(Math.max(0, activeLeague - 1))}
                className="p-3 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                disabled={activeLeague === 0}
            >
                ←
            </button>
            <div className="w-56 text-center flex flex-col items-center">
                <div className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-1">Лига</div>
                <div className="text-xl font-black text-white uppercase tracking-tight">
                    {LEVEL_NAMES[activeLeague]}
                </div>
            </div>
            <button 
                onClick={() => setActiveLeague(Math.min(LEVEL_NAMES.length - 1, activeLeague + 1))}
                className="p-3 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                disabled={activeLeague === LEVEL_NAMES.length - 1}
            >
                →
            </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
            {loading ? (
                <div className="flex flex-col items-center justify-center h-48 gap-4 opacity-50">
                    <Loader2 className="animate-spin text-yellow-500" size={32} />
                    <span className="text-xs text-gray-500 font-mono">Загрузка данных сервера...</span>
                </div>
            ) : (
                <div className="flex flex-col gap-3 pb-8">
                    {users.map((user, index) => {
                        let rankStyle = "bg-[#1c1c1e] border-white/5 text-gray-400";
                        let rankIcon = null;

                        if (index === 0) {
                            rankStyle = "bg-gradient-to-r from-yellow-900/40 to-black border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]";
                            rankIcon = <Crown size={16} className="text-yellow-500" />;
                        } else if (index === 1) {
                            rankStyle = "bg-gradient-to-r from-gray-800/40 to-black border-gray-400/50";
                        } else if (index === 2) {
                            rankStyle = "bg-gradient-to-r from-orange-900/40 to-black border-orange-500/50";
                        }

                        const isMe = user.id === 'me';

                        return (
                            <div 
                                key={user.id} 
                                className={`flex items-center p-4 rounded-3xl border transition-all ${rankStyle} ${isMe ? 'border-blue-500 bg-blue-900/20 scale-[1.02] sticky top-0 z-10 shadow-xl' : ''}`}
                            >
                                <div className="w-8 text-center font-black text-sm flex justify-center">
                                    {rankIcon ? rankIcon : index + 1}
                                </div>
                                
                                <div className="w-10 h-10 rounded-full bg-[#2c2c2e] mx-4 overflow-hidden relative border border-white/10 shrink-0">
                                    {/* Realistic Avatars */}
                                    {user.isBot ? (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs font-bold text-gray-400">
                                            {user.name.charAt(0)}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-600">
                                            <span className="font-bold text-white text-lg">{user.name.charAt(0).toUpperCase()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold text-sm truncate ${isMe ? 'text-blue-400' : 'text-gray-200'} ${index < 3 ? 'text-white' : ''}`}>
                                            {user.name}
                                        </span>
                                        {isMe && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-bold">ВЫ</span>}
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                                        {formatNumber(user.profitPerHour)} / ч
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-0.5 pl-2">
                                    <span className="text-yellow-500 font-black text-sm tracking-tight">{formatNumber(user.balance)}</span>
                                    <span className="text-[9px] text-gray-600 font-bold uppercase">Coins</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    </div>
  );
};

export default TopTab;