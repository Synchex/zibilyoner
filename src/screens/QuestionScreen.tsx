import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';
import { getCurrentPrize, formatPrizeFull, formatPrize } from '../data/prizeLadder';
import { ProgressBar } from '../components/ProgressBar';
import { CircularTimer } from '../components/CircularTimer';
import { PrizeLadder } from '../components/PrizeLadder';
import { JokerBar } from '../components/JokerBar';
import { JokerState } from '../hooks/useJokers';
import { Difficulty } from './DifficultySelection';
import { useBalance } from '../context/BalanceContext';
import { calculateReward, formatEarnedReward, formatBalance } from '../utils/calculateReward';

interface Question {
    id: number;
    question: string;
    answers: string[];
    correctAnswer: number;
    category?: string;
    difficulty?: string;
}

export interface WrongAnswerSnapshot {
    questionId: number;
    questionText: string;
    answers: string[];
    correctAnswerIndex: number;
    correctAnswer: string;
    userAnswer: string;
    userAnswerIndex: number | null;
    timeUp: boolean;
    explanation?: string;
    category: string;
    difficulty: string;
    timestamp: number;
}

interface QuestionScreenProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    coins: number;
    streak: number;
    difficulty: Difficulty;
    onAnswer: (isCorrect: boolean, snapshot?: WrongAnswerSnapshot) => void;
    onNextQuestion: () => void;
    onContinueRequest: () => void;
    onWithdraw: (cashOutAmount: number) => void;
    continueUsed: boolean;
    language: Language;
    // Joker props
    jokerState: JokerState;
    onUseFiftyFifty: (question: Question) => number[];
    onUseExtraTime: () => void;
    onUseAiHint: (question: Question) => string;
}

function getTimerDuration(questionNumber: number): number {
    if (questionNumber <= 4) return 30;
    if (questionNumber <= 9) return 45;
    return 60;
}

