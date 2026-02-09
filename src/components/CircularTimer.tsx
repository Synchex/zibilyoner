import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../styles/theme';

interface CircularTimerProps {
    duration: number;
    onComplete: () => void;
    size: number;
    isLocked?: boolean;
}

export function CircularTimer({ duration, onComplete, size, isLocked }: CircularTimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const progressAnim = useRef(new Animated.Value(1)).current;
    const hasCompletedRef = useRef(false);
    const onCompleteRef = useRef(onComplete);
    const isLockedRef = useRef(isLocked);

    // Keep refs updated
    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        isLockedRef.current = isLocked;
    }, [isLocked]);

    useEffect(() => {
        // Reset on mount
        setTimeLeft(duration);
        hasCompletedRef.current = false;
        progressAnim.setValue(1);

        // Animate progress
        Animated.timing(progressAnim, {
            toValue: 0,
            duration: duration * 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();

        // Countdown interval
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    if (!hasCompletedRef.current && !isLockedRef.current) {
                        hasCompletedRef.current = true;
                        onCompleteRef.current();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [duration]); // Only depend on duration

    const getColor = () => {
        const ratio = timeLeft / duration;
        if (ratio > 0.5) return colors.neonGreen;
        if (ratio > 0.25) return '#f59e0b';
        return colors.wrong;
    };

    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Background circle */}
            <View style={[styles.backgroundCircle, {
                width: size - strokeWidth * 2,
                height: size - strokeWidth * 2,
                borderRadius: (size - strokeWidth * 2) / 2,
            }]} />

            {/* Timer text */}
            <Text style={[styles.timerText, { color: getColor() }]}>{timeLeft}</Text>

            {/* Progress ring (simplified - just a border for now) */}
            <View style={[styles.progressRing, {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: getColor(),
                opacity: timeLeft / duration,
            }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundCircle: {
        position: 'absolute',
        backgroundColor: colors.card,
    },
    timerText: {
        fontSize: 24,
        fontWeight: '800',
        zIndex: 1,
    },
    progressRing: {
        position: 'absolute',
    },
});
