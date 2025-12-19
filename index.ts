/**
 * App Entry Point
 *
 * This is the main entry point for the app when using Expo Router.
 * Unistyles must be initialized before any component that uses StyleSheet.create.
 */

// Initialize Unistyles first - MUST be before expo-router/entry
import './src/unistyles';

// Then load Expo Router
import 'expo-router/entry';
