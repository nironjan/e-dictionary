"use client";

import Link from "next/link";
import { useAuth } from "../../../features/auth/presentation/hooks/use-auth";
import { useUserRole } from "../../../features/auth/presentation/hooks/use-user-role";
import { Button } from "../ui/button";
import { APP_CONSTANTS } from "../../../lib/constants/constants";
import { AdminMenu } from "@/features/navigation/components/admin-menu";
import { UserMenu } from "@/features/navigation/components/user-menu";
import { useLogout } from "../../../features/auth/application/mutation/auth.mutation";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();

  const { mutate: logout, isPending: logoutPending } = useLogout();
  const isLoading = authLoading || roleLoading;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.replace(APP_CONSTANTS.ROUTES.LOGIN);
        router.refresh();
      },
    });
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <h1>e-Dictionay</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b  backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <h1>e-Dictionary</h1>
        </Link>
        <div className="flex flex-1 justify-center px-4">
          {isAuthenticated && isAdmin && <AdminMenu />}
        </div>
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <UserMenu />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Link href={APP_CONSTANTS.ROUTES.LOGIN}>Sign In</Link>
              </Button>

              <Button size="sm">
                <Link href={APP_CONSTANTS.ROUTES.REGISTER}>Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
