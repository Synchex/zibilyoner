import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Contexts
import { CreditProvider, useCredits } from './src/context/CreditContext';
import { YuanProvider, useYuan } from './src/context/YuanContext';
import { GameHistoryProvider, useGameHistory } from './src/context/GameHistoryContext';
import { LanguageProvider, useLanguage } from './src/context/LanguageContext';
import { BalanceProvider, useBalance } from './src/context/BalanceContext';

// Screens
import { HomeScreen } from './src/screens/HomeScreen';
import { CategorySelection, Category } from './src/screens/CategorySelection';
import { DifficultySelection, Difficulty } from './src/screens/DifficultySelection';
import { SportsSubcategoryScreen, SportsSubcategory } from './src/screens/SportsSubcategoryScreen';
import { HistorySubcategoryScreen, HistorySubcategory } from './src/screens/HistorySubcategoryScreen';
import { QuestionScreen, WrongAnswerSnapshot } from './src/screens/QuestionScreen';
import { LossScreen } from './src/screens/LossScreen';
import { ResultsScreen } from './src/screens/ResultsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { GameHistoryScreen } from './src/screens/GameHistoryScreen';
import { QuestionDatabaseScreen } from './src/screens/QuestionDatabaseScreen';
import { SpeedRoundScreen } from './src/screens/SpeedRoundScreen';
import { DailyChallengeScreen } from './src/screens/DailyChallengeScreen';
import { LevelSelectScreen } from './src/screens/LevelSelectScreen';
import { MillionaireModeScreen } from './src/screens/MillionaireModeScreen';

// Modals
import { ContinueModal } from './src/components/modals/ContinueModal';
import { InsufficientCreditsModal } from './src/components/modals/InsufficientCreditsModal';

// Data
import { Language, getTranslation } from './src/data/translations';
import { getQuestions, getQuestionsForLevel, getAvailableLevelCount, Question, difficultyMap, categoryMap } from './src/data/questionBank';
import { useProgress } from './src/context/ProgressContext';
import { ProgressProvider } from './src/context/ProgressContext';
import {
  QUESTIONS_PER_LEVEL,
  getSubcategoryQuestionCount,
  getSubcategoryTotalLevels,
  getSubcategoryProgressData,
} from './src/utils/progressHelpers';
import { getCurrentPrize } from './src/data/prizeLadder';

// Styles
import { colors } from './src/styles/theme';

// Hooks
import { useJokers } from './src/hooks/useJokers';

const Tab = createBottomTabNavigator();

type GameState =
  | 'home'
  | 'category'
  | 'sports_subcategory'
  | 'history_subcategory'
  | 'difficulty'
  | 'playing'
  | 'level_select'
  | 'level_playing'
  | 'speed_round'
  | 'daily_challenge'
  | 'millionaire'
  | 'loss'
  | 'results';

const STORAGE_KEY_LANGUAGE = 'appLanguage';
const TOTAL_QUESTIONS = 12;

