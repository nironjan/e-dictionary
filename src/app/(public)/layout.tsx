import type { ReactNode } from "react";
import { Header } from "../../shared/components/common/header";
import { Footer } from "../../shared/components/common/footer";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-zinc-50 font-sans dark:bg-black">
        {children}
      </main>
      <Footer />
    </div>
  );
}
