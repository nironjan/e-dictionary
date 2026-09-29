"use client";

import { useState } from "react";

import { AlertCircle, BadgeCheck } from "lucide-react";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Switch } from "@/shared/components/ui/switch";

import { useUpdateSpecialExpressionVerificationMutation } from "../../application/mutations/use-update-special-expression-verification-mutation";
import { useSpecialExpressionQuery } from "../../application/queries/use-special-expression-query";
import type { SpecialExpression } from "../../domain/types/special-expression.type";

interface SpecialExpressionVerificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expressionId: string | null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to update verification status";
}

export function SpecialExpressionVerificationDrawer({
  open,
  onOpenChange,
  expressionId,
}: SpecialExpressionVerificationDrawerProps) {
  const { data: expression, isLoading } = useSpecialExpressionQuery(
    expressionId ?? "",
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {isLoading && (
        <DialogContent className="sm:max-w-lg">
          <div className="py-6 text-center text-sm text-muted-foreground">
            Loading expression…
          </div>
        </DialogContent>
      )}

      {expression && (
        <SpecialExpressionVerificationContent
          key={expression.id}
          expression={expression}
          onClose={() => onOpenChange(false)}
        />
      )}
    </Dialog>
  );
}

interface SpecialExpressionVerificationContentProps {
  expression: SpecialExpression;
  onClose: () => void;
}

function SpecialExpressionVerificationContent({
  expression,
  onClose,
}: SpecialExpressionVerificationContentProps) {
  const updateVerificationMutation =
    useUpdateSpecialExpressionVerificationMutation();

  const [isVerified, setIsVerified] = useState(expression.isVerified);
  const [error, setError] = useState<string | null>(null);

  const hasChanges = isVerified !== expression.isVerified;
  const isSaving = updateVerificationMutation.isPending;

  const handleSave = async () => {
    if (!hasChanges) {
      onClose();
      return;
    }

    setError(null);

    try {
      await updateVerificationMutation.mutateAsync({
        id: expression.id,
        isVerified,
      });

      onClose();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  };

  const handleCancel = () => {
    setError(null);
    onClose();
  };

  return (
    <DialogContent className="flex max-h-[85vh] w-[95vw] max-w-lg flex-col overflow-hidden sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BadgeCheck className="size-5" />
          Verify Expression
        </DialogTitle>

        <DialogDescription>
          Review the expression and update its verification status.
        </DialogDescription>
      </DialogHeader>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-2 pr-1">
        {/* Expression */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs capitalize">
              {expression.type}
            </Badge>

            <Badge
              variant={expression.isVerified ? "default" : "secondary"}
              className="text-xs"
            >
              {expression.isVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>

          <p className="text-base font-semibold">{expression.expression}</p>
        </div>

        {/* Meaning */}
        {expression.meaning && (
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Meaning
            </p>

            <p className="text-sm">{expression.meaning}</p>
          </div>
        )}

        {/* Replacement */}
        {expression.replacement && (
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Replacement
            </p>

            <p className="text-sm">{expression.replacement}</p>
          </div>
        )}

        {/* Literal meaning */}
        {expression.literalMeaning && (
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Literal Meaning
            </p>

            <p className="text-sm">{expression.literalMeaning}</p>
          </div>
        )}

        {/* Example */}
        {expression.example && (
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Example
            </p>

            <p className="text-sm">{expression.example}</p>
          </div>
        )}

        {/* Notes */}
        {expression.notes && (
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Notes
            </p>

            <p className="text-sm text-muted-foreground">{expression.notes}</p>
          </div>
        )}

        {/* Verification */}
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium">Verification Status</div>

              <p className="text-xs text-muted-foreground">
                Mark this expression as reviewed and verified.
              </p>
            </div>

            <Switch
              checked={isVerified}
              onCheckedChange={setIsVerified}
              disabled={isSaving}
            />
          </div>

          <div className="mt-3">
            <Badge
              variant={isVerified ? "default" : "secondary"}
              className="text-xs"
            >
              {isVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-2 text-xs text-destructive">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 border-t pt-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>

        <Button
          type="button"
          size="sm"
          onClick={() => void handleSave()}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? "Saving..." : "Save Verification"}
        </Button>
      </div>
    </DialogContent>
  );
}
