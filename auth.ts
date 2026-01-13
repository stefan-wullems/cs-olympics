import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    role: "admin" | "viewer";
  }
  interface Session {
    user: {
      role: "admin" | "viewer";
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const password = credentials?.password as string;

        if (password === process.env.AUTH_ADMIN_PASSWORD) {
          return { id: "admin", role: "admin" as const };
        }

        if (password === process.env.AUTH_VIEWER_PASSWORD) {
          return { id: "viewer", role: "viewer" as const };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role as "admin" | "viewer";
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
});
