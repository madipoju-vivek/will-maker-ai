import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import DocLib "../lib/document";
import ProfileLib "../lib/profile";
import DocTypes "../types/document";
import ProfileTypes "../types/profile";
import AdminTypes "../types/admin";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  documents : Map.Map<Common.DocumentId, DocTypes.DocumentInternal>,
  profileCreatedAt : Map.Map<Common.UserId, Common.Timestamp>,
  openAIApiKey : { var value : ?Text },
) {
  public query ({ caller }) func adminListUsers() : async [AdminTypes.UserSummary] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let entries = ProfileLib.listAllProfiles(userProfiles);
    entries.map<(Common.UserId, ProfileTypes.UserProfile), AdminTypes.UserSummary>(
      func((userId, profile)) {
        let docCount = DocLib.countByUser(documents, userId);
        let createdAt = switch (profileCreatedAt.get(userId)) {
          case (?t) { t };
          case null { profile.createdAt };
        };
        {
          userId;
          name = profile.name;
          email = profile.email;
          documentCount = docCount;
          createdAt;
        };
      }
    );
  };

  public query ({ caller }) func adminGetPlatformStats() : async AdminTypes.PlatformStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    let now = Time.now();
    // 30 days in nanoseconds
    let thirtyDays : Int = 30 * 24 * 60 * 60 * 1_000_000_000;
    let since = now - thirtyDays;
    let totalUsers = userProfiles.size();
    let totalDocuments = DocLib.countAll(documents);
    let documentsThisMonth = DocLib.countSince(documents, since);
    var usersThisMonth = 0;
    for ((userId, _) in userProfiles.entries()) {
      switch (profileCreatedAt.get(userId)) {
        case (?t) { if (t >= since) { usersThisMonth += 1 } };
        case null {};
      };
    };
    {
      totalUsers;
      totalDocuments;
      documentsThisMonth;
      usersThisMonth;
    };
  };

  public shared ({ caller }) func adminSetOpenAIApiKey(key : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: admin only");
    };
    openAIApiKey.value := ?key;
  };

  public query func isOpenAIConfigured() : async Bool {
    switch (openAIApiKey.value) {
      case null { false };
      case (?_) { true };
    };
  };
};
