import type { TokenStorage } from "@convex-dev/auth/react";
import * as SecureStore from "expo-secure-store";

const memoryStore = new Map<string, string>();

async function secureStoreAvailable() {
  try {
    return await SecureStore.isAvailableAsync();
  } catch {
    return false;
  }
}

export const authTokenStorage: TokenStorage = {
  async getItem(key) {
    if (await secureStoreAvailable()) {
      return SecureStore.getItemAsync(key);
    }
    return memoryStore.get(key) ?? null;
  },
  async setItem(key, value) {
    if (await secureStoreAvailable()) {
      await SecureStore.setItemAsync(key, value);
      return;
    }
    memoryStore.set(key, value);
  },
  async removeItem(key) {
    if (await secureStoreAvailable()) {
      await SecureStore.deleteItemAsync(key);
      return;
    }
    memoryStore.delete(key);
  },
};
