import type { ListUsersParams } from "../../domain/types/user.types";

export const usersKeys = {
  all: ["users"] as const,

  lists: () => [...usersKeys.all, "list"] as const,

  list: (params: ListUsersParams) => [...usersKeys.lists(), params] as const,
};
