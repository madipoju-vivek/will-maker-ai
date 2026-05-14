import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  userProfiles : Map.Map<Common.UserId, ProfileTypes.UserProfile>,
  profileCreatedAt : Map.Map<Common.UserId, Common.Timestamp>,
) {
  public query ({ caller }) func getCallerUserProfile() : async ?ProfileTypes.UserProfile {
    ProfileLib.getProfile(userProfiles, caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : ProfileTypes.UserProfile) : async () {
    if (not profileCreatedAt.containsKey(caller)) {
      profileCreatedAt.add(caller, profile.createdAt);
    };
    ProfileLib.saveProfile(userProfiles, caller, profile);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?ProfileTypes.UserProfile {
    let isSelf = caller == user;
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    if (not isSelf and not isAdmin) {
      Runtime.trap("Unauthorized: only self or admin can view this profile");
    };
    ProfileLib.getProfile(userProfiles, user);
  };
};
