// Design tokens extracted from the web app's CSS
export const colors = {
  bgDark: '#0E0E16',
  bgDarker: '#1a1a2e',
  card: '#1e1e2e',
  muted: '#2d2d3d',
  gold: '#D4AF37',
  goldLight: '#F4E4C1',
  goldDark: '#A67C00',
  purple: '#7c3aed',
  purpleLight: '#a855f7',
  neonGreen: '#00ff88',
  correct: '#00ff88',
  wrong: '#ff1744',
  textPrimary: '#ffffff',
  textSecondary: '#a1a1aa',
  border: '#2d2d3d',
  borderLight: '#3d3d4d',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  // Headings
  h1: {
    fontSize: 48,
    fontWeight: '900' as const,
  },
  h2: {
    fontSize: 32,
    fontWeight: '800' as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  // Body
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
  },
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
  labelSmall: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  // Button
  button: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 1,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  gold: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  correct: {
    shadowColor: colors.correct,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  wrong: {
    shadowColor: colors.wrong,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
};
