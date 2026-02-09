import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../styles/theme';
import { PRIZE_LADDER, formatPrize } from '../data/prizeLadder';

interface PrizeLadderProps {
    currentQuestionNumber: number;
}

export function PrizeLadder({ currentQuestionNumber }: PrizeLadderProps) {
    return (
        <View style={styles.container}>
            {[...PRIZE_LADDER].reverse().map((item, index) => {
                const questionNum = PRIZE_LADDER.length - index;
                const isCurrent = questionNum === currentQuestionNumber;
                const isCompleted = questionNum < currentQuestionNumber;

                return (
                    <View
                        key={item.question}
                        style={[
                            styles.row,
                            isCurrent && styles.rowCurrent,
                            isCompleted && styles.rowCompleted,
                        ]}
                    >
                        <Text style={[
                            styles.questionNum,
                            isCurrent && styles.textCurrent,
                            isCompleted && styles.textCompleted,
                        ]}>
                            Q{questionNum}
                        </Text>
                        <Text style={[
                            styles.prize,
                            isCurrent && styles.textCurrent,
                            isCompleted && styles.textCompleted,
                        ]}>
                            ¥ {formatPrize(item.prize)}
                        </Text>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    rowCurrent: {
        backgroundColor: 'rgba(212, 175, 55, 0.2)',
        borderWidth: 1,
        borderColor: colors.gold,
    },
    rowCompleted: {
        opacity: 0.5,
    },
    questionNum: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    prize: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
    },
    textCurrent: {
        color: colors.gold,
    },
    textCompleted: {
        color: colors.correct,
    },
});
