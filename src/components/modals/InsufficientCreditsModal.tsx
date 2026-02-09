import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../../data/translations';
import { colors, borderRadius, spacing } from '../../styles/theme';
import { useCredits } from '../../context/CreditContext';

interface InsufficientCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
}

export function InsufficientCreditsModal({ isOpen, onClose, language }: InsufficientCreditsModalProps) {
    const t = (key: any, params?: any) => getTranslation(language, key, params);
    const { gameCost, credits } = useCredits();

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="alert-circle" size={48} color={colors.wrong} />
                    </View>

                    <Text style={styles.title}>{t('notEnoughCredits')}</Text>

                    <Text style={styles.description}>
                        {t('needCredits', { amount: gameCost })}
                    </Text>

                    <View style={styles.creditsInfo}>
                        <Text style={styles.creditsLabel}>{t('currentCredits')}:</Text>
                        <Text style={styles.creditsValue}>{credits}</Text>
                    </View>

                    <View style={styles.optionsContainer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.optionButton,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Ionicons name="play-circle" size={24} color={colors.purple} />
                            <Text style={styles.optionText}>{t('watchAds')}</Text>
                            <Text style={styles.comingSoon}>{t('comingSoon')}</Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.optionButton,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Ionicons name="card" size={24} color={colors.gold} />
                            <Text style={styles.optionText}>{t('purchaseCoins')}</Text>
                            <Text style={styles.comingSoon}>{t('comingSoon')}</Text>
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={onClose}
                        style={({ pressed }) => [
                            styles.closeButton,
                            pressed && styles.buttonPressed,
                        ]}
                    >
                        <Text style={styles.closeText}>{t('close')}</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        marginHorizontal: spacing.lg,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.wrong,
    },
    iconContainer: {
        marginBottom: spacing.lg,
    },
    title: {
        color: colors.wrong,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    description: {
        color: colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    creditsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    creditsLabel: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    creditsValue: {
        color: colors.gold,
        fontSize: 18,
        fontWeight: '700',
    },
    optionsContainer: {
        width: '100%',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.muted,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        gap: spacing.md,
    },
    optionText: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    comingSoon: {
        color: colors.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
    },
    closeButton: {
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
    },
    closeText: {
        color: colors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
});
