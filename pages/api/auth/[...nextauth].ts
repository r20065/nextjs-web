// pages/api/auth/[...nextauth].ts

import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "メール", type: "email", placeholder: "email@example.com" },
                password: { label: "パスワード", type: "password" },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials) return null;

                const userFromDB = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!userFromDB) return null;

                const isValid = await bcrypt.compare(credentials.password, userFromDB.password);
                if (!isValid) return null;

                const user: User = {
                    id: userFromDB.id.toString(), // stringに変換
                    email: userFromDB.email,
                };

                return user;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id) {
                session.user.id = token.id as string; // stringで扱う
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);
