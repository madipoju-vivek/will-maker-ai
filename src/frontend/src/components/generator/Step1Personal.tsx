import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PersonalDetails } from "@/types";

interface Step1PersonalProps {
  data: Partial<PersonalDetails>;
  errors: Partial<Record<keyof PersonalDetails, string>>;
  onChange: (field: keyof PersonalDetails, value: string) => void;
}

const MARITAL_STATUS_OPTIONS = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "Separated",
  "Domestic Partnership",
];

function FieldGroup({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label} <span className="text-destructive">*</span>
      </Label>
      {children}
      {error && (
        <p
          className="text-xs text-destructive"
          data-ocid={`step1.${htmlFor}_error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function Step1Personal({ data, errors, onChange }: Step1PersonalProps) {
  return (
    <div className="space-y-5" data-ocid="generator.step1">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-1">
          Personal Details
        </h2>
        <p className="text-sm text-muted-foreground">
          Provide your legal information as it should appear in the document.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldGroup
          label="Full Legal Name"
          htmlFor="fullName"
          error={errors.fullName}
        >
          <Input
            id="fullName"
            value={data.fullName ?? ""}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="e.g. Jane Elizabeth Smith"
            data-ocid="step1.fullName_input"
          />
        </FieldGroup>

        <FieldGroup
          label="Date of Birth"
          htmlFor="dateOfBirth"
          error={errors.dateOfBirth}
        >
          <Input
            id="dateOfBirth"
            type="date"
            value={data.dateOfBirth ?? ""}
            onChange={(e) => onChange("dateOfBirth", e.target.value)}
            data-ocid="step1.dateOfBirth_input"
          />
        </FieldGroup>

        <div className="sm:col-span-2">
          <FieldGroup
            label="Street Address"
            htmlFor="address"
            error={errors.address}
          >
            <Input
              id="address"
              value={data.address ?? ""}
              onChange={(e) => onChange("address", e.target.value)}
              placeholder="e.g. 123 Maple Street"
              data-ocid="step1.address_input"
            />
          </FieldGroup>
        </div>

        <FieldGroup label="City" htmlFor="city" error={errors.city}>
          <Input
            id="city"
            value={data.city ?? ""}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="e.g. Austin"
            data-ocid="step1.city_input"
          />
        </FieldGroup>

        <FieldGroup
          label="State / Province"
          htmlFor="state"
          error={errors.state}
        >
          <Input
            id="state"
            value={data.state ?? ""}
            onChange={(e) => onChange("state", e.target.value)}
            placeholder="e.g. Texas"
            data-ocid="step1.state_input"
          />
        </FieldGroup>

        <FieldGroup label="Country" htmlFor="country" error={errors.country}>
          <Input
            id="country"
            value={data.country ?? ""}
            onChange={(e) => onChange("country", e.target.value)}
            placeholder="e.g. United States"
            data-ocid="step1.country_input"
          />
        </FieldGroup>

        <FieldGroup
          label="Marital Status"
          htmlFor="maritalStatus"
          error={errors.maritalStatus}
        >
          <Select
            value={data.maritalStatus ?? ""}
            onValueChange={(v) => onChange("maritalStatus", v)}
          >
            <SelectTrigger
              id="maritalStatus"
              data-ocid="step1.maritalStatus_select"
            >
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {MARITAL_STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>
      </div>
    </div>
  );
}
