"use client";

import { useRouter } from "next/navigation";
import { useLanguageForm } from "../hooks/use-language-form";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Switch } from "@/shared/components/ui/switch";
import type { Language } from "../../domain/types/language.type";

type LanguageFormProps = {
  language?: Language;
};

export function LanguageForm({ language }: LanguageFormProps) {
  const router = useRouter();

  const { form, isEditMode, isSubmitting, error } = useLanguageForm({
    language,
    onSuccess: () => {
      router.push("/dashboard/languages");
      router.refresh();
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        void form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Code */}
        <form.Field name="code">
          {(field) => {
            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Language Code</Label>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="en"
                  autoComplete="off"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Use a lowercase ISO-style code, e.g. en, hi, as.
                </p>
              </div>
            );
          }}
        </form.Field>

        {/* Name */}
        <form.Field name="name">
          {(field) => {
            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Name</Label>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="English"
                  autoComplete="off"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Native Name */}
        <form.Field name="nativeName">
          {(field) => {
            return (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Native Name</Label>

                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="English"
                  autoComplete="off"
                />

                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]?.message}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Active */}
        <form.Field name="isActive">
          {(field) => {
            return (
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-1">
                  <Label htmlFor={field.name}>Active</Label>

                  <p className="text-sm text-muted-foreground">
                    Make this language available in the dictionary.
                  </p>
                </div>

                <Switch
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={field.handleChange}
                />
              </div>
            );
          }}
        </form.Field>
      </div>

      {/* Mutation error */}
      {error instanceof Error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
          {error.message}
        </div>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push("/dashboard/languages")}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Language"
              : "Create Language"}
        </Button>
      </div>
    </form>
  );
}
