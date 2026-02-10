export type Language = 'en' | 'tr';

export interface Translations {
  // Home Screen
  appTitle: string;
  appSubtitle: string;
  startGame: string;

  // Category Selection
  chooseCategory: string;
  selectBattlefield: string;
  generalKnowledge: string;
  generalKnowledgeDesc: string;
  history: string;
  historyDesc: string;
  sports: string;
  sportsDesc: string;
  allCategories: string;
  allCategoriesDesc: string;

  // Difficulty Selection
  selectDifficulty: string;
  howBrave: string;
  easy: string;
  easyDesc: string;
  medium: string;
  mediumDesc: string;
  hard: string;
  hardDesc: string;

  mixed: string;
  mixedDesc: string;

  // Question Screen
  questionOf: string;
  correct: string;
  wrongAnswer: string;
  timeUp: string;

  // Results Screen
  perfectScore: string;
  excellent: string;
  greatJob: string;
  goodEffort: string;
  keepTrying: string;
  accuracy: string;
  correctAnswers: string;
  coinsEarned: string;
  bestStreak: string;
  playAgain: string;

  // Settings
  settings: string;
  language: string;
  close: string;
  english: string;
  turkish: string;

  // Credits
  credits: string;
  dailyRefillIn: string;
  notEnoughCredits: string;
  needCredits: string;
  getMoreCredits: string;
  watchAds: string;
  purchaseCoins: string;
  comingSoon: string;
  gameCost: string;
  currentCredits: string;

  // Bottom Tab Navigation
  home: string;
  gameHistory: string;
  leaderboard: string;
  database: string;

  // Question Database
  questionDatabase: string;
  searchQuestions: string;
  allDifficulties: string;

  // Sports Subcategory
  chooseSportsCategory: string;
  selectSportsField: string;
  football: string;
  footballDesc: string;
  basketball: string;
  basketballDesc: string;
  turkishSports: string;
  turkishSportsDesc: string;
  legendsRecords: string;
  legendsRecordsDesc: string;
  // Language-specific labels
  generalSports: string;
  generalSportsDesc: string;
  generalFootball: string;
  generalFootballDesc: string;
  footballLabel: string;
  // History Subcategory (EN only)
  chooseHistoryCategory: string;
  selectHistoryEra: string;
  historyModern: string;
  historyModernDesc: string;
  historyLegendsEmpires: string;
  historyLegendsEmpiresDesc: string;
  historyAncientEarly: string;
  historyAncientEarlyDesc: string;
  historyAll: string;
  historyAllDesc: string;
  // History Subcategory (TR only)
  historyTrTurkish: string;
  historyTrTurkishDesc: string;
  historyTrModern: string;
  historyTrModernDesc: string;
  historyTrAncientAnatolia: string;
  historyTrAncientAnatoliaDesc: string;
  historyTrMixed: string;
  historyTrMixedDesc: string;
  // Withdraw feature
  withdraw: string;
  withdrawTitle: string;
  withdrawBody: string;
  withdrawCancel: string;
  withdrawConfirm: string;
  // Joker system
  jokerFiftyFifty: string;
  jokerExtraTime: string;
  jokerAiHint: string;
  jokerUsed: string;
  hintPrefix: string;
  // Level progression
  levelMode: string;
  classicMode: string;
  classicModeDesc: string;
  levelModeDesc: string;
  selectLevel: string;
  levelLabel: string;
  levelLocked: string;
  levelComplete: string;
  levelProgress: string;
  chooseGameMode: string;
  totalLevel: string;
  completedLabel: string;

  // Kim Milyoner Mode
  kimMilyonerTitle: string;
  kimMilyonerDesc: string;
  questionLabel: string;
  congratulations: string;
  millionaireVictory: string;
  withdrawn: string;
  withdrawnAt: string;
  eliminated: string;
  eliminatedAt: string;
  correctAnswerLabel: string;
  prizeWon: string;
  mainMenu: string;
  guaranteed: string;
  withdrawConfirmTitle: string;
  withdrawConfirmDesc: string;
  withdrawAction: string;
  continueAction: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Home Screen
    appTitle: 'TRIVIA',
    appSubtitle: 'The Ultimate Quiz Show Experience',
    startGame: 'START GAME',

    // Category Selection
    chooseCategory: 'Choose Your Category',
    selectBattlefield: 'Select your battlefield',
    generalKnowledge: 'General Knowledge',
    generalKnowledgeDesc: 'Test your knowledge across all topics',
    history: 'History',
    historyDesc: 'Journey through time and events',
    sports: 'Sports',
    sportsDesc: 'From championships to legendary athletes',
    allCategories: 'All Categories',
    allCategoriesDesc: 'The ultimate challenge: anything goes!',

