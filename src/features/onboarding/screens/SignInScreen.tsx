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
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';

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
  const router = useRouter();
  const { nextStep } = useOnboarding();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [isWorking, setIsWorking] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);
  const redirectTo = useMemo(() => makeRedirectUri(), []);
  const insets = useSafeAreaInsets();
  const devBypassEnabled = process.env.EXPO_PUBLIC_DEV_AUTH_BYPASS === "true";
  const devAuthToken = process.env.EXPO_PUBLIC_DEV_AUTH_TOKEN;

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

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
        // Auto-advance
        nextStep();
        router.push('/onboarding/full-name');
    }
  }, [isAuthenticated, isLoading, nextStep, router]);

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

  const startDevSignIn = useCallback(async () => {
    if (isWorking || isLoading) {
      return;
    }
    setIsWorking(true);
    try {
      await signIn("dev", devAuthToken ? { token: devAuthToken } : {});
    } finally {
      setIsWorking(false);
    }
  }, [devAuthToken, isLoading, isWorking, signIn]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.providerButton}
            onPress={() => startOAuth("google")}
            disabled={isWorking || isLoading}
            activeOpacity={0.8}
          >
            <View style={styles.providerIcon}>
              <GoogleIcon />
            </View>
            <Text style={styles.providerButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {isAppleAvailable ? (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
              buttonStyle={
                AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
              }
              cornerRadius={26}
              style={styles.appleButton}
              onPress={startAppleNative}
            />
          ) : (
            <TouchableOpacity
              style={[styles.providerButton, styles.appleFallbackButton]}
              disabled
              activeOpacity={0.8}
            >
              <Text style={styles.providerButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          )}

          {devBypassEnabled && (
            <TouchableOpacity
              style={styles.devButton}
              onPress={startDevSignIn}
              disabled={isWorking || isLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.devButtonText}>Continue with Dev Account</Text>
            </TouchableOpacity>
          )}
        </View>

        {(isWorking || isLoading) && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={theme.colors.text.primary} />
            <Text style={styles.loadingText}>Authenticating...</Text>
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
    justifyContent: 'center',
  },
  content: {
    width: '100%',
  },
  actions: {
    gap: 12,
  },
  providerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 26,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#dadce0",
  },
  providerIcon: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  providerButtonText: {
    color: "#1f1f1f",
    fontWeight: "500",
    fontSize: 20,
    fontFamily: "System", // Or space mono if preferred
  },
  devButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colors.text.muted,
  },
  devButtonText: {
    color: theme.colors.text.primary,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  appleButton: {
    width: "100%",
    height: 52,
  },
  appleFallbackButton: {
    opacity: 0.6,
  },
  loadingRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    color: theme.colors.text.muted,
  },
}));
