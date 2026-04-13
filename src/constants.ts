import { AppData } from './types';

export const INITIAL_DATA: AppData = {
  user: {
    gender: null,
    birthDate: null,
    startDate: null,
    dailyTarget: 5,
  },
  prayers: {
    sabah: 720,
    ogle: 840,
    ikindi: 840,
    aksam: 820,
    yatsi: 850,
    vitir: 450,
  },
  stats: {
    streak: 12,
    totalCompleted: 842,
    lastActiveDate: new Date().toISOString(),
  },
  history: [],
};

export const PRAYER_NAMES: Record<keyof AppData['prayers'], string> = {
  sabah: 'Sabah',
  ogle: 'Öğle',
  ikindi: 'İkindi',
  aksam: 'Akşam',
  yatsi: 'Yatsı',
  vitir: 'Vitir',
};
