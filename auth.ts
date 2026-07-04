import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import type { Role } from "@/types/role";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  events: {
    async createUser({ user }) {
      if (!user.id) return;
      const woodenRod = await prisma.rod.findUnique({
        where: { name: "Wooden Rod" },
      });
      const profile = await prisma.profile.create({
        data: { userId: user.id, equippedRodId: woodenRod?.id },
      });
      if (woodenRod) {
        await prisma.playerRod.create({
          data: { profileId: profile.id, rodId: woodenRod.id },
        });
      }
    },
  },
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user?.id) {
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id },
          select: { role: true },
        });
        token.id = user.id;
        token.role = (profile?.role ?? "player") as Role;
      }
      return token;
    },
  },
});
