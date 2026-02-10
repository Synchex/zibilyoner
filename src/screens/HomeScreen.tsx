import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, typography, borderRadius, spacing } from '../styles/theme';
import { useDailyStreak } from '../hooks/useDailyStreak';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
    onStartGame: () => void;
    onMillionaireMode: () => void;
    onSpeedRound: () => void;
    onDailyChallenge: () => void;
    language: Language;
}

export function HomeScreen({ onStartGame, onMillionaireMode, onSpeedRound, onDailyChallenge, language }: HomeScreenProps) {
    const t = (key: any) => getTranslation(language, key);
    const { streak, isLoading: streakLoading } = useDailyStreak();

    // Pulse animation for streak badge
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.3)).current;

    // Scale animation for KİM MİLYONER button
    const millionaireScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (streak > 0) {
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 1200, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
                ])
            );
            const glow = Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, { toValue: 0.8, duration: 1200, useNativeDriver: true }),
                    Animated.timing(glowAnim, { toValue: 0.3, duration: 1200, useNativeDriver: true }),
                ])
            );
            pulse.start();
            glow.start();
            return () => { pulse.stop(); glow.stop(); };
        }
    }, [streak]);

    // Subtle shimmer for millionaire button
    useEffect(() => {
        const shimmer = Animated.loop(
            Animated.sequence([
                Animated.timing(millionaireScale, { toValue: 1.02, duration: 2000, useNativeDriver: true }),
                Animated.timing(millionaireScale, { toValue: 1, duration: 2000, useNativeDriver: true }),
            ])
        );
        shimmer.start();
        return () => shimmer.stop();
    }, []);

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

                {/* ── Streak Badge ── */}
                {!streakLoading && (
                    <Animated.View style={[
                        styles.streakBadge,
                        streak > 0 && {
                            transform: [{ scale: pulseAnim }],
                            shadowOpacity: glowAnim as any,
                        },
                    ]}>
                        <LinearGradient
                            colors={
                                streak > 0
                                    ? ['rgba(212, 175, 55, 0.25)', 'rgba(255, 140, 0, 0.15)']
                                    : ['rgba(45, 45, 61, 0.6)', 'rgba(30, 30, 46, 0.6)']
                            }
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.streakGradient}
                        >
                            <Text style={styles.streakFlame}>🔥</Text>
                            <Text style={[
                                styles.streakText,
                                streak === 0 && { color: colors.textSecondary },
                            ]}>
                                {streak > 0
                                    ? (language === 'tr'
                                        ? `${streak} Günlük Seri`
                                        : `${streak} Day Streak`)
                                    : (language === 'tr'
                                        ? 'Seri Başlat!'
                                        : 'Start a Streak!')}
                            </Text>
                            {streak >= 7 && (
                                <View style={styles.streakMilestone}>
                                    <Ionicons name="star" size={14} color={colors.gold} />
                                </View>
                            )}
                        </LinearGradient>
                    </Animated.View>
                )}

                {/* Title */}
                <Text style={styles.title}>{t('appTitle')}</Text>

                {/* Subtitle */}
                <View style={styles.subtitleContainer}>
                    <Text style={styles.subtitle}>
                        {language === 'tr' ? 'Sahneye Çık' : 'Step Into The Arena'}
                    </Text>
                </View>

                {/* ══════ Start Button ══════ */}
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

                {/* ══════ KİM MİLYONER Button ══════ */}
                <Animated.View style={{ transform: [{ scale: millionaireScale }] }}>
                    <Pressable
                        onPress={onMillionaireMode}
                        style={({ pressed }) => [
                            styles.millionaireButton,
                            pressed && styles.millionaireButtonPressed,
                        ]}
                    >
                        <LinearGradient
                            colors={['rgba(212, 175, 55, 0.12)', 'rgba(180, 140, 20, 0.06)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.millionaireGradient}
                        >
                            <Text style={styles.millionaireCrown}>👑</Text>
                            <View style={styles.millionaireTextGroup}>
                                <Text style={styles.millionaireText}>KİM MİLYONER</Text>
                                <Text style={styles.millionaireSubtext}>
                                    {language === 'tr' ? 'Basamakları tırman' : 'Climb the ladder'}
                                </Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="rgba(212, 175, 55, 0.6)" />
                        </LinearGradient>
                    </Pressable>
                </Animated.View>

                {/* ══════ Daily Challenge Card ══════ */}
                <Pressable
                    onPress={onDailyChallenge}
                    style={({ pressed }) => [
                        styles.dailyChallengeCard,
                        pressed && styles.dailyChallengeCardPressed,
                    ]}
                >
                    <View style={styles.dailyChallengeContent}>
                        <View style={styles.dailyChallengeIconContainer}>
                            <Ionicons name="calendar" size={24} color={colors.gold} />
                        </View>
                        <View style={styles.dailyChallengeTextContainer}>
                            <Text style={styles.dailyChallengeTitle}>
                                {language === 'tr' ? 'GÜNLÜK GÖREV' : 'DAILY CHALLENGE'}
                            </Text>
                            <Text style={styles.dailyChallengeSubtitle}>
                                {language === 'tr' ? 'Her gün 1 özel yarışma' : '1 special contest every day'}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                    </View>
                </Pressable>

                {/* ══════ Speed Round (tertiary, below daily) ══════ */}
                <Pressable
                    onPress={onSpeedRound}
                    style={({ pressed }) => [
                        styles.speedButton,
                        pressed && styles.speedButtonPressed,
                    ]}
                >
                    <Ionicons name="flash" size={16} color={colors.textSecondary} />
                    <Text style={styles.speedButtonText}>
                        {language === 'tr' ? 'HIZLI OYUN' : 'SPEED ROUND'}
                    </Text>
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
        marginBottom: spacing.xl,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 3,
    },

    // ── Start Button ──
    startButton: {
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        borderColor: 'rgba(212, 175, 55, 0.6)',
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 40,
        elevation: 8,
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

    // ── KİM MİLYONER Button ──
    millionaireButton: {
        marginTop: spacing.md,
        borderRadius: borderRadius.xl,
        borderWidth: 1.5,
        borderColor: 'rgba(212, 175, 55, 0.45)',
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 5,
    },
    millionaireButtonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.97 }],
        backgroundColor: 'rgba(212, 175, 55, 0.08)',
    },
    millionaireGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg + 4,
        paddingVertical: spacing.md + 2,
        borderRadius: borderRadius.xl - 2,
        gap: spacing.sm + 2,
    },
    millionaireCrown: {
        fontSize: 22,
    },
    millionaireTextGroup: {
        flex: 1,
    },
    millionaireText: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.gold,
        textTransform: 'uppercase',
        letterSpacing: 2.5,
    },
    millionaireSubtext: {
        fontSize: 11,
        fontWeight: '500',
        color: 'rgba(212, 175, 55, 0.6)',
        letterSpacing: 0.5,
        marginTop: 1,
    },

    // ── Daily Challenge Card ──
    dailyChallengeCard: {
        marginTop: spacing.lg,
        width: width - spacing.lg * 4,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
        overflow: 'hidden',
    },
    dailyChallengeCardPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
    dailyChallengeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    dailyChallengeIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(212, 175, 55, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    dailyChallengeTextContainer: {
        flex: 1,
    },
    dailyChallengeTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.gold,
        letterSpacing: 1,
        marginBottom: 2,
    },
    dailyChallengeSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textSecondary,
    },

    // ── Speed Round (tertiary) ──
    speedButton: {
        marginTop: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
        borderRadius: borderRadius.xl,
        backgroundColor: 'transparent',
    },
    speedButtonPressed: {
        opacity: 0.6,
    },
    speedButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },

    // ── Streak Badge ──
    streakBadge: {
        marginBottom: spacing.lg,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.4)',
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 6,
        overflow: 'hidden',
    },
    streakGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
        borderRadius: borderRadius.full,
        gap: spacing.sm,
    },
    streakFlame: {
        fontSize: 18,
    },
    streakText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.gold,
        letterSpacing: 0.5,
    },
    streakMilestone: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 2,
    },
});
