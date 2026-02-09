import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../styles/theme';
import { Language, getTranslation } from '../data/translations';

interface ProgressBarProps {
    current: number;
    total: number;
    language: Language;
}

export function ProgressBar({ current, total, language }: ProgressBarProps) {
    const t = (key: any, params?: any) => getTranslation(language, key, params);
    const progress = (current / total) * 100;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {t('questionOf', { current, total })}
            </Text>
            <View style={styles.barContainer}>
                <View style={[styles.barFill, { width: `${progress}%` }]} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    label: {
        color: colors.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    barContainer: {
        height: 6,
        backgroundColor: colors.muted,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: colors.purple,
        borderRadius: borderRadius.sm,
    },
});
