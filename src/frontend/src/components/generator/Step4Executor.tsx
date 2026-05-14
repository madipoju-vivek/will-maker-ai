import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ExecutorInfo } from "@/types";

interface Step4ExecutorProps {
  data: Partial<ExecutorInfo>;
  errors: Partial<Record<keyof ExecutorInfo, string>>;
  onChange: (field: keyof ExecutorInfo, value: string) => void;
}

function FieldGroup({
  label,
  htmlFor,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && (
        <p
          className="text-xs text-destructive"
          data-ocid={`step4.${htmlFor}_error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function Step4Executor({ data, errors, onChange }: Step4ExecutorProps) {
  return (
    <div className="space-y-6" data-ocid="generator.step4">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-1">
          Executor & Guardian
        </h2>
        <p className="text-sm text-muted-foreground">
          Name the person who will carry out your wishes and, if applicable, a
          guardian for any minor children.
        </p>
      </div>

      {/* Executor Section */}
      <div className="glass rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
          Executor
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup
            label="Executor Full Name"
            htmlFor="executorName"
            required
            error={errors.executorName}
          >
            <Input
              id="executorName"
              value={data.executorName ?? ""}
              onChange={(e) => onChange("executorName", e.target.value)}
              placeholder="e.g. Robert Johnson"
              data-ocid="step4.executorName_input"
            />
          </FieldGroup>

          <FieldGroup
            label="Relationship to You"
            htmlFor="executorRelationship"
            required
            error={errors.executorRelationship}
          >
            <Input
              id="executorRelationship"
              value={data.executorRelationship ?? ""}
              onChange={(e) => onChange("executorRelationship", e.target.value)}
              placeholder="e.g. Brother, Attorney"
              data-ocid="step4.executorRelationship_input"
            />
          </FieldGroup>

          <div className="sm:col-span-2">
            <FieldGroup
              label="Executor Contact"
              htmlFor="executorContact"
              error={errors.executorContact}
            >
              <Input
                id="executorContact"
                value={data.executorContact ?? ""}
                onChange={(e) => onChange("executorContact", e.target.value)}
                placeholder="e.g. robert@email.com or +1 555-0100"
                data-ocid="step4.executorContact_input"
              />
            </FieldGroup>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Guardian Section */}
      <div className="glass rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide">
          Guardian{" "}
          <span className="text-muted-foreground font-normal normal-case">
            (optional — for minor children)
          </span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldGroup
            label="Guardian Full Name"
            htmlFor="guardianName"
            error={errors.guardianName}
          >
            <Input
              id="guardianName"
              value={data.guardianName ?? ""}
              onChange={(e) => onChange("guardianName", e.target.value)}
              placeholder="e.g. Sarah Johnson"
              data-ocid="step4.guardianName_input"
            />
          </FieldGroup>

          <FieldGroup
            label="Relationship to Children"
            htmlFor="guardianRelationship"
            error={errors.guardianRelationship}
          >
            <Input
              id="guardianRelationship"
              value={data.guardianRelationship ?? ""}
              onChange={(e) => onChange("guardianRelationship", e.target.value)}
              placeholder="e.g. Aunt, Family Friend"
              data-ocid="step4.guardianRelationship_input"
            />
          </FieldGroup>

          <div className="sm:col-span-2">
            <FieldGroup
              label="Guardian Contact"
              htmlFor="guardianContact"
              error={errors.guardianContact}
            >
              <Input
                id="guardianContact"
                value={data.guardianContact ?? ""}
                onChange={(e) => onChange("guardianContact", e.target.value)}
                placeholder="e.g. sarah@email.com"
                data-ocid="step4.guardianContact_input"
              />
            </FieldGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
