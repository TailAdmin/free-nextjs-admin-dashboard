import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Role } from "@/types";

export const authConfig: NextAuthConfig = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email as string,
                    },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid credentials");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
    pages: {
        signIn: "/signin",
        signOut: "/signin",
        error: "/signin",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role || Role.USER;
            }

            // For OAuth providers, check if user exists and get their role
            if (account && token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                });
                if (dbUser) {
                    token.role = dbUser.role;
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as Role;
            }
            return session;
        },
        async signIn({ user, account, profile }) {
            // For OAuth providers, create or update user in database
            if (account?.provider !== "credentials") {
                if (!user.email) return false;

                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            emailVerified: new Date(),
                            role: Role.USER,
                        },
                    });
                }
            }

            return true;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};
