/**
 * progressHelpers.ts — Pure helper functions for level progression calculations.
 *
 * These functions compute category/subcategory level totals and progress
 * from the question bank and stored progress data.
 */

import { getQuestions } from '../data/questionBank';
import type { Language } from '../data/translations';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const QUESTIONS_PER_LEVEL = 10;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SubcategoryProgress {
    completedLevels: number;
    unlockedLevel: number;
    lastPlayedAt?: number;
}

export interface ProgressState {
    [categoryId: string]: {
        [subcategoryId: string]: SubcategoryProgress;
    };
}

export const DEFAULT_SUBCATEGORY_PROGRESS: SubcategoryProgress = {
    completedLevels: 0,
    unlockedLevel: 1,
};

// ---------------------------------------------------------------------------
// Pure Calculation Functions
// ---------------------------------------------------------------------------

/** Total levels available from a question count. */
export function getSubcategoryTotalLevels(questionCount: number): number {
    return Math.floor(questionCount / QUESTIONS_PER_LEVEL);
}

/** Sum of completed levels across all subcategories in a category. */
export function getCategoryTotalLevel(
    progress: ProgressState,
    categoryId: string,
): number {
    const cat = progress[categoryId] || {};
    return Object.values(cat).reduce(
        (sum, sub) => sum + (sub?.completedLevels ?? 0),
        0,
    );
}

/** Category progress as a percentage (0–100). */
export function getCategoryProgressPercent(
    progress: ProgressState,
    categoryId: string,
    totalAvailableLevels: number,
): number {
    if (totalAvailableLevels <= 0) return 0;
    const completed = getCategoryTotalLevel(progress, categoryId);
    return Math.min(Math.round((completed / totalAvailableLevels) * 100), 100);
}

/** Progress for a specific subcategory. */
export function getSubcategoryProgressData(
    progress: ProgressState,
    categoryId: string,
    subcategoryId: string,
): SubcategoryProgress {
    return (
        progress[categoryId]?.[subcategoryId] ?? { ...DEFAULT_SUBCATEGORY_PROGRESS }
    );
}

// ---------------------------------------------------------------------------
// Subcategory Metadata — which subcategories belong to which category
// ---------------------------------------------------------------------------

export function getCategorySubcategoryIds(
    categoryId: string,
    language: Language,
): string[] {
    switch (categoryId) {
        case 'sports':
            return language === 'tr'
                ? [
                    'general_sports',
                    'general_football',
                    'turkish_football',
                    'basketball',
                    'turkish_sports',
                    'legends_records',
                ]
                : ['general_sports', 'general_football', 'basketball'];
        case 'history':
            return language === 'tr'
                ? [
                    'history_tr_turkish',
                    'history_tr_modern',
                    'history_tr_ancient_anatolia',
                    'history_tr_mixed',
                ]
                : [
                    'history_modern',
                    'history_legends_empires',
                    'history_ancient_early',
                    'history_all',
                ];
        case 'general':
            return ['general_default'];
        case 'all':
            return ['all_default'];
        default:
            return [];
    }
}

// ---------------------------------------------------------------------------
// Question Count Lookups
// ---------------------------------------------------------------------------

/** Question count for a specific subcategory (uses the question bank). */
export function getSubcategoryQuestionCount(
    categoryId: string,
    subcategoryId: string,
    language: Language,
): number {
    // Implicit single-subcategory categories
    if (subcategoryId === 'general_default') {
        return getQuestions({
            category: 'genel_kultur',
            language,
            shuffle: false,
        }).length;
    }
    if (subcategoryId === 'all_default') {
        return getQuestions({ language, shuffle: false }).length;
    }

    // Sports
    if (categoryId === 'sports') {
        return getQuestions({
            category: 'spor',
            subcategory: subcategoryId as any,
            language,
            shuffle: false,
        }).length;
    }

    // History
    if (categoryId === 'history') {
        if (language === 'tr') {
            return getQuestions({
                category: 'tarih',
                historySubcategoryTR: subcategoryId as any,
                language: 'tr',
                shuffle: false,
            }).length;
        }
        return getQuestions({
            category: 'tarih',
            historySubcategory: subcategoryId as any,
            language: 'en',
            shuffle: false,
        }).length;
    }

    return 0;
}

/** Total available levels for a category (sum across all subcategories). */
export function getCategoryTotalAvailableLevels(
    categoryId: string,
    language: Language,
): number {
    const subs = getCategorySubcategoryIds(categoryId, language);
    return subs.reduce((sum, subId) => {
        const qCount = getSubcategoryQuestionCount(categoryId, subId, language);
        return sum + getSubcategoryTotalLevels(qCount);
    }, 0);
}
