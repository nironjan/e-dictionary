export type Role = "user" | "editor" | "admin";

export type UserStatus = "active" | "inactive" | "suspended";

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  googleId: string | null;
  githubId: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedUsers {
  data: SafeUser[];
  pagination: PaginationMeta;
}

export interface ListUsersParams {
  [key: string]: string | number | undefined;

  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  status?: UserStatus;
  sortBy?: "name" | "email" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface UpdateUserRolePayload {
  id: string;
  role: Role;
}

export interface UpdateUserStatusPayload {
  id: string;
  status: UserStatus;
}

export interface DeleteUserPayload {
  id: string;
}
