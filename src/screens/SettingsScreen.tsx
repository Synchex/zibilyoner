import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';
import { useCredits } from '../context/CreditContext';
import { useYuan } from '../context/YuanContext';
import { useGameHistory } from '../context/GameHistoryContext';

interface SettingsScreenProps {
    language: Language;
    onLanguageChange: (lang: Language) => void;
}

export function SettingsScreen({ language, onLanguageChange }: SettingsScreenProps) {
    const t = (key: any) => getTranslation(language, key);
    const { credits, resetCredits, timeUntilReset } = useCredits();
    const { totalYuan, resetYuan } = useYuan();
    const { clearHistory } = useGameHistory();

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
                <Text style={styles.title}>{t('settings')}</Text>

                {/* Language Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('language')}</Text>
                    <View style={styles.languageButtons}>
                        <Pressable
                            onPress={() => onLanguageChange('en')}
                            style={[
                                styles.languageButton,
                                language === 'en' && styles.languageButtonActive,
                            ]}
                        >
                            <Text style={[
                                styles.languageText,
                                language === 'en' && styles.languageTextActive,
                            ]}>
                                {t('english')}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={() => onLanguageChange('tr')}
                            style={[
                                styles.languageButton,
                                language === 'tr' && styles.languageButtonActive,
                            ]}
                        >
                            <Text style={[
                                styles.languageText,
                                language === 'tr' && styles.languageTextActive,
                            ]}>
                                {t('turkish')}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                {/* Credits Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('credits')}</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{t('currentCredits')}:</Text>
                        <Text style={styles.infoValue}>{credits}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>{t('dailyRefillIn')}:</Text>
                        <Text style={styles.infoValue}>{timeUntilReset}</Text>
                    </View>
                </View>

                {/* Yuan Balance */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {language === 'tr' ? 'YUAN Bakiye' : 'YUAN Balance'}
                    </Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.yuanSymbol}>¥</Text>
                        <Text style={styles.yuanValue}>{totalYuan.toLocaleString()}</Text>
                    </View>
                </View>

                {/* Dev Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        {language === 'tr' ? 'Geliştirici' : 'Developer'}
                    </Text>

                    <Pressable
                        onPress={resetCredits}
                        style={({ pressed }) => [
                            styles.devButton,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Ionicons name="refresh" size={20} color={colors.purple} />
                        <Text style={styles.devButtonText}>
                            {language === 'tr' ? 'Kredileri Sıfırla' : 'Reset Credits'}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={resetYuan}
                        style={({ pressed }) => [
                            styles.devButton,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Ionicons name="refresh" size={20} color={colors.gold} />
                        <Text style={styles.devButtonText}>
                            {language === 'tr' ? 'YUAN Sıfırla' : 'Reset YUAN'}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={clearHistory}
                        style={({ pressed }) => [
                            styles.devButton,
                            styles.dangerButton,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Ionicons name="trash" size={20} color={colors.wrong} />
                        <Text style={[styles.devButtonText, { color: colors.wrong }]}>
                            {language === 'tr' ? 'Geçmişi Temizle' : 'Clear History'}
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
        paddingTop: spacing.xxl + spacing.lg,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: spacing.xl,
    },
    section: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: spacing.md,
    },
    languageButtons: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    languageButton: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
    },
    languageButtonActive: {
        borderColor: colors.purple,
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
    },
    languageText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
    languageTextActive: {
        color: colors.purple,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    infoLabel: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    infoValue: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    yuanSymbol: {
        color: colors.gold,
        fontSize: 24,
        fontWeight: '700',
    },
    yuanValue: {
        color: colors.gold,
        fontSize: 24,
        fontWeight: '700',
    },
    devButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.muted,
        marginBottom: spacing.sm,
    },
    devButtonText: {
        color: colors.textPrimary,
        fontSize: 14,
        fontWeight: '600',
    },
    dangerButton: {
        backgroundColor: 'rgba(255, 23, 68, 0.1)',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
});
