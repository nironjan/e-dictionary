"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { AdminWordListItem } from "../../../domain/types/admin-word-list";
import { Badge } from "../../../../../shared/components/ui/badge";
import { Check, CircleX } from "lucide-react";
import type { wordTableFeatures } from "./table-config";
import { WordActions } from "./word-actions";

export const wordColumns: ColumnDef<
  typeof wordTableFeatures,
  AdminWordListItem
>[] = [
  {
    accessorKey: "text",
    header: "Word",
    cell: ({ row }) => <div className="font-medium">{row.original.text}</div>,
  },
  {
    id: "language",
    header: "Language",
    cell: ({ row }) => {
      const language = row.original.language;

      return (
        <div className="flex items-center gap-2">
          <span>{language.name}</span>

          <Badge variant="secondary" className="uppercase">
            {language.code}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    cell: ({ row }) => {
      const isVerified = row.original.isVerified;

      return isVerified ? (
        <Badge variant="outline" className="gap-1">
          <Check className="size-3" />
          Verified
        </Badge>
      ) : (
        <Badge variant="destructive" className="gap-1">
          <CircleX className="size-3" />
          Unverified
        </Badge>
      );
    },
  },
  {
    accessorKey: "version",
    header: "Version",
    cell: ({ row }) => (
      <span className="text-muted-foreground">v{row.original.version}</span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => {
      const updatedAt = new Date(row.original.updatedAt);

      return (
        <span className="text-sm text-muted-foreground">
          {updatedAt.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <WordActions word={row.original} />;
    },
  },
];
