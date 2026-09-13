import type { ReactNode } from "react";
import { AccountAuthGuard } from "@/features/auth/components/auth-guard";

type AccountLayoutProps = {
  children: ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return <AccountAuthGuard>{children}</AccountAuthGuard>;
}
