import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { ListUsersParams } from "../../domain/types/user.types";
import { usersKeys } from "../query-keys/user.query-keys";
import { usersApi } from "../../infrastructure/users.api";

export function useUsersQuery(params: ListUsersParams) {
  return useQuery({
    queryKey: usersKeys.list(params),
    queryFn: () => usersApi.list(params),
    placeholderData: keepPreviousData, // avoids table flicker/blank state when page/filters change
  });
}
