import type { backendInterface } from "../backend.d";
import {
  DocumentStatus,
  DocumentType,
  UserRole,
} from "../backend.d";

const mockPrincipal = {
  toText: () => "aaaaa-aa",
  toString: () => "aaaaa-aa",
  toUint8Array: () => new Uint8Array(29),
  isAnonymous: () => false,
  compareTo: () => "eq" as const,
  toJSON: () => "aaaaa-aa",
  _isPrincipal: true as const,
} as any;

const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleDoc1 = {
  id: "doc-001",
  status: DocumentStatus.final_,
  title: "My Last Will & Testament",
  documentType: DocumentType.lastWill,
  userId: mockPrincipal,
  createdAt: now - BigInt(7 * 24 * 3600) * BigInt(1_000_000_000),
  updatedAt: now - BigInt(3 * 24 * 3600) * BigInt(1_000_000_000),
  shareToken: undefined,
  generatedContent:
    "I, John Smith, being of sound mind, do hereby declare this to be my Last Will and Testament...",
  formData: {
    step1: {
      fullName: "John Smith",
      dateOfBirth: "1970-05-15",
      country: "United States",
      state: "California",
      city: "San Francisco",
      address: "123 Main Street",
      maritalStatus: "married",
    },
    step2: [
      {
        name: "Jane Smith",
        relationship: "Spouse",
        share: "60%",
        contact: "jane@example.com",
      },
      {
        name: "Emily Smith",
        relationship: "Daughter",
        share: "40%",
        contact: "emily@example.com",
      },
    ],
    step3: [
      {
        assetType: "Real Estate",
        description: "Primary residence at 123 Main Street",
        estimatedValue: "$850,000",
        beneficiaryName: "Jane Smith",
      },
      {
        assetType: "Investment Account",
        description: "Brokerage account #12345",
        estimatedValue: "$250,000",
        beneficiaryName: "Emily Smith",
      },
    ],
    step4: {
      executorName: "Robert Johnson",
      executorRelationship: "Brother",
      executorContact: "robert@example.com",
      guardianName: "Sarah Williams",
      guardianRelationship: "Sister",
      guardianContact: "sarah@example.com",
    },
    step5: {
      lifeSupport: "Do not resuscitate if no reasonable chance of recovery",
      organDonation: "Yes, donate all viable organs",
      healthcareProxy: "Jane Smith",
      proxyContact: "jane@example.com",
      additionalWishes: "Cremation preferred",
    },
  },
};

const sampleDoc2 = {
  id: "doc-002",
  status: DocumentStatus.draft,
  title: "Power of Attorney",
  documentType: DocumentType.powerOfAttorney,
  userId: mockPrincipal,
  createdAt: now - BigInt(2 * 24 * 3600) * BigInt(1_000_000_000),
  updatedAt: now - BigInt(1 * 24 * 3600) * BigInt(1_000_000_000),
  shareToken: undefined,
  generatedContent: undefined,
  formData: {
    step1: {
      fullName: "John Smith",
      dateOfBirth: "1970-05-15",
      country: "United States",
      state: "California",
      city: "San Francisco",
      address: "123 Main Street",
      maritalStatus: "married",
    },
  },
};

const sampleDoc3 = {
  id: "doc-003",
  status: DocumentStatus.final_,
  title: "Healthcare Directive",
  documentType: DocumentType.healthcareDirective,
  userId: mockPrincipal,
  createdAt: now - BigInt(14 * 24 * 3600) * BigInt(1_000_000_000),
  updatedAt: now - BigInt(14 * 24 * 3600) * BigInt(1_000_000_000),
  shareToken: "share-token-abc123",
  generatedContent:
    "This Healthcare Directive sets forth my wishes regarding medical treatment...",
  formData: {
    step5: {
      lifeSupport: "Comfort care only",
      organDonation: "Yes",
      healthcareProxy: "Jane Smith",
      proxyContact: "jane@example.com",
      additionalWishes: "No extraordinary measures",
    },
  },
};

export const mockBackend: backendInterface = {
  adminGetPlatformStats: async () => ({
    totalUsers: BigInt(1248),
    totalDocuments: BigInt(3891),
    usersThisMonth: BigInt(87),
    documentsThisMonth: BigInt(312),
  }),
  adminListUsers: async () => [
    {
      userId: mockPrincipal,
      name: "John Smith",
      email: "john@example.com",
      createdAt: now - BigInt(30 * 24 * 3600) * BigInt(1_000_000_000),
      documentCount: BigInt(3),
    },
    {
      userId: mockPrincipal,
      name: "Alice Johnson",
      email: "alice@example.com",
      createdAt: now - BigInt(15 * 24 * 3600) * BigInt(1_000_000_000),
      documentCount: BigInt(1),
    },
    {
      userId: mockPrincipal,
      name: "Bob Williams",
      email: "bob@example.com",
      createdAt: now - BigInt(7 * 24 * 3600) * BigInt(1_000_000_000),
      documentCount: BigInt(2),
    },
  ],
  adminSetOpenAIApiKey: async () => undefined,
  assignCallerUserRole: async () => undefined,
  createDocument: async (req) => ({
    id: "doc-new-" + Date.now(),
    ...req,
    userId: mockPrincipal,
    createdAt: now,
    updatedAt: now,
    shareToken: undefined,
    generatedContent: undefined,
  }),
  deleteDocument: async () => true,
  generateShareLink: async (docId) =>
    `https://willmaker.ai/share/${docId}?token=mock-share-token`,
  generateWillDocument: async () =>
    "LAST WILL AND TESTAMENT\n\nI, John Smith, being of sound mind and body, do hereby declare this to be my Last Will and Testament, revoking all prior wills and codicils.\n\nARTICLE I: PERSONAL DETAILS\nI reside at 123 Main Street, San Francisco, California, United States.\n\nARTICLE II: BENEFICIARIES\nI bequeath my estate as follows: 60% to my spouse Jane Smith, and 40% to my daughter Emily Smith.\n\nARTICLE III: EXECUTOR\nI appoint Robert Johnson as executor of this will.\n\nSigned this day with full legal intent.",
  getCallerUserProfile: async () => ({
    name: "John Smith",
    email: "john@example.com",
    phone: "+1-555-0123",
    createdAt: now - BigInt(30 * 24 * 3600) * BigInt(1_000_000_000),
  }),
  getCallerUserRole: async () => UserRole.user,
  getDocument: async (docId) => {
    if (docId === "doc-001") return sampleDoc1;
    if (docId === "doc-002") return sampleDoc2;
    if (docId === "doc-003") return sampleDoc3;
    return null;
  },
  getDocumentByShareToken: async () => sampleDoc3,
  getUserProfile: async () => ({
    name: "John Smith",
    email: "john@example.com",
    phone: "+1-555-0123",
    createdAt: now - BigInt(30 * 24 * 3600) * BigInt(1_000_000_000),
  }),
  isCallerAdmin: async () => false,
  isOpenAIConfigured: async () => true,
  listMyDocuments: async () => [sampleDoc1, sampleDoc2, sampleDoc3],
  saveCallerUserProfile: async () => undefined,
  updateDocument: async () => true,
};
