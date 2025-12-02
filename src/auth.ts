import CredentialsProvider from "next-auth/providers/credentials";
import { type NextAuthOptions } from "next-auth";
import prisma from "@/prisma/prisma";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

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
          throw new Error("Contraseña o correo inválidos");
        }
        const user = await prisma.usuarios.findUnique({
          where: { correo: credentials.email },
          include: { profile: true },
        });
        
        if (!user || !user.password) {
          throw new Error("Contraseña o correo inválidos");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Contraseña o correo inválidos");
        }

        if (user.rol !== "admin" && user.rol !== "vendedor") {
          throw new Error("No tienes permiso para acceder");
        }

        return {
          id: String(user.id),
          name: user.nombre,
          email: user.correo,
          image: user.profile?.imagen || null,
          role: user.rol,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        const user = await prisma.usuarios.findUnique({
          where: { correo: profile.email },
        });

        if (!user) {
          return false;
        }

        if (user.rol !== "admin" && user.rol !== "vendedor") {
          return false;
        }

        return true;
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (account && user) {
        token.id = user.id;
        if (account.provider === "credentials") {
          token.role = user.role;
        } else if (account.provider === "google") {
          const dbUser = await prisma.usuarios.findUnique({
            where: { correo: user.email! },
            include: { profile: true },
          });
          if (dbUser) {
            token.role = dbUser.rol;
            token.id = String(dbUser.id);
            if (dbUser.profile?.imagen) {
              token.picture = dbUser.profile.imagen;
            }
          }
        }
      } else if (token.email) {
        const dbUser = await prisma.usuarios.findUnique({
          where: { correo: token.email },
          include: { profile: true },
        });
        if (dbUser) {
          token.role = dbUser.rol;
          if (dbUser.profile?.imagen) {
            token.picture = dbUser.profile.imagen;
          }
          if (dbUser.nombre || dbUser.apellido) {
             token.name = `${dbUser.nombre || ""} ${dbUser.apellido || ""}`.trim();
          }
        }
      }
      
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthOptions;