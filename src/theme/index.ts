/**
 * Lifelong App Theme System
 *
 * A calm, optimistic, nature-forward design system for Health + Longevity
 * Based on the design guidelines in /plans/design-guidelines.md
 */

// ============================================================================
// BRAND COLORS
// ============================================================================

const brand = {
    // Primary - Vital Coral (progress, success states, CTAs, highlights)
    primary: {
        light: '#F26B4F',
        dark: '#FF7A5C',
    },
    // Secondary - Sky Calm Blue (headers, cards, illustrations, background accents)
    secondary: {
        light: '#A9CFE5',
        dark: '#6FA8C9',
    },
    // Accent - Longevity Yellow (subtle emphasis, icons, badges, optimism)
    accent: {
        light: '#F4D35E',
        dark: '#E6C453',
    },
} as const;

// ============================================================================
// SEMANTIC COLORS
// ============================================================================

const semantic = {
    success: {
        base: '#3CB371',
        softBg: {
            light: '#E6F6ED',
            dark: '#1F3D2E',
        },
    },
    warning: {
        base: '#E6A23C',
        softBg: {
            light: '#FFF3E0',
            dark: '#3A2A14',
        },
    },
    error: {
        base: '#E5533D',
        softBg: {
            light: '#FDECEC',
            dark: '#3A1E1A',
        },
    },
    info: {
        base: '#4DA3D9',
        softBg: {
            light: '#EAF4FB',
            dark: '#1B3344',
        },
    },
} as const;

// ============================================================================
// PROGRESS & HEALTH INDICATORS
// ============================================================================

const progress = {
    low: '#CBD5E1',
    medium: '#6FA8C9',
    high: '#F26B4F',
    streak: '#FF8C66',
} as const;

// ============================================================================
// GRADIENTS
// ============================================================================

const gradients = {
    vital: {
        light: ['#A9CFE5', '#F26B4F'] as const,
        dark: ['#1F3D4F', '#FF7A5C'] as const,
    },
} as const;

// ============================================================================
// SPACING SYSTEM (4px base unit)
// ============================================================================

const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 48,
    '4xl': 64,
} as const;

// ============================================================================
// BORDER RADIUS SYSTEM
// ============================================================================

const radius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 24,
    full: 9999,
} as const;

// ============================================================================
// TYPOGRAPHY SYSTEM
// ============================================================================

const typography = {
    display: {
        fontSize: 32,
        fontWeight: '600' as const,
        lineHeight: 38,
        letterSpacing: -0.5,
    },
    headline: {
        fontSize: 24,
        fontWeight: '700' as const,
        lineHeight: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 26,
    },
    body: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 22,
    },
    caption: {
        fontSize: 14,
        fontWeight: '500' as const,
        lineHeight: 18,
    },
    small: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
    },
} as const;

// ============================================================================
// LIGHT THEME
// ============================================================================

export const lightTheme = {
    // Background colors
    colors: {
        background: {
            primary: '#F7FAFC',
            secondary: '#FFFFFF',
        },
        surface: {
            card: '#FFFFFF',
            overlay: 'rgba(247, 250, 252, 0.9)',
        },
        border: {
            subtle: '#E5E9EE',
            divider: '#D8DEE6',
        },
        text: {
            primary: '#0F172A',
            secondary: '#475569',
            muted: '#94A3B8',
            disabled: '#CBD5E1',
            inverse: '#FFFFFF',
        },
        brand: {
            primary: brand.primary.light,
            secondary: brand.secondary.light,
            accent: brand.accent.light,
        },
        semantic: {
            success: semantic.success.base,
            successSoft: semantic.success.softBg.light,
            warning: semantic.warning.base,
            warningSoft: semantic.warning.softBg.light,
            error: semantic.error.base,
            errorSoft: semantic.error.softBg.light,
            info: semantic.info.base,
            infoSoft: semantic.info.softBg.light,
        },
        progress,
        gradient: gradients.vital.light,
    },
    spacing,
    radius,
    typography,
    shadows: {
        sm: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
        lg: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 8,
            elevation: 4,
        },
    },
} as const;

// ============================================================================
// DARK THEME
// ============================================================================

export const darkTheme = {
    colors: {
        background: {
            primary: '#0B0F14',
            secondary: '#121822',
        },
        surface: {
            card: '#171E2B',
            overlay: 'rgba(11, 15, 20, 0.9)',
        },
        border: {
            subtle: '#263042',
            divider: '#1F2937',
        },
        text: {
            primary: '#E6EDF3',
            secondary: '#B6C2D0',
            muted: '#7C8A9D',
            disabled: '#4B5563',
            inverse: '#0F172A',
        },
        brand: {
            primary: brand.primary.dark,
            secondary: brand.secondary.dark,
            accent: brand.accent.dark,
        },
        semantic: {
            success: semantic.success.base,
            successSoft: semantic.success.softBg.dark,
            warning: semantic.warning.base,
            warningSoft: semantic.warning.softBg.dark,
            error: semantic.error.base,
            errorSoft: semantic.error.softBg.dark,
            info: semantic.info.base,
            infoSoft: semantic.info.softBg.dark,
        },
        progress,
        gradient: gradients.vital.dark,
    },
    spacing,
    radius,
    typography,
    shadows: {
        sm: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 2,
        },
        lg: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 4,
        },
    },
} as const;

// ============================================================================
// THEME TYPES
// ============================================================================

export type AppTheme = typeof lightTheme;

export const appThemes = {
    light: lightTheme,
    dark: darkTheme,
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
    xs: 0,
    sm: 380,
    md: 428,
    lg: 768,
    xl: 1024,
} as const;
