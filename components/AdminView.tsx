import React, { useState } from 'react';
import { Send, Image, MessageCircle } from 'lucide-react';

const AdminView: React.FC = () => {
  const [message, setMessage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleBroadcast = () => {
      if (!message) return;
      
      setIsSending(true);
      // Simulate API call to backend bot
      setTimeout(() => {
          setIsSending(false);
          setStatus('Рассылка успешно отправлена всем пользователям!');
          setMessage('');
          setImageUrl('');
          setTimeout(() => setStatus(null), 3000);
      }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col p-4 w-full max-w-md mx-auto pt-6 overflow-y-auto pb-24 relative z-10">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-display font-bold text-red-500 mb-2">Admin Panel</h2>
        <p className="text-gray-400 text-xs">Управление ботом (Только для создателя)</p>
      </div>

      <div className="bg-neutral-800 p-6 rounded-2xl border border-red-900/50 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Send size={20} /> Создать рассылку
          </h3>

          <div className="space-y-4">
              <div>
                  <label className="text-xs text-gray-400 mb-1 block">Текст сообщения</label>
                  <textarea 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-neutral-900 rounded-lg p-3 text-white text-sm border border-neutral-700 focus:border-red-500 outline-none h-24"
                    placeholder="Введите новость для всех игроков..."
                  />
              </div>

              <div>
                  <label className="text-xs text-gray-400 mb-1 block">Ссылка на картинку (опционально)</label>
                  <div className="flex items-center gap-2 bg-neutral-900 rounded-lg p-3 border border-neutral-700">
                      <Image size={16} className="text-gray-500" />
                      <input 
                        type="text"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="bg-transparent w-full text-white text-sm outline-none"
                        placeholder="https://..."
                      />
                  </div>
              </div>

              {imageUrl && (
                  <div className="w-full h-32 rounded-lg bg-neutral-900 overflow-hidden relative">
                      <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-[10px] p-1 text-center">Preview</div>
                  </div>
              )}

              <button 
                onClick={handleBroadcast}
                disabled={isSending || !message}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-neutral-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                  {isSending ? 'Отправка...' : 'Отправить Всем'}
              </button>

              {status && (
                  <div className="text-green-400 text-sm text-center animate-fade-in font-bold">
                      {status}
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default AdminView;