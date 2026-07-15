import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL as string || "http://localhost:3000",
  plugins: [jwtClient()],
});

export const signInGoogle = async (): Promise<void> => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
  });
};

export const { 
  signIn, 
  signUp, 
  useSession, 
  signOut 
} = authClient;