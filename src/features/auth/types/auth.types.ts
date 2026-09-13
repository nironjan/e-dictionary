export type UserRole = "admin" | "editor" | "user";

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  avatarUrl?: string;
  role: UserRole;
};

export type AuthResponse = {
  user: AuthUser;
};

export type LogoutResponse = {
  success: true;
};

export type ForgotPasswordResponse = {
  success: true;
};

export type ResetPasswordResponse = {
  success: true;
  user: AuthUser;
};
