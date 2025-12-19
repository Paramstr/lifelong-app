/**
 * Unistyles Configuration
 *
 * This file initializes Unistyles with our theme system.
 * It must be imported before any component that uses StyleSheet.create.
 */

import { StyleSheet } from 'react-native-unistyles';
import { appThemes, breakpoints } from './theme';

// ============================================================================
// TYPE DECLARATIONS
// ============================================================================

type AppThemes = typeof appThemes;
type AppBreakpoints = typeof breakpoints;

declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends AppThemes { }
    export interface UnistylesBreakpoints extends AppBreakpoints { }
}

// ============================================================================
// CONFIGURE UNISTYLES
// ============================================================================

StyleSheet.configure({
    themes: appThemes,
    breakpoints,
    settings: {
        // Enable adaptive themes to automatically switch based on device color scheme
        adaptiveThemes: true,
    },
});
