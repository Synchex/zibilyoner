import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, typography, borderRadius, spacing } from '../styles/theme';

// EN History subcategories
export type HistorySubcategoryEN = 'history_modern' | 'history_legends_empires' | 'history_ancient_early' | 'history_all';

// TR History subcategories
export type HistorySubcategoryTR = 'history_tr_turkish' | 'history_tr_modern' | 'history_tr_ancient_anatolia' | 'history_tr_mixed';

// Combined type
export type HistorySubcategory = HistorySubcategoryEN | HistorySubcategoryTR;

interface HistorySubcategoryScreenProps {
    onSelectSubcategory: (subcategory: HistorySubcategory) => void;
    language: Language;
}

interface SubcategoryItem {
    id: HistorySubcategory;
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    description: string;
    color: string;
    highlighted?: boolean;
}

export function HistorySubcategoryScreen({ onSelectSubcategory, language }: HistorySubcategoryScreenProps) {
    const t = (key: any) => getTranslation(language, key);

    // EN subcategories
    const subcategoriesEN: SubcategoryItem[] = [
        {
            id: 'history_modern',
            name: t('historyModern') || 'Modern History',
            icon: 'business',
            description: t('historyModernDesc') || '20th century and recent events',
            color: '#3B82F6',
        },
        {
            id: 'history_legends_empires',
            name: t('historyLegendsEmpires') || 'Legends & Empires',
            icon: 'shield',
            description: t('historyLegendsEmpiresDesc') || 'Great empires and legendary figures',
            color: '#8B5CF6',
        },
        {
            id: 'history_ancient_early',
            name: t('historyAncientEarly') || 'Ancient & Early Modern',
            icon: 'library',
            description: t('historyAncientEarlyDesc') || 'Ancient civilizations and early modern era',
            color: '#D97706',
        },
        {
            id: 'history_all',
            name: t('historyAll') || 'Mixed',
            icon: 'layers',
            description: t('historyAllDesc') || 'Questions from all periods',
            color: '#10B981',
            highlighted: true,
        },
    ];

    // TR subcategories
    const subcategoriesTR: SubcategoryItem[] = [
        {
            id: 'history_tr_turkish',
            name: t('historyTrTurkish') || 'Türk Tarihi',
            icon: 'flag',
            description: t('historyTrTurkishDesc') || 'Osmanlı, Selçuklu ve Cumhuriyet tarihi',
            color: '#EF4444',
        },
        {
            id: 'history_tr_modern',
            name: t('historyTrModern') || 'Modern Tarih',
            icon: 'globe',
            description: t('historyTrModernDesc') || 'Dünya savaşları ve 20. yüzyıl',
            color: '#3B82F6',
        },
        {
            id: 'history_tr_ancient_anatolia',
            name: t('historyTrAncientAnatolia') || 'Antik Anadolu',
            icon: 'library',
            description: t('historyTrAncientAnatoliaDesc') || 'Hitit, Frig, Lidya ve İyon uygarlıkları',
            color: '#D97706',
        },
        {
            id: 'history_tr_mixed',
            name: t('historyTrMixed') || 'Karışık',
            icon: 'layers',
            description: t('historyTrMixedDesc') || 'Tüm dönemlerden sorular',
            color: '#10B981',
            highlighted: true,
        },
    ];

    const subcategories = language === 'tr' ? subcategoriesTR : subcategoriesEN;

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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: language === 'tr' ? '#EF4444' : '#8B5CF6' }]}>
                        {t('chooseHistoryCategory') || 'Tarih Dönemi Seç'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {t('selectHistoryEra') || 'Hangi dönemden sorular istersin?'}
                    </Text>
                </View>

                {/* Grid */}
                <View style={styles.grid}>
                    {subcategories.map((item) => (
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
                                <Ionicons name={item.icon} size={40} color={item.color} />
                            </View>
                            <Text style={[styles.cardTitle, { color: item.color }]}>
                                {item.name}
                            </Text>
                            <Text style={styles.cardDescription}>
                                {item.description}
                            </Text>
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
        paddingHorizontal: spacing.lg,
        paddingTop: 60,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
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
        borderWidth: 2,
    },
    cardPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    cardDescription: {
        fontSize: 12,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});
