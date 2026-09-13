"use client";

import { useFieldContext } from "./word-form-context";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function TextField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  const field = useFieldContext<string | undefined>();
  const errors = field.state.meta.errors;
  const hasError = field.state.meta.isTouched && errors.length > 0;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>{label}</Label>
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={hasError}
      />
      {hasError && (
        <p className="text-sm text-destructive">
          {errors
            .map((err) => (typeof err === "string" ? err : err?.message))
            .join(", ")}
        </p>
      )}
    </div>
  );
}
