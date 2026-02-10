import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    Animated,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation, Translations } from '../data/translations';
import { Question } from '../data/questionBank';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { PRIZE_LADDER, formatPrizeFull, getCurrentPrize } from '../data/prizeLadder';
import { JokerBar } from '../components/JokerBar';
import { useJokers, JokerType } from '../hooks/useJokers';
import {
    MILLIONAIRE_TOTAL_QUESTIONS,
    SAFE_HAVENS,
    getDifficultyForStep,
    getDifficultyLabel,
    getDifficultyColor,
    pickMillionaireQuestions,
    getSafeHavenPrize,
} from '../utils/millionaireEngine';
import { useYuan } from '../context/YuanContext';
import { useGameHistory } from '../context/GameHistoryContext';

// ============================================================================
// Types
// ============================================================================

type MillionairePhase = 'intro' | 'playing' | 'won' | 'lost' | 'withdrawn';

interface MillionaireModeScreenProps {
    language: Language;
    onGoHome: () => void;
}

// ============================================================================
// Component
// ============================================================================

export function MillionaireModeScreen({ language, onGoHome }: MillionaireModeScreenProps) {
    const { addYuan } = useYuan();
    const { startNewRun, recordAnswer, finalizeRun } = useGameHistory();

    // Game state
    const [phase, setPhase] = useState<MillionairePhase>('intro');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answerRevealed, setAnswerRevealed] = useState(false);
    const [hiddenAnswers, setHiddenAnswers] = useState<number[]>([]);
    const [aiHintText, setAiHintText] = useState<string | null>(null);
    const [showQuitModal, setShowQuitModal] = useState(false);

    // Joker system
    const {
        jokerState,
        useFiftyFifty,
        useExtraTime,
        useAiHint,
        resetJokers,
        isJokerUsed,
    } = useJokers();

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    const t = useCallback(
        (key: keyof Translations, params?: any) => getTranslation(language, key, params),
        [language]
    );

    // ============================================================================
    // Game Lifecycle
    // ============================================================================

    const startGame = useCallback(() => {
        const picked = pickMillionaireQuestions(language);
        if (picked.length < MILLIONAIRE_TOTAL_QUESTIONS) {
            console.error('[Millionaire] Not enough questions!');
        }
        setQuestions(picked);
        setCurrentStep(0);
        setSelectedAnswer(null);
        setAnswerRevealed(false);
        setHiddenAnswers([]);
        setAiHintText(null);
        resetJokers();
        startNewRun('all', 'mixed', MILLIONAIRE_TOTAL_QUESTIONS);
        setPhase('playing');
        animateIn();
    }, [language, resetJokers, startNewRun]);

    const animateIn = useCallback(() => {
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.95);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 80,
                friction: 12,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, scaleAnim]);

    // ============================================================================
    // Answer Handling
    // ============================================================================

    const handleSelectAnswer = useCallback(
        (index: number) => {
            if (selectedAnswer !== null || answerRevealed) return;
            if (hiddenAnswers.includes(index)) return;

            setSelectedAnswer(index);

            // Reveal after a dramatic pause
            setTimeout(() => {
                const question = questions[currentStep];
                const isCorrect = index === question.correctAnswer;

                // Record in game history
                recordAnswer({
                    questionId: String(question.id),
                    questionIndex: currentStep + 1,
                    questionText: question.question,
                    selectedIndex: index,
                    correctIndex: question.correctAnswer,
                    isCorrect,
                    userAnswer: question.answers[index],
                    correctAnswer: question.answers[question.correctAnswer],
                });

                setAnswerRevealed(true);

                // After reveal, advance after a short delay
                setTimeout(() => {
                    if (isCorrect) {
                        const prize = getCurrentPrize(currentStep);
                        addYuan(prize);

                        if (currentStep + 1 >= MILLIONAIRE_TOTAL_QUESTIONS) {
                            // WON THE GAME!
                            finalizeRun('completed', prize);
                            setPhase('won');
                        } else {
                            // Next question
                            setCurrentStep(prev => prev + 1);
                            setSelectedAnswer(null);
                            setAnswerRevealed(false);
                            setHiddenAnswers([]);
                            setAiHintText(null);
                            animateIn();
                        }
                    } else {
                        // LOST
                        const guaranteedPrize = getSafeHavenPrize(currentStep, getCurrentPrize);
                        finalizeRun('lost', guaranteedPrize);
                        setPhase('lost');
                    }
                }, 1500);
            }, 1200);
        },
        [selectedAnswer, answerRevealed, hiddenAnswers, questions, currentStep, recordAnswer, addYuan, finalizeRun, animateIn]
    );

    // ============================================================================
    // Withdrawal
    // ============================================================================

    const handleWithdraw = useCallback(() => {
        if (currentStep === 0) return;
        setShowQuitModal(true);
    }, [currentStep]);

    const confirmWithdraw = useCallback(() => {
        const prize = getCurrentPrize(currentStep - 1);
        addYuan(prize);
        finalizeRun('withdrawn', prize);
        setShowQuitModal(false);
        setPhase('withdrawn');
    }, [currentStep, addYuan, finalizeRun]);

    // ============================================================================
    // Joker Handlers
    // ============================================================================

    const handleFiftyFifty = useCallback(() => {
        if (selectedAnswer !== null) return;
        const question = questions[currentStep];
        const hidden = useFiftyFifty(question);
        setHiddenAnswers(hidden);
    }, [selectedAnswer, questions, currentStep, useFiftyFifty]);

    const handleAiHint = useCallback(() => {
        if (selectedAnswer !== null) return;
        const question = questions[currentStep];
        const hint = useAiHint(question);
        if (hint) setAiHintText(hint);
    }, [selectedAnswer, questions, currentStep, useAiHint]);

    // ============================================================================
    // Renderers
    // ============================================================================

    const currentQuestion = questions[currentStep];
    const currentPrize = currentStep > 0 ? getCurrentPrize(currentStep - 1) : 0;
    const nextPrize = getCurrentPrize(currentStep);
    const guaranteedPrize = getSafeHavenPrize(currentStep, getCurrentPrize);

    // ---- INTRO SCREEN ----
    if (phase === 'intro') {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={[colors.bgDark, '#0d0d1a', '#0a0a14']}
                    style={StyleSheet.absoluteFillObject}
                />
                <HeaderBackButton onPress={onGoHome} />

                <View style={styles.introContent}>
                    <Text style={styles.crownEmoji}>👑</Text>
                    <Text style={styles.introTitle}>KİM MİLYONER</Text>
                    <View style={styles.introDivider} />


                    <Text style={styles.introDescription}>
                        {t('kimMilyonerDesc')}
                    </Text>

                    {/* Difficulty tiers info */}
                    <View style={styles.tierInfo}>
                        {[
                            { range: '1–3', label: t('easy'), color: '#00ff88' },
                            { range: '4–8', label: t('medium'), color: '#ffaa00' },
                            { range: '9–12', label: t('hard'), color: '#ff4444' },
                        ].map((tier) => (
                            <View key={tier.range} style={styles.tierRow}>
                                <View style={[styles.tierDot, { backgroundColor: tier.color }]} />
                                <Text style={styles.tierLabel}>
                                    {t('questionLabel')} {tier.range}
                                </Text>
                                <Text style={[styles.tierDifficulty, { color: tier.color }]}>
                                    {tier.label}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Pressable
                        onPress={startGame}
                        style={({ pressed }) => [
                            styles.startButton,
                            pressed && styles.startButtonPressed,
                        ]}
                    >
                        <LinearGradient
                            colors={['#D4AF37', '#A67C00']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.startButtonGradient}
                        >
                            <Text style={styles.startButtonText}>
                                {t('startGame')}
                            </Text>
                        </LinearGradient>
                    </Pressable>
                </View>
            </View>
        );
    }

    // ---- RESULT SCREENS (WON / LOST / WITHDRAWN) ----
    if (phase === 'won' || phase === 'lost' || phase === 'withdrawn') {
        const isWin = phase === 'won';
        const isWithdrawn = phase === 'withdrawn';
        const finalPrize = isWin
            ? getCurrentPrize(MILLIONAIRE_TOTAL_QUESTIONS - 1)
            : isWithdrawn
                ? getCurrentPrize(currentStep - 1)
                : getSafeHavenPrize(currentStep, getCurrentPrize);

        let title = '';
        let subtitle = '';

        if (isWin) {
            title = t('congratulations');
            subtitle = t('millionaireVictory');
        } else if (isWithdrawn) {
            title = t('withdrawn');
            subtitle = t('withdrawnAt', { level: currentStep });
        } else {
            title = t('eliminated');
            subtitle = t('eliminatedAt', { level: currentStep + 1 });
        }

        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={
                        isWin
                            ? ['#0d0d1a', '#1a1a00', '#0d0d1a']
                            : ['#0d0d1a', '#1a0000', '#0d0d1a']
                    }
                    style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.resultContent}>
                    <Text style={styles.resultEmoji}>
                        {isWin ? '🏆' : isWithdrawn ? '🏦' : '💔'}
                    </Text>
                    <Text
                        style={[
                            styles.resultTitle,
                            { color: isWin ? colors.gold : isWithdrawn ? colors.gold : colors.wrong },
                        ]}
                    >
                        {title}
                    </Text>

                    <Text style={styles.resultSubtitle}>
                        {subtitle}
                    </Text>

                    {!isWin && !isWithdrawn && currentQuestion && (
                        <View style={styles.correctAnswerBox}>
                            <Text style={styles.correctAnswerLabel}>
                                {t('correctAnswerLabel')}
                            </Text>
                            <Text style={styles.correctAnswerText}>
                                {currentQuestion.answers[currentQuestion.correctAnswer]}
                            </Text>
                        </View>
                    )}

                    <View style={styles.resultPrizeBox}>
                        <Text style={styles.resultPrizeLabel}>
                            {t('prizeWon')}
                        </Text>
                        <Text style={styles.resultPrizeAmount}>
                            ¥ {formatPrizeFull(finalPrize)}
                        </Text>
                    </View>

                    <Pressable
                        onPress={onGoHome}
                        style={({ pressed }) => [
                            styles.resultButton,
                            pressed && { opacity: 0.7 },
                        ]}
                    >
                        <Text style={styles.resultButtonText}>
                            {t('mainMenu')}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            setPhase('intro');
                        }}
                        style={({ pressed }) => [
                            styles.resultButtonSecondary,
                            pressed && { opacity: 0.7 },
                        ]}
                    >
                        <Text style={styles.resultButtonSecondaryText}>
                            {t('playAgain')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    // ---- PLAYING SCREEN ----
    if (!currentQuestion) {
        return (
            <View style={styles.container}>
                <Text style={{ color: '#fff', textAlign: 'center', marginTop: 100 }}>
                    Loading...
                </Text>
            </View>
        );
    }

    const diffLabel = getDifficultyLabel(currentStep, language);
    const diffColor = getDifficultyColor(currentStep);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.bgDark, '#0d0d1a', colors.bgDark]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Top Bar */}
            <View style={styles.topBar}>
                <Pressable onPress={onGoHome} style={styles.topBarBack}>
                    <Ionicons name="close" size={22} color={colors.textSecondary} />
                </Pressable>

                <View style={styles.topBarCenter}>
                    <Text style={styles.questionCounter}>
                        {currentStep + 1} / {MILLIONAIRE_TOTAL_QUESTIONS}
                    </Text>
                    <View style={[styles.diffBadge, { borderColor: diffColor }]}>
                        <View style={[styles.diffDot, { backgroundColor: diffColor }]} />
                        <Text style={[styles.diffBadgeText, { color: diffColor }]}>
                            {diffLabel}
                        </Text>
                    </View>
                </View>

                <View style={styles.topBarPrize}>
                    <Text style={styles.prizeLabel}>¥</Text>
                    <Text style={styles.prizeValue}>{formatPrizeFull(nextPrize)}</Text>
                </View>
            </View>

            <ScrollView
                style={styles.playArea}
                contentContainerStyle={styles.playAreaContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Prize Ladder (compact) */}
                <View style={styles.ladderContainer}>
                    {PRIZE_LADDER.slice()
                        .reverse()
                        .map((step, revIdx) => {
                            const idx = MILLIONAIRE_TOTAL_QUESTIONS - 1 - revIdx;
                            const isActive = idx === currentStep;
                            const isPassed = idx < currentStep;
                            const isSafe = SAFE_HAVENS.includes(idx);
                            const stepDiffColor = getDifficultyColor(idx);

                            return (
                                <View
                                    key={step.question}
                                    style={[
                                        styles.ladderStep,
                                        isActive && styles.ladderStepActive,
                                        isPassed && styles.ladderStepPassed,
                                        isSafe && styles.ladderStepSafe,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.ladderStepNumber,
                                            isActive && { color: colors.gold, fontWeight: '800' },
                                            isPassed && { color: colors.correct },
                                        ]}
                                    >
                                        {step.question}
                                    </Text>
                                    <View
                                        style={[
                                            styles.ladderDiffIndicator,
                                            { backgroundColor: stepDiffColor, opacity: isActive ? 1 : 0.3 },
                                        ]}
                                    />
                                    <Text
                                        style={[
                                            styles.ladderStepPrize,
                                            isActive && { color: colors.gold, fontWeight: '800' },
                                            isPassed && { color: colors.correct },
                                        ]}
                                    >
                                        ¥{formatPrizeFull(step.prize)}
                                    </Text>
                                    {isSafe && (
                                        <View style={styles.safeBadge}>
                                            <Ionicons name="shield-checkmark" size={12} color={colors.gold} />
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                </View>

                {/* Question Card */}
                <Animated.View
                    style={[
                        styles.questionCard,
                        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
                    ]}
                >
                    <Text style={styles.questionText}>{currentQuestion.question}</Text>
                </Animated.View>

                {/* AI Hint Display */}
                {aiHintText && (
                    <View style={styles.hintBox}>
                        <Ionicons name="bulb-outline" size={16} color={colors.gold} />
                        <Text style={styles.hintText}>{aiHintText}</Text>
                    </View>
                )}

                {/* Answer Options */}
                <Animated.View style={{ opacity: fadeAnim }}>
                    {currentQuestion.answers.map((answer, index) => {
                        const isHidden = hiddenAnswers.includes(index);
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQuestion.correctAnswer;
                        const showCorrect = answerRevealed && isCorrect;
                        const showWrong = answerRevealed && isSelected && !isCorrect;

                        if (isHidden) {
                            return (
                                <View key={index} style={[styles.answerButton, styles.answerHidden]}>
                                    <Text style={styles.answerLabel}>{String.fromCharCode(65 + index)}</Text>
                                </View>
                            );
                        }

                        return (
                            <Pressable
                                key={index}
                                onPress={() => handleSelectAnswer(index)}
                                disabled={selectedAnswer !== null}
                                style={[
                                    styles.answerButton,
                                    isSelected && !answerRevealed && styles.answerSelected,
                                    showCorrect && styles.answerCorrect,
                                    showWrong && styles.answerWrong,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.answerLabelBox,
                                        showCorrect && { backgroundColor: colors.correct },
                                        showWrong && { backgroundColor: colors.wrong },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.answerLabel,
                                            (showCorrect || showWrong) && { color: '#000' },
                                        ]}
                                    >
                                        {String.fromCharCode(65 + index)}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.answerText,
                                        showCorrect && { color: colors.correct },
                                        showWrong && { color: colors.wrong },
                                    ]}
                                >
                                    {answer}
                                </Text>
                                {showCorrect && (
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={22}
                                        color={colors.correct}
                                        style={styles.answerIcon}
                                    />
                                )}
                                {showWrong && (
                                    <Ionicons
                                        name="close-circle"
                                        size={22}
                                        color={colors.wrong}
                                        style={styles.answerIcon}
                                    />
                                )}
                            </Pressable>
                        );
                    })}
                </Animated.View>

                {/* Joker Bar */}
                <View style={styles.jokerRow}>
                    <Pressable
                        onPress={handleFiftyFifty}
                        disabled={jokerState.fiftyFifty.used || selectedAnswer !== null}
                        style={[
                            styles.jokerButton,
                            jokerState.fiftyFifty.used && styles.jokerUsed,
                        ]}
                    >
                        <Text style={styles.jokerEmoji}>50:50</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleAiHint}
                        disabled={jokerState.aiHint.used || selectedAnswer !== null}
                        style={[
                            styles.jokerButton,
                            jokerState.aiHint.used && styles.jokerUsed,
                        ]}
                    >
                        <Ionicons
                            name="bulb"
                            size={20}
                            color={jokerState.aiHint.used ? '#555' : colors.gold}
                        />
                    </Pressable>

                    {/* Withdraw button */}
                    {currentStep > 0 && (
                        <Pressable
                            onPress={handleWithdraw}
                            disabled={selectedAnswer !== null}
                            style={styles.withdrawButton}
                        >
                            <Text style={styles.withdrawText}>
                                {t('withdrawAction')}
                            </Text>
                            <Text style={styles.withdrawPrize}>
                                ¥{formatPrizeFull(getCurrentPrize(currentStep - 1))}
                            </Text>
                        </Pressable>
                    )}
                </View>

                {/* Guaranteed prize info */}
                {guaranteedPrize > 0 && (
                    <View style={styles.guaranteeRow}>
                        <Ionicons name="shield-checkmark" size={14} color={colors.gold} />
                        <Text style={styles.guaranteeText}>
                            {t('guaranteed')}
                            ¥{formatPrizeFull(guaranteedPrize)}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Quit Confirmation Modal */}
            <Modal visible={showQuitModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>
                            {t('withdrawConfirmTitle')}
                        </Text>
                        <Text style={styles.modalDesc}>
                            {t('withdrawConfirmDesc', { amount: formatPrizeFull(getCurrentPrize(currentStep - 1)) })}
                        </Text>
                        <View style={styles.modalButtons}>
                            <Pressable
                                onPress={() => setShowQuitModal(false)}
                                style={[styles.modalBtn, styles.modalBtnCancel]}
                            >
                                <Text style={styles.modalBtnText}>
                                    {t('continueAction')}
                                </Text>
                            </Pressable>
                            <Pressable
                                onPress={confirmWithdraw}
                                style={[styles.modalBtn, styles.modalBtnConfirm]}
                            >
                                <Text style={[styles.modalBtnText, { color: colors.gold }]}>
                                    {t('withdrawAction')}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgDark,
    },

    // ---- TOP BAR ----
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 56,
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.sm,
    },
    topBarBack: {
        padding: spacing.sm,
    },
    topBarCenter: {
        alignItems: 'center',
        gap: 4,
    },
    questionCounter: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.textPrimary,
        letterSpacing: 1,
    },
    diffBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderWidth: 1,
        borderRadius: borderRadius.full,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    diffDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    diffBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    topBarPrize: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
    },
    prizeLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.gold,
    },
    prizeValue: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.gold,
    },

    // ---- PLAY AREA ----
    playArea: {
        flex: 1,
    },
    playAreaContent: {
        paddingHorizontal: spacing.md,
        paddingBottom: 40,
    },

    // ---- LADDER ----
    ladderContainer: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
        marginBottom: spacing.md,
    },
    ladderStep: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.sm,
        marginVertical: 1,
    },
    ladderStepActive: {
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
    },
    ladderStepPassed: {
        opacity: 0.5,
    },
    ladderStepSafe: {
        // Safe haven styling handled by badge
    },
    ladderStepNumber: {
        width: 24,
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        textAlign: 'center',
    },
    ladderDiffIndicator: {
        width: 4,
        height: 12,
        borderRadius: 2,
        marginHorizontal: 6,
    },
    ladderStepPrize: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
        textAlign: 'right',
    },
    safeBadge: {
        marginLeft: 6,
    },

    // ---- QUESTION CARD ----
    questionCard: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
        padding: spacing.lg,
        marginBottom: spacing.md,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        lineHeight: 26,
        textAlign: 'center',
    },

    // ---- HINT ----
    hintBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.2)',
    },
    hintText: {
        flex: 1,
        fontSize: 13,
        color: colors.gold,
        fontWeight: '600',
    },

    // ---- ANSWERS ----
    answerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: borderRadius.md,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.08)',
        paddingVertical: 14,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
        gap: 12,
    },
    answerHidden: {
        opacity: 0.15,
        borderColor: 'transparent',
    },
    answerSelected: {
        borderColor: colors.gold,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    answerCorrect: {
        borderColor: colors.correct,
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
    },
    answerWrong: {
        borderColor: colors.wrong,
        backgroundColor: 'rgba(255, 23, 68, 0.1)',
    },
    answerLabelBox: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    answerLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: colors.textSecondary,
    },
    answerText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: colors.textPrimary,
        lineHeight: 22,
    },
    answerIcon: {
        marginLeft: 'auto',
    },

    // ---- JOKER ROW ----
    jokerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    jokerButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1.5,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    jokerUsed: {
        opacity: 0.3,
        borderColor: '#333',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    jokerEmoji: {
        fontSize: 13,
        fontWeight: '900',
        color: colors.gold,
    },
    withdrawButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255, 68, 68, 0.3)',
        backgroundColor: 'rgba(255, 68, 68, 0.05)',
        alignItems: 'center',
    },
    withdrawText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#ff6666',
        letterSpacing: 1,
    },
    withdrawPrize: {
        fontSize: 11,
        fontWeight: '600',
        color: '#ff9999',
    },

    // ---- GUARANTEE ----
    guaranteeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginBottom: spacing.lg,
    },
    guaranteeText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.gold,
        opacity: 0.8,
    },

    // ---- INTRO ----
    introContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    crownEmoji: {
        fontSize: 64,
        marginBottom: spacing.lg,
    },
    introTitle: {
        fontSize: 36,
        fontWeight: '900',
        color: colors.gold,
        letterSpacing: 3,
        textShadowColor: 'rgba(212, 175, 55, 0.4)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 15,
        marginBottom: spacing.md,
    },
    introDivider: {
        width: 60,
        height: 2,
        backgroundColor: colors.gold,
        opacity: 0.4,
        marginBottom: spacing.lg,
    },
    introDescription: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: spacing.xl,
    },
    tierInfo: {
        gap: spacing.sm,
        marginBottom: spacing.xxl,
    },
    tierRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    tierDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    tierLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        width: 80,
    },
    tierDifficulty: {
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    startButton: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.gold,
    },
    startButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.97 }],
    },
    startButtonGradient: {
        paddingHorizontal: 60,
        paddingVertical: 18,
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#000',
        letterSpacing: 3,
    },

    // ---- RESULTS ----
    resultContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    resultEmoji: {
        fontSize: 72,
        marginBottom: spacing.lg,
    },
    resultTitle: {
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: spacing.sm,
    },
    resultSubtitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: spacing.xl,
        textAlign: 'center',
    },
    correctAnswerBox: {
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 136, 0.2)',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        alignItems: 'center',
    },
    correctAnswerLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.correct,
        opacity: 0.7,
        marginBottom: 4,
    },
    correctAnswerText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.correct,
    },
    resultPrizeBox: {
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xxl,
        marginBottom: spacing.xxl,
        alignItems: 'center',
    },
    resultPrizeLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: 4,
    },
    resultPrizeAmount: {
        fontSize: 36,
        fontWeight: '900',
        color: colors.gold,
        letterSpacing: 2,
    },
    resultButton: {
        backgroundColor: colors.gold,
        borderRadius: borderRadius.xl,
        paddingHorizontal: 48,
        paddingVertical: 16,
        marginBottom: spacing.md,
    },
    resultButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#000',
        letterSpacing: 2,
    },
    resultButtonSecondary: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: borderRadius.xl,
        paddingHorizontal: 48,
        paddingVertical: 14,
    },
    resultButtonSecondaryText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textSecondary,
        letterSpacing: 1,
    },

    // ---- MODAL ----
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    modalBox: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        padding: spacing.xl,
        width: '100%',
        maxWidth: 360,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    modalDesc: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    modalBtnCancel: {
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    modalBtnConfirm: {
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    modalBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: 1,
    },
});
