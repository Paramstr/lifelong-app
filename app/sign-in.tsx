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
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

const GoogleIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 48 48">
    <Path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.01 1.53 7.39 2.82l5.43-5.43C33.86 4.04 29.37 2 24 2 14.73 2 6.79 7.37 3.05 15.09l6.64 5.16C11.17 13.03 17.06 9.5 24 9.5z"
    />
    <Path
      fill="#4285F4"
      d="M46.14 24.46c0-1.64-.15-3.2-.44-4.71H24v9h12.5c-.54 2.9-2.16 5.36-4.61 7.04l7.05 5.48c4.12-3.8 6.5-9.4 6.5-16.81z"
    />
    <Path
      fill="#FBBC05"
      d="M9.69 28.25c-.48-1.4-.76-2.89-.76-4.25 0-1.36.28-2.85.76-4.25l-6.64-5.16C1.74 17.91 1 20.91 1 24c0 3.09.74 6.09 2.05 8.91l6.64-5.16z"
    />
    <Path
      fill="#34A853"
      d="M24 46c5.37 0 9.86-1.77 13.14-4.82l-7.05-5.48c-1.96 1.32-4.47 2.09-6.09 2.09-6.94 0-12.83-4.53-14.9-10.75l-6.64 5.16C6.79 40.63 14.73 46 24 46z"
    />
  </Svg>
);

export default function SignInScreen() {
  const { theme } = useUnistyles();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [isWorking, setIsWorking] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const redirectTo = useMemo(() => makeRedirectUri(), []);
  const insets = useSafeAreaInsets();

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
      <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.appName}>Lifelong</Text>
          <View style={styles.betaBadge}>
            <Text style={styles.betaText}>BETA</Text>
          </View>
        </View>
        <Text style={styles.title}>Sign in</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 24 }]}>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.googleButton}
            onPress={() => startOAuth("google")}
            disabled={isWorking || isLoading}
            activeOpacity={0.8}
          >
            <View style={styles.googleIcon}>
              <GoogleIcon />
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
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
        </View>

        {(isWorking || isLoading) && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={theme.colors.text.primary} />
            <Text style={styles.loadingText}>Working...</Text>
          </View>
        )}

      </View>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    paddingBottom: 18,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  appName: {
    ...theme.typography.display,
    fontSize: 32,
    color: theme.colors.text.primary,
    lineHeight: 38,
  },
  betaBadge: {
    backgroundColor: theme.colors.text.primary,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
    marginTop: 4,
  },
  betaText: {
    color: theme.colors.background.primary,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginTop: 18,
  },
  subhead: {
    marginTop: 8,
    fontSize: 15,
    color: theme.colors.text.muted,
  },
  footer: {
    marginTop: "auto",
  },
  actions: {
    gap: 12,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dadce0",
  },
  googleIcon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#1f1f1f",
    fontWeight: "600",
    fontSize: 15,
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
  loadingRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loadingText: {
    color: theme.colors.text.muted,
  },
}));
