import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Language, getTranslation } from '../data/translations';
import { colors, typography, borderRadius, spacing } from '../styles/theme';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
    onStartGame: () => void;
    language: Language;
}

export function HomeScreen({ onStartGame, language }: HomeScreenProps) {
    const t = (key: any) => getTranslation(language, key);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.bgDark, colors.bgDarker, colors.bgDark]}
                style={StyleSheet.absoluteFillObject}
            />

            {/* Decorative circles */}
            <View style={[styles.decorativeCircle, styles.outerCircle]} />
            <View style={[styles.decorativeCircle, styles.innerCircle]} />

            {/* Top gold line */}
            <View style={styles.topLine} />

            {/* Content */}
            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title}>{t('appTitle')}</Text>

                {/* Subtitle */}
                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitle}>
                        {language === 'tr' ? 'Sahneye Çık' : 'Step Into The Arena'}
                    </Text>
                </View>

                {/* Start Button */}
                <Pressable
                    onPress={onStartGame}
                    style={({ pressed }) => [
                        styles.startButton,
                        pressed && styles.startButtonPressed,
                    ]}
                >
                    <LinearGradient
                        colors={['rgba(212, 175, 55, 0.25)', 'rgba(166, 124, 0, 0.15)']}
                        style={styles.startButtonGradient}
                    >
                        <Text style={styles.startButtonText}>{t('startGame')}</Text>
                    </LinearGradient>
                </Pressable>
            </View>

            {/* Bottom gold line */}
            <View style={styles.bottomLine} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bgDark,
    },
    decorativeCircle: {
        position: 'absolute',
        borderWidth: 1,
        borderColor: colors.gold,
        borderRadius: 9999,
        opacity: 0.1,
    },
    outerCircle: {
        width: width * 1.2,
        height: width * 1.2,
    },
    innerCircle: {
        width: width * 0.9,
        height: width * 0.9,
        opacity: 0.15,
    },
    topLine: {
        position: 'absolute',
        top: 80,
        left: 40,
        right: 40,
        height: 1,
        backgroundColor: colors.gold,
        opacity: 0.2,
    },
    bottomLine: {
        position: 'absolute',
        bottom: 80,
        left: 40,
        right: 40,
        height: 1,
        backgroundColor: colors.gold,
        opacity: 0.2,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    title: {
        fontSize: 64,
        fontWeight: '900',
        color: colors.gold,
        textShadowColor: 'rgba(212, 175, 55, 0.4)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 20,
        marginBottom: spacing.md,
    },
    subtitleContainer: {
        backgroundColor: 'rgba(30, 30, 45, 0.8)',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        marginBottom: spacing.xxl,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 3,
    },
    startButton: {
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.6)',
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 40,
        elevation: 8,
        marginTop: spacing.xl,
    },
    startButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    startButtonGradient: {
        paddingHorizontal: spacing.xxl * 1.5,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.xl - 2,
    },
    startButtonText: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
});
