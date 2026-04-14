import { z } from 'zod';
import type { AppData, PrayerType, UserProfile, PrayerCounts, AppStats, PrayerLog } from './types';

export const PrayerTypeSchema = z.enum(['sabah', 'ogle', 'ikindi', 'aksam', 'yatsi', 'vitir']);

export const UserProfileSchema = z.object({
  gender: z.enum(['male', 'female']).nullable(),
  birthDate: z.string().nullable(),
  startDate: z.string().nullable(),
  dailyTarget: z.number().int().positive(),
});

export const PrayerCountsSchema = z.object({
  sabah: z.number().int().nonnegative(),
  ogle: z.number().int().nonnegative(),
  ikindi: z.number().int().nonnegative(),
  aksam: z.number().int().nonnegative(),
  yatsi: z.number().int().nonnegative(),
  vitir: z.number().int().nonnegative(),
});

export const AppStatsSchema = z.object({
  streak: z.number().int().nonnegative(),
  totalCompleted: z.number().int().nonnegative(),
  lastActiveDate: z.string().nullable(),
});

export const PrayerLogSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  type: PrayerTypeSchema,
  amount: z.number().int(),
});

export const AppDataSchema = z.object({
  user: UserProfileSchema,
  prayers: PrayerCountsSchema,
  stats: AppStatsSchema,
  history: z.array(PrayerLogSchema),
});

export type { PrayerType, UserProfile, PrayerCounts, AppStats, PrayerLog, AppData };

export type ValidatedAppData = z.infer<typeof AppDataSchema>;

export function validateAppData(data: unknown): AppData | null {
  try {
    const result = AppDataSchema.parse(data);
    return result as AppData;
  } catch (error) {
    console.error('Data validation failed:', error);
    return null;
  }
}
