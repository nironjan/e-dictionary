import { useForm } from "@tanstack/react-form";
import { useLogin } from "../../application/mutation/auth.mutation";
import { loginSchema } from "../../schemas/auth.schema";
import type { LoginInputDto } from "../../domain/dto/login-input.dto";
import { getErrorMessage } from "../../../../shared/errors/api-error-handler";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { APP_CONSTANTS } from "../../../../lib/constants/constants";
import { useToast } from "../../../../shared/hooks/use-toast";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function useLoginForm({ onSuccess }: LoginFormProps) {
  const router = useRouter();
  const toast = useToast();
  const loginMutation = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    } satisfies LoginInputDto,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);

      try {
        await loginMutation.mutateAsync(value);
        toast.success("Login Successful");
        router.replace(APP_CONSTANTS.ROUTES.HOME);
        router.refresh();
        onSuccess?.();
      } catch (error: unknown) {
        setServerError(getErrorMessage(error));
      }
    },
  });
  return {
    form,
    isLogging: loginMutation.isPending,
    serverError,
  };
}
