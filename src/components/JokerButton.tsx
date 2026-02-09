import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius, spacing } from '../styles/theme';
import { Language, getTranslation } from '../data/translations';
import { JokerType } from '../hooks/useJokers';

interface JokerButtonProps {
    type: JokerType;
    onPress: () => void;
    disabled: boolean;
    used: boolean;
    language: Language;
}

const jokerConfig: Record<JokerType, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
    fiftyFifty: { icon: 'cut-outline', color: colors.purple },
    extraTime: { icon: 'time-outline', color: colors.neonGreen },
    aiHint: { icon: 'bulb-outline', color: colors.gold },
};

export function JokerButton({ type, onPress, disabled, used, language }: JokerButtonProps) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    const t = (key: any) => getTranslation(language, key);
    const config = jokerConfig[type];

    const getLabel = (): string => {
        if (used) return t('jokerUsed');
        switch (type) {
            case 'fiftyFifty':
                return t('jokerFiftyFifty');
            case 'extraTime':
                return t('jokerExtraTime');
            case 'aiHint':
                return t('jokerAiHint');
            default:
                return '';
        }
    };

    const handlePress = () => {
        if (disabled || used) return;

        // Play activation animation
        Animated.parallel([
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 0.5,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        onPress();
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ scale: scaleAnim }],
                    opacity: used ? 0.4 : opacityAnim,
                },
            ]}
        >
            <Pressable
                onPress={handlePress}
                disabled={disabled || used}
                style={[
                    styles.button,
                    { borderColor: used ? colors.border : config.color },
                    used && styles.buttonUsed,
                ]}
            >
                <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
                    <Ionicons
                        name={config.icon}
                        size={20}
                        color={used ? colors.textSecondary : config.color}
                    />
                </View>
                <Text
                    style={[
                        styles.label,
                        { color: used ? colors.textSecondary : config.color },
                    ]}
                    numberOfLines={1}
                >
                    {getLabel()}
                </Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minWidth: 90,
    },
    button: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        gap: spacing.xs,
        minHeight: 70,
    },
    buttonUsed: {
        backgroundColor: colors.muted,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 11,
        fontWeight: '700',
        textAlign: 'center',
    },
});