function GameTabScreen({ navigation }: any) {
  const { credits, spendCredits, addCredits, canAfford, gameCost } = useCredits();
  const { addYuan, resetRunYuan } = useYuan();
  const { startNewRun, recordAnswer, finalizeRun } = useGameHistory();
  const { language } = useLanguage();

  const [gameState, setGameState] = useState<GameState>('home');

  // Home tab'a her geldiğinde veya basıldığında ana ekrana dön
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e: any) => {
      // Home'a basıldığında her zaman ana ekrana dön
      setGameState('home');
    });

    return unsubscribe;
  }, [navigation]);

  // Tab focus değiştiğinde de kontrol et
  useFocusEffect(
    useCallback(() => {
      setGameState('home');
    }, [])
  );
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [continueUsed, setContinueUsed] = useState(false);
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);
  const [wrongSnapshot, setWrongSnapshot] = useState<WrongAnswerSnapshot | null>(null);
  const [selectedSportsSubcategory, setSelectedSportsSubcategory] = useState<SportsSubcategory | undefined>(undefined);
  const [selectedHistorySubcategory, setSelectedHistorySubcategory] = useState<HistorySubcategory | undefined>(undefined);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('general_default');

  // Joker system
  const {
    jokerState,
    useFiftyFifty,
    useExtraTime,
    useAiHint,
    resetJokers,
  } = useJokers();

  // Progress context
  const {
    progress,
    getSubcategoryProgress: getSubProgress,
    completeLevel: completeLevelInCtx,
  } = useProgress();


  const handleStartGame = () => {
    if (!canAfford(gameCost)) {
      setShowInsufficientCreditsModal(true);
      return;
    }
    setGameState('category');
  };

  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    if (category === 'sports') {
      setGameState('sports_subcategory');
    } else if (category === 'history') {
      setGameState('history_subcategory');
    } else {
      // general or all → go straight to level select
      setSelectedSportsSubcategory(undefined);
      setSelectedHistorySubcategory(undefined);
      const subId = category === 'all' ? 'all_default' : 'general_default';
      setSelectedSubcategoryId(subId);
      setGameState('level_select');
    }
  };

  const handleSelectSportsSubcategory = (subcategory: SportsSubcategory) => {
    setSelectedSportsSubcategory(subcategory);
    setSelectedHistorySubcategory(undefined);
    setSelectedSubcategoryId(subcategory);
    setGameState('level_select');
  };

  const handleSelectHistorySubcategory = (subcategory: HistorySubcategory) => {
    setSelectedHistorySubcategory(subcategory);
    setSelectedSportsSubcategory(undefined);
    setSelectedSubcategoryId(subcategory);
    setGameState('level_select');
  };

  const handleSelectLevel = (level: number) => {
    if (!spendCredits(gameCost)) {
      setShowInsufficientCreditsModal(true);
      return;
    }

    setSelectedLevel(level);

    const questionCategory = selectedCategory === 'all'
      ? undefined
      : categoryMap[selectedCategory as keyof typeof categoryMap];

    // Level mode: no difficulty filter — all difficulties mixed
    const levelQuestions = getQuestionsForLevel({
      category: questionCategory,
      subcategory: selectedSportsSubcategory,
      historySubcategory: language === 'en' ? selectedHistorySubcategory as any : undefined,
      historySubcategoryTR: language === 'tr' ? selectedHistorySubcategory as any : undefined,
      language,
      level,
      questionsPerLevel: QUESTIONS_PER_LEVEL,
    });

    setQuestions(levelQuestions);
    setCurrentQuestionIndex(0);
    setCoins(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setContinueUsed(false);
    setWrongSnapshot(null);
    resetRunYuan();
    startNewRun(selectedCategory, 'mixed', QUESTIONS_PER_LEVEL);
    resetJokers();

    setGameState('level_playing');
  };

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    if (!spendCredits(gameCost)) {
      setShowInsufficientCreditsModal(true);
      return;
    }

    setSelectedDifficulty(difficulty);

    // Normalize difficulty for the question bank
    const questionDifficulty = difficulty === 'mixed' ? 'mixed' : difficultyMap[difficulty as keyof typeof difficultyMap] || 'orta';

    // Map English category names to Turkish for the question bank
    const questionCategory = selectedCategory === 'all'
      ? undefined
      : categoryMap[selectedCategory as keyof typeof categoryMap];

    // Get questions for the game
    const gameQuestions = getQuestions({
      category: questionCategory,
      difficulty: difficulty === 'mixed' ? undefined : questionDifficulty,
      subcategory: selectedSportsSubcategory,
      historySubcategory: language === 'en' ? selectedHistorySubcategory as any : undefined,
      historySubcategoryTR: language === 'tr' ? selectedHistorySubcategory as any : undefined,
      limit: TOTAL_QUESTIONS,
      language,
    });

    setQuestions(gameQuestions);
    setCurrentQuestionIndex(0);
    setCoins(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectCount(0);
    setContinueUsed(false);
    setWrongSnapshot(null);
    resetRunYuan();

    // Start game history tracking
    startNewRun(selectedCategory, difficulty, TOTAL_QUESTIONS);

    // Reset jokers for new game
    resetJokers();

    setGameState('playing');
  };

  const handleAnswer = (isCorrect: boolean, snapshot?: WrongAnswerSnapshot) => {
    const currentQuestion = questions[currentQuestionIndex];

    // Record in history
    recordAnswer({
      questionId: String(currentQuestion.id),
      questionIndex: currentQuestionIndex + 1,
      questionText: currentQuestion.question,
      selectedIndex: snapshot?.userAnswerIndex ?? -1,
      correctIndex: currentQuestion.correctAnswer,
      isCorrect,
      userAnswer: snapshot?.userAnswer ?? currentQuestion.answers[currentQuestion.correctAnswer],
      correctAnswer: currentQuestion.answers[currentQuestion.correctAnswer],
    });

    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(Math.max(maxStreak, newStreak));
      setCorrectCount(prev => prev + 1);

      const prize = getCurrentPrize(currentQuestionIndex);
      addYuan(prize);
      setCoins(prev => prev + prize);
    } else {
      setStreak(0);
      if (snapshot) {
        setWrongSnapshot(snapshot);
      }
    }
  };

  const handleNextQuestion = () => {
    const isLevelMode = gameState === 'level_playing';
    const totalQs = isLevelMode ? QUESTIONS_PER_LEVEL : TOTAL_QUESTIONS;

    if (currentQuestionIndex + 1 >= questions.length) {
      // Game / level complete
      if (isLevelMode) {
        completeLevelInCtx(selectedCategory, selectedSubcategoryId, selectedLevel);
        finalizeRun('completed', coins);
        setGameState('level_select');
      } else {
        const won = correctCount === totalQs;
        finalizeRun(won ? 'completed' : 'lost', coins);
        setGameState('results');
      }
    } else if (!wrongSnapshot && !continueUsed) {
      // Continue to next question
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (wrongSnapshot) {
      if (isLevelMode) {
        // In level mode, wrong answer ends the level attempt (back to level select)
        finalizeRun('lost', coins);
        setGameState('level_select');
      } else {
        // Wrong answer - show loss screen
        const prize = currentQuestionIndex > 0 ? getCurrentPrize(currentQuestionIndex - 1) : 0;
        finalizeRun('lost', prize);
        setGameState('loss');
      }
    }
  };

  const handleContinueRequest = () => {
    if (!continueUsed) {
      setShowContinueModal(true);
    } else {
      const prize = currentQuestionIndex > 0 ? getCurrentPrize(currentQuestionIndex - 1) : 0;
      finalizeRun('lost', prize);
      setGameState('loss');
    }
  };

  const handleWatchAd = () => {
    // Simulate watching an ad
    setContinueUsed(true);
    setShowContinueModal(false);
    setWrongSnapshot(null);
    // Keep the same question for retry
  };

  const handleDeclineContinue = () => {
    setShowContinueModal(false);
    const prize = currentQuestionIndex > 0 ? getCurrentPrize(currentQuestionIndex - 1) : 0;
    finalizeRun('lost', prize);
    setGameState('loss');
  };

  const handleWithdraw = (cashOutAmount: number) => {
    addYuan(cashOutAmount);
    finalizeRun('withdrawn', cashOutAmount);
    setGameState('home');
  };

  const handleTryAgain = () => {
    setGameState('category');
  };

  const handleGoHome = () => {
    setGameState('home');
  };

  const handlePlayAgain = () => {
    setGameState('category');
  };

  // Render current game state
  const renderGameContent = () => {
    switch (gameState) {
      case 'home':
        return (
          <HomeScreen
            onStartGame={handleStartGame}
            onMillionaireMode={() => setGameState('millionaire')}
            onSpeedRound={() => setGameState('speed_round')}
            onDailyChallenge={() => setGameState('daily_challenge')}
            language={language}
          />
        );

      case 'category':
        return (
          <CategorySelection
            onSelectCategory={handleSelectCategory}
            onBack={() => setGameState('home')}
            language={language}
          />
        );

      case 'sports_subcategory':
        return (
          <SportsSubcategoryScreen
            onSelectSubcategory={handleSelectSportsSubcategory}
            onBack={() => setGameState('category')}
            language={language}
          />
        );

      case 'history_subcategory':
        return (
          <HistorySubcategoryScreen
            onSelectSubcategory={handleSelectHistorySubcategory}
            onBack={() => setGameState('category')}
            language={language}
          />
        );

      case 'difficulty':
        return (
          <DifficultySelection
            onSelectDifficulty={handleSelectDifficulty}
            onSelectLevelMode={handleSelectDifficulty}
            onBack={() => setGameState('category')}
            onGoHome={() => setGameState('home')}
            language={language}
            category={selectedCategory}
          />
        );

      case 'level_select': {
        const qCount = getSubcategoryQuestionCount(
          selectedCategory,
          selectedSubcategoryId,
          language,
        );
        const maxLevels = getSubcategoryTotalLevels(qCount);
        const subProgress = getSubProgress(selectedCategory, selectedSubcategoryId);

        const t = (key: any) => getTranslation(language, key);
        const categoryLabel = selectedCategory === 'all'
          ? t('allCategories')
          : selectedCategory === 'general'
            ? t('generalKnowledge')
            : selectedCategory === 'history'
              ? t('history')
              : t('sports');
        const diffLabel = selectedSubcategoryId;

        const isUnlocked = (lvl: number) => lvl <= subProgress.unlockedLevel;
        const isCompleted = (lvl: number) => lvl <= subProgress.completedLevels;

        // Back navigation: return to subcategory screen or category screen
        const handleBackFromLevels = () => {
          if (selectedCategory === 'sports') setGameState('sports_subcategory');
          else if (selectedCategory === 'history') setGameState('history_subcategory');
          else setGameState('category');
        };

        return (
          <LevelSelectScreen
            language={language}
            categoryLabel={categoryLabel}
            difficultyLabel={diffLabel}
            isLevelUnlocked={isUnlocked}
            isLevelCompleted={isCompleted}
            maxLevels={maxLevels}
            onSelectLevel={handleSelectLevel}
            onBack={handleBackFromLevels}
            onGoHome={() => setGameState('home')}
          />
        );
      }

      case 'level_playing':
        if (questions.length === 0) {
          return <View style={styles.loading}><ActivityIndicator size="large" color={colors.purple} /></View>;
        }
        return (
          <QuestionScreen
            key={`lq-${currentQuestionIndex}-${questions[currentQuestionIndex]?.id}`}
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={QUESTIONS_PER_LEVEL}
            coins={coins}
            streak={streak}
            difficulty={selectedDifficulty}
            onAnswer={handleAnswer}
            onNextQuestion={handleNextQuestion}
            onContinueRequest={handleContinueRequest}
            onWithdraw={handleWithdraw}
            continueUsed={continueUsed}
            language={language}
            jokerState={jokerState}
            onUseFiftyFifty={useFiftyFifty}
            onUseExtraTime={useExtraTime}
            onUseAiHint={useAiHint}
          />
        );

      case 'speed_round':
        return (
          <SpeedRoundScreen
            language={language}
            onComplete={(correct, total, earned) => {
              // After speed round, go back to home
              setGameState('home');
            }}
            onGoHome={() => setGameState('home')}
          />
        );

      case 'daily_challenge':
        return (
          <DailyChallengeScreen
            language={language}
            onComplete={(correct, total, earned) => {
              setGameState('home');
            }}
            onGoHome={() => setGameState('home')}
          />
        );

      case 'millionaire':
        return (
          <MillionaireModeScreen
            language={language}
            onGoHome={() => setGameState('home')}
          />
        );

      case 'playing':
        if (questions.length === 0) {
          return <View style={styles.loading}><ActivityIndicator size="large" color={colors.purple} /></View>;
        }
        return (
          <QuestionScreen
            key={`q-${currentQuestionIndex}-${questions[currentQuestionIndex]?.id}`}
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
            coins={coins}
            streak={streak}
            difficulty={selectedDifficulty}
            onAnswer={handleAnswer}
            onNextQuestion={handleNextQuestion}
            onContinueRequest={handleContinueRequest}
            onWithdraw={handleWithdraw}
            continueUsed={continueUsed}
            language={language}
            jokerState={jokerState}
            onUseFiftyFifty={useFiftyFifty}
            onUseExtraTime={useExtraTime}
            onUseAiHint={useAiHint}
          />
        );

      case 'loss':
        return wrongSnapshot ? (
          <LossScreen
            correctAnswer={wrongSnapshot.correctAnswer}
            userAnswer={wrongSnapshot.userAnswer}
            correctCount={correctCount}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={TOTAL_QUESTIONS}
            coinsEarned={coins}
            prizeWon={currentQuestionIndex > 0 ? getCurrentPrize(currentQuestionIndex - 1) : 0}
            onTryAgain={handleTryAgain}
            onGoHome={handleGoHome}
            language={language}
            questionId={String(wrongSnapshot.questionId)}
            questionText={wrongSnapshot.questionText}
            choices={wrongSnapshot.answers}
            category={wrongSnapshot.category}
            difficulty={wrongSnapshot.difficulty}
          />
        ) : null;

      case 'results':
        return (
          <ResultsScreen
            totalQuestions={TOTAL_QUESTIONS}
            correctAnswers={correctCount}
            coins={coins}
            maxStreak={maxStreak}
            onPlayAgain={handlePlayAgain}
            language={language}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderGameContent()}

      <ContinueModal
        isOpen={showContinueModal}
        onWatchAd={handleWatchAd}
        onDecline={handleDeclineContinue}
        language={language}
      />

      <InsufficientCreditsModal
        isOpen={showInsufficientCreditsModal}
        onClose={() => setShowInsufficientCreditsModal(false)}
        language={language}
      />
    </View>
  );
}

function HistoryTabScreen() {
  const { language } = useLanguage();
  return <GameHistoryScreen language={language} />;
}

function QuestionsTabScreen() {
  const { language } = useLanguage();
  return <QuestionDatabaseScreen language={language} />;
}

function SettingsTabScreen() {
  const { language, setLanguage } = useLanguage();
  return <SettingsScreen language={language} onLanguageChange={setLanguage} />;
}

function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Questions') {
            iconName = focused ? 'help-circle' : 'help-circle-outline';
          } else {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={GameTabScreen} />
      <Tab.Screen name="History" component={HistoryTabScreen} />
      <Tab.Screen name="Questions" component={QuestionsTabScreen} />
      <Tab.Screen name="Settings" component={SettingsTabScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <BalanceProvider>
        <CreditProvider>
          <YuanProvider>
            <GameHistoryProvider>
              <ProgressProvider>
                <NavigationContainer>
                  <StatusBar barStyle="light-content" backgroundColor={colors.bgDark} />
                  <AppNavigator />
                </NavigationContainer>
              </ProgressProvider>
            </GameHistoryProvider>
          </YuanProvider>
        </CreditProvider>
      </BalanceProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDark,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgDark,
  },
});
