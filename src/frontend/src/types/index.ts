import type {
  Asset,
  Beneficiary,
  CreateDocumentRequest,
  Document,
  DocumentStatus,
  DocumentType,
  ExecutorInfo,
  FormData,
  HealthcarePreferences,
  PersonalDetails,
  PlatformStats,
  UpdateDocumentRequest,
  UserProfile,
  UserRole,
  UserSummary,
} from "@/backend";

export type {
  Document,
  DocumentType,
  DocumentStatus,
  FormData,
  PersonalDetails,
  Beneficiary,
  Asset,
  ExecutorInfo,
  HealthcarePreferences,
  UserProfile,
  UserSummary,
  PlatformStats,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  UserRole,
};

export interface AuthUser {
  profile: UserProfile | null;
  isAdmin: boolean;
  principalId: string;
}

export interface NavItem {
  label: string;
  href: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}
