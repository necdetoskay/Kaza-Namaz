export type PrayerType = 'sabah' | 'ogle' | 'ikindi' | 'aksam' | 'yatsi' | 'vitir';

export interface UserProfile {
  gender: 'male' | 'female' | null;
  birthDate: string | null;
  startDate: string | null;
  dailyTarget: number;
}

export interface PrayerCounts {
  sabah: number;
  ogle: number;
  ikindi: number;
  aksam: number;
  yatsi: number;
  vitir: number;
}

export interface AppStats {
  streak: number;
  totalCompleted: number;
  lastActiveDate: string | null;
}

export interface PrayerLog {
  id: string;
  timestamp: string;
  type: PrayerType;
  amount: number;
}

export interface AppData {
  user: UserProfile;
  prayers: PrayerCounts;
  stats: AppStats;
  history: PrayerLog[];
}
