import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';
import { Category } from './CategorySelection';
import { formatMultiplier } from '../utils/calculateReward';
import { HeaderBackButton } from '../components/HeaderBackButton';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

interface DifficultySelectionProps {
    onSelectDifficulty: (difficulty: Difficulty) => void;
    onBack: () => void;
    onGoHome: () => void;
    language: Language;
    category: Category;
}

interface DifficultyOption {
    id: Difficulty;
    icon: keyof typeof Ionicons.glyphMap;
    titleKey: keyof typeof import('../data/translations').translations.en;
    descKey: keyof typeof import('../data/translations').translations.en;
    color: string;
}

const difficulties: DifficultyOption[] = [
    {
        id: 'easy',
        icon: 'leaf-outline',
        titleKey: 'easy',
        descKey: 'easyDesc',
        color: colors.neonGreen,
    },
    {
        id: 'medium',
        icon: 'flame-outline',
        titleKey: 'medium',
        descKey: 'mediumDesc',
        color: '#f59e0b',
    },
    {
        id: 'hard',
        icon: 'skull-outline',
        titleKey: 'hard',
        descKey: 'hardDesc',
        color: colors.wrong,
    },
    {
        id: 'mixed',
        icon: 'shuffle-outline',
        titleKey: 'mixed',
        descKey: 'mixedDesc',
        color: colors.purple,
    },
];

export function DifficultySelection({ onSelectDifficulty, onBack, onGoHome, language, category }: DifficultySelectionProps) {
    const t = (key: any) => getTranslation(language, key);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.bgDark, colors.bgDarker, colors.bgDark]}
                style={StyleSheet.absoluteFillObject}
            />

            <HeaderBackButton onPress={onBack} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>{t('selectDifficulty')}</Text>
                <Text style={styles.subtitle}>{t('howBrave')}</Text>

                <View style={styles.grid}>
                    {difficulties.map((difficulty) => (
                        <Pressable
                            key={difficulty.id}
                            onPress={() => onSelectDifficulty(difficulty.id)}
                            style={({ pressed }) => [
                                styles.difficultyCard,
                                pressed && styles.difficultyCardPressed,
                            ]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: `${difficulty.color}20` }]}>
                                <Ionicons name={difficulty.icon} size={32} color={difficulty.color} />
                            </View>
                            <View style={styles.textContainer}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.difficultyTitle}>{t(difficulty.titleKey)}</Text>
                                    <View style={[styles.multiplierBadge, { backgroundColor: `${difficulty.color}25`, borderColor: difficulty.color }]}>
                                        <Text style={[styles.multiplierText, { color: difficulty.color }]}>
                                            ₿ {formatMultiplier(difficulty.id)}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.difficultyDesc}>{t(difficulty.descKey)}</Text>
                            </View>
                        </Pressable>
                    ))}
                </View>

                {/* Home Button */}
                <Pressable
                    onPress={onGoHome}
                    style={({ pressed }) => [
                        styles.homeButton,
                        pressed && styles.homeButtonPressed,
                    ]}
                >
                    <Ionicons name="home-outline" size={20} color={colors.textSecondary} />
                    <Text style={styles.homeButtonText}>{t('home')}</Text>
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
        paddingTop: spacing.xxl + spacing.lg,
        paddingBottom: 100,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    grid: {
        gap: spacing.md,
    },
    difficultyCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    difficultyCardPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
        borderColor: colors.purple,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    textContainer: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xs,
    },
    difficultyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    multiplierBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
    },
    multiplierText: {
        fontSize: 12,
        fontWeight: '700',
    },
    difficultyDesc: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        marginTop: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
    },
    homeButtonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    homeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
    },
});
