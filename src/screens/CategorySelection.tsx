import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, typography, borderRadius, spacing } from '../styles/theme';

export type Category = 'all' | 'general' | 'history' | 'sports';

interface CategorySelectionProps {
    onSelectCategory: (category: Category) => void;
    language: Language;
}

interface CategoryOption {
    id: Category;
    icon: keyof typeof Ionicons.glyphMap;
    titleKey: keyof typeof import('../data/translations').translations.en;
    descKey: keyof typeof import('../data/translations').translations.en;
    color: string;
}

const categories: CategoryOption[] = [
    {
        id: 'general',
        icon: 'globe-outline',
        titleKey: 'generalKnowledge',
        descKey: 'generalKnowledgeDesc',
        color: colors.purple,
    },
    {
        id: 'history',
        icon: 'time-outline',
        titleKey: 'history',
        descKey: 'historyDesc',
        color: '#f59e0b',
    },
    {
        id: 'sports',
        icon: 'football-outline',
        titleKey: 'sports',
        descKey: 'sportsDesc',
        color: colors.neonGreen,
    },
    {
        id: 'all',
        icon: 'shuffle-outline',
        titleKey: 'allCategories',
        descKey: 'allCategoriesDesc',
        color: colors.gold,
    },
];

export function CategorySelection({ onSelectCategory, language }: CategorySelectionProps) {
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
                <Text style={styles.title}>{t('chooseCategory')}</Text>
                <Text style={styles.subtitle}>{t('selectBattlefield')}</Text>

                <View style={styles.grid}>
                    {categories.map((category) => (
                        <Pressable
                            key={category.id}
                            onPress={() => onSelectCategory(category.id)}
                            style={({ pressed }) => [
                                styles.categoryCard,
                                pressed && styles.categoryCardPressed,
                            ]}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
                                <Ionicons name={category.icon} size={32} color={category.color} />
                            </View>
                            <Text style={styles.categoryTitle}>{t(category.titleKey)}</Text>
                            <Text style={styles.categoryDesc}>{t(category.descKey)}</Text>
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
    categoryCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    categoryCardPressed: {
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
        marginBottom: spacing.md,
    },
    categoryTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    categoryDesc: {
        fontSize: 14,
        color: colors.textSecondary,
    },
});
