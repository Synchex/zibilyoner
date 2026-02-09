import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';
import { Category } from './CategorySelection';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'mixed';

interface DifficultySelectionProps {
    onSelectDifficulty: (difficulty: Difficulty) => void;
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

export function DifficultySelection({ onSelectDifficulty, language, category }: DifficultySelectionProps) {
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
                                <Text style={styles.difficultyTitle}>{t(difficulty.titleKey)}</Text>
                                <Text style={styles.difficultyDesc}>{t(difficulty.descKey)}</Text>
                            </View>
                        </Pressable>
                    ))}
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
    difficultyTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    difficultyDesc: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});
