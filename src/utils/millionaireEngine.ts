/**
 * Millionaire Mode Engine
 * 
 * Provides difficulty progression and question selection for Kim Milyoner mode.
 * 
 * Difficulty Ramp:
 *   Questions 1–3  (index 0–2): kolay  (Easy)
 *   Questions 4–8  (index 3–7): orta   (Medium)
 *   Questions 9–12 (index 8–11): zor   (Hard)
 */

import { getQuestions, Question, Difficulty } from '../data/questionBank';
import type { Language } from '../data/translations';

// ============================================================================
// Constants
// ============================================================================

export const MILLIONAIRE_TOTAL_QUESTIONS = 12;

/** Safe-haven indices (0-based). Prize is guaranteed at these steps. */
export const SAFE_HAVENS = [2, 7]; // After Q3 and Q8

// ============================================================================
// Difficulty Progression
// ============================================================================

/**
 * Returns the question bank difficulty for a given step index (0-based).
 *   0–2  → 'kolay'
 *   3–7  → 'orta'
 *   8–11 → 'zor'
 */
export function getDifficultyForStep(stepIndex: number): Difficulty {
    if (stepIndex <= 2) return 'kolay';
    if (stepIndex <= 7) return 'orta';
    return 'zor';
}

/**
 * Returns the user-facing difficulty label for a given step.
 */
export function getDifficultyLabel(stepIndex: number, language: Language): string {
    const diff = getDifficultyForStep(stepIndex);
    const labels: Record<string, Record<Difficulty, string>> = {
        tr: { kolay: 'Kolay', orta: 'Orta', zor: 'Zor', mixed: 'Karışık' },
        en: { kolay: 'Easy', orta: 'Medium', zor: 'Hard', mixed: 'Mixed' },
    };
    return labels[language]?.[diff] ?? labels.en[diff];
}

/**
 * Returns a color for the difficulty tier (for UI badges).
 */
export function getDifficultyColor(stepIndex: number): string {
    const diff = getDifficultyForStep(stepIndex);
    switch (diff) {
        case 'kolay': return '#00ff88';  // green
        case 'orta': return '#ffaa00';  // amber
        case 'zor': return '#ff4444';  // red
        default: return '#ffffff';
    }
}

// ============================================================================
// Question Selection
// ============================================================================

/**
 * Picks a single question for a given difficulty, excluding already-used IDs.
 * Falls back to nearest difficulty if pool is exhausted.
 */
export function pickQuestionByDifficulty(
    difficulty: Difficulty,
    usedQuestionIds: Set<number>,
    language: Language,
): Question | null {
    // Attempt order: requested → nearest fallbacks
    const fallbackOrder = getFallbackOrder(difficulty);

    for (const diff of fallbackOrder) {
        const pool = getQuestions({
            difficulty: diff,
            language,
            shuffle: true,
        }).filter(q => !usedQuestionIds.has(q.id));

        if (pool.length > 0) {
            if (diff !== difficulty) {
                console.warn(
                    `[MillionaireEngine] Difficulty '${difficulty}' pool exhausted. ` +
                    `Falling back to '${diff}' (${pool.length} available).`
                );
            }
            return pool[0]; // Already shuffled
        }
    }

    console.error('[MillionaireEngine] No questions available for any difficulty!');
    return null;
}

/**
 * Pre-picks all 12 questions for a Millionaire run with proper difficulty ramp.
 * Guarantees no duplicates within the run.
 */
export function pickMillionaireQuestions(language: Language): Question[] {
    const questions: Question[] = [];
    const usedIds = new Set<number>();

    for (let i = 0; i < MILLIONAIRE_TOTAL_QUESTIONS; i++) {
        const difficulty = getDifficultyForStep(i);
        const question = pickQuestionByDifficulty(difficulty, usedIds, language);

        if (question) {
            questions.push(question);
            usedIds.add(question.id);
        } else {
            console.error(`[MillionaireEngine] Could not pick question for step ${i + 1}!`);
        }
    }

    return questions;
}

/**
 * Returns the guaranteed prize for when a player loses.
 * Safe havens are at Q3 (index 2) and Q8 (index 7).
 */
export function getSafeHavenPrize(currentStepIndex: number, prizeForStep: (idx: number) => number): number {
    // Find the highest safe haven the player has passed
    const passedHavens = SAFE_HAVENS.filter(h => currentStepIndex > h);
    if (passedHavens.length === 0) return 0;
    const lastHaven = Math.max(...passedHavens);
    return prizeForStep(lastHaven);
}

// ============================================================================
// Internal Helpers
// ============================================================================

function getFallbackOrder(difficulty: Difficulty): Difficulty[] {
    switch (difficulty) {
        case 'kolay': return ['kolay', 'orta', 'zor'];
        case 'orta': return ['orta', 'kolay', 'zor'];
        case 'zor': return ['zor', 'orta', 'kolay'];
        default: return ['orta', 'kolay', 'zor'];
    }
}
