import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useGetCallerUserProfile, useGetCallerUserRole } from "./useBackend";

export interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  isInitializing: boolean;
  isLoggingIn: boolean;
  principalId: string | null;
  profile: import("../types").UserProfile | null;
  signIn: () => void;
  signOut: () => void;
}

export function useAuth(): AuthState {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
  } = useInternetIdentity();

  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const { data: role, isLoading: roleLoading } = useGetCallerUserRole();

  const signIn = useCallback(() => {
    login();
  }, [login]);

  const signOut = useCallback(() => {
    clear();
    queryClient.clear();
  }, [clear, queryClient]);

  const principalId = identity ? identity.getPrincipal().toString() : null;
  const isAdmin = role === "admin";
  const isLoading =
    isInitializing || (isAuthenticated && (profileLoading || roleLoading));

  return {
    isAuthenticated,
    isAdmin,
    isLoading,
    isInitializing,
    isLoggingIn,
    principalId,
    profile: profile ?? null,
    signIn,
    signOut,
  };
}
