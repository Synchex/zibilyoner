import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';

interface LossScreenProps {
    correctAnswer: string;
    userAnswer: string;
    explanation?: string;
    correctCount: number;
    currentQuestion: number;
    totalQuestions: number;
    coinsEarned: number;
    prizeWon: number;
    onTryAgain: () => void;
    onGoHome: () => void;
    language: Language;
    questionId: string;
    questionText: string;
    choices: string[];
    category: string;
    difficulty: string;
}

export function LossScreen({
    correctAnswer,
    userAnswer,
    correctCount,
    currentQuestion,
    totalQuestions,
    coinsEarned,
    prizeWon,
    onTryAgain,
    onGoHome,
    language,
    questionText,
}: LossScreenProps) {
    const t = (key: any) => getTranslation(language, key);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.bgDark, colors.bgDarker, colors.bgDark]}
                style={StyleSheet.absoluteFillObject}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Game Over Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons name="close-circle" size={80} color={colors.wrong} />
                </View>

                <Text style={styles.title}>{t('wrongAnswer')}</Text>

                {/* Question that was wrong */}
                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>{questionText}</Text>
                </View>

                {/* Answers comparison */}
                <View style={styles.answerSection}>
                    <View style={styles.answerRow}>
                        <Text style={styles.answerLabel}>
                            {language === 'tr' ? 'Senin Cevabın:' : 'Your Answer:'}
                        </Text>
                        <Text style={styles.wrongAnswerText}>{userAnswer}</Text>
                    </View>

                    <View style={styles.answerRow}>
                        <Text style={styles.answerLabel}>
                            {language === 'tr' ? 'Doğru Cevap:' : 'Correct Answer:'}
                        </Text>
                        <Text style={styles.correctAnswerText}>{correctAnswer}</Text>
                    </View>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Ionicons name="checkmark-circle" size={24} color={colors.correct} />
                        <Text style={styles.statValue}>{correctCount}/{totalQuestions}</Text>
                        <Text style={styles.statLabel}>{t('correctAnswers')}</Text>
                    </View>

                    <View style={styles.statItem}>
                        <Ionicons name="trophy" size={24} color={colors.gold} />
                        <Text style={styles.statValue}>Q{currentQuestion}</Text>
                        <Text style={styles.statLabel}>
                            {language === 'tr' ? 'Ulaşılan Soru' : 'Reached'}
                        </Text>
                    </View>

                    <View style={styles.statItem}>
                        <Text style={styles.yuanIcon}>¥</Text>
                        <Text style={styles.statValue}>{prizeWon}</Text>
                        <Text style={styles.statLabel}>
                            {language === 'tr' ? 'Kazanılan' : 'Won'}
                        </Text>
                    </View>
                </View>

                {/* Buttons */}
                <View style={styles.buttonsContainer}>
                    <Pressable
                        onPress={onTryAgain}
                        style={({ pressed }) => [
                            styles.tryAgainButton,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Text style={styles.tryAgainText}>
                            {language === 'tr' ? 'TEKRAR DENE' : 'TRY AGAIN'}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={onGoHome}
                        style={({ pressed }) => [
                            styles.homeButton,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Text style={styles.homeText}>
                            {language === 'tr' ? 'ANA SAYFA' : 'HOME'}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgDark,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingTop: spacing.xxl + spacing.xl,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.wrong,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    questionCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.lg,
        width: '100%',
    },
    questionText: {
        color: colors.textPrimary,
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    answerSection: {
        width: '100%',
        marginBottom: spacing.xl,
    },
    answerRow: {
        marginBottom: spacing.md,
    },
    answerLabel: {
        color: colors.textSecondary,
        fontSize: 14,
        marginBottom: spacing.xs,
    },
    wrongAnswerText: {
        color: colors.wrong,
        fontSize: 16,
        fontWeight: '600',
        backgroundColor: 'rgba(255,23,68,0.1)',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    correctAnswerText: {
        color: colors.correct,
        fontSize: 16,
        fontWeight: '600',
        backgroundColor: 'rgba(0,255,136,0.1)',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        overflow: 'hidden',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: spacing.xl,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: '700',
        marginTop: spacing.xs,
    },
    statLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: spacing.xs,
    },
    yuanIcon: {
        color: colors.gold,
        fontSize: 24,
        fontWeight: '700',
    },
    buttonsContainer: {
        width: '100%',
        gap: spacing.md,
    },
    tryAgainButton: {
        backgroundColor: colors.purple,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
    },
    tryAgainText: {
        color: colors.textPrimary,
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: 1,
    },
    homeButton: {
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
    },
    homeText: {
        color: colors.textSecondary,
        fontSize: 18,
        fontWeight: '600',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
});
