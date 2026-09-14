import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { usersApi } from "../../infrastructure/users.api";
import type {
  DeleteUserPayload,
  PaginatedUsers,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from "../../domain/types/user.types";
import { usersKeys } from "../query-keys/user.query-keys";

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.updateRole,

    onMutate: async ({ id, role }: UpdateUserRolePayload) => {
      await queryClient.cancelQueries({
        queryKey: usersKeys.lists(),
      });

      const previousQueries = queryClient.getQueriesData<PaginatedUsers>({
        queryKey: usersKeys.lists(),
      });

      queryClient.setQueriesData<PaginatedUsers>(
        { queryKey: usersKeys.lists() },
        (old) =>
          old
            ? {
                ...old,
                data: old.data.map((user) =>
                  user.id === id ? { ...user, role } : user,
                ),
              }
            : old,
      );

      return { previousQueries };
    },

    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      toast.error("Failed to update role. Please try again.");
    },

    onSuccess: () => {
      toast.success("Role updated successfully.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.lists(),
      });
    },
  });
}

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersApi.updateStatus,

    onMutate: async ({ id, status }: UpdateUserStatusPayload) => {
      await queryClient.cancelQueries({
        queryKey: usersKeys.lists(),
      });

      const previousQueries = queryClient.getQueriesData<PaginatedUsers>({
        queryKey: usersKeys.lists(),
      });

      queryClient.setQueriesData<PaginatedUsers>(
        { queryKey: usersKeys.lists() },
        (old) =>
          old
            ? {
                ...old,
                data: old.data.map((user) =>
                  user.id === id ? { ...user, status } : user,
                ),
              }
            : old,
      );

      return { previousQueries };
    },

    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      toast.error("Failed to update status. Please try again.");
    },

    onSuccess: () => {
      toast.success("User status updated successfully.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.lists(),
      });
    },
  });
}
export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteUserPayload) => usersApi.remove({ id }),

    onMutate: async ({ id }: DeleteUserPayload) => {
      await queryClient.cancelQueries({
        queryKey: usersKeys.lists(),
      });

      const previousQueries = queryClient.getQueriesData<PaginatedUsers>({
        queryKey: usersKeys.lists(),
      });

      queryClient.setQueriesData<PaginatedUsers>(
        { queryKey: usersKeys.lists() },
        (old) =>
          old
            ? {
                ...old,
                data: old.data.filter((user) => user.id !== id),
              }
            : old,
      );

      return { previousQueries };
    },

    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      toast.error("Failed to delete user. Please try again.");
    },

    onSuccess: () => {
      toast.success("User deleted successfully.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: usersKeys.lists(),
      });
    },
  });
}
