import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/db";
import { adminLoginSchema } from "@/lib/validations";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Admin credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const parsed = adminLoginSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const admin = await prisma.admin.findUnique({ where: { email: parsed.data.email.toLowerCase() } });

        if (!admin) {
          return null;
        }

        const ok = await bcrypt.compare(parsed.data.password, admin.password);

        if (!ok) {
          return null;
        }

        return {
          id: admin.id,
          email: admin.email,
          name: "Administrator",
          role: "ADMIN"
        };
      }
    })
  ],
  pages: {
    signIn: "/admin"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = "ADMIN";
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId || "");
        session.user.role = "ADMIN";
      }

      return session;
    }
  }
};

export async function getCurrentAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return prisma.admin.findUnique({ where: { id: session.user.id } });
}
