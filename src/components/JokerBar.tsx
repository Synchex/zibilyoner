import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing } from '../styles/theme';
import { Language } from '../data/translations';
import { JokerButton } from './JokerButton';
import { JokerState } from '../hooks/useJokers';

interface JokerBarProps {
    jokerState: JokerState;
    onFiftyFifty: () => void;
    onExtraTime: () => void;
    onAiHint: () => void;
    disabled: boolean;
    language: Language;
}

export function JokerBar({
    jokerState,
    onFiftyFifty,
    onExtraTime,
    onAiHint,
    disabled,
    language,
}: JokerBarProps) {
    return (
        <View style={styles.container}>
            <JokerButton
                type="fiftyFifty"
                onPress={onFiftyFifty}
                disabled={disabled}
                used={jokerState.fiftyFifty.used}
                language={language}
            />
            <JokerButton
                type="extraTime"
                onPress={onExtraTime}
                disabled={disabled}
                used={jokerState.extraTime.used}
                language={language}
            />
            <JokerButton
                type="aiHint"
                onPress={onAiHint}
                disabled={disabled}
                used={jokerState.aiHint.used}
                language={language}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.xs,
    },
});
