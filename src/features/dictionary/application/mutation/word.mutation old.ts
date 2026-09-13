"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateWordInput,
  UpdateWordInput,
} from "../../domain/types/admin-word.types";
import { adminWordApi } from "../../infrastructure/admin-word-api";
import { adminWordKeys } from "../query-keys/admin-word-query-keys";

export function useCreateAdminWordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWordInput) => adminWordApi.create(input),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: adminWordKeys.all,
      });
    },
  });
}

export function useUpdateAdminWordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateWordInput }) =>
      adminWordApi.update(id, input),
    onSuccess: (_data, variables) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminWordKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: adminWordKeys.detail(variables.id),
        }),
      ]);
    },
  });
}

export function useVerifyAdminWordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminWordApi.verify(id),
    onSuccess: (_data, id) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminWordKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: adminWordKeys.detail(id),
        }),
      ]);
    },
  });
}

export function useDeleteAdminWordMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminWordApi.remove(id),
    onSuccess: (_data, id) => {
      queryClient.removeQueries({
        queryKey: adminWordKeys.detail(id),
      });
      return queryClient.invalidateQueries({
        queryKey: adminWordKeys.all,
      });
    },
  });
}
