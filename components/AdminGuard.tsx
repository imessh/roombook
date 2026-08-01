"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { loading, loadingProfile, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !loadingProfile && !isAdmin) {
      router.replace("/");
    }
  }, [loading, loadingProfile, isAdmin, router]);

  if (loading || loadingProfile || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
