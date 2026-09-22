import "server-only";

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getServerEnv } from "@/lib/env";

const ACCESS_TOKEN_LIFETIME_IN_SECONDS = 60 * 60 * 24;

type LoginResponse = { accessToken: string };
type TechnicianResponse = { id: string; name: string; email: string };

function getTokenExpiration(accessToken: string): number {
  const [, payload] = accessToken.split(".");
  const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString());

  return exp * 1000;
}

async function findTechnicianByEmail(accessToken: string, email: string) {
  const response = await fetch(`${getServerEnv().API_URL}/technicians`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) return null;

  const technicians: TechnicianResponse[] = await response.json();

  return technicians.find(
    (technician) => technician.email.toLowerCase() === email.toLowerCase(),
  );
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: ACCESS_TOKEN_LIFETIME_IN_SECONDS,
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const response = await fetch(`${getServerEnv().API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
          cache: "no-store",
        });

        if (!response.ok) return null;

        const { accessToken }: LoginResponse = await response.json();
        const technician = await findTechnicianByEmail(
          accessToken,
          credentials.email,
        );

        if (!technician) return null;

        return {
          id: technician.id,
          name: technician.name,
          email: technician.email,
          accessToken,
          accessTokenExpiresAt: getTokenExpiration(accessToken),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;

      return session;
    },
  },
};
