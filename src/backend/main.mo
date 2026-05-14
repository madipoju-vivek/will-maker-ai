import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import ProfileMixin "mixins/profile-api";
import DocumentMixin "mixins/document-api";
import AdminMixin "mixins/admin-api";
import Common "types/common";
import DocTypes "types/document";
import ProfileTypes "types/profile";

actor {
  // --- Authorization ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // --- Object storage infrastructure ---
  include MixinObjectStorage();

  // --- Profile state ---
  let userProfiles = Map.empty<Common.UserId, ProfileTypes.UserProfile>();
  let profileCreatedAt = Map.empty<Common.UserId, Common.Timestamp>();

  // --- Document state ---
  let documents = Map.empty<Common.DocumentId, DocTypes.DocumentInternal>();
  let docState = { var nextId : Nat = 0 };

  // --- AI key (admin-set) ---
  let openAIApiKey = { var value : ?Text = null };

  // --- Rate limiting: last AI generation timestamp per user ---
  let rateLimitState = Map.empty<Common.UserId, Common.Timestamp>();

  // --- Mixins ---
  include ProfileMixin(accessControlState, userProfiles, profileCreatedAt);
  include DocumentMixin(accessControlState, documents, docState, openAIApiKey, rateLimitState);
  include AdminMixin(accessControlState, userProfiles, documents, profileCreatedAt, openAIApiKey);
};
