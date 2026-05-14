import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface HealthcarePreferences {
    organDonation: string;
    proxyContact: string;
    healthcareProxy: string;
    additionalWishes: string;
    lifeSupport: string;
}
export interface Beneficiary {
    contact: string;
    relationship: string;
    name: string;
    share: string;
}
export interface PersonalDetails {
    country: string;
    dateOfBirth: string;
    city: string;
    fullName: string;
    state: string;
    address: string;
    maritalStatus: string;
}
export interface Document {
    id: string;
    status: DocumentStatus;
    title: string;
    documentType: DocumentType;
    userId: Principal;
    createdAt: bigint;
    shareToken?: string;
    formData: FormData;
    updatedAt: bigint;
    generatedContent?: string;
}
export interface UpdateDocumentRequest {
    status?: DocumentStatus;
    title?: string;
    formData?: FormData;
}
export interface ExecutorInfo {
    guardianContact: string;
    guardianRelationship: string;
    executorRelationship: string;
    executorContact: string;
    guardianName: string;
    executorName: string;
}
export interface UserSummary {
    userId: Principal;
    name: string;
    createdAt: bigint;
    email: string;
    documentCount: bigint;
}
export type DocumentId = string;
export interface FormData {
    step1?: PersonalDetails;
    step2?: Array<Beneficiary>;
    step3?: Array<Asset>;
    step4?: ExecutorInfo;
    step5?: HealthcarePreferences;
}
export interface Asset {
    beneficiaryName: string;
    description: string;
    estimatedValue: string;
    assetType: string;
}
export interface CreateDocumentRequest {
    status: DocumentStatus;
    title: string;
    documentType: DocumentType;
    formData: FormData;
}
export interface PlatformStats {
    usersThisMonth: bigint;
    documentsThisMonth: bigint;
    totalUsers: bigint;
    totalDocuments: bigint;
}
export interface UserProfile {
    name: string;
    createdAt: bigint;
    email: string;
    phone: string;
}
export type ShareToken = string;
export enum DocumentStatus {
    final_ = "final",
    draft = "draft"
}
export enum DocumentType {
    healthcareDirective = "healthcareDirective",
    powerOfAttorney = "powerOfAttorney",
    lastWill = "lastWill"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    adminGetPlatformStats(): Promise<PlatformStats>;
    adminListUsers(): Promise<Array<UserSummary>>;
    adminSetOpenAIApiKey(key: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createDocument(req: CreateDocumentRequest): Promise<Document>;
    deleteDocument(docId: DocumentId): Promise<boolean>;
    generateShareLink(docId: DocumentId): Promise<string>;
    generateWillDocument(docId: DocumentId): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDocument(docId: DocumentId): Promise<Document | null>;
    getDocumentByShareToken(token: ShareToken): Promise<Document | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isOpenAIConfigured(): Promise<boolean>;
    listMyDocuments(): Promise<Array<Document>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDocument(docId: DocumentId, req: UpdateDocumentRequest): Promise<boolean>;
}
