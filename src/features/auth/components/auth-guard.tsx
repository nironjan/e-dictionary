"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ApiError } from "@/lib/api/api-error";
import { useCurrentUserQuery } from "../application/queries/auth.query";
import { LoadingState } from "../../../shared/components/common/loading-state";

type AccountAuthGuardProps = {
  children: React.ReactNode;
};

export function AccountAuthGuard({ children }: AccountAuthGuardProps) {
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
        <LoadingState message="Loading..." />
      </div>
    );
  }

  if (isUnauthorized) {
    return null;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
