import { apiClient } from "@/lib/api/api-client";
import type {
  AuthResponse,
  AuthUser,
  ForgotPasswordResponse,
  LogoutResponse,
  ResetPasswordResponse,
} from "../../types/auth.types";
import { AUTH_ENDPOINTS } from "./auth.endpoints";
import type { LoginInputDto } from "../../domain/dto/login-input.dto";
import type { RegisterInputDto } from "../../domain/dto/register-input.dto";
import type { ForgotPasswordInputDto } from "../../domain/dto/forgot-password-input.dto";
import type { ResetPasswordInputDto } from "../../domain/dto/reset-password-input.dto";
import type { GoogleLinkInputDto } from "../../domain/dto/google-link.dto";

export const authApi = {
  login: (input: LoginInputDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(AUTH_ENDPOINTS.auth.login, input);
  },

  register: (input: RegisterInputDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>(AUTH_ENDPOINTS.auth.register, input);
  },

  linkGoogle: (input: GoogleLinkInputDto): Promise<AuthUser> => {
    return apiClient.post<AuthUser>(AUTH_ENDPOINTS.auth.googleLink, input);
  },

  profile: (): Promise<AuthUser> => {
    return apiClient.get<AuthUser>(AUTH_ENDPOINTS.auth.me);
  },
  logout: (): Promise<LogoutResponse> => {
    return apiClient.post<LogoutResponse>(AUTH_ENDPOINTS.auth.logout);
  },

  logoutAll: (): Promise<LogoutResponse> => {
    return apiClient.post<LogoutResponse>(AUTH_ENDPOINTS.auth.logoutAll);
  },

  forgotPassword: (
    input: ForgotPasswordInputDto,
  ): Promise<ForgotPasswordResponse> => {
    return apiClient.post<ForgotPasswordResponse>(
      AUTH_ENDPOINTS.auth.forgotPassword,
      input,
    );
  },

  resetPassword: (
    input: ResetPasswordInputDto,
  ): Promise<ResetPasswordResponse> => {
    return apiClient.post<ResetPasswordResponse>(
      AUTH_ENDPOINTS.auth.resetPassword,
      input,
    );
  },
};
