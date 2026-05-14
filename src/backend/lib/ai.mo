import DocTypes "../types/document";

module {
  // Build a textual prompt from collected form data for OpenAI generation
  public func buildPrompt(
    docType : DocTypes.DocumentType,
    formData : DocTypes.FormData,
  ) : Text {
    let docTypeName = switch (docType) {
      case (#lastWill) { "Last Will and Testament" };
      case (#powerOfAttorney) { "Power of Attorney" };
      case (#healthcareDirective) { "Healthcare Directive" };
    };

    var prompt = "You are a legal document drafting assistant. Generate a formal, legally-structured " # docTypeName # " document based on the following information provided by the testator/grantor. Include all standard legal clauses, proper headings, and structure.\n\n";

    switch (formData.step1) {
      case (?p) {
        prompt #= "## PERSONAL DETAILS\n";
        prompt #= "Full Name: " # p.fullName # "\n";
        prompt #= "Date of Birth: " # p.dateOfBirth # "\n";
        prompt #= "Address: " # p.address # ", " # p.city # ", " # p.state # ", " # p.country # "\n";
        prompt #= "Marital Status: " # p.maritalStatus # "\n\n";
      };
      case null {};
    };

    switch (formData.step2) {
      case (?bens) {
        prompt #= "## BENEFICIARIES\n";
        for (b in bens.values()) {
          prompt #= "- " # b.name # " (" # b.relationship # "): " # b.share # "% share. Contact: " # b.contact # "\n";
        };
        prompt #= "\n";
      };
      case null {};
    };

    switch (formData.step3) {
      case (?assets) {
        prompt #= "## ASSETS & DISTRIBUTION\n";
        for (a in assets.values()) {
          prompt #= "- " # a.assetType # ": " # a.description # " (Est. Value: " # a.estimatedValue # ") → " # a.beneficiaryName # "\n";
        };
        prompt #= "\n";
      };
      case null {};
    };

    switch (formData.step4) {
      case (?e) {
        prompt #= "## EXECUTOR & GUARDIAN\n";
        prompt #= "Executor: " # e.executorName # " (" # e.executorRelationship # "), Contact: " # e.executorContact # "\n";
        if (e.guardianName != "") {
          prompt #= "Guardian: " # e.guardianName # " (" # e.guardianRelationship # "), Contact: " # e.guardianContact # "\n";
        };
        prompt #= "\n";
      };
      case null {};
    };

    switch (formData.step5) {
      case (?h) {
        prompt #= "## HEALTHCARE PREFERENCES\n";
        prompt #= "Healthcare Proxy: " # h.healthcareProxy # ", Contact: " # h.proxyContact # "\n";
        prompt #= "Life Support Wishes: " # h.lifeSupport # "\n";
        prompt #= "Organ Donation: " # h.organDonation # "\n";
        if (h.additionalWishes != "") {
          prompt #= "Additional Wishes: " # h.additionalWishes # "\n";
        };
        prompt #= "\n";
      };
      case null {};
    };

    prompt #= "\nPlease generate the complete formal " # docTypeName # " document with proper legal language, numbered sections, signature blocks, and witness/notary requirements. Include a disclaimer that this is an AI-generated document and should be reviewed by a licensed attorney.";
    prompt;
  };
};
