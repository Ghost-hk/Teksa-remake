import NextAuth, { Awaitable, User, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  // callbacks: {
  //   session({ session, user }) {
  //     if (session.user) {
  //       session.user.id = user.id;
  //     }
  //     // strategy: 'jwt',
  //     return session;
  //   },
  // },

  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials, req) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("No user found");
        }
        const passwordValid = await compare(password, user.password as string);
        if (!passwordValid || user.email !== email) {
          throw new Error("Incorrect email or password");
        }
        return user;
      },
    }),

    // ...add more providers here
  ],
  secret: "test",
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
