"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { OwnerTopbar } from "@/components/layout/owner-topbar";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink/40" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <OwnerTopbar />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
