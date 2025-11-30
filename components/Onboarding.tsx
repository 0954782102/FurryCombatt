import React, { useState } from 'react';
import { Send, ShieldCheck, Sparkles, Globe } from 'lucide-react';

interface OnboardingProps {
  onComplete: (username: string) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length < 3) {
      setError('Имя должно быть длиннее 3 символов');
      return;
    }
    onComplete(input.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-blue-900/20 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="relative z-10 w-full max-w-xs text-center">
        <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.5)]">
          <Globe className="text-white w-12 h-12" />
        </div>

        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-wide">FurryCombat</h1>
        <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full mb-6"></div>
        
        <p className="text-gray-300 text-sm mb-8 leading-relaxed font-medium">
          Официальный релиз. <br/>
          Подключитесь к глобальной сети и начните зарабатывать токены прямо сейчас.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError('');
              }}
              placeholder="Ваш Никнейм"
              className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl px-4 py-4 text-center text-white font-bold placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
            />
            {error && <p className="text-red-500 text-xs mt-2 absolute -bottom-6 w-full font-bold">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={!input}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            <span>Регистрация</span>
            <Send size={18} />
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-green-500 uppercase font-bold tracking-wider">
          <ShieldCheck size={12} />
          База данных подключена
        </div>
      </div>
    </div>
  );
};

export default Onboarding;