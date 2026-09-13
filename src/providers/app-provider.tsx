"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { Toaster } from "sonner";
import { ThemeProvider } from "./theme-provider";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProviderProps) {
  return (
    <QueryProvider>
      <ThemeProvider
        attribute={"class"}
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <Toaster position="top-right" richColors closeButton />
    </QueryProvider>
  );
}
