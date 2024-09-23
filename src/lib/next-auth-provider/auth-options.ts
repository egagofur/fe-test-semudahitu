import { fetcher } from "@/lib/fetcher";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password ) {
          return null;
        }
        try {
          const response = await fetcher.post<{
            data: {
              user: {
                id: string;
                fullname: string;
                email: string;
              };
              token: string;
            };
          }>(
            "/auth/sign-up",
            {
              email: credentials.email,
              password: credentials.password,
            },
            {},
            {
              "Content-Type": "application/json",
            },
          );

          if (response.data) {
            return {
              id: response.data.user.id,
              name: response.data.user.fullname,
              email: response.data.user.email,
              token: response.data.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Error during authorization:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user) return false;
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.token;
      }
      return { ...token, ...user };
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-up",
  },
};
