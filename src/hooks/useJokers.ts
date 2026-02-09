import { useState, useCallback, useMemo } from 'react';

export type JokerType = 'fiftyFifty' | 'extraTime' | 'aiHint';

export interface JokerState {
    fiftyFifty: { used: boolean };
    extraTime: { used: boolean };
    aiHint: { used: boolean };
}

interface Question {
    answers: string[];
    correctAnswer: number;
}

interface UseJokersReturn {
    jokerState: JokerState;
    useFiftyFifty: (question: Question) => number[];
    useExtraTime: () => void;
    useAiHint: (question: Question) => string;
    resetJokers: () => void;
    isJokerUsed: (type: JokerType) => boolean;
}

const initialJokerState: JokerState = {
    fiftyFifty: { used: false },
    extraTime: { used: false },
    aiHint: { used: false },
};

/**
 * Hook for managing joker state and logic in the trivia game.
 * Jokers can only be used once per round.
 */
export function useJokers(): UseJokersReturn {
    const [jokerState, setJokerState] = useState<JokerState>(initialJokerState);

    /**
     * Fifty-Fifty Joker: Returns indices of 2 wrong answers to hide.
     * Can only be used once per round.
     */
    const useFiftyFifty = useCallback((question: Question): number[] => {
        if (jokerState.fiftyFifty.used) {
            return [];
        }

        // Get all wrong answer indices
        const wrongIndices = question.answers
            .map((_, index) => index)
            .filter((index) => index !== question.correctAnswer);

        // Shuffle and pick 2 wrong answers to hide
        const shuffled = wrongIndices.sort(() => Math.random() - 0.5);
        const hiddenIndices = shuffled.slice(0, 2);

        setJokerState((prev) => ({
            ...prev,
            fiftyFifty: { used: true },
        }));

        return hiddenIndices;
    }, [jokerState.fiftyFifty.used]);

    /**
     * Extra Time Joker: Marks the joker as used.
     * The actual time addition is handled by the timer component.
     */
    const useExtraTime = useCallback(() => {
        if (jokerState.extraTime.used) {
            return;
        }

        setJokerState((prev) => ({
            ...prev,
            extraTime: { used: true },
        }));
    }, [jokerState.extraTime.used]);

    /**
     * AI Hint Joker: Returns a hint about the correct answer.
     * Can only be used once per round.
     */
    const useAiHint = useCallback((question: Question): string => {
        if (jokerState.aiHint.used) {
            return '';
        }

        const correctAnswer = question.answers[question.correctAnswer];
        const hint = generateHint(correctAnswer);

        setJokerState((prev) => ({
            ...prev,
            aiHint: { used: true },
        }));

        return hint;
    }, [jokerState.aiHint.used]);

    /**
     * Reset all jokers for a new round/game.
     */
    const resetJokers = useCallback(() => {
        setJokerState(initialJokerState);
    }, []);

    /**
     * Check if a specific joker has been used.
     */
    const isJokerUsed = useCallback((type: JokerType): boolean => {
        return jokerState[type].used;
    }, [jokerState]);

    return {
        jokerState,
        useFiftyFifty,
        useExtraTime,
        useAiHint,
        resetJokers,
        isJokerUsed,
    };
}

/**
 * Generate a hint based on the correct answer.
 * Uses various hint strategies to avoid giving away the answer directly.
 */
function generateHint(answer: string): string {
    const cleanAnswer = answer.trim();
    const length = cleanAnswer.length;

    // Strategy 1: First letter hint
    const firstLetter = cleanAnswer.charAt(0).toUpperCase();

    // Strategy 2: Word count for multi-word answers
    const words = cleanAnswer.split(/\s+/);
    const wordCount = words.length;

    // Strategy 3: Character count
    const charHint = `${length} characters`;

    // Build the hint
    if (wordCount > 1) {
        return `Starts with "${firstLetter}", ${wordCount} words, ${charHint}`;
    } else {
        return `Starts with "${firstLetter}", ${charHint}`;
    }
}
