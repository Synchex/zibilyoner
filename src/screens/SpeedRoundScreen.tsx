import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';
import { getQuestions, Question } from '../data/questionBank';
import { useBalance } from '../context/BalanceContext';
import { calculateReward } from '../utils/calculateReward';

const SPEED_ROUND_QUESTIONS = 10;
const TOTAL_TIME_SECONDS = 60;

type GameEndReason = 'completed' | 'eliminated' | 'timeout';

interface SpeedRoundScreenProps {
    language: Language;
    onComplete: (correct: number, total: number, earned: number) => void;
    onGoHome: () => void;
}

export function SpeedRoundScreen({ language, onComplete, onGoHome }: SpeedRoundScreenProps) {
    const t = (key: any) => getTranslation(language, key);
    const { addBalance } = useBalance();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [totalEarned, setTotalEarned] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [endReason, setEndReason] = useState<GameEndReason | null>(null);

    const isLockedRef = useRef(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const eliminatedFadeAnim = useRef(new Animated.Value(0)).current;

    // Load questions on mount
    useEffect(() => {
        const loadedQuestions = getQuestions({
            category: 'all',
            difficulty: 'all',
            limit: SPEED_ROUND_QUESTIONS,
            shuffle: true,
            language: language,
        });
        setQuestions(loadedQuestions);
    }, [language]);

    // Timer countdown
    useEffect(() => {
        if (gameOver || questions.length === 0) return;

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    setEndReason('timeout');
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameOver, questions.length]);

    // Handle game over (only for timeout/completed - not elimination which has its own UI)
    useEffect(() => {
        if (gameOver && endReason && endReason !== 'eliminated') {
            onComplete(correctCount, currentIndex, totalEarned);
        }
    }, [gameOver, endReason]);

    // Animate elimination screen
    useEffect(() => {
        if (endReason === 'eliminated') {
            Animated.timing(eliminatedFadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [endReason]);

    const shakeWrongAnswer = (callback: () => void) => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 15, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -15, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start(callback);
    };

    const handleAnswer = (index: number) => {
        if (isLockedRef.current || showResult || gameOver) return;
        isLockedRef.current = true;

        setSelectedAnswer(index);
        const correct = index === questions[currentIndex].correctAnswer;
        setShowResult(true);

        if (correct) {
            setCorrectCount(prev => prev + 1);
            // Speed round gives fixed 50 coins per correct answer with 2x multiplier
            const { earned } = calculateReward('hard', 50, true);
            setTotalEarned(prev => prev + earned);
            addBalance(earned);

            // Move to next question after brief delay
            setTimeout(() => {
                if (currentIndex + 1 >= SPEED_ROUND_QUESTIONS) {
                    setEndReason('completed');
                    setGameOver(true);
                } else {
                    setCurrentIndex(prev => prev + 1);
                    setSelectedAnswer(null);
                    setShowResult(false);
                    isLockedRef.current = false;
                    shakeAnim.setValue(0);
                }
            }, 400);
        } else {
            // WRONG ANSWER - ELIMINATE!
            // Stop timer immediately
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            // Shake animation then show elimination
            shakeWrongAnswer(() => {
                setEndReason('eliminated');
                setGameOver(true);
            });
        }
    };

    const getAnswerStyle = (index: number) => {
        if (!showResult) {
            return selectedAnswer === index ? styles.answerSelected : styles.answer;
        }
        if (index === questions[currentIndex]?.correctAnswer) {
            return styles.answerCorrect;
        }
        if (selectedAnswer === index) {
            return styles.answerWrong;
        }
        return styles.answer;
    };

    const getTimerColor = () => {
        if (timeLeft <= 10) return colors.wrong;
        if (timeLeft <= 20) return '#f59e0b';
        return colors.neonGreen;
    };

    // Loading state
    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={[colors.bgDark, colors.bgDarker]} style={StyleSheet.absoluteFillObject} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    // ELIMINATION SCREEN
    if (endReason === 'eliminated') {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[colors.bgDark, colors.bgDarker, colors.bgDark]}
                    style={StyleSheet.absoluteFillObject}
                />

                <Animated.View style={[styles.eliminatedContainer, { opacity: eliminatedFadeAnim }]}>
                    {/* Elimination Icon */}
                    <View style={styles.eliminatedIconContainer}>
                        <Ionicons name="close-circle" size={100} color={colors.wrong} />
                    </View>

                    {/* Elimination Message */}
                    <Text style={styles.eliminatedTitle}>
                        {language === 'tr' ? 'Kaybettin!' : 'Eliminated!'}
                    </Text>
                    <Text style={styles.eliminatedSubtitle}>
                        {language === 'tr' ? 'Bir dahaki sefere.' : 'Better luck next time.'}
                    </Text>

                    {/* Stats */}
                    <View style={styles.eliminatedStats}>
                        <View style={styles.statItem}>
                            <Ionicons name="checkmark-circle" size={24} color={colors.neonGreen} />
                            <Text style={styles.statValue}>{correctCount}</Text>
                            <Text style={styles.statLabel}>{language === 'tr' ? 'Doğru' : 'Correct'}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statSymbol}>₿</Text>
                            <Text style={styles.statValue}>{totalEarned}</Text>
                            <Text style={styles.statLabel}>{language === 'tr' ? 'Kazanılan' : 'Earned'}</Text>
                        </View>
                    </View>

                    {/* Home Button */}
                    <Pressable
                        onPress={onGoHome}
                        style={({ pressed }) => [
                            styles.homeButton,
                            pressed && styles.homeButtonPressed,
                        ]}
                    >
                        <LinearGradient
                            colors={['rgba(212, 175, 55, 0.25)', 'rgba(166, 124, 0, 0.15)']}
                            style={styles.homeButtonGradient}
                        >
                            <Ionicons name="home-outline" size={20} color={colors.textPrimary} />
                            <Text style={styles.homeButtonText}>
                                {language === 'tr' ? 'Ana Ekrana Dön' : 'Back to Home'}
                            </Text>
                        </LinearGradient>
                    </Pressable>
                </Animated.View>
            </View>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.bgDark, colors.bgDarker, colors.bgDark]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.timerBadge}>
                    <Ionicons name="timer-outline" size={20} color={getTimerColor()} />
                    <Text style={[styles.timerText, { color: getTimerColor() }]}>{timeLeft}s</Text>
                </View>

                <View style={styles.progressBadge}>
                    <Text style={styles.progressText}>
                        {currentIndex + 1}/{SPEED_ROUND_QUESTIONS}
                    </Text>
                </View>

                <View style={styles.scoreBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.neonGreen} />
                    <Text style={styles.scoreText}>{correctCount}</Text>
                </View>
            </View>

            {/* Mode Label */}
            <View style={styles.modeLabel}>
                <Ionicons name="flash" size={16} color={colors.gold} />
                <Text style={styles.modeLabelText}>
                    {language === 'tr' ? 'HIZLI OYUN' : 'SPEED ROUND'}
                </Text>
            </View>

            {/* Question Card */}
            <Animated.View style={[styles.questionCard, { transform: [{ translateX: shakeAnim }] }]}>
                <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </Animated.View>

            {/* Answers */}
            <View style={styles.answersContainer}>
                {currentQuestion.answers.map((answer, index) => (
                    <Pressable
                        key={index}
                        onPress={() => handleAnswer(index)}
                        disabled={showResult}
                        style={({ pressed }) => [
                            getAnswerStyle(index),
                            pressed && !showResult && styles.answerPressed,
                        ]}
                    >
                        <Text style={styles.answerLabel}>{String.fromCharCode(65 + index)}</Text>
                        <Text style={styles.answerText}>{answer}</Text>
                    </Pressable>
                ))}
            </View>

            {/* Earned Badge */}
            {totalEarned > 0 && (
                <View style={styles.earnedBadge}>
                    <Text style={styles.earnedText}>+₿ {totalEarned}</Text>
                </View>
            )}

            {/* Back Button */}
            <Pressable onPress={onGoHome} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgDark,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl + spacing.lg,
    },
    loadingText: {
        color: colors.textPrimary,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    timerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
    },
    timerText: {
        fontSize: 18,
        fontWeight: '800',
    },
    progressBadge: {
        backgroundColor: colors.card,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
    },
    progressText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
    },
    scoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
    },
    scoreText: {
        color: colors.neonGreen,
        fontSize: 18,
        fontWeight: '800',
    },
    modeLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        marginBottom: spacing.md,
    },
    modeLabelText: {
        color: colors.gold,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
    },
    questionCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    questionText: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '600',
        lineHeight: 26,
        textAlign: 'center',
    },
    answersContainer: {
        gap: spacing.sm,
    },
    answer: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    answerSelected: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.purple,
    },
    answerCorrect: {
        backgroundColor: 'rgba(0, 255, 136, 0.15)',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.neonGreen,
    },
    answerWrong: {
        backgroundColor: 'rgba(255, 23, 68, 0.15)',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.wrong,
    },
    answerPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.99 }],
    },
    answerLabel: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.1)',
        textAlign: 'center',
        lineHeight: 28,
        color: colors.textSecondary,
        fontWeight: '700',
        marginRight: spacing.md,
    },
    answerText: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 15,
        fontWeight: '500',
    },
    earnedBadge: {
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        backgroundColor: colors.neonGreen,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
    },
    earnedText: {
        color: colors.bgDark,
        fontSize: 16,
        fontWeight: '800',
    },
    closeButton: {
        position: 'absolute',
        top: spacing.xxl,
        right: spacing.lg,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Elimination Screen Styles
    eliminatedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    eliminatedIconContainer: {
        marginBottom: spacing.lg,
    },
    eliminatedTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: colors.wrong,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    eliminatedSubtitle: {
        fontSize: 18,
        fontWeight: '500',
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    eliminatedStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.xxl,
        gap: spacing.lg,
    },
    statItem: {
        alignItems: 'center',
        gap: spacing.xs,
    },
    statSymbol: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.gold,
    },
    statValue: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'uppercase',
    },
    statDivider: {
        width: 1,
        height: 50,
        backgroundColor: colors.border,
    },
    homeButton: {
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.6)',
        overflow: 'hidden',
    },
    homeButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    homeButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    homeButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
