export const USERS_ENDPOINTS = {
  list: "/users",
  updateRole: (id: string) => `/users/${id}/role`,
  updateStatus: (id: string) => `/users/${id}/status`,
  delete: (id: string) => `/users/${id}`,
} as const;
