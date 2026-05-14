import { createActor } from "@/backend";
import type { UserRole } from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateDocumentRequest,
  UpdateDocumentRequest,
  UserProfile,
} from "../types";

function useBackendActor() {
  return useActor(createActor);
}

// ─── Profile ───────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  const query = useQuery<UserProfile | null>({
    queryKey: ["callerUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerUserProfile"] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<UserRole>({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

// ─── Documents ─────────────────────────────────────────────────────────────

export function useListMyDocuments() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["myDocuments"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.listMyDocuments();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetDocument(docId: string | undefined) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["document", docId],
    queryFn: async () => {
      if (!actor || !docId) throw new Error("Actor or docId not available");
      return actor.getDocument(docId);
    },
    enabled: !!actor && !actorFetching && !!docId,
  });
}

export function useGetDocumentByShareToken(token: string | undefined) {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["documentByToken", token],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Actor or token not available");
      return actor.getDocumentByShareToken(token);
    },
    enabled: !!actor && !actorFetching && !!token,
  });
}

export function useCreateDocument() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: CreateDocumentRequest) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createDocument(req);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
    },
  });
}

export function useUpdateDocument() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      docId,
      req,
    }: {
      docId: string;
      req: UpdateDocumentRequest;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateDocument(docId, req);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
      queryClient.invalidateQueries({
        queryKey: ["document", variables.docId],
      });
    },
  });
}

export function useDeleteDocument() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteDocument(docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
    },
  });
}

export function useGenerateWillDocument() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.generateWillDocument(docId);
    },
    onSuccess: (_data, docId) => {
      queryClient.invalidateQueries({ queryKey: ["document", docId] });
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
    },
  });
}

export function useGenerateShareLink() {
  const { actor } = useBackendActor();
  return useMutation({
    mutationFn: async (docId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.generateShareLink(docId);
    },
  });
}

// ─── Admin ─────────────────────────────────────────────────────────────────

export function useAdminListUsers() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.adminListUsers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAdminGetPlatformStats() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery({
    queryKey: ["platformStats"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.adminGetPlatformStats();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAdminSetOpenAIApiKey() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (key: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.adminSetOpenAIApiKey(key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isOpenAIConfigured"] });
    },
  });
}

export function useIsOpenAIConfigured() {
  const { actor, isFetching: actorFetching } = useBackendActor();
  return useQuery<boolean>({
    queryKey: ["isOpenAIConfigured"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.isOpenAIConfigured();
    },
    enabled: !!actor && !actorFetching,
  });
}
