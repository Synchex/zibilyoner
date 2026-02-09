import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Language, getTranslation } from '../data/translations';
import { colors, borderRadius, spacing } from '../styles/theme';
import { getActiveQuestionBank, Question } from '../data/questionBank';

interface QuestionDatabaseScreenProps {
    language: Language;
}

export function QuestionDatabaseScreen({ language }: QuestionDatabaseScreenProps) {
    const t = (key: any) => getTranslation(language, key);
    const [searchQuery, setSearchQuery] = useState('');

    const questions = getActiveQuestionBank(language);

    const filteredQuestions = questions.filter(q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'kolay': return colors.neonGreen;
            case 'orta': return '#f59e0b';
            case 'zor': return colors.wrong;
            default: return colors.textSecondary;
        }
    };

    const getDifficultyLabel = (difficulty: string) => {
        if (language === 'tr') {
            switch (difficulty) {
                case 'kolay': return 'Kolay';
                case 'orta': return 'Orta';
                case 'zor': return 'Zor';
                default: return difficulty;
            }
        }
        switch (difficulty) {
            case 'kolay': return 'Easy';
            case 'orta': return 'Medium';
            case 'zor': return 'Hard';
            default: return difficulty;
        }
    };

    const renderItem = ({ item }: { item: Question }) => (
        <View style={styles.questionCard}>
            <Text style={styles.questionText}>{item.question}</Text>

            <View style={styles.answersList}>
                {item.answers.map((answer, index) => (
                    <View
                        key={index}
                        style={[
                            styles.answerRow,
                            index === item.correctAnswer && styles.correctAnswerRow,
                        ]}
                    >
                        <Text style={[
                            styles.answerLetter,
                            index === item.correctAnswer && styles.correctAnswerLetter,
                        ]}>
                            {String.fromCharCode(65 + index)}
                        </Text>
                        <Text style={[
                            styles.answerText,
                            index === item.correctAnswer && styles.correctAnswerText,
                        ]}>
                            {answer}
                        </Text>
                        {index === item.correctAnswer && (
                            <Ionicons name="checkmark-circle" size={16} color={colors.correct} />
                        )}
                    </View>
                ))}
            </View>

            <View style={styles.metaRow}>
                <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor(item.difficulty)}20` }]}>
                    <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
                        {getDifficultyLabel(item.difficulty)}
                    </Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[colors.bgDark, colors.bgDarker, colors.bgDark]}
                style={StyleSheet.absoluteFillObject}
            />

            <View style={styles.header}>
                <Text style={styles.title}>{t('questionDatabase')}</Text>
                <Text style={styles.count}>{questions.length} questions</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color={colors.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder={t('searchQuestions')}
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredQuestions.slice(0, 50)} // Limit to 50 for performance
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {language === 'tr' ? 'Soru bulunamadı' : 'No questions found'}
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgDark,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xxl + spacing.lg,
        paddingBottom: spacing.md,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
    },
    count: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchInput: {
        flex: 1,
        color: colors.textPrimary,
        fontSize: 16,
        paddingVertical: spacing.md,
        marginLeft: spacing.sm,
    },
    listContent: {
        padding: spacing.lg,
        paddingTop: 0,
        paddingBottom: 100,
    },
    questionCard: {
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    questionText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: spacing.md,
        lineHeight: 24,
    },
    answersList: {
        marginBottom: spacing.md,
    },
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.xs,
    },
    correctAnswerRow: {
        backgroundColor: 'rgba(0,255,136,0.1)',
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.xs,
        marginHorizontal: -spacing.xs,
    },
    answerLetter: {
        color: colors.textSecondary,
        fontSize: 12,
        fontWeight: '600',
        width: 20,
    },
    correctAnswerLetter: {
        color: colors.correct,
    },
    answerText: {
        flex: 1,
        color: colors.textSecondary,
        fontSize: 14,
    },
    correctAnswerText: {
        color: colors.correct,
        fontWeight: '600',
    },
    metaRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    difficultyBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: 16,
    },
});
