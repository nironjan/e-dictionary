"use client";

import type { ReactNode } from "react";
import { Label } from "@/shared/components/ui/label";

type FieldShellProps = {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: ReactNode;
};

export function FieldShell({
  id,
  label,
  description,
  error,
  children,
}: FieldShellProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
