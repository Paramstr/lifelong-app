import { useAuth, useAuthActions } from "@convex-dev/auth/react";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";

WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const { theme } = useUnistyles();
  const { isAuthenticated, isLoading } = useAuth();
  const { signIn, signOut } = useAuthActions();
  const [isWorking, setIsWorking] = useState(false);
  const redirectTo = useMemo(() => makeRedirectUri(), []);

  const startOAuth = useCallback(
    async (provider: "google" | "apple") => {
      setIsWorking(true);
      try {
        const result = await signIn(provider, { redirectTo });

        if (result?.redirect) {
          if (Platform.OS === "web") {
            return;
          }
          const authResult = await WebBrowser.openAuthSessionAsync(
            result.redirect.toString(),
            redirectTo,
          );

          if (authResult.type === "success" && authResult.url) {
            const code = new URL(authResult.url).searchParams.get("code");
            if (typeof code === "string") {
              await signIn(provider, { code });
            }
          }
        }
      } finally {
        setIsWorking(false);
      }
    },
    [redirectTo, signIn],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subhead}>
        Use Google or Apple to test Convex Auth.
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => startOAuth("google")}
          disabled={isWorking || isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => startOAuth("apple")}
          disabled={isWorking || isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ghostButton}
          onPress={() => signOut()}
          disabled={isWorking || isLoading || !isAuthenticated}
          activeOpacity={0.8}
        >
          <Text style={styles.ghostButtonText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {(isWorking || isLoading) && (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={theme.colors.text.primary} />
          <Text style={styles.loadingText}>Working...</Text>
        </View>
      )}

      <Text style={styles.stateText}>
        {isAuthenticated ? "Authenticated" : "Not signed in"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    backgroundColor: theme.colors.background.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  subhead: {
    marginTop: 8,
    fontSize: 15,
    color: theme.colors.text.muted,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.colors.brand.primary,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: theme.colors.text.primary,
  },
  secondaryButtonText: {
    color: theme.colors.background.primary,
    fontWeight: "600",
    fontSize: 15,
    textAlign: "center",
  },
  ghostButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.text.muted,
  },
  ghostButtonText: {
    color: theme.colors.text.primary,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  loadingRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: theme.colors.text.muted,
  },
  stateText: {
    marginTop: 16,
    color: theme.colors.text.muted,
  },
}));
