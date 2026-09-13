"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ApiError } from "@/lib/api/api-error";
import { useCurrentUserQuery } from "../application/queries/auth.query";

type AdminAuthGuardProps = {
  children: React.ReactNode;
};

const ADMIN_ROLES = ["admin", "editor"] as const;

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();

  const { data: user, isLoading, error } = useCurrentUserQuery();

  const isUnauthorized = error instanceof ApiError && error.status === 401;

  useEffect(() => {
    if (!isLoading && isUnauthorized) {
      router.replace("/login");
    }
  }, [isLoading, isUnauthorized, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isUnauthorized) {
    return null;
  }

  if (!user) {
    return null;
  }

  const isAdmin = ADMIN_ROLES.includes(
    user.role as (typeof ADMIN_ROLES)[number],
  );

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Access denied</h1>

          <p className="mt-2 text-muted-foreground">
            You do not have permission to access this area.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
