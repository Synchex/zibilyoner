import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../styles/theme';

interface HeaderBackButtonProps {
    onPress: () => void;
}

export function HeaderBackButton({ onPress }: HeaderBackButtonProps) {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="chevron-back" size={28} color={colors.gold} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: spacing.xxl,
        left: spacing.md,
        zIndex: 100,
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.3)',
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
});
