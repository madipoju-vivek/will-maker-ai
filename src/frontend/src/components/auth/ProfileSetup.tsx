import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSaveCallerUserProfile } from "@/hooks/useBackend";
import type { UserProfile } from "@/types";
import { CheckCircle, Mail, Phone, User } from "lucide-react";
import { useState } from "react";

interface ProfileSetupProps {
  onComplete: () => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const saveProfile = useSaveCallerUserProfile();

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim()) errs.email = "Email address is required.";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))
      errs.email = "Enter a valid email.";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    const profile: UserProfile = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      createdAt: 0n,
    };

    try {
      await saveProfile.mutateAsync(profile);
      onComplete();
    } catch {
      setErrors({ submit: "Failed to save profile. Please try again." });
    }
  }

  return (
    <div
      data-ocid="profile_setup.card"
      className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 shadow-2xl"
    >
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-2">
          <User className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground">
          Complete Your Profile
        </h2>
        <p className="text-muted-foreground text-sm text-center">
          Tell us a bit about yourself to get started.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="profile-name" className="text-sm font-medium">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="profile-name"
              data-ocid="profile_setup.input"
              className="pl-10"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => {
                if (!name.trim())
                  setErrors((p) => ({ ...p, name: "Full name is required." }));
                else
                  setErrors((p) => {
                    const n = { ...p };
                    n.name = undefined;
                    return n;
                  });
              }}
            />
          </div>
          {errors.name && (
            <p
              data-ocid="profile_setup.field_error"
              className="text-xs text-destructive"
            >
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="profile-email" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="profile-email"
              data-ocid="profile_setup.input"
              type="email"
              className="pl-10"
              placeholder="jane@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => {
                if (!email.trim())
                  setErrors((p) => ({ ...p, email: "Email is required." }));
                else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email))
                  setErrors((p) => ({ ...p, email: "Enter a valid email." }));
                else
                  setErrors((p) => {
                    const n = { ...p };
                    n.email = undefined;
                    return n;
                  });
              }}
            />
          </div>
          {errors.email && (
            <p
              data-ocid="profile_setup.field_error"
              className="text-xs text-destructive"
            >
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label
            htmlFor="profile-phone"
            className="text-sm font-medium text-muted-foreground"
          >
            Phone Number{" "}
            <span className="text-muted-foreground/50">(optional)</span>
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="profile-phone"
              data-ocid="profile_setup.input"
              type="tel"
              className="pl-10"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {errors.submit && (
          <p
            data-ocid="profile_setup.error_state"
            className="text-xs text-destructive text-center"
          >
            {errors.submit}
          </p>
        )}

        <Button
          type="submit"
          data-ocid="profile_setup.submit_button"
          className="w-full h-12 font-semibold"
          size="lg"
          disabled={saveProfile.isPending}
        >
          {saveProfile.isPending ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Complete Setup
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
