import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getQuestions, Question } from '../data/questionBank';
import { Language } from '../data/translations';

const STORAGE_KEY_DAILY_DATE = 'zibilyoner_daily_date';
const STORAGE_KEY_DAILY_RESULT = 'zibilyoner_daily_result';
const DAILY_QUESTIONS_COUNT = 10;
const BONUS_COINS_ALL_CORRECT = 500;
const COINS_PER_CORRECT = 100;

interface DailyResult {
    date: string;
    correctCount: number;
    totalEarned: number;
    completed: boolean;
}

interface UseDailyChallengeReturn {
    isLoading: boolean;
    canPlayToday: boolean;
    todayResult: DailyResult | null;
    questions: Question[];
    generateTodayQuestions: (language: Language) => void;
    saveDailyResult: (correctCount: number, totalEarned: number) => Promise<void>;
    getTodayDateKey: () => string;
}

/**
 * Get today's date as a string key (YYYY-MM-DD)
 */
function getTodayDateKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/**
 * Generate a seed number from a date string for deterministic randomization
 */
function dateToSeed(dateKey: string): number {
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
        const char = dateKey.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Deterministic shuffle using a seed (same seed = same order)
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
    const result = [...array];
    let currentSeed = seed;

    const random = () => {
        currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
        return currentSeed / 0x7fffffff;
    };

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

export function useDailyChallenge(): UseDailyChallengeReturn {
    const [isLoading, setIsLoading] = useState(true);
    const [canPlayToday, setCanPlayToday] = useState(false);
    const [todayResult, setTodayResult] = useState<DailyResult | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);

    // Check if user has already played today
    useEffect(() => {
        checkTodayStatus();
    }, []);

    const checkTodayStatus = async () => {
        try {
            setIsLoading(true);
            const todayKey = getTodayDateKey();
            const lastPlayedDate = await AsyncStorage.getItem(STORAGE_KEY_DAILY_DATE);
            const resultJson = await AsyncStorage.getItem(STORAGE_KEY_DAILY_RESULT);

            if (lastPlayedDate === todayKey && resultJson) {
                // Already played today
                const result: DailyResult = JSON.parse(resultJson);
                setTodayResult(result);
                setCanPlayToday(false);
            } else {
                // Can play today
                setCanPlayToday(true);
                setTodayResult(null);
            }
        } catch (error) {
            console.error('Error checking daily status:', error);
            setCanPlayToday(true);
        } finally {
            setIsLoading(false);
        }
    };

    const generateTodayQuestions = useCallback((language: Language) => {
        const todayKey = getTodayDateKey();
        const seed = dateToSeed(todayKey);

        // Get all questions for the language
        const allQuestions = getQuestions({
            category: 'all',
            difficulty: 'all',
            language: language,
            shuffle: false, // We'll shuffle deterministically
        });

        // Deterministically shuffle and take first N
        const shuffled = seededShuffle(allQuestions, seed);
        const dailyQuestions = shuffled.slice(0, DAILY_QUESTIONS_COUNT);

        setQuestions(dailyQuestions);
    }, []);

    const saveDailyResult = async (correctCount: number, totalEarned: number): Promise<void> => {
        try {
            const todayKey = getTodayDateKey();

            // Add bonus if all correct
            let finalEarned = totalEarned;
            if (correctCount === DAILY_QUESTIONS_COUNT) {
                finalEarned += BONUS_COINS_ALL_CORRECT;
            }

            const result: DailyResult = {
                date: todayKey,
                correctCount,
                totalEarned: finalEarned,
                completed: true,
            };

            await AsyncStorage.setItem(STORAGE_KEY_DAILY_DATE, todayKey);
            await AsyncStorage.setItem(STORAGE_KEY_DAILY_RESULT, JSON.stringify(result));

            setTodayResult(result);
            setCanPlayToday(false);
        } catch (error) {
            console.error('Error saving daily result:', error);
        }
    };

    return {
        isLoading,
        canPlayToday,
        todayResult,
        questions,
        generateTodayQuestions,
        saveDailyResult,
        getTodayDateKey,
    };
}

// Export constants for use in screens
export { DAILY_QUESTIONS_COUNT, COINS_PER_CORRECT, BONUS_COINS_ALL_CORRECT };