export function QuestionScreen({
    question,
    questionNumber,
    totalQuestions,
    coins,
    streak,
    difficulty,
    onAnswer,
    onNextQuestion,
    onContinueRequest,
    onWithdraw,
    continueUsed,
    language,
    jokerState,
    onUseFiftyFifty,
    onUseExtraTime,
    onUseAiHint,
}: QuestionScreenProps) {
    const t = (key: any, params?: any) => getTranslation(language, key, params);
    const { balance, addBalance } = useBalance();

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [timeUp, setTimeUp] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [hiddenAnswers, setHiddenAnswers] = useState<number[]>([]);
    const [hintText, setHintText] = useState<string | null>(null);
    const [earnedReward, setEarnedReward] = useState<number | null>(null);
    const isLockedRef = useRef(false);
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const addTimeRef = useRef<((seconds: number) => void) | null>(null);
    const rewardAnim = useRef(new Animated.Value(0)).current;
    const rewardOpacity = useRef(new Animated.Value(0)).current;

    const currentPrize = getCurrentPrize(questionNumber - 1);
    const cashOutAmount = questionNumber > 1 ? getCurrentPrize(questionNumber - 2) : 0;

    useEffect(() => {
        setSelectedAnswer(null);
        setShowResult(false);
        setIsCorrect(false);
        setTimeUp(false);
        setShowWithdrawModal(false);
        setHiddenAnswers([]);
        setHintText(null);
        setEarnedReward(null);
        isLockedRef.current = false;
        rewardAnim.setValue(0);
        rewardOpacity.setValue(0);
    }, [question.id, questionNumber]);

    const shakeWrongAnswer = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    };

    const handleWithdrawClick = () => {
        if (isLockedRef.current || showResult) return;
        setShowWithdrawModal(true);
    };

    const handleWithdrawConfirm = () => {
        isLockedRef.current = true;
        setShowWithdrawModal(false);
        onWithdraw(cashOutAmount);
    };

    const handleAnswerClick = (index: number) => {
        if (isLockedRef.current) return;
        isLockedRef.current = true;

        setSelectedAnswer(index);
        const correct = index === question.correctAnswer;
        setIsCorrect(correct);
        setShowResult(true);

        if (correct) {
            // Calculate reward with difficulty multiplier
            const basePrize = getCurrentPrize(questionNumber - 1);
            const { earned } = calculateReward(difficulty, basePrize, true);
            setEarnedReward(earned);
            addBalance(earned);

            // Animate reward feedback
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(rewardOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
                    Animated.delay(800),
                    Animated.timing(rewardOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
                ]),
                Animated.sequence([
                    Animated.spring(rewardAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
                    Animated.delay(800),
                    Animated.timing(rewardAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
                ]),
            ]).start();

            onAnswer(true);
            setTimeout(() => {
                onNextQuestion();
            }, 2000);
        } else {
            shakeWrongAnswer();
            const snapshot: WrongAnswerSnapshot = {
                questionId: question.id,
                questionText: question.question,
                answers: [...question.answers],
                correctAnswerIndex: question.correctAnswer,
                correctAnswer: question.answers[question.correctAnswer],
                userAnswer: question.answers[index],
                userAnswerIndex: index,
                timeUp: false,
                category: question.category || 'unknown',
                difficulty: question.difficulty || 'unknown',
                timestamp: Date.now(),
            };

            onAnswer(false, snapshot);

            setTimeout(() => {
                if (!continueUsed) {
                    onContinueRequest();
                } else {
                    onNextQuestion();
                }
            }, 800);
        }
    };

    const handleTimeUp = () => {
        if (isLockedRef.current) return;
        isLockedRef.current = true;

        setTimeUp(true);
        setShowResult(true);
        setIsCorrect(false);

        const snapshot: WrongAnswerSnapshot = {
            questionId: question.id,
            questionText: question.question,
            answers: [...question.answers],
            correctAnswerIndex: question.correctAnswer,
            correctAnswer: question.answers[question.correctAnswer],
            userAnswer: language === 'tr' ? 'Zaman Doldu' : 'Time Up',
            userAnswerIndex: null,
            timeUp: true,
            category: question.category || 'unknown',
            difficulty: question.difficulty || 'unknown',
            timestamp: Date.now(),
        };

        onAnswer(false, snapshot);

        setTimeout(() => {
            if (!continueUsed) {
                onContinueRequest();
            } else {
                onNextQuestion();
            }
        }, 800);
    };

    const getAnswerStyle = (index: number) => {
        if (!showResult) {
            return styles.answerDefault;
        }

        if (index === question.correctAnswer) {
            return styles.answerCorrect;
        }

        if (index === selectedAnswer && !isCorrect) {
            return styles.answerWrong;
        }

        return styles.answerDisabled;
    };

    // Joker handlers
    const handleFiftyFifty = () => {
        if (showResult || jokerState.fiftyFifty.used) return;
        const hidden = onUseFiftyFifty(question);
        setHiddenAnswers(hidden);
    };

    const handleExtraTime = () => {
        if (showResult || jokerState.extraTime.used) return;
        onUseExtraTime();
        if (addTimeRef.current) {
            addTimeRef.current(10);
        }
    };

    const handleAiHint = () => {
        if (showResult || jokerState.aiHint.used) return;
        const hint = onUseAiHint(question);
        setHintText(hint);
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.bgDark, colors.bgDarker, colors.bgDark]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Result overlay */}
            {showResult && (
                <View style={[
                    styles.resultOverlay,
                    { backgroundColor: isCorrect ? 'rgba(0,255,136,0.05)' : 'rgba(255,23,68,0.05)' }
                ]} />
            )}

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Top Stats Bar */}
                <View style={styles.topBar}>
                    <View style={styles.balanceBadge}>
                        <Text style={styles.balanceSymbol}>₿</Text>
                        <Text style={styles.balanceText}>{balance}</Text>
                    </View>

                    <CircularTimer
                        key={`timer-${question.id}`}
                        duration={getTimerDuration(questionNumber)}
                        onComplete={handleTimeUp}
                        size={70}
                        isLocked={isLockedRef.current}
                        addTimeRef={addTimeRef}
                    />

                    <View style={styles.streakContainer}>
                        <Ionicons name="flash" size={24} color={colors.neonGreen} />
                        <Text style={styles.streakText}>{streak}x</Text>
                    </View>
                </View>

                {/* Reward Feedback Animation */}
                {earnedReward !== null && (
                    <Animated.View style={[
                        styles.rewardFeedback,
                        {
                            opacity: rewardOpacity,
                            transform: [
                                { scale: rewardAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) },
                                { translateY: rewardAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }
                            ]
                        }
                    ]}>
                        <Text style={styles.rewardFeedbackText}>+₿ {earnedReward}</Text>
                    </Animated.View>
                )}

                {/* Withdraw Button */}
                <Pressable
                    onPress={handleWithdrawClick}
                    disabled={showResult}
                    style={[styles.withdrawButton, showResult && styles.withdrawButtonDisabled]}
                >
                    <Ionicons name="exit-outline" size={20} color={colors.gold} />
                    <Text style={styles.withdrawText}>{t('withdraw')}</Text>
                </Pressable>

                {/* Current Prize */}
                <View style={styles.prizeContainer}>
                    <Text style={styles.prizeLabel}>PRIZE</Text>
                    <Text style={styles.prizeAmount}>¥ {formatPrize(currentPrize)}</Text>
                </View>

                {/* Progress */}
                <View style={styles.progressContainer}>
                    <ProgressBar current={questionNumber} total={totalQuestions} language={language} />
                </View>

                {/* Question Card */}
                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>{question.question}</Text>
                    {hintText && (
                        <View style={styles.hintContainer}>
                            <Text style={styles.hintText}>
                                {t('hintPrefix')} {hintText}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Joker Bar */}
                <JokerBar
                    jokerState={jokerState}
                    onFiftyFifty={handleFiftyFifty}
                    onExtraTime={handleExtraTime}
                    onAiHint={handleAiHint}
                    disabled={showResult}
                    language={language}
                />

                {/* Answers */}
                <View style={styles.answersContainer}>
                    {question.answers.map((answer, index) => {
                        // Hide answers eliminated by 50:50
                        if (hiddenAnswers.includes(index)) return null;

                        return (
                            <Animated.View
                                key={index}
                                style={[
                                    { transform: [{ translateX: selectedAnswer === index && !isCorrect ? shakeAnim : 0 }] }
                                ]}
                            >
                                <Pressable
                                    onPress={() => handleAnswerClick(index)}
                                    disabled={selectedAnswer !== null || timeUp}
                                    style={[styles.answerButton, getAnswerStyle(index)]}
                                >
                                    <View style={styles.answerLetter}>
                                        <Text style={styles.answerLetterText}>{String.fromCharCode(65 + index)}</Text>
                                    </View>
                                    <Text style={styles.answerText}>{answer}</Text>
                                </Pressable>
                            </Animated.View>
                        );
                    })}
                </View>

                {/* Result Message */}
                {showResult && (
                    <View style={styles.resultMessage}>
                        <Text style={[styles.resultText, { color: isCorrect ? colors.correct : colors.wrong }]}>
                            {isCorrect ? t('correct') : timeUp ? t('timeUp') : t('wrongAnswer')}
                        </Text>
                    </View>
                )}

                {/* Bottom padding for scroll */}
                <View style={{ height: 50 }} />
            </ScrollView>

            {/* Withdraw Modal */}
            <Modal
                visible={showWithdrawModal}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('withdrawTitle')}</Text>
                        <Text style={styles.modalBody}>
                            {t('withdrawBody', { amount: formatPrizeFull(cashOutAmount) })}
                        </Text>
                        <View style={styles.modalButtons}>
                            <Pressable
                                onPress={() => setShowWithdrawModal(false)}
                                style={styles.modalCancelButton}
                            >
                                <Text style={styles.modalCancelText}>{t('withdrawCancel')}</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleWithdrawConfirm}
                                style={styles.modalConfirmButton}
                            >
                                <Text style={styles.modalConfirmText}>{t('withdrawConfirm')}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgDark,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.xxl + spacing.md,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    resultOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        borderColor: colors.gold,
    },
    coinText: {
        color: colors.gold,
        fontSize: 18,
        fontWeight: '700',
        marginLeft: spacing.xs,
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        borderColor: colors.neonGreen,
    },
    streakText: {
        color: colors.neonGreen,
        fontSize: 18,
        fontWeight: '700',
        marginLeft: spacing.xs,
    },
    withdrawButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        backgroundColor: colors.card,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        borderColor: colors.gold,
        marginBottom: spacing.md,
    },
    withdrawButtonDisabled: {
        opacity: 0.5,
    },
    withdrawText: {
        color: colors.gold,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: spacing.xs,
    },
    prizeContainer: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    prizeLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    prizeAmount: {
        color: colors.gold,
        fontSize: 28,
        fontWeight: '800',
    },
    progressContainer: {
        marginBottom: spacing.lg,
    },
    questionCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg,
    },
    questionText: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 28,
    },
    answersContainer: {
        gap: spacing.sm,
    },
    answerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 2,
        marginBottom: spacing.sm,
    },
    answerDefault: {
        borderColor: colors.border,
    },
    answerCorrect: {
        borderColor: colors.correct,
        backgroundColor: 'rgba(0,255,136,0.1)',
    },
    answerWrong: {
        borderColor: colors.wrong,
        backgroundColor: 'rgba(255,23,68,0.1)',
    },
    answerDisabled: {
        borderColor: colors.border,
        opacity: 0.5,
    },
    answerLetter: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(124, 58, 237, 0.2)',
        borderWidth: 2,
        borderColor: colors.purple,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    answerLetterText: {
        color: colors.purple,
        fontSize: 16,
        fontWeight: '700',
    },
    answerText: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 16,
    },
    resultMessage: {
        marginTop: spacing.lg,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 28,
        fontWeight: '800',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        marginHorizontal: spacing.lg,
        borderWidth: 2,
        borderColor: colors.gold,
    },
    modalTitle: {
        color: colors.gold,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    modalBody: {
        color: colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    modalCancelButton: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
    },
    modalCancelText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
    modalConfirmButton: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.gold,
        alignItems: 'center',
    },
    modalConfirmText: {
        color: colors.bgDark,
        fontSize: 16,
        fontWeight: '700',
    },
    hintContainer: {
        marginTop: spacing.md,
        padding: spacing.sm,
        backgroundColor: `${colors.gold}20`,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.gold,
    },
    hintText: {
        color: colors.gold,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    balanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.gold,
        gap: spacing.xs,
    },
    balanceSymbol: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.gold,
    },
    balanceText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.gold,
    },
    rewardFeedback: {
        alignSelf: 'center',
        backgroundColor: colors.neonGreen,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.sm,
    },
    rewardFeedbackText: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.bgDark,
    },
});
