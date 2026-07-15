import { jwtClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL as string,
  plugins: [jwtClient()],
});

export const signInGoogle = async (): Promise<void> => {
  await authClient.signIn.social({
    provider: "google",
  });
};

export const { 
  signIn, 
  signUp, 
  useSession, 
  signOut 
} = createAuthClient();