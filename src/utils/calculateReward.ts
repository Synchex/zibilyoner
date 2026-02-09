/**
 * Reward Calculation Utility
 * 
 * Calculates money rewards based on difficulty multipliers.
 * Symbol: ₿ (Bitcoin symbol for in-game currency)
 */

import { Difficulty } from '../screens/DifficultySelection';

// ============================================================================
// Difficulty Multipliers
// ============================================================================

export const DIFFICULTY_MULTIPLIERS: Record<Difficulty, number> = {
    easy: 1.0,
    medium: 1.5,
    hard: 2.0,
    mixed: 1.5, // Average for mixed difficulty
};

/**
 * Get the reward multiplier for a given difficulty
 */
export function getMultiplier(difficulty: Difficulty): number {
    return DIFFICULTY_MULTIPLIERS[difficulty];
}

/**
 * Format multiplier for display (e.g., "x1.5")
 */
export function formatMultiplier(difficulty: Difficulty): string {
    const mult = getMultiplier(difficulty);
    if (mult === 1) return 'x1';
    if (mult === 2) return 'x2';
    return `x${mult}`;
}

// ============================================================================
// Reward Calculation
// ============================================================================

export interface RewardResult {
    earned: number;
    multiplier: number;
    baseReward: number;
}

/**
 * Calculate reward for an answer
 * @param difficulty - Current game difficulty
 * @param baseReward - Base reward amount from prize ladder
 * @param isCorrect - Whether the answer was correct
 * @returns RewardResult with earned amount (0 if wrong)
 */
export function calculateReward(
    difficulty: Difficulty,
    baseReward: number,
    isCorrect: boolean
): RewardResult {
    const multiplier = getMultiplier(difficulty);
    const earned = isCorrect ? Math.round(baseReward * multiplier) : 0;

    return {
        earned,
        multiplier,
        baseReward,
    };
}

/**
 * Format balance for display with ₿ symbol
 */
export function formatBalance(amount: number): string {
    if (amount >= 1000000) {
        return `₿ ${(amount / 1000000).toFixed(1)}M`.replace('.0M', 'M');
    }
    if (amount >= 1000) {
        return `₿ ${(amount / 1000).toFixed(0)}K`;
    }
    return `₿ ${amount}`;
}

/**
 * Format reward earned for feedback display
 */
export function formatEarnedReward(amount: number): string {
    return `+₿ ${amount}`;
}