    // Difficulty Selection
    selectDifficulty: 'Select Difficulty',
    howBrave: 'How brave are you feeling?',
    easy: 'Easy',
    easyDesc: 'Warm up with simple questions',
    medium: 'Medium',
    mediumDesc: 'A balanced challenge',
    hard: 'Hard',
    hardDesc: 'For the true trivia masters',

    mixed: 'Mixed',
    mixedDesc: 'Random difficulty mix',

    // Question Screen
    questionOf: 'Question {current} of {total}',
    correct: '🎉 Correct!',
    wrongAnswer: '❌ Wrong Answer',
    timeUp: "⏰ Time's Up!",

    // Results Screen
    perfectScore: 'PERFECT SCORE!',
    excellent: 'EXCELLENT!',
    greatJob: 'GREAT JOB!',
    goodEffort: 'GOOD EFFORT!',
    keepTrying: 'KEEP TRYING!',
    accuracy: 'Accuracy',
    correctAnswers: 'Correct',
    coinsEarned: 'Coins Earned',
    bestStreak: 'Best Streak',
    playAgain: 'PLAY AGAIN',

    // Settings
    settings: 'Settings',
    language: 'Language',
    close: 'Close',
    english: 'English',
    turkish: 'Turkish',

    // Credits
    credits: 'Credits',
    dailyRefillIn: 'Daily refill in',
    notEnoughCredits: 'Not Enough Credits',
    needCredits: 'You need {amount} credits to start a game',
    getMoreCredits: 'Get More Credits',
    watchAds: 'Watch Ads',
    purchaseCoins: 'Purchase Coins',
    comingSoon: 'Coming soon',
    gameCost: 'Game Cost: {amount} credits',
    currentCredits: 'Current Credits',

    // Bottom Tab Navigation
    home: 'Home',
    gameHistory: 'History',
    leaderboard: 'Leaderboard',
    database: 'Database',

    // Question Database
    questionDatabase: 'Question Database',
    searchQuestions: 'Search questions...',
    allDifficulties: 'All Difficulties',

    // Sports Subcategory
    chooseSportsCategory: 'Choose Sports Category',
    selectSportsField: 'Pick your playing field',
    football: 'Football',
    footballDesc: 'The beautiful game worldwide',
    basketball: 'Basketball',
    basketballDesc: 'From NBA to international courts',
    turkishSports: 'Turkish Sports',
    turkishSportsDesc: 'Legends of Turkish athletics',
    legendsRecords: 'Legends & Records',
    legendsRecordsDesc: 'Greatest athletes and achievements',
    // Language-specific labels
    generalSports: 'General Sports',
    generalSportsDesc: 'All sports mixed together',
    generalFootball: 'General Football',
    generalFootballDesc: 'Football from all leagues worldwide',
    footballLabel: 'English Football',
    // History Subcategory (EN only)
    chooseHistoryCategory: 'Choose History Era',
    selectHistoryEra: 'Pick your time period',
    historyModern: 'Modern History',
    historyModernDesc: 'Revolutions, wars, and the modern world (1700+)',
    historyLegendsEmpires: 'Legends & Empires',
    historyLegendsEmpiresDesc: 'Iconic leaders, dynasties and world-changing empires',
    historyAncientEarly: 'Ancient & Early Modern History',
    historyAncientEarlyDesc: 'From ancient civilizations to global exploration',
    historyAll: 'All History',
    historyAllDesc: 'The ultimate historical battlefield',
    // History Subcategory (TR only - English placeholders)
    historyTrTurkish: 'Turkish History',
    historyTrTurkishDesc: 'From Central Asia to the year 2000',
    historyTrModern: 'Modern History',
    historyTrModernDesc: 'World Wars, Cold War and Modern Era',
    historyTrAncientAnatolia: 'Ancient Anatolia',
    historyTrAncientAnatoliaDesc: 'Hittites, Phrygians, and Lydians',
    historyTrMixed: 'All History',
    historyTrMixedDesc: 'Mixed questions from all eras',
    // Withdraw feature
    withdraw: 'Withdraw',
    withdrawTitle: 'Withdraw from the game?',
    withdrawBody: 'You will cash out {amount} YUAN and end this run.',
    withdrawCancel: 'Cancel',
    withdrawConfirm: 'Withdraw',
    // Joker system
    jokerFiftyFifty: '50:50',
    jokerExtraTime: '+10s',
    jokerAiHint: 'AI Hint',
    jokerUsed: 'Used',
    hintPrefix: 'Hint:',
    // Level progression
    levelMode: 'Level Mode',
    classicMode: 'Classic Mode',
    classicModeDesc: '12 questions with prize ladder',
    levelModeDesc: 'Progressive levels — unlock as you go',
    selectLevel: 'Select Level',
    levelLabel: 'Level',
    levelLocked: 'Complete the previous level first',
    levelComplete: 'Level Complete!',
    levelProgress: 'Level {level} — Question {current} / {total}',
    chooseGameMode: 'Choose Game Mode',
    totalLevel: 'Total Level',
    completedLabel: 'completed',

