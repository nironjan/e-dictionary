"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../../infrastructure/category.api";
import { categoryKeys } from "../query-kyes/category.query-keys";
import type {
  CreateCategoryDto,
  CreateCategoryTranslationDto,
  UpdateCategoryDto,
  UpdateCategoryTranslationDto,
} from "../../domain/types/category.type";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryDto) => categoryApi.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoryDto }) =>
      categoryApi.update(id, input),
    onSuccess: async (category) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: categoryKeys.lists(),
        }),
        queryClient.invalidateQueries({
          queryKey: categoryKeys.detail(category.id),
        }),
      ]);
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.delete(id),

    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: categoryKeys.lists(),
        }),
        queryClient.removeQueries({
          queryKey: categoryKeys.detail(id),
        }),
      ]);
    },
  });
}

// ---------------------------------------------------------------------------
// Nested translation mutations — use these only if you mutate translations
// outside of the parent PATCH.
// ---------------------------------------------------------------------------

export function useAddCategoryTranslation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      dto,
    }: {
      categoryId: string;
      dto: CreateCategoryTranslationDto;
    }) => categoryApi.addTranslation(categoryId, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoryKeys.details(),
      });
    },
  });
}

export function useUpdateCategoryTranslation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      translationId,
      dto,
    }: {
      categoryId: string;
      translationId: string;
      dto: UpdateCategoryTranslationDto;
    }) => categoryApi.updateTranslation(categoryId, translationId, dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoryKeys.details(),
      });
    },
  });
}

export function useDeleteCategoryTranslation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      categoryId,
      translationId,
    }: {
      categoryId: string;
      translationId: string;
    }) => categoryApi.removeTranslation(categoryId, translationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: categoryKeys.details(),
      });
    },
  });
}
