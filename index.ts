/**
 * App Entry Point
 *
 * This is the main entry point for the app when using Expo Router.
 * Unistyles must be initialized before any component that uses StyleSheet.create.
 */

// Initialize Unistyles first - MUST be before expo-router/entry
import './src/unistyles';

// Suppress noisy library logs
const originalLog = console.log;
console.log = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('[React Buoy] Using persistent file storage')) {
    return;
  }
  originalLog(...args);
};

// Then load Expo Router
import 'expo-router/entry';
