import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Category = 'all' | 'general' | 'history' | 'sports';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'very-hard' | 'mixed';

export interface QuestionRecord {
    questionId: string;
    questionIndex: number;
    questionText: string;
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
}

export interface GameRun {
    runId: string;
    timestamp: number;
    category: Category;
    difficulty: Difficulty;
    questions: QuestionRecord[];
    totalQuestions: number;
    correctCount: number;
    status: 'completed' | 'lost' | 'abandoned' | 'withdrawn';
    prizeWon: number;
}

interface GameHistoryContextType {
    runs: GameRun[];
    currentRun: Partial<GameRun> | null;
    isLoading: boolean;
    startNewRun: (category: Category, difficulty: Difficulty, totalQuestions: number) => void;
    recordAnswer: (question: QuestionRecord) => void;
    finalizeRun: (status: 'completed' | 'lost' | 'abandoned' | 'withdrawn', prizeWon: number) => void;
    clearHistory: () => void;
}

const GameHistoryContext = createContext<GameHistoryContextType | undefined>(undefined);

const STORAGE_KEY = 'trivia_game_history';
const MAX_RUNS = 50;

export function GameHistoryProvider({ children }: { children: ReactNode }) {
    const [runs, setRuns] = useState<GameRun[]>([]);
    const [currentRun, setCurrentRun] = useState<Partial<GameRun> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const finalizedRunIdsRef = useRef<Set<string>>(new Set());

    // Load history from AsyncStorage on mount
    useEffect(() => {
        const initHistory = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed: GameRun[] = JSON.parse(stored);

                    // Clean up and deduplicate
                    const cleanedRuns = parsed.map(run => {
                        if (!run.questions || run.questions.length === 0) {
                            return run;
                        }

                        const questionMap = new Map<number, QuestionRecord>();
                        run.questions.forEach((q, idx) => {
                            const key = q.questionIndex ?? idx;
                            questionMap.set(key, { ...q, questionIndex: key });
                        });

                        const dedupedQuestions = Array.from(questionMap.values())
                            .sort((a, b) => a.questionIndex - b.questionIndex);

                        return {
                            ...run,
                            questions: dedupedQuestions,
                            correctCount: dedupedQuestions.filter(q => q.isCorrect).length,
                        };
                    });

                    const runMap = new Map<string, GameRun>();
                    cleanedRuns.forEach(run => {
                        if (!runMap.has(run.runId) || run.timestamp > (runMap.get(run.runId)?.timestamp || 0)) {
                            runMap.set(run.runId, run);
                        }
                    });

                    const finalRuns = Array.from(runMap.values())
                        .sort((a, b) => b.timestamp - a.timestamp)
                        .slice(0, MAX_RUNS);

                    setRuns(finalRuns);
                }
            } catch (error) {
                console.error('Failed to load game history:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initHistory();
    }, []);

    // Save history to AsyncStorage whenever it changes
    useEffect(() => {
        if (!isLoading) {
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(runs)).catch(error => {
                console.error('Failed to save game history:', error);
            });
        }
    }, [runs, isLoading]);

    const startNewRun = (category: Category, difficulty: Difficulty, totalQuestions: number) => {
        const newRun: Partial<GameRun> = {
            runId: `run_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            timestamp: Date.now(),
            category,
            difficulty,
            questions: [],
            totalQuestions,
            correctCount: 0,
            prizeWon: 0,
        };
        setCurrentRun(newRun);

        if (finalizedRunIdsRef.current.size > 10) {
            const arr = Array.from(finalizedRunIdsRef.current);
            finalizedRunIdsRef.current = new Set(arr.slice(-5));
        }
    };

    const recordAnswer = (question: QuestionRecord) => {
        if (!currentRun) return;

        setCurrentRun(prev => {
            if (!prev) return prev;

            const existingQuestions = prev.questions || [];
            const existingIndex = existingQuestions.findIndex(
                q => q.questionIndex === question.questionIndex
            );

            let updatedQuestions: QuestionRecord[];
            if (existingIndex >= 0) {
                updatedQuestions = [...existingQuestions];
                updatedQuestions[existingIndex] = question;
            } else {
                updatedQuestions = [...existingQuestions, question];
            }

            updatedQuestions.sort((a, b) => a.questionIndex - b.questionIndex);
            const correctCount = updatedQuestions.filter(q => q.isCorrect).length;

            return {
                ...prev,
                questions: updatedQuestions,
                correctCount,
            };
        });
    };

    const finalizeRun = (status: 'completed' | 'lost' | 'abandoned' | 'withdrawn', prizeWon: number) => {
        if (!currentRun || !currentRun.runId) return;

        const runId = currentRun.runId;

        if (finalizedRunIdsRef.current.has(runId)) {
            return;
        }
        finalizedRunIdsRef.current.add(runId);

        const completedRun: GameRun = {
            runId,
            timestamp: currentRun.timestamp || Date.now(),
            category: currentRun.category || 'all',
            difficulty: currentRun.difficulty || 'easy',
            questions: currentRun.questions || [],
            totalQuestions: currentRun.totalQuestions || 0,
            correctCount: currentRun.correctCount || 0,
            status,
            prizeWon,
        };

        setRuns(prev => {
            if (prev.some(r => r.runId === runId)) {
                return prev;
            }
            const updated = [completedRun, ...prev];
            return updated.slice(0, MAX_RUNS);
        });

        setCurrentRun(null);
    };

    const clearHistory = () => {
        setRuns([]);
        AsyncStorage.removeItem(STORAGE_KEY);
    };

    return (
        <GameHistoryContext.Provider
            value={{
                runs,
                currentRun,
                isLoading,
                startNewRun,
                recordAnswer,
                finalizeRun,
                clearHistory,
            }}
        >
            {children}
        </GameHistoryContext.Provider>
    );
}

export function useGameHistory() {
    const context = useContext(GameHistoryContext);
    if (!context) {
        throw new Error('useGameHistory must be used within GameHistoryProvider');
    }
    return context;
}
