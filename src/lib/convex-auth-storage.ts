import type { TokenStorage } from "@convex-dev/auth/react";

// In-memory storage for dev; swap with SecureStore before production.
const memoryStore = new Map<string, string>();

export const authTokenStorage: TokenStorage = {
  async getItem(key) {
    return memoryStore.get(key) ?? null;
  },
  async setItem(key, value) {
    memoryStore.set(key, value);
  },
  async removeItem(key) {
    memoryStore.delete(key);
  },
};
