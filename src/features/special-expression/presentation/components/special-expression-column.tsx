"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { BadgeCheck, Edit2, Languages, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import type { SpecialExpression } from "../../domain/types/special-expression.type";
import type { specialExpressionTableFeatures } from "./config/special-expression-table.config";

interface SpecialExpressionColumnsOptions {
  onEdit: (expression: SpecialExpression) => void;
  onManageTranslations: (expression: SpecialExpression) => void;
  onVerify: (expression: SpecialExpression) => void;
  onDelete: (expression: SpecialExpression) => void;
}

export function getSpecialExpressionColumns({
  onEdit,
  onManageTranslations,
  onVerify,
  onDelete,
}: SpecialExpressionColumnsOptions): ColumnDef<
  typeof specialExpressionTableFeatures,
  SpecialExpression
>[] {
  return [
    {
      id: "expression",
      header: "Expression",
      cell: ({ row }) => {
        const expression = row.original;

        return (
          <div className="min-w-70 max-w-125 space-y-1">
            <div className="font-medium">{expression.expression}</div>

            {expression.meaning && (
              <div className="line-clamp-2 text-sm text-muted-foreground">
                {expression.meaning}
              </div>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium capitalize">
          {row.original.type}
        </span>
      ),
    },

    {
      id: "translations",
      header: "Languages",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.translations.length > 0 ? (
            row.original.translations.map((translation) => (
              <span
                key={translation.id}
                className="rounded-md bg-muted px-2 py-1 text-xs font-medium"
              >
                {translation.languageCode}
              </span>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>
      ),
    },

    {
      accessorKey: "isVerified",
      header: "Verified",
      cell: ({ row }) => (
        <span
          className={
            row.original.isVerified
              ? "text-sm font-medium"
              : "text-sm text-muted-foreground"
          }
        >
          {row.original.isVerified ? "Yes" : "No"}
        </span>
      ),
    },

    {
      accessorKey: "updatedAt",
      header: "Updated",
      cell: ({ row }) => {
        const date = new Date(row.original.updatedAt);

        return (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {date.toLocaleDateString()}
          </span>
        );
      },
    },

    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => {
        const expression = row.original;

        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 gap-1 px-2 text-xs"
              onClick={() => onManageTranslations(expression)}
              title="Manage Translations"
            >
              <Languages className="size-3" />
              <span>Translations</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={() => onVerify(expression)}
              title={
                expression.isVerified
                  ? "Manage Verification"
                  : "Verify Expression"
              }
            >
              <BadgeCheck className="size-3.5" />
              <span className="sr-only">
                {expression.isVerified
                  ? "Manage verification"
                  : "Verify expression"}
              </span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(expression)}
              title="Edit Expression"
            >
              <Edit2 className="size-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(expression)}
              title="Delete Expression"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];
}
