import type { AdminWordListQuery } from "../../domain/types/admin-word-list";

export const adminWordKeys = {
  all: ["dictionary", "admin", "words"] as const,

  lists: () => [...adminWordKeys.all, "list"] as const,

  list: (params: AdminWordListQuery) =>
    [...adminWordKeys.lists(), "list", params] as const,

  details: () => [...adminWordKeys.all, "detail"] as const,

  detail: (id: string) => [...adminWordKeys.details(), id] as const,
} as const;
