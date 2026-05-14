import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import DocLib "../lib/document";
import AiLib "../lib/ai";
import OpenAILib "../lib/openai";
import DocTypes "../types/document";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  documents : Map.Map<Common.DocumentId, DocTypes.DocumentInternal>,
  docState : { var nextId : Nat },
  openAIApiKey : { var value : ?Text },
  rateLimitState : Map.Map<Common.UserId, Common.Timestamp>,
) {
  public shared ({ caller }) func createDocument(
    req : DocTypes.CreateDocumentRequest
  ) : async DocTypes.Document {
    let now = Time.now();
    DocLib.create(documents, docState, caller, req, now);
  };

  public query ({ caller }) func listMyDocuments() : async [DocTypes.Document] {
    DocLib.listByUser(documents, caller);
  };

  public query ({ caller }) func getDocument(docId : Common.DocumentId) : async ?DocTypes.Document {
    switch (DocLib.getById(documents, docId)) {
      case null { null };
      case (?doc) {
        if (doc.userId != caller) { null }
        else { ?DocLib.toPublic(doc) };
      };
    };
  };

  public shared ({ caller }) func updateDocument(
    docId : Common.DocumentId,
    req : DocTypes.UpdateDocumentRequest,
  ) : async Bool {
    switch (DocLib.getById(documents, docId)) {
      case null { false };
      case (?doc) {
        if (doc.userId != caller) { return false };
        let now = Time.now();
        DocLib.update(doc, req, now);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteDocument(docId : Common.DocumentId) : async Bool {
    DocLib.delete(documents, docId, caller);
  };

  public shared ({ caller }) func generateWillDocument(docId : Common.DocumentId) : async Text {
    // Rate limit: 10 seconds between calls per user
    let now = Time.now();
    let tenSeconds : Int = 10_000_000_000;
    switch (rateLimitState.get(caller)) {
      case (?lastTime) {
        if (now - lastTime < tenSeconds) {
          Runtime.trap("Rate limit: please wait before generating another document");
        };
      };
      case null {};
    };
    rateLimitState.add(caller, now);

    // Get and validate document
    let doc = switch (DocLib.getById(documents, docId)) {
      case null { Runtime.trap("Document not found") };
      case (?d) { d };
    };
    if (doc.userId != caller) {
      Runtime.trap("Unauthorized: you do not own this document");
    };

    // Require API key
    let apiKey = switch (openAIApiKey.value) {
      case null { Runtime.trap("OpenAI API key not configured. Contact an admin.") };
      case (?k) { k };
    };

    let prompt = AiLib.buildPrompt(doc.documentType, doc.formData);
    let config = OpenAILib.configForKey(apiKey);
    let content = await* OpenAILib.runChatCompletion(config, prompt);
    DocLib.setGeneratedContent(doc, content, Time.now());
    content;
  };

  public shared ({ caller }) func generateShareLink(docId : Common.DocumentId) : async Text {
    let doc = switch (DocLib.getById(documents, docId)) {
      case null { Runtime.trap("Document not found") };
      case (?d) { d };
    };
    if (doc.userId != caller) {
      Runtime.trap("Unauthorized: you do not own this document");
    };
    let now = Time.now();
    DocLib.generateShareToken(doc, now);
  };

  public query func getDocumentByShareToken(token : Common.ShareToken) : async ?DocTypes.Document {
    DocLib.getByShareToken(documents, token);
  };
};
