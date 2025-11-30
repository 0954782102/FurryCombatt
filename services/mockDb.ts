
import { GameState, Upgrade } from '../types';
import { INITIAL_STATE, INITIAL_UPGRADES } from '../constants';

const DB_DELAY = 300; 
const DB_VERSION = 'v5'; 

export interface LeaderboardEntry {
    rank: number;
    name: string;
    balance: number;
    isCheater: boolean;
    photoUrl?: string; // Added photo simulation
}

// Random Realistic Names Generator
const REAL_NAMES = [
    'Алексей_Crypto', 'Dimon_Ton', 'Satoshi_Nakamoto', 'Ольга_Trade', 'Иван_Pro', 
    'CryptoWolf', 'Ton_Holder_777', 'Masha_Gem', 'Vlad_Bitcoin', 'Sergey_Dev',
    'Anna_Moon', 'Durovs_Fan', 'Notcoin_Killer', 'Hamster_Boss', 'Furry_King'
];

export const dbService = {
  getUserData: async (userId: string = 'default'): Promise<{ state: GameState; upgrades: Upgrade[] }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const key = `furryCombat_${userId}_${DB_VERSION}`;
        const savedState = localStorage.getItem(`${key}_state`);
        const savedUpgrades = localStorage.getItem(`${key}_upgrades`);

        let state = savedState ? JSON.parse(savedState) : INITIAL_STATE;
        const upgrades = savedUpgrades ? JSON.parse(savedUpgrades) : INITIAL_UPGRADES;

        if (state.isCheater === undefined) state.isCheater = false;
        if (typeof state.referrals === 'number') state.referrals = [];

        resolve({ state, upgrades });
      }, DB_DELAY);
    });
  },

  saveProgress: async (userId: string = 'default', state: GameState, upgrades: Upgrade[]): Promise<boolean> => {
    return new Promise((resolve) => {
      const key = `furryCombat_${userId}_${DB_VERSION}`;
      localStorage.setItem(`${key}_state`, JSON.stringify(state));
      localStorage.setItem(`${key}_upgrades`, JSON.stringify(upgrades));
      resolve(true);
    });
  },

  saveWallet: async (userId: string = 'default', address: string): Promise<boolean> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              console.log(`Wallet saved for ${userId}:`, address);
              const key = `furryCombat_${userId}_${DB_VERSION}`;
              const savedState = localStorage.getItem(`${key}_state`);
              if (savedState) {
                  const state = JSON.parse(savedState);
                  state.walletAddress = address;
                  localStorage.setItem(`${key}_state`, JSON.stringify(state));
              }
              resolve(true);
          }, DB_DELAY);
      });
  },

  processReferral: async (referrerId: string, newUserId: string, newUserName: string): Promise<void> => {
    return new Promise((resolve) => {
       setTimeout(() => {
           console.log(`Referral processed: User ${newUserId} joined via ${referrerId}`);
           resolve();
       }, 200);
    });
  },

  // "Real" Leaderboard Generator
  getLeaderboard: async (currentUserState: GameState): Promise<LeaderboardEntry[]> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              // Generate fake "real" users
              const randomUsers: LeaderboardEntry[] = REAL_NAMES.map((name, index) => {
                  // Generate a score close to the user's score or wildly higher for top ranks
                  const randomBalance = index < 3 
                    ? 100000000 + Math.random() * 50000000 
                    : Math.max(1000, currentUserState.balance * (Math.random() * 2 + 0.5));
                  
                  return {
                      rank: 0,
                      name: name,
                      balance: Math.floor(randomBalance),
                      isCheater: false
                  };
              });

              // Add current user
              const userEntry: LeaderboardEntry = {
                  rank: 0,
                  name: currentUserState.characterName || 'Вы (Unknown)',
                  balance: currentUserState.balance,
                  isCheater: currentUserState.isCheater
              };

              // Combine and sort
              const all = [...randomUsers, userEntry].sort((a, b) => b.balance - a.balance);
              
              // Assign ranks
              all.forEach((u, i) => u.rank = i + 1);

              // Limit to top 50
              resolve(all.slice(0, 50)); 
          }, DB_DELAY);
      });
  }
};
