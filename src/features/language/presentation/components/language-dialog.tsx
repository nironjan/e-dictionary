"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import type { Language } from "../../domain/types/language.type";
import { useLanguageForm } from "../hooks/use-language-form";
import { Switch } from "../../../../shared/components/ui/switch";
import { Label } from "../../../../shared/components/ui/label";

interface LanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language?: Language | null;
}

export function LanguageDialog({
  open,
  onOpenChange,
  language,
}: LanguageDialogProps) {
  const { form, isSaving, isEditing } = useLanguageForm({
    language,
    open,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-xl max-w-xl">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Language" : "Create Language"}
            </DialogTitle>

            <DialogDescription>
              {isEditing
                ? `Update language configuration for ${language?.name} (${language?.code}).`
                : "Add a new dictionary locale with native script and RTL direction support."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-2">
            <form.Field name="code">
              {(field) => {
                return (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-1 block text-xs font-semibold text-zinc-700"
                    >
                      Language Code (ISO){" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value.toLowerCase())
                      }
                      onBlur={field.handleBlur}
                      placeholder="e.g. en, as, brx, hi"
                      disabled={isEditing}
                      className={
                        field.state.meta.errors.length > 0
                          ? "border-red-500"
                          : ""
                      }
                    />

                    {field.state.meta.errors.map((error) => (
                      <p key={error} className="mt-1 text-[11px] text-red-600">
                        {error}
                      </p>
                    ))}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="name">
              {(field) => {
                return (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-1 block text-xs font-semibold text-zinc-700"
                    >
                      Language Name <span className="text-red-500">*</span>
                    </label>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(event) => {
                        const name = event.target.value;
                        field.handleChange(name);

                        if (!form.getFieldValue("slug")) {
                          form.setFieldValue(
                            "slug",
                            name.toLowerCase().trim().replace(/\s+/g, "-"),
                          );
                        }
                      }}
                      onBlur={field.handleBlur}
                      placeholder="e.g. English, Assamese, Bodo"
                      className={
                        field.state.meta.errors.length > 0
                          ? "border-red-500"
                          : ""
                      }
                    />

                    {field.state.meta.errors.map((error) => (
                      <p key={error} className="mt-1 text-[11px] text-red-600">
                        {error}
                      </p>
                    ))}
                  </div>
                );
              }}
            </form.Field>

            <form.Field name="nativeName">
              {(field) => {
                return (
                  <div>
                    <label
                      htmlFor={field.name}
                      className="mb-1 block text-xs font-semibold text-zinc-700"
                    >
                      Native Name / Script
                    </label>

                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      onBlur={field.handleBlur}
                      placeholder="e.g. অসমীয়া, बड', हिन्दी"
                    />

                    {field.state.meta.errors.map((error) => (
                      <p key={error} className="mt-1 text-[11px] text-red-600">
                        {error}
                      </p>
                    ))}
                  </div>
                );
              }}
            </form.Field>

            <div className="flex items-center gap-6 pt-5">
              <form.Field name="isActive">
                {(field) => {
                  return (
                    <div className="flex items-center gap-2">
                      <Switch
                        id={field.name}
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                      />
                      <Label htmlFor={field.name}>Active Status</Label>
                    </div>
                  );
                }}
              </form.Field>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>

            <Button size="sm" type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Update Language"
                  : "Create Language"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
