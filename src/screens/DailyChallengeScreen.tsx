import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';
import { Question } from '../data/questionBank';
import { useBalance } from '../context/BalanceContext';
import {
    useDailyChallenge,
    DAILY_QUESTIONS_COUNT,
    COINS_PER_CORRECT,
    BONUS_COINS_ALL_CORRECT
} from '../hooks/useDailyChallenge';

interface DailyChallengeScreenProps {
    language: Language;
    onComplete: (correct: number, total: number, earned: number) => void;
    onGoHome: () => void;
}

export function DailyChallengeScreen({ language, onComplete, onGoHome }: DailyChallengeScreenProps) {
    const t = (key: any) => getTranslation(language, key);
    const { addBalance } = useBalance();
    const {
        isLoading,
        canPlayToday,
        todayResult,
        questions,
        generateTodayQuestions,
        saveDailyResult
    } = useDailyChallenge();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [totalEarned, setTotalEarned] = useState(0);
    const [gameComplete, setGameComplete] = useState(false);

    const isLockedRef = useRef(false);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const rewardAnim = useRef(new Animated.Value(0)).current;
    const rewardOpacity = useRef(new Animated.Value(0)).current;
    const [showRewardFeedback, setShowRewardFeedback] = useState(false);

    // Generate questions when component mounts
    useEffect(() => {
        if (canPlayToday) {
            generateTodayQuestions(language);
        }
    }, [canPlayToday, language]);

    const shakeWrongAnswer = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const showRewardAnimation = (earned: number) => {
        setShowRewardFeedback(true);
        rewardAnim.setValue(0);
        rewardOpacity.setValue(1);

        Animated.parallel([
            Animated.timing(rewardAnim, {
                toValue: -50,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(rewardOpacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start(() => setShowRewardFeedback(false));
    };

    const handleAnswer = async (index: number) => {
        if (isLockedRef.current || showResult) return;
        isLockedRef.current = true;

        setSelectedAnswer(index);
        const correct = index === questions[currentIndex].correctAnswer;
        setShowResult(true);

        if (correct) {
            const earned = COINS_PER_CORRECT;
            setCorrectCount(prev => prev + 1);
            setTotalEarned(prev => prev + earned);
            addBalance(earned);
            showRewardAnimation(earned);
        } else {
            shakeWrongAnswer();
        }

        // Move to next question or finish
        setTimeout(async () => {
            if (currentIndex + 1 >= DAILY_QUESTIONS_COUNT) {
                // Game complete - calculate final earnings
                const finalCorrect = correct ? correctCount + 1 : correctCount;
                const baseEarned = totalEarned + (correct ? COINS_PER_CORRECT : 0);

                // Add bonus if all correct
                let finalEarned = baseEarned;
                if (finalCorrect === DAILY_QUESTIONS_COUNT) {
                    finalEarned += BONUS_COINS_ALL_CORRECT;
                    addBalance(BONUS_COINS_ALL_CORRECT);
                }

                // Save result
                await saveDailyResult(finalCorrect, finalEarned);
                setGameComplete(true);
            } else {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setShowResult(false);
                isLockedRef.current = false;
                shakeAnim.setValue(0);
            }
        }, 600);
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

    // Loading state
    if (isLoading) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={[colors.bgDark, colors.bgDarker]} style={StyleSheet.absoluteFillObject} />
                <ActivityIndicator size="large" color={colors.gold} />
            </View>
        );
    }

    // Already played today
    if (!canPlayToday && todayResult) {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[colors.bgDark, colors.bgDarker, colors.bgDark]}
                    style={StyleSheet.absoluteFillObject}
                />

                <View style={styles.completedContainer}>
                    <View style={styles.completedIconContainer}>
                        <Ionicons name="checkmark-circle" size={80} color={colors.neonGreen} />
                    </View>

                    <Text style={styles.completedTitle}>
                        {language === 'tr' ? 'Bugün Tamamlandı!' : 'Completed Today!'}
                    </Text>
                    <Text style={styles.completedSubtitle}>
                        {language === 'tr'
                            ? 'Yarın tekrar gel yeni görev için.'
                            : 'Come back tomorrow for a new challenge.'}
                    </Text>

                    <View style={styles.resultStats}>
                        <View style={styles.statItem}>
                            <Ionicons name="checkmark-circle" size={24} color={colors.neonGreen} />
                            <Text style={styles.statValue}>{todayResult.correctCount}/{DAILY_QUESTIONS_COUNT}</Text>
                            <Text style={styles.statLabel}>{language === 'tr' ? 'Doğru' : 'Correct'}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statSymbol}>₿</Text>
                            <Text style={styles.statValue}>{todayResult.totalEarned}</Text>
                            <Text style={styles.statLabel}>{language === 'tr' ? 'Kazanılan' : 'Earned'}</Text>
                        </View>
                    </View>

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
                </View>
            </View>
        );
    }

    // Game complete - show results
    if (gameComplete) {
        const isPerfect = correctCount === DAILY_QUESTIONS_COUNT;

        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[colors.bgDark, colors.bgDarker, colors.bgDark]}
                    style={StyleSheet.absoluteFillObject}
                />

                <View style={styles.completedContainer}>
                    <View style={styles.completedIconContainer}>
                        <Ionicons
                            name={isPerfect ? "trophy" : "flag"}
                            size={80}
                            color={isPerfect ? colors.gold : colors.neonGreen}
                        />
                    </View>

                    <Text style={[styles.completedTitle, isPerfect && { color: colors.gold }]}>
                        {isPerfect
                            ? (language === 'tr' ? 'Mükemmel!' : 'Perfect!')
                            : (language === 'tr' ? 'Tamamlandı!' : 'Completed!')}
                    </Text>

                    {isPerfect && (
                        <Text style={styles.bonusText}>
                            +₿ {BONUS_COINS_ALL_CORRECT} {language === 'tr' ? 'Bonus!' : 'Bonus!'}
                        </Text>
                    )}

                    <View style={styles.resultStats}>
                        <View style={styles.statItem}>
                            <Ionicons name="checkmark-circle" size={24} color={colors.neonGreen} />
                            <Text style={styles.statValue}>{correctCount}/{DAILY_QUESTIONS_COUNT}</Text>
                            <Text style={styles.statLabel}>{language === 'tr' ? 'Doğru' : 'Correct'}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statSymbol}>₿</Text>
                            <Text style={styles.statValue}>
                                {totalEarned + (isPerfect ? BONUS_COINS_ALL_CORRECT : 0)}
                            </Text>
                            <Text style={styles.statLabel}>{language === 'tr' ? 'Kazanılan' : 'Earned'}</Text>
                        </View>
                    </View>

                    <Pressable
                        onPress={() => onComplete(correctCount, DAILY_QUESTIONS_COUNT, totalEarned)}
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
                </View>
            </View>
        );
    }

    // Still loading questions
    if (questions.length === 0) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={[colors.bgDark, colors.bgDarker]} style={StyleSheet.absoluteFillObject} />
                <ActivityIndicator size="large" color={colors.gold} />
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
                <View style={styles.progressBadge}>
                    <Text style={styles.progressText}>
                        {currentIndex + 1}/{DAILY_QUESTIONS_COUNT}
                    </Text>
                </View>

                <View style={styles.scoreBadge}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.neonGreen} />
                    <Text style={styles.scoreText}>{correctCount}</Text>
                </View>

                <View style={styles.earnedBadgeHeader}>
                    <Text style={styles.earnedSymbol}>₿</Text>
                    <Text style={styles.earnedValue}>{totalEarned}</Text>
                </View>
            </View>

            {/* Mode Label */}
            <View style={styles.modeLabel}>
                <Ionicons name="calendar" size={16} color={colors.gold} />
                <Text style={styles.modeLabelText}>
                    {language === 'tr' ? 'GÜNLÜK GÖREV' : 'DAILY CHALLENGE'}
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

            {/* Reward Animation */}
            {showRewardFeedback && (
                <Animated.View
                    style={[
                        styles.rewardFeedback,
                        {
                            transform: [{ translateY: rewardAnim }],
                            opacity: rewardOpacity,
                        }
                    ]}
                >
                    <Text style={styles.rewardFeedbackText}>+₿ {COINS_PER_CORRECT}</Text>
                </Animated.View>
            )}

            {/* Close Button */}
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
        justifyContent: 'flex-start',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
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
    earnedBadgeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
    },
    earnedSymbol: {
        color: colors.gold,
        fontSize: 16,
        fontWeight: '800',
    },
    earnedValue: {
        color: colors.gold,
        fontSize: 16,
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
    rewardFeedback: {
        position: 'absolute',
        top: '50%',
        alignSelf: 'center',
        backgroundColor: colors.neonGreen,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
    },
    rewardFeedbackText: {
        color: colors.bgDark,
        fontSize: 20,
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
    // Completed/Result Screen Styles
    completedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    completedIconContainer: {
        marginBottom: spacing.lg,
    },
    completedTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: colors.neonGreen,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    completedSubtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    bonusText: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.gold,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    resultStats: {
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
