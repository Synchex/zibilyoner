import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, typography, borderRadius, spacing } from '../styles/theme';

export type SportsSubcategory = 'general_sports' | 'general_football' | 'football' | 'basketball' | 'turkish_football' | 'turkish_sports' | 'legends_records';

interface SportsSubcategoryScreenProps {
    onSelectSubcategory: (subcategory: SportsSubcategory) => void;
    language: Language;
}

interface SubcategoryItem {
    id: SportsSubcategory;
    name: string;
    icon: keyof typeof Ionicons.glyphMap;
    description: string;
    color: string;
}

export function SportsSubcategoryScreen({ onSelectSubcategory, language }: SportsSubcategoryScreenProps) {
    const t = (key: any) => getTranslation(language, key);

    // English subcategories
    const englishSubcategories: SubcategoryItem[] = [
        {
            id: 'general_sports',
            name: t('generalSports') || 'General Sports',
            icon: 'trophy',
            description: t('generalSportsDesc') || 'All sports mixed',
            color: '#9C27B0',
        },
        {
            id: 'general_football',
            name: t('generalFootball') || 'Football',
            icon: 'football',
            description: t('generalFootballDesc') || 'World football questions',
            color: '#4CAF50',
        },
        {
            id: 'basketball',
            name: t('basketball') || 'Basketball',
            icon: 'basketball',
            description: t('basketballDesc') || 'NBA and world basketball',
            color: '#FF9800',
        },
    ];

    // Turkish subcategories
    const turkishSubcategories: SubcategoryItem[] = [
        {
            id: 'general_sports',
            name: t('generalSports') || 'Genel Spor',
            icon: 'trophy',
            description: t('generalSportsDesc') || 'Tüm sporlar karışık',
            color: '#9C27B0',
        },
        {
            id: 'general_football',
            name: t('generalFootball') || 'Dünya Futbolu',
            icon: 'football',
            description: t('generalFootballDesc') || 'Dünya futbolu soruları',
            color: '#2196F3',
        },
        {
            id: 'turkish_football',
            name: t('footballLabel') || 'Türk Futbolu',
            icon: 'flag',
            description: t('footballDesc') || 'Süper Lig ve Türk futbolu',
            color: '#E53935',
        },
        {
            id: 'basketball',
            name: t('basketball') || 'Basketbol',
            icon: 'basketball',
            description: t('basketballDesc') || 'NBA ve dünya basketbolu',
            color: '#FF9800',
        },
        {
            id: 'turkish_sports',
            name: t('turkishSports') || 'Türk Sporları',
            icon: 'medal',
            description: t('turkishSportsDesc') || 'Güreş, voleybol ve diğer Türk sporları',
            color: '#9C27B0',
        },
        {
            id: 'legends_records',
            name: t('legendsRecords') || 'Efsaneler & Rekorlar',
            icon: 'star',
            description: t('legendsRecordsDesc') || 'Olimpiyat, rekorlar ve spor efsaneleri',
            color: '#FFD700',
        },
    ];

    const subcategories = language === 'tr' ? turkishSubcategories : englishSubcategories;

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
                    <Text style={styles.title}>
                        {t('chooseSportsCategory') || 'Spor Dalı Seç'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {t('selectSportsField') || 'Hangi alanda yarışmak istersin?'}
                    </Text>
                </View>

                {/* Grid */}
                <View style={styles.grid}>
                    {subcategories.map((item) => (
                        <Pressable
                            key={item.id}
                            style={({ pressed }) => [
                                styles.card,
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
