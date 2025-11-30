
import React, { useState, useEffect } from 'react';
import { Users, Copy, Check, ExternalLink, RefreshCw, Star, Send } from 'lucide-react';
import { BOT_USERNAME } from '../constants';
import { formatNumber } from './Formatters';
import { Referral } from '../types';

interface FriendsViewProps {
  referrals: Referral[];
}

type Tab = 'invite' | 'earn';

const FriendsView: React.FC<FriendsViewProps> = ({ referrals }) => {
  const [activeTab, setActiveTab] = useState<Tab>('invite');
  const [copied, setCopied] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [userId, setUserId] = useState<string>('');

  // Earn Tasks State
  const [taskStatus, setTaskStatus] = useState<'idle' | 'checking' | 'completed'>('idle');

  useEffect(() => {
      // Get Real ID from Telegram or fallback
      const currentUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || '12345';
      setUserId(currentUserId);
      // NOTE: Using 'startapp' parameter for Mini Apps deep linking
      const link = `https://t.me/${BOT_USERNAME}?startapp=ref_${currentUserId}`;
      setInviteLink(link);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInviteFriend = () => {
      const link = `https://t.me/${BOT_USERNAME}?startapp=ref_${userId}`;
      const text = "🚀 Join me in FurryCombat! Train your fighter and earn $FURY tokens!";
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`;
      
      if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.openTelegramLink(shareUrl);
      } else {
          window.open(shareUrl, '_blank');
      }
  };

  const handleChannelTask = () => {
      // 1. Open Channel
      if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.openTelegramLink('https://t.me/Groznoy7');
      } else {
          window.open('https://t.me/Groznoy7', '_blank');
      }
      
      // 2. Start Checking Simulation
      setTaskStatus('checking');
      
      // 3. Simulate success after delay
      setTimeout(() => {
          setTaskStatus('completed');
          if (window.Telegram?.WebApp?.HapticFeedback) {
              window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
          }
      }, 5000);
  };

  return (
    <div className="flex-1 flex flex-col w-full max-w-md mx-auto pt-4 relative z-10 h-full overflow-hidden">
       {/* Toggle Tabs */}
       <div className="flex px-4 mb-4 gap-2">
           <button 
                onClick={() => setActiveTab('invite')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'invite' ? 'bg-neutral-800 text-white shadow-lg border border-neutral-700' : 'text-gray-500 hover:text-gray-300'}`}
           >
               Друзья
           </button>
           <button 
                onClick={() => setActiveTab('earn')}
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'earn' ? 'bg-neutral-800 text-white shadow-lg border border-neutral-700' : 'text-gray-500 hover:text-gray-300'}`}
           >
               Задания
           </button>
       </div>

       <div className="flex-1 overflow-y-auto px-4 pb-24">
           {activeTab === 'invite' ? (
               <div className="animate-fade-in">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-display font-bold text-white mb-2">Пригласи Друзей</h2>
                        <p className="text-gray-400 text-sm">Получайте бонусы вместе!</p>
                    </div>

                    {/* Banner */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-6 shadow-lg text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                            <h3 className="text-xl font-bold mb-1">Пригласи друга</h3>
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <span className="text-yellow-300 font-bold text-2xl">+5,000</span>
                                <span className="text-white text-sm opacity-90">монет</span>
                            </div>
                            
                            <button 
                                onClick={handleInviteFriend}
                                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold w-full shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                Пригласить друга
                            </button>
                    </div>

                    <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-400">Ваша ссылка</span>
                            </div>
                            <div className="bg-neutral-800 rounded-xl p-3 flex items-center justify-between border border-neutral-700">
                                <code className="text-xs text-blue-400 truncate flex-1 mr-2 select-all">{inviteLink}</code>
                                <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors">
                                    {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                                </button>
                            </div>
                    </div>

                    <div>
                            <h3 className="text-lg font-bold mb-4">Ваши друзья ({referrals.length})</h3>
                            {referrals.length === 0 ? (
                                <div className="text-center py-8 text-neutral-600 bg-neutral-800/30 rounded-xl border border-neutral-800/50">
                                    <Users size={48} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Вы еще никого не пригласили</p>
                                    <p className="text-xs mt-1 text-gray-500">Поделитесь ссылкой, чтобы начать!</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {referrals.map((ref) => (
                                        <div key={ref.id} className="bg-neutral-800 rounded-xl p-3 flex items-center justify-between animate-fade-in border border-neutral-700">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold text-gray-400">
                                                    {ref.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm">{ref.name}</span>
                                                    <span className="text-xs text-gray-500">{ref.league}</span>
                                                </div>
                                            </div>
                                            <span className="text-yellow-500 font-mono font-bold text-sm">+{formatNumber(ref.reward)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>
               </div>
           ) : (
               <div className="animate-fade-in">
                   <div className="text-center mb-6">
                        <h2 className="text-2xl font-display font-bold text-white mb-2">Задания</h2>
                        <p className="text-gray-400 text-sm">Выполняй и зарабатывай FURY</p>
                    </div>

                    <div className="space-y-3">
                        {/* Channel Task */}
                        <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700 relative overflow-hidden">
                             {taskStatus === 'completed' && (
                                 <div className="absolute inset-0 bg-green-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                                     <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
                                         <Check size={20} /> Выполнено (+5,000)
                                     </div>
                                 </div>
                             )}

                             <div className="flex justify-between items-start mb-3">
                                 <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                         <Send size={20} />
                                     </div>
                                     <div>
                                         <h4 className="font-bold text-white">Подпишись на канал</h4>
                                         <p className="text-xs text-gray-400">Официальный канал FurryCombat</p>
                                     </div>
                                 </div>
                                 <div className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-bold">
                                     +5,000
                                 </div>
                             </div>

                             <button 
                                onClick={handleChannelTask}
                                disabled={taskStatus !== 'idle'}
                                className={`
                                    w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all
                                    ${taskStatus === 'checking' ? 'bg-neutral-700 text-gray-300' : 'bg-blue-600 hover:bg-blue-500 text-white'}
                                `}
                             >
                                 {taskStatus === 'checking' ? (
                                     <>
                                         <RefreshCw size={16} className="animate-spin" />
                                         Проверка подписки...
                                     </>
                                 ) : (
                                     <>
                                         Подписаться
                                         <ExternalLink size={14} />
                                     </>
                                 )}
                             </button>
                        </div>
                    </div>
               </div>
           )}
       </div>
    </div>
  );
};

export default FriendsView;
