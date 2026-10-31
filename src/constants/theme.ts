/**
 * DevPay design tokens.
 * Sampled from the reference set in `ui/` (soft sky-blue frosted world).
 * Light mode is the reference; dark mode is derived from the same hues.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#17191C',
    textSecondary: '#6B7378',
    textMuted: '#8E979D',
    background: '#F3F6F9',
    backgroundElement: '#E9EEF2',
    backgroundSelected: '#DDE4E9',
    surface: '#FFFFFF',
    surfaceGlass: 'rgba(255, 255, 255, 0.86)',
    primary: '#3AA6DB',
    primaryLight: '#6CC7F1',
    primaryDeep: '#2C88B4',
    primaryText: '#2479A6',
    primarySoft: '#E3F2FA',
    primaryWash: '#EEF7FC',
    navActive: '#3B7493',
    accentCoral: '#E5484D',
    coralSoft: '#FCEBEC',
    accentGreen: '#1FAE7A',
    greenSoft: '#E5F6EF',
    accentAmber: '#D98A12',
    amberSoft: '#FDF3E1',
    border: '#EAEEF1',
    cardBorder: 'rgba(255, 255, 255, 0.9)',
    shadow: '#7FA6BD',
    onPrimary: '#FFFFFF',
  },
  dark: {
    text: '#EEF3F6',
    textSecondary: '#A1ADB5',
    textMuted: '#76838C',
    background: '#0C1317',
    backgroundElement: '#1A252C',
    backgroundSelected: '#24323A',
    surface: '#131C22',
    surfaceGlass: 'rgba(22, 32, 39, 0.9)',
    primary: '#4DB4E4',
    primaryLight: '#7CCDF2',
    primaryDeep: '#2C88B4',
    primaryText: '#7CCDF2',
    primarySoft: '#16303D',
    primaryWash: '#11232C',
    navActive: '#7CCDF2',
    accentCoral: '#F06A6E',
    coralSoft: '#3A1E22',
    accentGreen: '#3CC796',
    greenSoft: '#123227',
    accentAmber: '#F0A63A',
    amberSoft: '#352812',
    border: '#1F2B32',
    cardBorder: 'rgba(40, 55, 64, 0.8)',
    shadow: '#000000',
    onPrimary: '#FFFFFF',
  },
} as const;

export type ThemePalette = {
  [K in keyof typeof Colors.light]: string;
};

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** Card gradient (Recommended card) and CTA gradient (Apply Now, Saved toggle). */
export const Gradients = {
  card: ['#5FBDEA', '#3399CF'] as const,
  cta: ['#3A9DCB', '#2A82AE'] as const,
  ctaDark: ['#2F8FBE', '#1F6F97'] as const,
  /** Pale fade used behind "Apply" on white cards. */
  applyFade: ['rgba(214, 238, 248, 0)', 'rgba(206, 234, 247, 1)'] as const,
  applyFadeDark: ['rgba(22, 48, 61, 0)', 'rgba(30, 64, 82, 1)'] as const,
  /** Screen wash: sky tint at the top fading to the canvas. */
  screen: ['#E6F2F9', '#F3F6F9'] as const,
  screenDark: ['#10212A', '#0C1317'] as const,
};

export const Radius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 999,
} as const;

/** 4-column grid, 20px margin, 20px gutter (freelancestr.jpg). */
export const Layout = {
  margin: 20,
  gutter: 20,
  sectionGap: 24,
  headerHeight: 60,
  navHeight: 70,
} as const;

export const Type = {
  title: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.4 },
  heading: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.2 },
  section: { fontSize: 15, fontWeight: '600' as const, letterSpacing: -0.1 },
  body: { fontSize: 14, fontWeight: '400' as const },
  label: { fontSize: 13, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  micro: { fontSize: 11, fontWeight: '500' as const },
};

export const Shadows = {
  soft: {
    shadowColor: '#7FA6BD',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 3,
  },
  lifted: {
    shadowColor: '#3FA7DA',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 8,
  },
  button: {
    shadowColor: '#5B7C8F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
