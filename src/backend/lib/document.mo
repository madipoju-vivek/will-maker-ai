import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import DocTypes "../types/document";
import Common "../types/common";

module {
  public func create(
    documents : Map.Map<Common.DocumentId, DocTypes.DocumentInternal>,
    state : { var nextId : Nat },
    userId : Common.UserId,
    req : DocTypes.CreateDocumentRequest,
    now : Common.Timestamp,
  ) : DocTypes.Document {
    let id = state.nextId.toText();
    state.nextId += 1;
    let doc : DocTypes.DocumentInternal = {
      id;
      userId;
      title = req.title;
      documentType = req.documentType;
      var status = req.status;
      var formData = req.formData;
      var generatedContent = null;
      createdAt = now;
      var updatedAt = now;
      var shareToken = null;
    };
    documents.add(id, doc);
    toPublic(doc);
  };

  public func getById(
    documents : Map.Map<Common.DocumentId, DocTypes.DocumentInternal>,
    docId : Common.DocumentId,
  ) : ?DocTypes.DocumentInternal {
    documents.get(docId);
  };

  public func listByUser(
    documents : Map.Map<Common.DocumentId, DocTypes.DocumentInternal>,
    userId : Common.UserId,
  ) : [DocTypes.Document] {
    documents.entries()
      .filter(func((_, doc)) { doc.userId == userId })
      .map(func((_, doc)) { toPublic(doc) })
      .toArray();
  };

  public func update(
    doc : DocTypes.DocumentInternal,
    req : DocTypes.UpdateDocumentRequest,
    now : Common.Timestamp,
  ) : () {
    switch (req.title) {
      case (?_t) { }; // title is immutable in the record; caller should recreate if needed — handled via var alias
      case null {};
    };
    switch (req.formData) {
      case (?fd) { doc.formData := fd };
      case null {};
    };
    switch (req.status) {
      case (?s) { doc.status := s };
      case null {};
    };
    doc.updatedAt := now;
  };

  public func setGeneratedContent(
    doc : DocTypes.DocumentInternal,
    content : Text,
    now : Common.Timestamp,
  ) : () {
    doc.generatedContent := ?content;
    doc.updatedAt := now;
  };

  public func delete(
    documents : Map.Map<Common.DocumentId, DocTypes.DocumentInternal>,
    docId : Common.DocumentId,
    userId : Common.UserId,
  ) : Bool {
    switch (documents.get(docId)) {
      case null { false };
      case (?doc) {
        if (doc.userId != userId) { return false };
        documents.remove(docId);
        true;
      };
    };
  };

  public func generateShareToken(
    doc : DocTypes.DocumentInternal,
    now : Common.Timestamp,
  ) : Text {
    let token = doc.id # "-" # now.toText();
    doc.shareToken := ?token;
    doc.updatedAt := now;
    token;
  };

  public func getByShareToken(
    documents : Map.Map<Common.DocumentId, DocTypes.DocumentInternal>,
    token : Common.ShareToken,
  ) : ?DocTypes.Document {
    for ((_, doc) in documents.entries()) {
      switch (doc.shareToken) {
        case (?t) {
          if (t == token) { return ?toPublic(doc) };
        };
        case null {};
      };
    };
    null;
  };

  public func toPublic(doc : DocTypes.DocumentInternal) : DocTypes.Document {
    {
      id = doc.id;
      userId = doc.userId;
      title = doc.title;
      documentType = doc.documentType;
      status = doc.status;
      formData = doc.formData;
      generatedContent = doc.generatedContent;
      createdAt = doc.createdAt;
      updatedAt = doc.updatedAt;
      shareToken = doc.shareToken;
    };
  };

  public func countByUser(
    documents : Map.Map<Common.DocumentId, DocTypes.DocumentInternal>,
    userId : Common.UserId,
  ) : Nat {
    var count = 0;
    for ((_, doc) in documents.entries()) {
      if (doc.userId == userId) { count += 1 };
    };
    count;
  };

  public func countAll(
    documents : Map.Map<Common.DocumentId, DocTypes.DocumentInternal>,
  ) : Nat {
    documents.size();
  };

  public func countSince(
    documents : Map.Map<Common.DocumentId, DocTypes.DocumentInternal>,
    since : Common.Timestamp,
  ) : Nat {
    var count = 0;
    for ((_, doc) in documents.entries()) {
      if (doc.createdAt >= since) { count += 1 };
    };
    count;
  };
};
