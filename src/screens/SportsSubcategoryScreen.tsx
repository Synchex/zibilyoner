import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, typography, borderRadius, spacing } from '../styles/theme';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { useProgress } from '../context/ProgressContext';
import {
    getSubcategoryQuestionCount,
    getSubcategoryTotalLevels,
    getSubcategoryProgressData,
} from '../utils/progressHelpers';

export type SportsSubcategory = 'general_sports' | 'general_football' | 'football' | 'basketball' | 'turkish_football' | 'turkish_sports' | 'legends_records';

interface SportsSubcategoryScreenProps {
    onSelectSubcategory: (subcategory: SportsSubcategory) => void;
    onBack: () => void;
    language: Language;
}

interface SubcategoryItem {
    id: SportsSubcategory;
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    description: string;
    color: string;
    highlighted?: boolean;
}

export function SportsSubcategoryScreen({ onSelectSubcategory, onBack, language }: SportsSubcategoryScreenProps) {
    const t = (key: any) => getTranslation(language, key);
    const { progress } = useProgress();

    // English subcategories — specific ones first, mixed at bottom
    const englishSubcategories: SubcategoryItem[] = [
        { id: 'general_football', name: t('generalFootball') || 'Football', icon: 'football', description: t('generalFootballDesc') || 'World football questions', color: '#4CAF50' },
        { id: 'basketball', name: t('basketball') || 'Basketball', icon: 'basketball', description: t('basketballDesc') || 'NBA and world basketball', color: '#FF9800' },
        // Mixed / All Sports at bottom
        { id: 'general_sports', name: language === 'en' ? 'Mixed' : 'Karışık', icon: 'layers', description: language === 'en' ? 'Questions from all sports' : 'Tüm spor dallarından sorular', color: '#10B981', highlighted: true },
    ];

    // Turkish subcategories — specific ones first, mixed at bottom
    const turkishSubcategories: SubcategoryItem[] = [
        { id: 'general_football', name: t('generalFootball') || 'Dünya Futbolu', icon: 'football', description: t('generalFootballDesc') || 'Dünya futbolu soruları', color: '#2196F3' },
        { id: 'turkish_football', name: t('footballLabel') || 'Türk Futbolu', icon: 'flag', description: t('footballDesc') || 'Süper Lig ve Türk futbolu', color: '#E53935' },
        { id: 'basketball', name: t('basketball') || 'Basketbol', icon: 'basketball', description: t('basketballDesc') || 'NBA ve dünya basketbolu', color: '#FF9800' },
        { id: 'turkish_sports', name: t('turkishSports') || 'Türk Sporları', icon: 'medal', description: t('turkishSportsDesc') || 'Güreş, voleybol ve diğer Türk sporları', color: '#9C27B0' },
        { id: 'legends_records', name: t('legendsRecords') || 'Efsaneler & Rekorlar', icon: 'star', description: t('legendsRecordsDesc') || 'Olimpiyat, rekorlar ve spor efsaneleri', color: '#FFD700' },
        // Mixed / All Sports at bottom
        { id: 'general_sports', name: 'Karışık', icon: 'layers', description: 'Tüm spor dallarından karışık sorular', color: '#10B981', highlighted: true },
    ];

    const subcategories = language === 'tr' ? turkishSubcategories : englishSubcategories;

    // Pre-compute progress for each subcategory
    const subcatStats = useMemo(() => {
        const stats: Record<string, { completed: number; total: number }> = {};
        for (const sub of subcategories) {
            const qCount = getSubcategoryQuestionCount('sports', sub.id, language);
            const totalLevels = getSubcategoryTotalLevels(qCount);
            const prog = getSubcategoryProgressData(progress, 'sports', sub.id);
            stats[sub.id] = { completed: prog.completedLevels, total: totalLevels };
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
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {t('chooseSportsCategory') || 'Spor Dalı Seç'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {t('selectSportsField') || 'Hangi alanda yarışmak istersin?'}
                    </Text>
                </View>

                <View style={styles.grid}>
                    {subcategories.map((item) => {
                        const stats = subcatStats[item.id];
                        const pct = stats.total > 0
                            ? Math.round((stats.completed / stats.total) * 100)
                            : 0;

                        return (
                            <Pressable
                                key={item.id}
                                style={({ pressed }) => [
                                    styles.card,
                                    item.highlighted && styles.cardHighlighted,
                                    pressed && styles.cardPressed,
                                ]}
                                onPress={() => onSelectSubcategory(item.id)}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                                    <Ionicons name={item.icon} size={36} color={item.color} />
                                </View>
                                <Text style={[styles.cardTitle, { color: item.color }]}>
                                    {item.name}
                                </Text>
                                <Text style={styles.cardDescription}>
                                    {item.description}
                                </Text>

                                {/* Progress info */}
                                <View style={styles.progressSection}>
                                    <View style={styles.progressRow}>
                                        <Text style={styles.progressLabel}>
                                            {t('levelLabel')} {stats.completed}/{stats.total}
                                        </Text>
                                        <Text style={[styles.progressPct, { color: item.color }]}>
                                            {pct}%
                                        </Text>
                                    </View>
                                    <View style={styles.progressBarOuter}>
                                        <View
                                            style={[
                                                styles.progressBarInner,
                                                { width: `${pct}%`, backgroundColor: item.color },
                                            ]}
                                        />
                                    </View>
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
        paddingHorizontal: spacing.lg,
        paddingTop: 60,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#4CAF50',
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    cardHighlighted: {
        borderColor: '#10B981',
        borderWidth: 1.5,
    },
    cardPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    cardDescription: {
        fontSize: 11,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    // Progress
    progressSection: {
        width: '100%',
        paddingTop: spacing.xs,
        borderTopWidth: 1,
        borderTopColor: `${colors.border}60`,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    progressLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    progressPct: {
        fontSize: 11,
        fontWeight: '800',
    },
    progressBarOuter: {
        height: 4,
        backgroundColor: colors.muted,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarInner: {
        height: 4,
        borderRadius: 2,
    },
});
