import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, typography, borderRadius, spacing } from '../styles/theme';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { useProgress } from '../context/ProgressContext';
import {
    getCategoryTotalLevel,
    getCategoryProgressPercent,
    getCategoryTotalAvailableLevels,
} from '../utils/progressHelpers';

export type Category = 'all' | 'general' | 'history' | 'sports';

interface CategorySelectionProps {
    onSelectCategory: (category: Category) => void;
    onBack: () => void;
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
        id: 'all',
        icon: 'shuffle-outline',
        titleKey: 'allCategories',
        descKey: 'allCategoriesDesc',
        color: colors.gold,
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
        id: 'general',
        icon: 'globe-outline',
        titleKey: 'generalKnowledge',
        descKey: 'generalKnowledgeDesc',
        color: colors.purple,
    },
];

export function CategorySelection({ onSelectCategory, onBack, language }: CategorySelectionProps) {
    const t = (key: any) => getTranslation(language, key);
    const { progress } = useProgress();

    // Pre-compute progress stats for each category
    const categoryStats = useMemo(() => {
        const stats: Record<string, { total: number; completed: number; percent: number }> = {};
        for (const cat of categories) {
            const totalAvailable = getCategoryTotalAvailableLevels(cat.id, language);
            const completed = getCategoryTotalLevel(progress, cat.id);
            const percent = getCategoryProgressPercent(progress, cat.id, totalAvailable);
            stats[cat.id] = { total: totalAvailable, completed, percent };
        }
        return stats;
    }, [progress, language]);

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
                <Text style={styles.title}>{t('chooseCategory')}</Text>
                <Text style={styles.subtitle}>{t('selectBattlefield')}</Text>

                <View style={styles.grid}>
                    {categories.map((category) => {
                        const stats = categoryStats[category.id];
                        return (
                            <Pressable
                                key={category.id}
                                onPress={() => onSelectCategory(category.id)}
                                style={({ pressed }) => [
                                    styles.categoryCard,
                                    pressed && styles.categoryCardPressed,
                                ]}
                            >
                                <View style={styles.cardTopRow}>
                                    <View style={[styles.iconContainer, { backgroundColor: `${category.color}20` }]}>
                                        <Ionicons name={category.icon} size={32} color={category.color} />
                                    </View>
                                    {/* Level badge */}
                                    {stats.completed > 0 && (
                                        <View style={[styles.levelBadge, { backgroundColor: `${category.color}25`, borderColor: category.color }]}>
                                            <Ionicons name="trophy" size={12} color={category.color} />
                                            <Text style={[styles.levelBadgeText, { color: category.color }]}>
                                                {stats.completed}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.categoryTitle}>{t(category.titleKey)}</Text>
                                <Text style={styles.categoryDesc}>{t(category.descKey)}</Text>

                                {/* Progress section */}
                                <View style={styles.progressSection}>
                                    <View style={styles.progressRow}>
                                        <Text style={styles.progressLabel}>
                                            {t('totalLevel')}: {stats.completed}
                                        </Text>
                                        <Text style={[styles.progressPercent, { color: category.color }]}>
                                            {stats.percent}%
                                        </Text>
                                    </View>
                                    <View style={styles.progressBarOuter}>
                                        <View
                                            style={[
                                                styles.progressBarInner,
                                                {
                                                    width: `${stats.percent}%`,
                                                    backgroundColor: category.color,
                                                },
                                            ]}
                                        />
                                    </View>
                                    <Text style={styles.progressSubtext}>
                                        {stats.completed} / {stats.total} {t('completedLabel')}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
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
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    levelBadgeText: {
        fontSize: 13,
        fontWeight: '800',
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
        marginBottom: spacing.md,
    },
    // Progress
    progressSection: {
        marginTop: spacing.xs,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: `${colors.border}60`,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    progressLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    progressPercent: {
        fontSize: 13,
        fontWeight: '800',
    },
    progressBarOuter: {
        height: 5,
        backgroundColor: colors.muted,
        borderRadius: 3,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressBarInner: {
        height: 5,
        borderRadius: 3,
    },
    progressSubtext: {
        fontSize: 11,
        color: `${colors.textSecondary}90`,
    },
});
