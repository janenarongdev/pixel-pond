"use client";

import { useState, useTransition } from "react";
import { updateUserRole } from "@/actions/admin-users";

type UserRow = {
  id: string;
  username: string;
  email: string | null;
  role: string;
  gold: number;
  isSelf: boolean;
};

export function UserTable({ users }: { users: UserRow[] }) {
  const [isPending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleRoleChange(profileId: string, role: string) {
    setErrors((prev) => ({ ...prev, [profileId]: "" }));
    startTransition(async () => {
      try {
        await updateUserRole(profileId, role);
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          [profileId]:
            err instanceof Error ? err.message : "Failed to update role.",
        }));
      }
    });
  }

  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>Player</th>
            <th>Email</th>
            <th>Gold</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                {u.username}
                {u.isSelf && (
                  <span className="text-base-content/50"> (you)</span>
                )}
              </td>
              <td>{u.email ?? "—"}</td>
              <td>{u.gold}</td>
              <td>
                <select
                  className="select select-bordered select-sm"
                  defaultValue={u.role}
                  disabled={isPending || u.isSelf}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  <option value="player">Player</option>
                  <option value="admin">Admin</option>
                </select>
                {errors[u.id] && (
                  <p className="text-error text-xs">{errors[u.id]}</p>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
