import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/profile";
import { AdminShell } from "@/components/admin/admin-shell";
import { UserTable } from "@/components/admin/user-table";

export default async function AdminUsersPage() {
  const session = await auth();
  const profile = await requireAdmin();

  const profiles = await prisma.profile.findMany({
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  const users = profiles.map((p) => ({
    id: p.id,
    username: p.user.name ?? p.user.email ?? "Unknown",
    email: p.user.email,
    role: p.role,
    gold: p.gold,
    isSelf: p.id === profile.id,
  }));

  const username = session?.user?.name ?? "Admin";
  const avatarUrl = session?.user?.image ?? null;

  return (
    <AdminShell username={username} avatarUrl={avatarUrl} gold={profile.gold}>
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <UserTable users={users} />
    </AdminShell>
  );
}
