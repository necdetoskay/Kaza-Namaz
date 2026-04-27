import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { AppData, PrayerType, UserProfile, PrayerCounts } from '../types';
import { DataService } from '../services/DataService';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const [data, setData] = useState<AppData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize DataService with Firebase user
  useEffect(() => {
    const init = async () => {
      try {
        const initialData = await DataService.initialize(user || undefined);
        setData(initialData);
      } catch (error) {
        console.error('Store initialization failed:', error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [user]);

  const reducePrayer = async (type: PrayerType, amount: number) => {
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

        // Async save with Firebase sync
        DataService.save(newData, user || undefined);
        return newData;
      });
    } catch (error) {
      console.error('reducePrayer failed:', error);
    }
  };

  const undoPrayer = async (type: PrayerType, amount: number) => {
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

        // Async save with Firebase sync
        DataService.save(newData, user || undefined);
        return newData;
      });
    } catch (error) {
      console.error('undoPrayer failed:', error);
    }
  };

  const updateDailyTarget = async (target: number) => {
    if (!data) return;
    
    setData((prev) => {
      if (!prev) return prev;
      const newData = { ...prev, user: { ...prev.user, dailyTarget: target } };
      DataService.save(newData, user || undefined);
      return newData;
    });
  };

  const resetData = async () => {
    await DataService.reset(user || undefined);
    setData(null);
  };

  const completeOnboarding = async (profile: UserProfile, prayers: PrayerCounts) => {
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
    
    await DataService.save(newData, user || undefined);
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
