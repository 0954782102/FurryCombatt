import { Upgrade, Skin } from './types';

export const LEVEL_THRESHOLDS = [
  0, 5000, 25000, 100000, 1000000, 2000000, 10000000, 50000000, 100000000, 1000000000
];

export const LEVEL_NAMES = [
  "Хомяк",       // 0
  "Криптан",         // 5k
  "Трейдер",      // 25k
  "Инвестор",  // 100k
  "Кит",          // 1M
  "Маркет Мейкер",       // 2M
  "CEO Биржи",         // 10M
  "Крипто-Лорд",   // 50M
  "Владыка Сети",       // 100M
  "Сатоши"       // 1B
];

export const MAX_ENERGY_BASE = 2000;
export const ENERGY_REGEN_RATE = 4; // в секунду

export const SKINS: Skin[] = [
  { id: 'furcoin', name: 'FurCoin', color: 'from-blue-600 via-purple-600 to-pink-600', borderColor: 'rgba(147,51,234,0.4)', icon: 'paw', cost: 0, unlocked: true },
  { id: 'ton', name: 'TON', color: 'from-blue-400 via-blue-500 to-blue-700', borderColor: 'rgba(59,130,246,0.6)', icon: 'gem', cost: 100000, unlocked: false },
  { id: 'btc', name: 'Bitcoin', color: 'from-orange-400 via-orange-500 to-yellow-600', borderColor: 'rgba(249,115,22,0.6)', icon: 'bitcoin', cost: 500000, unlocked: false },
  { id: 'eth', name: 'Ethereum', color: 'from-slate-400 via-slate-500 to-slate-800', borderColor: 'rgba(148,163,184,0.6)', icon: 'triangle', cost: 1000000, unlocked: false },
  { id: 'not', name: 'Notcoin', color: 'from-white via-gray-200 to-black', borderColor: 'rgba(255,255,255,0.6)', icon: 'circle', cost: 5000000, unlocked: false },
  { id: 'bnb', name: 'BNB', color: 'from-yellow-300 via-yellow-500 to-yellow-600', borderColor: 'rgba(234,179,8,0.6)', icon: 'box', cost: 10000000, unlocked: false },
];

// Global DB is now empty as requested. Only real users (the current player) will be shown.
export const GLOBAL_DB_USERS: { id: string; name: string; balance: number; profitPerHour: number; isBot: boolean }[] = [];

export const INITIAL_UPGRADES: Upgrade[] = [
  // TECH
  { id: 'tablet', name: 'Майнинг Ферма', description: 'Базовая добыча.', baseCost: 150, baseProfit: 50, level: 0, icon: 'server', category: 'Tech' },
  { id: 'pc_upgrade', name: 'ASIC Майнер', description: 'Мощное оборудование.', baseCost: 1000, baseProfit: 150, level: 0, icon: 'cpu', category: 'Tech' },
  { id: 'ai_assistant', name: 'ИИ Трейдер', description: 'Торгует за тебя.', baseCost: 5000, baseProfit: 400, level: 0, icon: 'bot', category: 'Tech' },
  { id: 'server_rack', name: 'Дата-центр', description: 'Сервера в Исландии.', baseCost: 15000, baseProfit: 900, level: 0, icon: 'server', category: 'Tech' },
  { id: 'vr_headset', name: 'Квантовый ПК', description: 'Взлом хешей.', baseCost: 40000, baseProfit: 1500, level: 0, icon: 'monitor', category: 'Tech' },
  
  // ART (Renamed to Markets)
  { id: 'sketch_comm', name: 'P2P Арбитраж', description: 'Разница курсов.', baseCost: 200, baseProfit: 40, level: 0, icon: 'repeat', category: 'Art' },
  { id: 'full_art', name: 'Спотовая торговля', description: 'Купи дешевле.', baseCost: 800, baseProfit: 120, level: 0, icon: 'bar-chart', category: 'Art' },
  { id: 'ref_sheet', name: 'Фьючерсы x100', description: 'Высокий риск.', baseCost: 2500, baseProfit: 300, level: 0, icon: 'zap', category: 'Art' },
  { id: 'ych_auction', name: 'Листинг Токена', description: 'Выход на биржу.', baseCost: 8000, baseProfit: 800, level: 0, icon: 'bell', category: 'Art' },
  
  // EVENTS (Renamed to PR)
  { id: 'local_meet', name: 'Шилл в чатах', description: 'Спам ссылками.', baseCost: 500, baseProfit: 70, level: 0, icon: 'message-circle', category: 'Events' },
  { id: 'anti_cafe', name: 'Коллаб с инфлюенсером', description: 'Реклама в YouTube.', baseCost: 2000, baseProfit: 250, level: 0, icon: 'video', category: 'Events' },
  { id: 'furry_party', name: 'AMA Сессия', description: 'Ответы на вопросы.', baseCost: 10000, baseProfit: 850, level: 0, icon: 'mic', category: 'Events' },
  { id: 'dealer_booth', name: 'Реклама на Times Square', description: 'Мировая известность.', baseCost: 35000, baseProfit: 2000, level: 0, icon: 'globe', category: 'Events' },

  // CRYPTO
  { id: 'wallet_setup', name: 'Cold Wallet', description: 'Безопасность.', baseCost: 1000, baseProfit: 100, level: 0, icon: 'lock', category: 'Crypto' },
  { id: 'airdrop_hunt', name: 'Smart Contract', description: 'Аудит кода.', baseCost: 5000, baseProfit: 450, level: 0, icon: 'file-code', category: 'Crypto' },
  { id: 'staking', name: 'Стейкинг ETH', description: 'Пассивный доход.', baseCost: 25000, baseProfit: 1500, level: 0, icon: 'layers', category: 'Crypto' },
  { id: 'nft_collection', name: 'Собственный Блокчейн', description: 'Layer 1 решение.', baseCost: 80000, baseProfit: 4000, level: 0, icon: 'database', category: 'Crypto' },
  { id: 'exchange_ceo', name: 'Своя Криптобиржа', description: 'Убийца Binance.', baseCost: 25000000, baseProfit: 400000, level: 0, icon: 'briefcase', category: 'Crypto' }
];