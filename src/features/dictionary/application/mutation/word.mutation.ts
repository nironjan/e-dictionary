"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type {
  CreateWordDto,
  SetVerifiedDto,
  UpdateWordDto,
} from "../../domain/types/word.types";
import { wordApi } from "../../infrastructure/admin-word-api";
import { wordQueryKeys } from "../query-keys/word.query-keys";

export function useCreateWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateWordDto) => wordApi.create(dto),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wordQueryKeys.all,
      });
    },
  });
}

export function useUpdateWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateWordDto }) =>
      wordApi.update(id, dto),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: wordQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: wordQueryKeys.detail(variables.id),
      });
    },
  });
}

export function useVerifyWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: SetVerifiedDto }) =>
      wordApi.verify(id, dto),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: wordQueryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: wordQueryKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteWord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => wordApi.remove(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: wordQueryKeys.all,
      });
    },
  });
}
