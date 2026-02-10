import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
    Animated,
    Platform,
    ToastAndroid,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';
import { HeaderBackButton } from '../components/HeaderBackButton';
import { LEVELS_PER_SUBCATEGORY, QUESTIONS_PER_LEVEL } from '../hooks/useLevelProgress';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LevelSelectScreenProps {
    language: Language;
    categoryLabel: string;
    difficultyLabel: string;
    isLevelUnlocked: (level: number) => boolean;
    isLevelCompleted: (level: number) => boolean;
    maxLevels: number; // how many levels are available (based on question pool)
    onSelectLevel: (level: number) => void;
    onBack: () => void;
    onGoHome: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function showToast(message: string) {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        Alert.alert('', message);
    }
}

// ---------------------------------------------------------------------------
// Level Card Sub-component
// ---------------------------------------------------------------------------

function LevelCard({
    level,
    unlocked,
    completed,
    isCurrent,
    onPress,
    index,
}: {
    level: number;
    unlocked: boolean;
    completed: boolean;
    isCurrent: boolean;
    onPress: () => void;
    index: number;
}) {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            delay: index * 60,
            tension: 80,
            friction: 10,
            useNativeDriver: true,
        }).start();
    }, []);

    useEffect(() => {
        if (isCurrent) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(glowAnim, {
                        toValue: 1,
                        duration: 1200,
                        useNativeDriver: false,
                    }),
                    Animated.timing(glowAnim, {
                        toValue: 0,
                        duration: 1200,
                        useNativeDriver: false,
                    }),
                ]),
            ).start();
        }
    }, [isCurrent]);

    const borderColor = completed
        ? colors.neonGreen
        : isCurrent
            ? glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [colors.purple, '#a855f7'],
            })
            : colors.border;

    const bgColor = completed
        ? `${colors.neonGreen}15`
        : isCurrent
            ? `${colors.purple}20`
            : unlocked
                ? colors.card
                : `${colors.bgDarker}80`;

    const iconName: keyof typeof Ionicons.glyphMap = completed
        ? 'checkmark-circle'
        : !unlocked
            ? 'lock-closed'
            : 'play-circle';

    const iconColor = completed
        ? colors.neonGreen
        : isCurrent
            ? colors.purple
            : unlocked
                ? colors.textSecondary
                : '#555';

    const textColor = completed
        ? colors.neonGreen
        : unlocked
            ? colors.textPrimary
            : '#555';

    return (
        <Animated.View
            style={[
                { transform: [{ scale: scaleAnim }], opacity: scaleAnim },
            ]}
        >
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.levelCard,
                    { backgroundColor: bgColor },
                    pressed && unlocked && styles.levelCardPressed,
                ]}
            >
                <Animated.View
                    style={[
                        styles.levelCardBorder,
                        { borderColor: borderColor as any },
                        isCurrent && styles.levelCardCurrent,
                    ]}
                />
                <View style={styles.levelIconWrap}>
                    <Ionicons name={iconName} size={36} color={iconColor} />
                </View>
                <Text style={[styles.levelNumber, { color: textColor }]}>{level}</Text>
                <Text style={[styles.levelLabel, { color: textColor }]}>
                    {completed ? '✓' : !unlocked ? '🔒' : '▶'}
                </Text>
            </Pressable>
        </Animated.View>
    );
}

// ---------------------------------------------------------------------------
// Main Screen
// ---------------------------------------------------------------------------

export function LevelSelectScreen({
    language,
    categoryLabel,
    difficultyLabel,
    isLevelUnlocked,
    isLevelCompleted,
    maxLevels,
    onSelectLevel,
    onBack,
    onGoHome,
}: LevelSelectScreenProps) {
    const t = (key: any) => getTranslation(language, key);
    const effectiveLevels = Math.min(maxLevels, LEVELS_PER_SUBCATEGORY);

    const levels = Array.from({ length: effectiveLevels }, (_, i) => i + 1);

    // Find current playable level for header display
    const currentLevel =
        levels.find((l) => isLevelUnlocked(l) && !isLevelCompleted(l)) ?? effectiveLevels;

    const completedCount = levels.filter((l) => isLevelCompleted(l)).length;

    function handleLevelPress(level: number) {
        if (!isLevelUnlocked(level)) {
            showToast(t('levelLocked'));
            return;
        }
        onSelectLevel(level);
    }

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
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{t('selectLevel')}</Text>
                    <Text style={styles.subtitle}>
                        {categoryLabel} • {difficultyLabel}
                    </Text>
                    <View style={styles.progressRow}>
                        <Ionicons name="trophy" size={16} color={colors.gold} />
                        <Text style={styles.progressText}>
                            {completedCount} / {effectiveLevels}
                        </Text>
                    </View>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarOuter}>
                    <View
                        style={[
                            styles.progressBarInner,
                            {
                                width: `${(completedCount / effectiveLevels) * 100}%`,
                            },
                        ]}
                    />
                </View>

                {/* Level Grid */}
                <View style={styles.grid}>
                    {levels.map((level, index) => {
                        const unlocked = isLevelUnlocked(level);
                        const completed = isLevelCompleted(level);
                        const isCurrent = unlocked && !completed;

                        return (
                            <LevelCard
                                key={level}
                                level={level}
                                unlocked={unlocked}
                                completed={completed}
                                isCurrent={isCurrent}
                                onPress={() => handleLevelPress(level)}
                                index={index}
                            />
                        );
                    })}
                </View>

                {/* Home Button */}
                <Pressable
                    onPress={onGoHome}
                    style={({ pressed }) => [
                        styles.homeButton,
                        pressed && styles.homeButtonPressed,
                    ]}
                >
                    <Ionicons name="home-outline" size={20} color={colors.textSecondary} />
                    <Text style={styles.homeButtonText}>{t('home')}</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgDark,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingTop: spacing.xxl + spacing.lg,
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.gold,
    },
    progressBarOuter: {
        height: 6,
        backgroundColor: colors.muted,
        borderRadius: 3,
        marginBottom: spacing.xl,
        overflow: 'hidden',
    },
    progressBarInner: {
        height: 6,
        backgroundColor: colors.neonGreen,
        borderRadius: 3,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    levelCard: {
        width: 95,
        height: 110,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    levelCardBorder: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
    },
    levelCardCurrent: {
        borderWidth: 2.5,
    },
    levelCardPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.95 }],
    },
    levelIconWrap: {
        marginBottom: 4,
    },
    levelNumber: {
        fontSize: 22,
        fontWeight: '800',
    },
    levelLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    homeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        marginTop: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.card,
    },
    homeButtonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    homeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
    },
});
