/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "@tanstack/react-form";
import type { ZodType } from "zod";

export function useWordAppForm<TValues extends Record<string, any>>(options: {
  defaultValues: TValues;
  validators?: {
    onSubmit?: ZodType<any>;
    onChange?: ZodType<any>;
  };
  onSubmit: (params: { value: TValues; formApi: any }) => void | Promise<void>;
}) {
  return useForm({
    defaultValues: options.defaultValues,
    validators: {
      onSubmit: ({ value }: { value: TValues }) => {
        if (!options.validators?.onSubmit) return undefined;
        const result = options.validators.onSubmit.safeParse(value);
        if (!result.success) {
          const errors = result.error.flatten();
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(errors.fieldErrors)) {
            if (msgs && msgs.length > 0) {
              fieldErrors[key] = msgs[0];
            }
          }
          return {
            form: errors.formErrors.join(", ") || undefined,
            fields: fieldErrors,
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value, formApi }) => {
      await options.onSubmit({ value, formApi });
    },
  });
}
