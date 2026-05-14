module {
  public type UserSummary = {
    userId : Principal;
    name : Text;
    email : Text;
    documentCount : Nat;
    createdAt : Int;
  };

  public type PlatformStats = {
    totalUsers : Nat;
    totalDocuments : Nat;
    documentsThisMonth : Nat;
    usersThisMonth : Nat;
  };
};
