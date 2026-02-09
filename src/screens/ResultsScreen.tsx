import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';

interface ResultsScreenProps {
    totalQuestions: number;
    correctAnswers: number;
    coins: number;
    maxStreak: number;
    onPlayAgain: () => void;
    language: Language;
}

export function ResultsScreen({
    totalQuestions,
    correctAnswers,
    coins,
    maxStreak,
    onPlayAgain,
    language,
}: ResultsScreenProps) {
    const t = (key: any) => getTranslation(language, key);
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

    const getResultTitle = () => {
        if (accuracy === 100) return t('perfectScore');
        if (accuracy >= 80) return t('excellent');
        if (accuracy >= 60) return t('greatJob');
        if (accuracy >= 40) return t('goodEffort');
        return t('keepTrying');
    };

    const getResultColor = () => {
        if (accuracy === 100) return colors.gold;
        if (accuracy >= 80) return colors.neonGreen;
        if (accuracy >= 60) return colors.purple;
        return colors.textSecondary;
    };

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
                {/* Trophy Icon */}
                <View style={styles.iconContainer}>
                    <Ionicons
                        name={accuracy >= 60 ? "trophy" : "ribbon"}
                        size={80}
                        color={getResultColor()}
                    />
                </View>

                <Text style={[styles.title, { color: getResultColor() }]}>
                    {getResultTitle()}
                </Text>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Ionicons name="pie-chart" size={28} color={colors.purple} />
                        <Text style={styles.statValue}>{accuracy}%</Text>
                        <Text style={styles.statLabel}>{t('accuracy')}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="checkmark-done" size={28} color={colors.correct} />
                        <Text style={styles.statValue}>{correctAnswers}/{totalQuestions}</Text>
                        <Text style={styles.statLabel}>{t('correctAnswers')}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="logo-bitcoin" size={28} color={colors.gold} />
                        <Text style={styles.statValue}>{coins}</Text>
                        <Text style={styles.statLabel}>{t('coinsEarned')}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Ionicons name="flash" size={28} color={colors.neonGreen} />
                        <Text style={styles.statValue}>{maxStreak}x</Text>
                        <Text style={styles.statLabel}>{t('bestStreak')}</Text>
                    </View>
                </View>

                {/* Play Again Button */}
                <Pressable
                    onPress={onPlayAgain}
                    style={({ pressed }) => [
                        styles.playAgainButton,
                        pressed && styles.buttonPressed,
                    ]}
                >
                    <LinearGradient
                        colors={['rgba(212, 175, 55, 0.25)', 'rgba(166, 124, 0, 0.15)']}
                        style={styles.playAgainGradient}
                    >
                        <Text style={styles.playAgainText}>{t('playAgain')}</Text>
                    </LinearGradient>
                </Pressable>
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
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: spacing.xl,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: spacing.md,
        marginBottom: spacing.xl,
        width: '100%',
    },
    statCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        width: '45%',
        borderWidth: 1,
        borderColor: colors.border,
    },
    statValue: {
        color: colors.textPrimary,
        fontSize: 24,
        fontWeight: '800',
        marginTop: spacing.sm,
    },
    statLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        marginTop: spacing.xs,
    },
    playAgainButton: {
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.6)',
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 8,
        marginTop: spacing.lg,
    },
    playAgainGradient: {
        paddingHorizontal: spacing.xxl,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.xl - 2,
    },
    playAgainText: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
});
