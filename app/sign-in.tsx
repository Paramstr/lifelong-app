import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { makeRedirectUri } from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const [isWorking, setIsWorking] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const redirectTo = useMemo(() => makeRedirectUri(), []);

  useEffect(() => {
    let isMounted = true;
    AppleAuthentication.isAvailableAsync()
      .then(isAvailable => {
        if (isMounted) {
          setIsAppleAvailable(isAvailable);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAppleAvailable(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const startOAuth = useCallback(
    async (provider: "google") => {
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

  const startAppleNative = useCallback(async () => {
    if (isWorking || isLoading) {
      return;
    }
    setIsWorking(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("Apple identity token is missing.");
      }

      const fullName = [
        credential.fullName?.givenName,
        credential.fullName?.familyName,
      ]
        .filter(Boolean)
        .join(" ");

      await signIn("appleNative", {
        identityToken: credential.identityToken,
        email: credential.email ?? undefined,
        fullName: fullName || undefined,
      });
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "ERR_REQUEST_CANCELED"
      ) {
        return;
      }
      throw error;
    } finally {
      setIsWorking(false);
    }
  }, [isLoading, isWorking, signIn]);

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
        {isAppleAvailable ? (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={14}
            style={styles.appleButton}
            onPress={startAppleNative}
          />
        ) : (
          <TouchableOpacity
            style={styles.appleFallbackButton}
            disabled
            activeOpacity={0.8}
          >
            <Text style={styles.appleFallbackText}>Continue with Apple</Text>
          </TouchableOpacity>
        )}
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
  appleButton: {
    width: "100%",
    height: 44,
  },
  appleFallbackButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#111827",
    opacity: 0.6,
  },
  appleFallbackText: {
    color: "#fff",
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
