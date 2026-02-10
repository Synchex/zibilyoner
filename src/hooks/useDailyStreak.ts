import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_STREAK = 'zibilyoner_daily_streak';
const STORAGE_KEY_STREAK_DATE = 'zibilyoner_daily_streak_date';

interface DailyStreakReturn {
    streak: number;
    isLoading: boolean;
    /** Call this when user successfully completes Daily Challenge */
    recordSuccess: () => Promise<void>;
}

/**
 * Get today's date as YYYY-MM-DD using local device time
 */
function getTodayKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Calculate the difference in calendar days between two YYYY-MM-DD strings.
 * Returns the number of days (b - a). Positive means b is after a.
 */
function daysDifference(a: string, b: string): number {
    const dateA = new Date(a + 'T00:00:00');
    const dateB = new Date(b + 'T00:00:00');
    const msPerDay = 86400000;
    return Math.round((dateB.getTime() - dateA.getTime()) / msPerDay);
}

/**
 * Hook to manage Daily Challenge streak.
 *
 * Rules:
 * - Streak +1 only on successful Daily Challenge completion.
 * - If more than 1 calendar day has passed since last success → reset to 0.
 * - Streak is persisted in AsyncStorage.
 */
export function useDailyStreak(): DailyStreakReturn {
    const [streak, setStreak] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Load streak on mount and validate it against current date
    useEffect(() => {
        loadStreak();
    }, []);

    const loadStreak = async () => {
        try {
            setIsLoading(true);
            const [storedStreak, storedDate] = await Promise.all([
                AsyncStorage.getItem(STORAGE_KEY_STREAK),
                AsyncStorage.getItem(STORAGE_KEY_STREAK_DATE),
            ]);

            if (storedStreak && storedDate) {
                const today = getTodayKey();
                const diff = daysDifference(storedDate, today);

                if (diff <= 1) {
                    // Same day or exactly next day → keep streak
                    setStreak(parseInt(storedStreak, 10) || 0);
                } else {
                    // More than 1 day passed → reset
                    setStreak(0);
                    await AsyncStorage.setItem(STORAGE_KEY_STREAK, '0');
                }
            } else {
                setStreak(0);
            }
        } catch (error) {
            console.error('Error loading daily streak:', error);
            setStreak(0);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Call when the user successfully completes today's Daily Challenge.
     * Increments streak only if not already recorded for today.
     */
    const recordSuccess = useCallback(async () => {
        try {
            const today = getTodayKey();
            const storedDate = await AsyncStorage.getItem(STORAGE_KEY_STREAK_DATE);
            const storedStreak = await AsyncStorage.getItem(STORAGE_KEY_STREAK);

            // Already recorded for today → no-op
            if (storedDate === today) return;

            let newStreak: number;

            if (storedDate) {
                const diff = daysDifference(storedDate, today);
                if (diff === 1) {
                    // Consecutive day → increment
                    newStreak = (parseInt(storedStreak || '0', 10)) + 1;
                } else {
                    // Gap → start fresh at 1
                    newStreak = 1;
                }
            } else {
                // First ever → 1
                newStreak = 1;
            }

            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEY_STREAK, String(newStreak)),
                AsyncStorage.setItem(STORAGE_KEY_STREAK_DATE, today),
            ]);

            setStreak(newStreak);
        } catch (error) {
            console.error('Error recording daily streak:', error);
        }
    }, []);

    return { streak, isLoading, recordSuccess };
}
