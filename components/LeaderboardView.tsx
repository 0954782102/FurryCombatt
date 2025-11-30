import React, { useEffect, useState } from 'react';
import { GameState } from '../types';
import { dbService, LeaderboardEntry } from '../services/mockDb';
import { Trophy, Medal, Ban, User, Crown } from 'lucide-react';
import { formatNumber } from './Formatters';

interface LeaderboardViewProps {
  currentUserState: GameState;
}

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ currentUserState }) => {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
        setLoading(true);
        const data = await dbService.getLeaderboard(currentUserState);
        setLeaders(data);
        setLoading(false);
    };
    fetchLeaders();
  }, [currentUserState.balance, currentUserState.isCheater]); 

  const getRankIcon = (rank: number) => {
      if (rank === 1) return <Trophy className="text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" size={24} />;
      if (rank === 2) return <Medal className="text-gray-300" size={24} />;
      if (rank === 3) return <Medal className="text-orange-400" size={24} />;
      return <span className="font-bold text-gray-500 w-6 text-center">{rank}</span>;
  };

  return (
    <div className="flex-1 flex flex-col p-4 w-full max-w-md mx-auto pt-6 overflow-y-auto pb-24 relative z-10">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-neutral-800 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-yellow-500/30">
            <Crown className="text-yellow-500" size={32} />
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">Топ Бойцов</h2>
        <p className="text-gray-400 text-sm">Лучшие игроки академии</p>
      </div>

      <div className="bg-neutral-900/50 backdrop-blur rounded-2xl overflow-hidden border border-neutral-700 shadow-xl">
          <div className="p-4 bg-neutral-800/80 border-b border-neutral-700 text-[10px] font-bold text-gray-400 flex justify-between uppercase tracking-widest">
              <span>Игрок</span>
              <span>Баланс (FURY)</span>
          </div>
          
          {loading ? (
              <div className="p-8 text-center text-gray-500 animate-pulse">Загрузка рейтинга...</div>
          ) : (
              <div className="divide-y divide-neutral-800">
                  {leaders.map((entry) => {
                      const isMe = entry.name === currentUserState.characterName;
                      return (
                        <div 
                            key={entry.rank} 
                            className={`
                                flex items-center justify-between p-4 transition-colors
                                ${isMe ? 'bg-indigo-900/40 border-l-4 border-indigo-500' : 'hover:bg-neutral-800/50'}
                                ${entry.isCheater ? 'opacity-75 bg-red-900/10' : ''}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
                                <div className="flex flex-col">
                                    <span className={`font-bold text-sm flex items-center gap-2 ${entry.isCheater ? 'text-red-400 line-through' : 'text-white'}`}>
                                        {entry.name}
                                        {entry.isCheater && <Ban size={12} className="text-red-500" />}
                                    </span>
                                    {isMe && (
                                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wide flex items-center gap-1">
                                            <User size={10} /> Это вы
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="font-mono font-bold text-sm text-right">
                                {entry.isCheater ? (
                                    <span className="text-red-500 text-[10px] border border-red-500/50 px-1 rounded bg-red-900/20">BANNED</span>
                                ) : (
                                    <span className={rankColor(entry.rank)}>{formatNumber(entry.balance)}</span>
                                )}
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

const rankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400 drop-shadow-sm";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-orange-400";
    return "text-white";
};

export default LeaderboardView;