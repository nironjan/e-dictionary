export const USER_ROLES = ["admin", "editor", "user"] as const;
export type UserRole = (typeof USER_ROLES)[number];
