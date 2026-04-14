import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppData, PrayerType, UserProfile, PrayerCounts } from '../types';
import { DataService } from '../services/DataService';

interface StoreContextType {
  data: AppData;
  isLoading: boolean;
  reducePrayer: (type: PrayerType, amount: number) => void;
  undoPrayer: (type: PrayerType, amount: number) => void;
  updateDailyTarget: (target: number) => void;
  resetData: () => void;
  completeOnboarding: (profile: UserProfile, prayers: PrayerCounts) => void;
}

export const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialData = DataService.getOrInit();
    setData(initialData);
    setIsLoading(false);
  }, []);

  const reducePrayer = (type: PrayerType, amount: number) => {
    if (!data) return;

    try {
      setData((prev) => {
        if (!prev) return prev;
        
        const currentAmount = prev.prayers[type];
        const newAmount = Math.max(0, currentAmount - amount);
        const difference = currentAmount - newAmount;

        if (difference === 0) return prev;

        const newLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type,
          amount: difference,
        };

        const newData: AppData = {
          ...prev,
          prayers: {
            ...prev.prayers,
            [type]: newAmount,
          },
          stats: {
            ...prev.stats,
            totalCompleted: prev.stats.totalCompleted + difference,
          },
          history: [newLog, ...(prev.history || [])],
        };

        DataService.save(newData);
        return newData;
      });
    } catch (error) {
      console.error('reducePrayer failed:', error);
    }
  };

  const undoPrayer = (type: PrayerType, amount: number) => {
    if (!data) return;

    try {
      setData((prev) => {
        if (!prev) return prev;
        
        const currentAmount = prev.prayers[type];
        const newAmount = currentAmount + amount;

        const newLog = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          type,
          amount: -amount,
        };

        const newData: AppData = {
          ...prev,
          prayers: {
            ...prev.prayers,
            [type]: newAmount,
          },
          stats: {
            ...prev.stats,
            totalCompleted: Math.max(0, prev.stats.totalCompleted - amount),
          },
          history: [newLog, ...(prev.history || [])],
        };

        DataService.save(newData);
        return newData;
      });
    } catch (error) {
      console.error('undoPrayer failed:', error);
    }
  };

  const updateDailyTarget = (target: number) => {
    if (!data) return;
    setData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, user: { ...prev.user, dailyTarget: target } };
      DataService.save(newData);
      return newData;
    });
  };

  const resetData = () => {
    const newData = DataService.reset();
    setData(newData);
  };

  const completeOnboarding = (profile: UserProfile, prayers: PrayerCounts) => {
    if (!data) return;
    const newData: AppData = {
      ...data,
      user: profile,
      prayers: prayers,
      stats: {
        streak: 0,
        totalCompleted: 0,
        lastActiveDate: new Date().toISOString(),
      },
      history: [],
    };
    DataService.save(newData);
    setData(newData);
  };

  if (isLoading || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-[#fbfbe2] text-[#0d631b]">Yükleniyor...</div>;
  }

  return (
    <StoreContext.Provider value={{ data, isLoading, reducePrayer, undoPrayer, updateDailyTarget, resetData, completeOnboarding }}>
      {children}
    </StoreContext.Provider>
  );
};
