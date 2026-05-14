import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Types "../types/profile";
import Common "../types/common";

module {
  public func getProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
  ) : ?Types.UserProfile {
    profiles.get(userId);
  };

  public func saveProfile(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
    userId : Common.UserId,
    profile : Types.UserProfile,
  ) : () {
    profiles.add(userId, profile);
  };

  public func listAllProfiles(
    profiles : Map.Map<Common.UserId, Types.UserProfile>,
  ) : [(Common.UserId, Types.UserProfile)] {
    profiles.entries().toArray();
  };
};
