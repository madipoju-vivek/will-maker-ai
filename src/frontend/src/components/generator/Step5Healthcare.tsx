import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { HealthcarePreferences } from "@/types";

interface Step5HealthcareProps {
  data: Partial<HealthcarePreferences>;
  errors: Partial<Record<keyof HealthcarePreferences, string>>;
  onChange: (field: keyof HealthcarePreferences, value: string) => void;
}

const YES_NO_OPTIONS = [
  "Yes",
  "No",
  "Limited circumstances only",
  "Consult my proxy",
];
const DONATION_OPTIONS = [
  "Yes, all organs",
  "Yes, specific organs only",
  "No",
  "To be determined",
];

function FieldGroup({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {hint && <p className="text-xs text-muted-foreground -mt-0.5">{hint}</p>}
      {children}
      {error && (
        <p
          className="text-xs text-destructive"
          data-ocid={`step5.${htmlFor}_error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function Step5Healthcare({
  data,
  errors,
  onChange,
}: Step5HealthcareProps) {
  return (
    <div className="space-y-5" data-ocid="generator.step5">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-1">
          Healthcare Preferences
        </h2>
        <p className="text-sm text-muted-foreground">
          Specify your medical care preferences and appoint a healthcare proxy.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup
          label="Healthcare Proxy"
          htmlFor="healthcareProxy"
          required
          hint="Person authorized to make medical decisions on your behalf."
          error={errors.healthcareProxy}
        >
          <Input
            id="healthcareProxy"
            value={data.healthcareProxy ?? ""}
            onChange={(e) => onChange("healthcareProxy", e.target.value)}
            placeholder="e.g. Emily Carter"
            data-ocid="step5.healthcareProxy_input"
          />
        </FieldGroup>

        <FieldGroup
          label="Proxy Contact"
          htmlFor="proxyContact"
          error={errors.proxyContact}
        >
          <Input
            id="proxyContact"
            value={data.proxyContact ?? ""}
            onChange={(e) => onChange("proxyContact", e.target.value)}
            placeholder="e.g. emily@email.com"
            data-ocid="step5.proxyContact_input"
          />
        </FieldGroup>

        <FieldGroup
          label="Life Support Preferences"
          htmlFor="lifeSupport"
          required
          hint="Your wishes regarding life-sustaining treatment."
          error={errors.lifeSupport}
        >
          <Select
            value={data.lifeSupport ?? ""}
            onValueChange={(v) => onChange("lifeSupport", v)}
          >
            <SelectTrigger
              id="lifeSupport"
              data-ocid="step5.lifeSupport_select"
            >
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              {YES_NO_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>

        <FieldGroup
          label="Organ Donation"
          htmlFor="organDonation"
          required
          error={errors.organDonation}
        >
          <Select
            value={data.organDonation ?? ""}
            onValueChange={(v) => onChange("organDonation", v)}
          >
            <SelectTrigger
              id="organDonation"
              data-ocid="step5.organDonation_select"
            >
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              {DONATION_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>

        <div className="sm:col-span-2">
          <FieldGroup
            label="Additional Wishes"
            htmlFor="additionalWishes"
            hint="Any other instructions for your medical care or end-of-life preferences."
            error={errors.additionalWishes}
          >
            <Textarea
              id="additionalWishes"
              value={data.additionalWishes ?? ""}
              onChange={(e) => onChange("additionalWishes", e.target.value)}
              placeholder="e.g. I wish to remain at home if possible. Comfort care should be prioritized."
              rows={4}
              className="resize-none"
              data-ocid="step5.additionalWishes_textarea"
            />
          </FieldGroup>
        </div>
      </div>
    </div>
  );
}
