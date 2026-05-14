module {
  public type DocumentType = {
    #lastWill;
    #powerOfAttorney;
    #healthcareDirective;
  };

  public type DocumentStatus = {
    #draft;
    #final_;
  };

  // Step 1: Personal details
  public type PersonalDetails = {
    fullName : Text;
    dateOfBirth : Text;
    address : Text;
    city : Text;
    state : Text;
    country : Text;
    maritalStatus : Text;
  };

  // Step 2: Beneficiaries
  public type Beneficiary = {
    name : Text;
    relationship : Text;
    share : Text;
    contact : Text;
  };

  // Step 3: Assets
  public type Asset = {
    assetType : Text;
    description : Text;
    estimatedValue : Text;
    beneficiaryName : Text;
  };

  // Step 4: Executor / guardian
  public type ExecutorInfo = {
    executorName : Text;
    executorRelationship : Text;
    executorContact : Text;
    guardianName : Text;
    guardianRelationship : Text;
    guardianContact : Text;
  };

  // Step 5: Healthcare preferences
  public type HealthcarePreferences = {
    healthcareProxy : Text;
    proxyContact : Text;
    lifeSupport : Text;
    organDonation : Text;
    additionalWishes : Text;
  };

  public type FormData = {
    step1 : ?PersonalDetails;
    step2 : ?[Beneficiary];
    step3 : ?[Asset];
    step4 : ?ExecutorInfo;
    step5 : ?HealthcarePreferences;
  };

  // Internal record (with var fields for mutation)
  public type DocumentInternal = {
    id : Text;
    userId : Principal;
    title : Text;
    documentType : DocumentType;
    var status : DocumentStatus;
    var formData : FormData;
    var generatedContent : ?Text;
    createdAt : Int;
    var updatedAt : Int;
    var shareToken : ?Text;
  };

  // Shared (public API boundary — no var fields)
  public type Document = {
    id : Text;
    userId : Principal;
    title : Text;
    documentType : DocumentType;
    status : DocumentStatus;
    formData : FormData;
    generatedContent : ?Text;
    createdAt : Int;
    updatedAt : Int;
    shareToken : ?Text;
  };

  public type CreateDocumentRequest = {
    title : Text;
    documentType : DocumentType;
    formData : FormData;
    status : DocumentStatus;
  };

  public type UpdateDocumentRequest = {
    title : ?Text;
    formData : ?FormData;
    status : ?DocumentStatus;
  };
};
