import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      authorize: async (credentials) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // throw new Error("No user found");
          // return null;
          return Promise.reject(new Error("No user found"));
        }
        const passwordValid = await compare(password, user.password as string);
        if (!passwordValid || user.email !== email) {
          // throw new Error("Incorrect email or password");
          // return null;
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      },
    }),
  ],
  callbacks: {
    // async jwt({ token, user, account, profile, isNewUser }) {
    //   user && (token.user = user);
    //   return token;
    // },
    async session({ session, token, user }) {
      session = {
        ...session,
        user: {
          id: user.id,
          ...session.user,
        },
      };
      return session;
    },
  },
  // secret: "test",
  // session: {
  //   strategy: "jwt",
  // },
};

export default NextAuth(authOptions);
