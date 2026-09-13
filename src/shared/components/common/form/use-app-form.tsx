"use client";

import { useForm } from "@tanstack/react-form";
import type { ZodType } from "zod";

type FormValues = Record<string, unknown>;

type AppFormValidators<TValues extends FormValues> = {
  onSubmit?: ZodType<TValues>;
  onChange?: ZodType<TValues>;
};

type AppFormSubmitParams<TValues extends FormValues> = {
  value: TValues;
  formApi: unknown;
};

type UseAppFormOptions<TValues extends FormValues> = {
  defaultValues: TValues;
  validators?: AppFormValidators<TValues>;
  onSubmit: (params: AppFormSubmitParams<TValues>) => void | Promise<void>;
};

export function useAppForm<TValues extends FormValues>(
  options: UseAppFormOptions<TValues>,
) {
  return useForm({
    defaultValues: options.defaultValues,

    validators: {
      onSubmit: ({ value }) => {
        const schema = options.validators?.onSubmit;

        if (!schema) {
          return undefined;
        }

        const result = schema.safeParse(value);

        if (result.success) {
          return undefined;
        }

        const errors = result.error.flatten();

        const fieldErrors: Record<string, string> = {};

        for (const [key, messages] of Object.entries(errors.fieldErrors)) {
          if (messages && messages.length > 0) {
            fieldErrors[key] = messages[0];
          }
        }

        return {
          form: errors.formErrors.join(", ") || undefined,
          fields: fieldErrors,
        };
      },
    },

    onSubmit: async ({ value, formApi }) => {
      await options.onSubmit({
        value,
        formApi,
      });
    },
  });
}
