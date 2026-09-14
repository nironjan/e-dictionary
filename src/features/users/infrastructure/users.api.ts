import apiClient from "../../../lib/api/api-client";
import type {
  DeleteUserPayload,
  ListUsersParams,
  PaginatedUsers,
  SafeUser,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
} from "../domain/types/user.types";
import { USERS_ENDPOINTS } from "./users.endpoints";

function buildQueryString(query: ListUsersParams): string {
  const searchParams = new URLSearchParams();

  if (query.page !== undefined) {
    searchParams.set("page", String(query.page));
  }

  if (query.limit !== undefined) {
    searchParams.set("limit", String(query.limit));
  }

  if (query.search?.trim()) {
    searchParams.set("search", query.search.trim());
  }

  if (query.role) {
    searchParams.set("role", query.role);
  }

  if (query.status) {
    searchParams.set("status", query.status);
  }

  if (query.sortBy) {
    searchParams.set("sortBy", query.sortBy);
  }

  if (query.sortOrder) {
    searchParams.set("sortOrder", query.sortOrder);
  }

  const queryString = searchParams.toString();

  return queryString
    ? `${USERS_ENDPOINTS.list}?${queryString}`
    : USERS_ENDPOINTS.list;
}

export const usersApi = {
  list: (query: ListUsersParams = {}): Promise<PaginatedUsers> => {
    return apiClient.get<PaginatedUsers>(buildQueryString(query));
  },

  updateRole: ({ id, role }: UpdateUserRolePayload): Promise<SafeUser> => {
    return apiClient.patch<SafeUser>(USERS_ENDPOINTS.updateRole(id), { role });
  },

  updateStatus: ({
    id,
    status,
  }: UpdateUserStatusPayload): Promise<SafeUser> => {
    return apiClient.patch<SafeUser>(USERS_ENDPOINTS.updateStatus(id), {
      status,
    });
  },

  remove: ({ id }: DeleteUserPayload): Promise<void> => {
    return apiClient.delete<void>(USERS_ENDPOINTS.delete(id));
  },
};
