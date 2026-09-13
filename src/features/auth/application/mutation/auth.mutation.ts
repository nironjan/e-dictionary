import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "../query-keys/auth.query-keys";
import type { LoginInputDto } from "../../domain/dto/login-input.dto";
import { authApi } from "../../infrastructure/api/auth.api";
import type { RegisterInputDto } from "../../domain/dto/register-input.dto";
import type { ForgotPasswordInputDto } from "../../domain/dto/forgot-password-input.dto";
import type { ResetPasswordInputDto } from "../../domain/dto/reset-password-input.dto";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInputDto) => authApi.login(input),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInputDto) => authApi.register(input),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: authKeys.all,
      });
    },
  });
};

export const useLogoutAll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: authKeys.all,
      });
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (input: ForgotPasswordInputDto) =>
      authApi.forgotPassword(input),
  });
};

export const useResetPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ResetPasswordInputDto) => authApi.resetPassword(input),
    onSuccess: ({ user }) => {
      queryClient.setQueryData(authKeys.me(), user);
    },
  });
};
