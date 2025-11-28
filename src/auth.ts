import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import prisma from "@/prisma/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "name" },
        password: { label: "Password", type: "password" },
        lastName: { label: "Last Name", type: "text" },
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        console.log("Authorizing user with email:", credentials.email);
        const user = await prisma.vendor.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          const newUser = await prisma.vendor.create({
            data: {
              name: credentials.name ?? credentials.email,
              email: credentials.email,
              password: await bcrypt.hash(credentials.password, 10),

            },
          });
          // Return a user object with id as string to satisfy NextAuth User type
          return {
            id: String(newUser.id),
            name: newUser.name,
            email: newUser.email,
       
          };
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        // Return a user object with id as string to satisfy NextAuth User type
        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
        
        };
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, id: token.id ?? user?.id };
    },
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.id } };
    },
  },
} satisfies NextAuthOptions;