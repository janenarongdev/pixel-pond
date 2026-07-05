import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: "url(/assets/background/Tranquil alpine lake view.png)" }}
    >
      <div className="card bg-base-100 w-full max-w-sm shadow-xl">
        <div className="card-body items-center text-center">
          <Image
            src="/assets/logo/pixel-pond-logo.png"
            alt="Pixel Pond"
            width={360}
            height={360}
            unoptimized
          />
          <h1 className="card-title">Welcome Back!</h1>
          <p className="text-base-content/70">
            Sign in to continue your fishing adventure.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
            className="mt-4 w-full"
          >
            <button type="submit" className="btn btn-neutral w-full gap-2">
              <Image
                src="/assets/icons/github.png"
                alt=""
                width={40}
                height={40}
                unoptimized
              />
              Sign in with GitHub
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
