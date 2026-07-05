import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/auth";

export function Navbar({
  username,
  avatarUrl,
  gold,
}: {
  username: string;
  avatarUrl: string | null;
  gold: number;
}) {
  return (
    <div className="navbar bg-base-100 border-base-300/60 sticky top-0 z-30 border-b px-4 shadow-sm backdrop-blur">
      <div className="flex-1">
        <label
          htmlFor="app-drawer"
          className="btn btn-ghost btn-circle lg:hidden"
        >
          ☰
        </label>
        <Link
          href="/dashboard"
          className="font-heading ml-2 flex items-center gap-2 text-xl transition-opacity hover:opacity-80"
        >
          <Image
            src="/assets/logo/pixel-pond-logo.png"
            alt="Pixel Pond"
            width={100}
            height={100}
            unoptimized
          />
          Pixel Pond
        </Link>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-base-200 flex items-center gap-2 rounded-full px-3 py-1.5">
          <Image
            src="/assets/icons/gold.png"
            alt="Gold"
            width={50}
            height={50}
            unoptimized
          />
          <span className="font-heading text-sm">
            {gold.toLocaleString()}
          </span>
        </div>
        <div className="dropdown dropdown-end">
          <label
            tabIndex={0}
            className="btn btn-ghost btn-circle avatar transition-transform hover:scale-105"
          >
            <div className="ring-primary/40 w-9 rounded-full ring-2 ring-offset-1">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={username} width={36} height={36} />
              ) : (
                <div className="bg-neutral text-neutral-content flex h-9 w-9 items-center justify-center rounded-full">
                  {username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content bg-base-100 rounded-box z-10 mt-3 w-48 p-2 shadow-lg"
          >
            <li>
              <Link href="/profile">{username}</Link>
            </li>
            <li>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button type="submit" className="w-full text-left">
                  Log out
                </button>
              </form>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
