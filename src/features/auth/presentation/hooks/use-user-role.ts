"use client";

import type { UserRole } from "../../types/auth.types";
import { useAuth } from "./use-auth";

interface UseRoleReturn {
  isLoading: boolean;
  role: UserRole | null;

  isAdmin: boolean;
  isEditor: boolean;
  isUser: boolean;

  canManageUser: boolean;
  canManageDictionary: boolean;
  canEditDictionary: boolean;
}

export function useUserRole(): UseRoleReturn {
  const { user, isLoading } = useAuth();
  const role: UserRole | null = user?.role ?? null;

  return {
    isLoading,
    role,
    isAdmin: role === "admin",
    isEditor: role === "editor",
    isUser: role === "user",

    canManageUser: role === "admin",
    canManageDictionary: role === "admin" || role === "editor",
    canEditDictionary: role === "admin" || role === "editor",
  };
}
