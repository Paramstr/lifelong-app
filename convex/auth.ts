import Apple from "@auth/core/providers/apple";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Apple({
      clientId: process.env.AUTH_APPLE_ID!,
      clientSecret: process.env.AUTH_APPLE_SECRET!,
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
