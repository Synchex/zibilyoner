/**
 * useLevelProgress — AsyncStorage-backed level progression hook
 *
 * Tracks per-subcategory level progress:
 *   - currentUnlockedLevel
 *   - completedLevels[]
 *
 * Key format: level_progress_{language}_{category}_{subcategory}_{difficulty}
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const LEVELS_PER_SUBCATEGORY = 10;
export const QUESTIONS_PER_LEVEL = 10;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LevelProgress {
    currentUnlockedLevel: number; // 1-based
    completedLevels: number[];   // list of completed level numbers
}

interface LevelProgressKey {
    language: string;
    category: string;
    subcategory?: string;
    difficulty: string;
}

// ---------------------------------------------------------------------------
// Storage helpers (pure functions, exported for external use)
// ---------------------------------------------------------------------------

function buildStorageKey(k: LevelProgressKey): string {
    const sub = k.subcategory || 'none';
    return `level_progress_${k.language}_${k.category}_${sub}_${k.difficulty}`;
}

const DEFAULT_PROGRESS: LevelProgress = {
    currentUnlockedLevel: 1,
    completedLevels: [],
};

async function loadProgress(key: string): Promise<LevelProgress> {
    try {
        const raw = await AsyncStorage.getItem(key);
        if (raw) {
            return JSON.parse(raw) as LevelProgress;
        }
    } catch (e) {
        console.warn('[LevelProgress] Failed to load:', e);
    }
    return { ...DEFAULT_PROGRESS };
}

async function saveProgress(key: string, progress: LevelProgress): Promise<void> {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(progress));
    } catch (e) {
        console.warn('[LevelProgress] Failed to save:', e);
    }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useLevelProgress(keyParts: LevelProgressKey) {
    const storageKey = buildStorageKey(keyParts);
    const [progress, setProgress] = useState<LevelProgress>({ ...DEFAULT_PROGRESS });
    const [loaded, setLoaded] = useState(false);

    // Load on mount / key change
    useEffect(() => {
        let cancelled = false;
        setLoaded(false);
        loadProgress(storageKey).then((p) => {
            if (!cancelled) {
                setProgress(p);
                setLoaded(true);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [storageKey]);

    // ---- public API ----

    const isLevelUnlocked = useCallback(
        (level: number): boolean => {
            return level <= progress.currentUnlockedLevel;
        },
        [progress.currentUnlockedLevel],
    );

    const isLevelCompleted = useCallback(
        (level: number): boolean => {
            return progress.completedLevels.includes(level);
        },
        [progress.completedLevels],
    );

    const completeLevel = useCallback(
        async (level: number) => {
            const newCompleted = progress.completedLevels.includes(level)
                ? progress.completedLevels
                : [...progress.completedLevels, level];

            const newUnlocked = Math.max(
                progress.currentUnlockedLevel,
                level + 1, // unlock next
            );

            const updated: LevelProgress = {
                currentUnlockedLevel: Math.min(newUnlocked, LEVELS_PER_SUBCATEGORY + 1),
                completedLevels: newCompleted,
            };
            setProgress(updated);
            await saveProgress(storageKey, updated);
        },
        [progress, storageKey],
    );

    const resetProgress = useCallback(async () => {
        const fresh = { ...DEFAULT_PROGRESS };
        setProgress(fresh);
        await saveProgress(storageKey, fresh);
    }, [storageKey]);

    const getUnlockedLevels = useCallback((): number[] => {
        const levels: number[] = [];
        for (let i = 1; i <= Math.min(progress.currentUnlockedLevel, LEVELS_PER_SUBCATEGORY); i++) {
            levels.push(i);
        }
        return levels;
    }, [progress.currentUnlockedLevel]);

    return {
        progress,
        loaded,
        isLevelUnlocked,
        isLevelCompleted,
        completeLevel,
        resetProgress,
        getUnlockedLevels,
        LEVELS_PER_SUBCATEGORY,
        QUESTIONS_PER_LEVEL,
    };
}
