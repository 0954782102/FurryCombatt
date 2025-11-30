import React from 'react';

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseProfit: number;
  level: number;
  icon: string;
  category: 'Tech' | 'Art' | 'Events' | 'Crypto';
}

export interface Skin {
  id: string;
  name: string;
  color: string;
  borderColor: string;
  icon: string; // Lucide icon name or image url
  cost: number;
  unlocked: boolean;
}

export interface UserState {
  username: string | null; // Added username
  balance: number;
  profitPerHour: number;
  energy: number;
  maxEnergy: number;
  level: number;
  tapPower: number;
  lastSync: number;
  unlockedSkins: string[];
  currentSkin: string;
}

export interface TabProps {
  userState: UserState;
  setUserState: React.Dispatch<React.SetStateAction<UserState>>;
  upgrades: Upgrade[];
  setUpgrades: React.Dispatch<React.SetStateAction<Upgrade[]>>;
}

export enum GameTab {
  EXCHANGE = 'exchange',
  MINE = 'mine',
  TOP = 'top',
  AIRDROP = 'airdrop',
}