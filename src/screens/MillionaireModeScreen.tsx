import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';
import { HeaderBackButton } from '../components/HeaderBackButton';

interface MillionaireModeScreenProps {
    language: Language;
    onGoHome: () => void;
}

export function MillionaireModeScreen({ language, onGoHome }: MillionaireModeScreenProps) {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.bgDark, '#0d0d1a', colors.bgDark]}
                style={StyleSheet.absoluteFillObject}
            />

            <HeaderBackButton onPress={onGoHome} />

            <View style={styles.content}>
                {/* Crown icon */}
                <View style={styles.iconGlow}>
                    <LinearGradient
                        colors={['rgba(212, 175, 55, 0.3)', 'rgba(166, 124, 0, 0.1)']}
                        style={styles.iconContainer}
                    >
                        <Text style={styles.crownEmoji}>👑</Text>
                    </LinearGradient>
                </View>

                <Text style={styles.title}>KİM MİLYONER</Text>

                <View style={styles.divider} />

                <Text style={styles.subtitle}>
                    {language === 'tr' ? 'Yakında' : 'Coming Soon'}
                </Text>

                <Text style={styles.description}>
                    {language === 'tr'
                        ? 'Basamakları tırman, milyoner ol!\nBu mod çok yakında aktif olacak.'
                        : 'Climb the ladder, become a millionaire!\nThis mode will be active very soon.'}
                </Text>

                <Pressable
                    onPress={onGoHome}
                    style={({ pressed }) => [
                        styles.backButton,
                        pressed && styles.backButtonPressed,
                    ]}
                >
                    <Ionicons name="arrow-back" size={18} color={colors.gold} />
                    <Text style={styles.backButtonText}>
                        {language === 'tr' ? 'Ana Menü' : 'Main Menu'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgDark,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    iconGlow: {
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 30,
        elevation: 10,
        marginBottom: spacing.xl,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.5)',
    },
    crownEmoji: {
        fontSize: 48,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: colors.gold,
        letterSpacing: 3,
        textShadowColor: 'rgba(212, 175, 55, 0.4)',
        textShadowOffset: { width: 0, height: 3 },
        textShadowRadius: 15,
        marginBottom: spacing.md,
    },
    divider: {
        width: 60,
        height: 2,
        backgroundColor: colors.gold,
        opacity: 0.4,
        marginBottom: spacing.md,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textSecondary,
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: spacing.md,
    },
    description: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        opacity: 0.7,
        marginBottom: spacing.xxl,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backButtonPressed: {
        opacity: 0.7,
        backgroundColor: 'rgba(212, 175, 55, 0.1)',
    },
    backButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.gold,
        letterSpacing: 1,
    },
});
