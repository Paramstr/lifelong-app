import Google from "@auth/core/providers/google";
import { ConvexCredentials } from "@convex-dev/auth/providers/ConvexCredentials";
import { convexAuth, createAccount } from "@convex-dev/auth/server";
import { createRemoteJWKSet, jwtVerify } from "jose";

const APPLE_ISSUER = "https://appleid.apple.com";
const appleJwks = createRemoteJWKSet(new URL(`${APPLE_ISSUER}/auth/keys`));

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    ConvexCredentials({
      id: "dev",
      authorize: async (credentials, ctx) => {
        if (process.env.DEV_AUTH_BYPASS !== "true") {
          throw new Error("Dev auth bypass is disabled.");
        }

        const expectedToken = process.env.DEV_AUTH_TOKEN;
        const providedToken =
          typeof credentials.token === "string" ? credentials.token : undefined;
        if (expectedToken && expectedToken !== providedToken) {
          throw new Error("Invalid dev auth token.");
        }

        const email = process.env.DEV_AUTH_EMAIL ?? "dev@lifelong.app";
        const name = process.env.DEV_AUTH_NAME ?? "Lifelong Dev";
        const now = Date.now();

        const { user } = await createAccount(ctx, {
          provider: "dev",
          account: { id: email },
          profile: {
            createdAt: now,
            email,
            emailVerificationTime: now,
            name,
            displayName: name,
          },
          shouldLinkViaEmail: true,
        });

        return { userId: user._id };
      },
    }),
    ConvexCredentials({
      id: "appleNative",
      authorize: async (credentials, ctx) => {
        const identityToken = credentials.identityToken;
        if (typeof identityToken !== "string") {
          throw new Error("Missing Apple identity token.");
        }

        const appleBundleId = process.env.AUTH_APPLE_BUNDLE_ID;
        if (!appleBundleId) {
          throw new Error("AUTH_APPLE_BUNDLE_ID is not set.");
        }

        const { payload } = await jwtVerify(identityToken, appleJwks, {
          issuer: APPLE_ISSUER,
          audience: appleBundleId,
        });

        const subject = payload.sub;
        if (typeof subject !== "string" || subject.length === 0) {
          throw new Error("Apple identity token is missing a subject.");
        }

        const tokenEmail =
          typeof payload.email === "string" ? payload.email : undefined;
        const email =
          tokenEmail ??
          (typeof credentials.email === "string" ? credentials.email : undefined);
        const fullName =
          typeof credentials.fullName === "string" ? credentials.fullName : undefined;
        const now = Date.now();

        const { user } = await createAccount(ctx, {
          provider: "appleNative",
          account: { id: subject },
          profile: {
            createdAt: now,
            ...(email ? { email, emailVerificationTime: now } : null),
            ...(fullName ? { name: fullName, displayName: fullName } : null),
          },
          shouldLinkViaEmail: Boolean(email),
        });

        return { userId: user._id };
      },
    }),
  ],
  callbacks: {
    async redirect({ redirectTo }) {
      if (redirectTo.startsWith("/")) {
        return redirectTo;
      }
      const siteUrl = process.env.CONVEX_SITE_URL;
      if (siteUrl && redirectTo.startsWith(siteUrl)) {
        return redirectTo;
      }
      if (
        redirectTo.startsWith("lifelongapp://") ||
        redirectTo.startsWith("exp://")
      ) {
        return redirectTo;
      }
      throw new Error("Invalid redirect URL");
    },
  },
});
