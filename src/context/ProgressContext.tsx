/**
 * ProgressContext — Centralised level-progression state.
 *
 * Stored in AsyncStorage under key "zibilyoner_progress_v1".
 * Shape:
 *   { [categoryId]: { [subcategoryId]: { completedLevels, unlockedLevel, lastPlayedAt? } } }
 */

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    ProgressState,
    SubcategoryProgress,
    DEFAULT_SUBCATEGORY_PROGRESS,
    getSubcategoryProgressData,
} from '../utils/progressHelpers';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'zibilyoner_progress_v1';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface ProgressContextValue {
    progress: ProgressState;
    loaded: boolean;
    getSubcategoryProgress: (
        categoryId: string,
        subcategoryId: string,
    ) => SubcategoryProgress;
    completeLevel: (
        categoryId: string,
        subcategoryId: string,
        level: number,
    ) => Promise<void>;
    resetProgress: (
        categoryId?: string,
        subcategoryId?: string,
    ) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextValue>({
    progress: {},
    loaded: false,
    getSubcategoryProgress: () => ({ ...DEFAULT_SUBCATEGORY_PROGRESS }),
    completeLevel: async () => { },
    resetProgress: async () => { },
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ProgressProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [progress, setProgress] = useState<ProgressState>({});
    const [loaded, setLoaded] = useState(false);

    // Load from AsyncStorage on mount
    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(STORAGE_KEY);
                if (raw) setProgress(JSON.parse(raw));
            } catch (e) {
                console.warn('[Progress] load failed:', e);
            }
            setLoaded(true);
        })();
    }, []);

    // Persist helper
    const persist = useCallback(async (data: ProgressState) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('[Progress] save failed:', e);
        }
    }, []);

    // ---- public API ----

    const getSubProgress = useCallback(
        (categoryId: string, subcategoryId: string): SubcategoryProgress =>
            getSubcategoryProgressData(progress, categoryId, subcategoryId),
        [progress],
    );

    const completeLevelFn = useCallback(
        async (categoryId: string, subcategoryId: string, level: number) => {
            setProgress((prev) => {
                const catData = prev[categoryId] || {};
                const subData =
                    catData[subcategoryId] ?? { ...DEFAULT_SUBCATEGORY_PROGRESS };

                const newCompleted = Math.max(subData.completedLevels, level);
                const updated: ProgressState = {
                    ...prev,
                    [categoryId]: {
                        ...catData,
                        [subcategoryId]: {
                            completedLevels: newCompleted,
                            unlockedLevel: newCompleted + 1,
                            lastPlayedAt: Date.now(),
                        },
                    },
                };
                persist(updated);
                return updated;
            });
        },
        [persist],
    );

    const resetProgressFn = useCallback(
        async (categoryId?: string, subcategoryId?: string) => {
            setProgress((prev) => {
                let updated: ProgressState;
                if (!categoryId) {
                    updated = {};
                } else if (!subcategoryId) {
                    const { [categoryId]: _, ...rest } = prev;
                    updated = rest;
                } else {
                    const catData = { ...(prev[categoryId] || {}) };
                    delete catData[subcategoryId];
                    updated = { ...prev, [categoryId]: catData };
                }
                persist(updated);
                return updated;
            });
        },
        [persist],
    );

    return (
        <ProgressContext.Provider
            value={{
                progress,
                loaded,
                getSubcategoryProgress: getSubProgress,
                completeLevel: completeLevelFn,
                resetProgress: resetProgressFn,
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useProgress() {
    return useContext(ProgressContext);
}