    // Kim Milyoner Mode
    kimMilyonerTitle: 'WHO WANTS TO BE A MILLIONAIRE',
    kimMilyonerDesc: 'Answer 12 questions correctly to reach the top!\nDifficulty increases gradually.',
    questionLabel: 'Q',
    congratulations: 'CONGRATULATIONS!',
    millionaireVictory: 'You became a millionaire!',
    withdrawn: 'WITHDRAWN',
    withdrawnAt: 'Withdrew at Question {level}',
    eliminated: 'ELIMINATED!',
    eliminatedAt: 'Eliminated at Question {level}',
    correctAnswerLabel: 'Correct Answer:',
    prizeWon: 'Prize Won',
    mainMenu: 'MAIN MENU',
    guaranteed: 'Guaranteed: ',
    withdrawConfirmTitle: 'Quit the Game?',
    withdrawConfirmDesc: 'You will leave with ¥{amount}.',
    withdrawAction: 'QUIT',
    continueAction: 'CONTINUE',
  },

  tr: {
    // Home Screen
    appTitle: 'BİLGİ YARIŞMASI',
    appSubtitle: 'En İyi Bilgi Yarışması Deneyimi',
    startGame: 'OYUNA BAŞLA',

    // Category Selection
    chooseCategory: 'Kategorini Seç',
    selectBattlefield: 'Savaş alanını seç',
    generalKnowledge: 'Genel Kültür',
    generalKnowledgeDesc: 'Tüm konularda bilginizi test edin',
    history: 'Tarih',
    historyDesc: 'Zaman ve olaylar içinde yolculuk',
    sports: 'Spor',
    sportsDesc: 'Şampiyonluklar ve efsanevi sporcular',
    allCategories: 'Tüm Kategoriler',
    allCategoriesDesc: 'Nihai meydan okuma: her şey mümkün!',

    // Difficulty Selection
    selectDifficulty: 'Zorluk Seç',
    howBrave: 'Ne kadar cesursun?',
    easy: 'Kolay',
    easyDesc: 'Basit sorularla ısın',
    medium: 'Orta',
    mediumDesc: 'Dengeli bir meydan okuma',
    hard: 'Zor',
    hardDesc: 'Gerçek bilgi yarışması ustaları için',

    mixed: 'Karışık',
    mixedDesc: 'Her zorluktan sorular',

    // Question Screen
    questionOf: 'Soru {current} / {total}',
    correct: '🎉 Doğru!',
    wrongAnswer: '❌ Yanlış Cevap',
    timeUp: '⏰ Süre Doldu!',

    // Results Screen
    perfectScore: 'MÜKEMMEL SKOR!',
    excellent: 'HARIKA!',
    greatJob: 'ÇOK İYİ!',
    goodEffort: 'İYİ ÇABA!',
    keepTrying: 'DEVAM ET!',
    accuracy: 'Doğruluk',
    correctAnswers: 'Doğru',
    coinsEarned: 'Kazanılan Jeton',
    bestStreak: 'En İyi Seri',
    playAgain: 'TEKRAR OYNA',

    // Settings
    settings: 'Ayarlar',
    language: 'Dil',
    close: 'Kapat',
    english: 'İngilizce',
    turkish: 'Türkçe',

    // Credits
    credits: 'Krediler',
    dailyRefillIn: 'Günlük yenileme',
    notEnoughCredits: 'Yetersiz Kredi',
    currentCredits: 'Mevcut Krediler',
    needCredits: 'Oyun başlatmak için {amount} krediye ihtiyacınız var',
    getMoreCredits: 'Daha Fazla Kredi Al',
    watchAds: 'Reklam İzle',
    purchaseCoins: 'Jeton Satın Al',
    comingSoon: 'Yakında gelecek',
    gameCost: 'Oyun Maliyeti: {amount} kredi',

    // Bottom Tab Navigation
    home: 'Ana Sayfa',
    gameHistory: 'Geçmiş',
    leaderboard: 'Skor Tablosu',
    database: 'Veritabanı',

    // Question Database
    questionDatabase: 'Soru Veritabanı',
    searchQuestions: 'Soru ara...',
    allDifficulties: 'Tüm Zorluklar',

    // Sports Subcategory
    chooseSportsCategory: 'Spor Kategorisi Seç',
    selectSportsField: 'Oyun alanını seç',
    football: 'Futbol',
    footballDesc: 'Dünyanın en güzel oyunu',
    basketball: 'Basketbol',
    basketballDesc: 'NBA\'den uluslararası sahalara',
    turkishSports: 'Türk Sporları',
    turkishSportsDesc: 'Türk atletizminin efsaneleri',
    legendsRecords: 'Efsaneler ve Rekorlar',
    legendsRecordsDesc: 'En büyük sporcular ve başarılar',
    // Language-specific labels
    generalSports: 'Genel Spor',
    generalSportsDesc: 'Tüm sporlar bir arada',
    generalFootball: 'Genel Futbol',
    generalFootballDesc: 'Dünya futbolunun tamamı',
    footballLabel: 'Türk Futbolu',
    // History Subcategory (EN only - placeholders for TypeScript)
    chooseHistoryCategory: 'Tarih Dönemi Seç',
    selectHistoryEra: 'Zaman diliminizi seçin',
    historyModern: 'Modern Tarih',
    historyModernDesc: 'Devrimler, savaşlar ve modern dünya (1700+)',
    historyLegendsEmpires: 'Efsaneler ve İmparatorluklar',
    historyLegendsEmpiresDesc: 'İkonik liderler, hanedanlar ve dünyayı değiştiren imparatorluklar',
    historyAncientEarly: 'Antik ve Erken Modern Tarih',
    historyAncientEarlyDesc: 'Antik medeniyetlerden küresel keşiflere',
    historyAll: 'Tüm Tarih',
    historyAllDesc: 'Nihai tarih savaş alanı',
    // History Subcategory (TR only)
    historyTrTurkish: 'Türk Tarihi',
    historyTrTurkishDesc: 'Selçuklu, Osmanlı ve Cumhuriyet Tarihi',
    historyTrModern: 'Modern Tarih',
    historyTrModernDesc: 'Dünya Savaşı, Soğuk Savaş ve Yakın Tarih',
    historyTrAncientAnatolia: 'Antik Anadolu',
    historyTrAncientAnatoliaDesc: 'Hitit, Frig, İyon, Urartu ve Lidyalılar',
    historyTrMixed: 'Karışık Tarih',
    historyTrMixedDesc: 'Tüm dönemlerden karışık sorular',
    // Withdraw feature
    withdraw: 'Çekil',
    withdrawTitle: 'Yarışmadan çekilmek istiyor musun?',
    withdrawBody: '{amount} YUAN kazanıp yarışmayı bitireceksin.',
    withdrawCancel: 'Vazgeç',
    withdrawConfirm: 'Çekil',
    // Joker system
    jokerFiftyFifty: '50:50',
    jokerExtraTime: '+10s',
    jokerAiHint: 'AI İpucu',
    jokerUsed: 'Kullanıldı',
    hintPrefix: 'İpucu:',
    // Level progression
    levelMode: 'Seviye Modu',
    classicMode: 'Klasik Mod',
    classicModeDesc: '12 soru ve ödül merdiveni',
    levelModeDesc: 'İlerleyerek seviyeleri aç',
    selectLevel: 'Seviye Seç',
    levelLabel: 'Seviye',
    levelLocked: 'Önce önceki seviyeyi tamamla',
    levelComplete: 'Seviye Tamamlandı!',
    levelProgress: 'Seviye {level} — Soru {current} / {total}',
    chooseGameMode: 'Oyun Modu Seç',
    totalLevel: 'Toplam Seviye',
    completedLabel: 'tamamlandı',

    // Kim Milyoner Mode
    kimMilyonerTitle: 'KİM MİLYONER',
    kimMilyonerDesc: '12 soruyu doğru yanıtla, zirveye ulaş!\nSoruların zorluğu kademeli olarak artar.',
    questionLabel: 'Soru',
    congratulations: 'TEBRİKLER!',
    millionaireVictory: 'Milyoner oldun!',
    withdrawn: 'ÇEKİLDİN',
    withdrawnAt: 'Soru {level}\'den çekildin',
    eliminated: 'ELENDİN!',
    eliminatedAt: 'Soru {level}\'de elendin',
    correctAnswerLabel: 'Doğru Cevap:',
    prizeWon: 'Kazanılan Ödül',
    mainMenu: 'ANA MENÜ',
    guaranteed: 'Garantili: ',
    withdrawConfirmTitle: 'Çekilmek İstiyorsun?',
    withdrawConfirmDesc: '¥{amount} ödülünle çekileceksin.',
    withdrawAction: 'ÇEKİL',
    continueAction: 'DEVAM ET',
  },
};

export function getTranslation(lang: Language, key: keyof Translations, params?: Record<string, string | number>): string {
  let text = translations[lang][key];

  if (params) {
    Object.keys(params).forEach(paramKey => {
      text = text.replace(`{${paramKey}}`, String(params[paramKey]));
    });
  }

  return text;
}
