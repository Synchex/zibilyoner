import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';
import { useGameHistory, GameRun } from '../context/GameHistoryContext';
import { formatPrize } from '../data/prizeLadder';

interface GameHistoryScreenProps {
    language: Language;
}

export function GameHistoryScreen({ language }: GameHistoryScreenProps) {
    const t = (key: any) => getTranslation(language, key);
    const { runs, isLoading } = useGameHistory();

    const getStatusIcon = (status: GameRun['status']) => {
        switch (status) {
            case 'completed':
                return <Ionicons name="trophy" size={20} color={colors.gold} />;
            case 'lost':
                return <Ionicons name="close-circle" size={20} color={colors.wrong} />;
            case 'withdrawn':
                return <Ionicons name="exit" size={20} color={colors.neonGreen} />;
            default:
                return <Ionicons name="help-circle" size={20} color={colors.textSecondary} />;
        }
    };

    const getStatusLabel = (status: GameRun['status']) => {
        if (language === 'tr') {
            switch (status) {
                case 'completed': return 'Tamamlandı';
                case 'lost': return 'Kaybedildi';
                case 'withdrawn': return 'Çekildi';
                default: return 'Bilinmiyor';
            }
        }
        switch (status) {
            case 'completed': return 'Completed';
            case 'lost': return 'Lost';
            case 'withdrawn': return 'Withdrawn';
            default: return 'Unknown';
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderItem = ({ item }: { item: GameRun }) => (
        <View style={styles.runCard}>
            <View style={styles.runHeader}>
                {getStatusIcon(item.status)}
                <Text style={styles.runStatus}>{getStatusLabel(item.status)}</Text>
                <Text style={styles.runDate}>{formatDate(item.timestamp)}</Text>
            </View>

            <View style={styles.runStats}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>
                        {language === 'tr' ? 'Doğru' : 'Correct'}
                    </Text>
                    <Text style={styles.statValue}>{item.correctCount}/{item.totalQuestions}</Text>
                </View>

                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>
                        {language === 'tr' ? 'Kazanılan' : 'Won'}
                    </Text>
                    <Text style={styles.statValueGold}>¥ {formatPrize(item.prizeWon)}</Text>
                </View>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.bgDark, colors.bgDarker, colors.bgDark]}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.header}>
                <Text style={styles.title}>{t('gameHistory')}</Text>
            </View>

            {runs.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="time-outline" size={64} color={colors.textSecondary} />
                    <Text style={styles.emptyText}>
                        {language === 'tr' ? 'Henüz oyun yok' : 'No games yet'}
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={runs}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.runId}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgDark,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl + spacing.lg,
        paddingBottom: spacing.md,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    loadingText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
    listContent: {
        padding: spacing.lg,
        paddingTop: 0,
    },
    runCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    runHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    runStatus: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
    },
    runDate: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    runStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: colors.textSecondary,
        fontSize: 12,
        marginBottom: spacing.xs,
    },
    statValue: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '700',
    },
    statValueGold: {
        color: colors.gold,
        fontSize: 16,
        fontWeight: '700',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
        marginTop: spacing.md,
    },
});
