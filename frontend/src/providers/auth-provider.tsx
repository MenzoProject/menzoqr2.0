"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getStoredToken, setStoredToken } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { User } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (token: string, user: User) => void;
  signOut: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = React.useState<boolean>(false);

  React.useEffect(() => {
    setHasToken(Boolean(getStoredToken()));
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get<User>(endpoints.auth.me);
      return data;
    },
    enabled: hasToken,
    retry: false,
  });

  const signIn = React.useCallback(
    (token: string, nextUser: User) => {
      setStoredToken(token);
      setHasToken(true);
      queryClient.setQueryData(["auth", "me"], nextUser);
    },
    [queryClient]
  );

  const signOut = React.useCallback(async () => {
    try {
      await apiClient.post(endpoints.auth.logout);
    } finally {
      setStoredToken(null);
      setHasToken(false);
      queryClient.removeQueries({ queryKey: ["auth", "me"] });
      router.push("/login");
    }
  }, [queryClient, router]);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isLoading: hasToken && isLoading,
      isAuthenticated: Boolean(user),
      signIn,
      signOut,
    }),
    [user, isLoading, hasToken, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
