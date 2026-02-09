import React from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../../data/translations';
import { colors, borderRadius, spacing } from '../../styles/theme';

interface ContinueModalProps {
    isOpen: boolean;
    onWatchAd: () => void;
    onDecline: () => void;
    language: Language;
}

export function ContinueModal({ isOpen, onWatchAd, onDecline, language }: ContinueModalProps) {
    const t = (key: any) => getTranslation(language, key);

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
                        <Ionicons name="heart" size={48} color={colors.wrong} />
                    </View>

                    <Text style={styles.title}>
                        {language === 'tr' ? 'Devam Etmek İster misin?' : 'Want to Continue?'}
                    </Text>

                    <Text style={styles.description}>
                        {language === 'tr'
                            ? 'Bir reklam izleyerek bu soruyu tekrar deneyebilirsin!'
                            : 'Watch an ad to retry this question!'}
                    </Text>

                    <View style={styles.buttonsContainer}>
                        <Pressable
                            onPress={onWatchAd}
                            style={({ pressed }) => [
                                styles.watchAdButton,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Ionicons name="play-circle" size={24} color={colors.bgDark} />
                            <Text style={styles.watchAdText}>
                                {language === 'tr' ? 'REKLAM İZLE' : 'WATCH AD'}
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={onDecline}
                            style={({ pressed }) => [
                                styles.declineButton,
                                pressed && styles.buttonPressed,
                            ]}
                        >
                            <Text style={styles.declineText}>
                                {language === 'tr' ? 'Hayır, Teşekkürler' : 'No Thanks'}
                            </Text>
                        </Pressable>
                    </View>
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
        borderColor: colors.purple,
    },
    iconContainer: {
        marginBottom: spacing.lg,
    },
    title: {
        color: colors.textPrimary,
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    description: {
        color: colors.textSecondary,
        fontSize: 16,
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 24,
    },
    buttonsContainer: {
        width: '100%',
        gap: spacing.md,
    },
    watchAdButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.neonGreen,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        gap: spacing.sm,
    },
    watchAdText: {
        color: colors.bgDark,
        fontSize: 16,
        fontWeight: '700',
    },
    declineButton: {
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
    },
    declineText: {
        color: colors.textSecondary,
        fontSize: 14,
        fontWeight: '600',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
});
