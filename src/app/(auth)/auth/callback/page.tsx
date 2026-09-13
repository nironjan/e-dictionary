"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

const GOOGLE_ACCOUNT_LINK_REQUIRED = "google_account_link_required";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const error = searchParams.get("error");

  useEffect(() => {
    if (error === GOOGLE_ACCOUNT_LINK_REQUIRED) {
      return;
    }

    if (error) {
      router.replace(`/login?error=${encodeURIComponent(error)}`);
      return;
    }

    router.replace("/");
  }, [error, router]);

  if (error === GOOGLE_ACCOUNT_LINK_REQUIRED) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">Account already exists</h1>

            <p className="text-muted-foreground">
              An account already exists with this Google email. Please sign in
              with your email and password first. You can then connect your
              Google account from your account settings.
            </p>
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={() => router.replace("/login")}
          >
            Sign in with password
          </Button>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md space-y-4 text-center">
          <h1 className="text-xl font-semibold">Google sign-in failed</h1>

          <p className="text-muted-foreground">
            We could not sign you in with Google. Please try again.
          </p>

          <Button
            type="button"
            className="w-full"
            onClick={() => router.replace("/login")}
          >
            Back to sign in
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Signing you in...</p>
    </main>
  );
}
