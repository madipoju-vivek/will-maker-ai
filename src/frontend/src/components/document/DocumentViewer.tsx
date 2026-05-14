import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Document } from "@/types";
import { Calendar, FileText, User } from "lucide-react";
import type React from "react";

const DOC_TYPE_LABELS: Record<string, string> = {
  lastWill: "Last Will & Testament",
  powerOfAttorney: "Power of Attorney",
  healthcareDirective: "Healthcare Directive",
};

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h2 className="font-display text-lg font-semibold text-foreground mb-3 border-b border-border pb-2">
        {title}
      </h2>
      <div className="text-sm text-muted-foreground space-y-1.5">
        {children}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
      <span className="font-medium text-foreground/80 sm:w-44 shrink-0">
        {label}:
      </span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  );
}

interface DocumentViewerProps {
  doc: Document;
}

export function DocumentViewer({ doc }: DocumentViewerProps) {
  const { formData, generatedContent } = doc;

  return (
    <div className="space-y-6" data-ocid="document_viewer.content">
      {/* Metadata bar */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <FileText className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">
            {DOC_TYPE_LABELS[doc.documentType] ?? doc.documentType}
          </span>
        </div>
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4" />
          <span>Created {formatDate(doc.createdAt)}</span>
        </div>
        {doc.updatedAt !== doc.createdAt && (
          <>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Updated {formatDate(doc.updatedAt)}</span>
            </div>
          </>
        )}
        <Badge
          variant={doc.status === "final" ? "default" : "secondary"}
          className="ml-auto text-[10px] uppercase tracking-wide"
        >
          {doc.status === "final" ? "Final" : "Draft"}
        </Badge>
      </div>

      <Separator />

      {/* Generated AI Content */}
      {generatedContent ? (
        <div data-ocid="document_viewer.generated_content">
          <div className="prose prose-invert max-w-none">
            {(() => {
              const result: React.ReactNode[] = [];
              for (const [idx, line] of generatedContent
                .split("\n")
                .entries()) {
                const key = `${idx}-${line.slice(0, 16)}`;
                if (!line.trim()) {
                  result.push(<div key={key} className="h-3" />);
                  continue;
                }
                if (line.startsWith("#")) {
                  const level = line.match(/^#+/)?.[0].length ?? 1;
                  const text = line.replace(/^#+\s*/, "");
                  const Tag = `h${Math.min(level + 1, 6)}` as React.ElementType;
                  result.push(
                    <Tag
                      key={key}
                      className="font-display font-bold text-foreground mt-6 mb-2"
                    >
                      {text}
                    </Tag>,
                  );
                  continue;
                }
                result.push(
                  <p
                    key={key}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {line}
                  </p>,
                );
              }
              return result;
            })()}
          </div>
        </div>
      ) : (
        <>
          {/* Personal Details */}
          {formData.step1 && (
            <Section title="Personal Details">
              <Field label="Full Name" value={formData.step1.fullName} />
              <Field label="Date of Birth" value={formData.step1.dateOfBirth} />
              <Field
                label="Marital Status"
                value={formData.step1.maritalStatus}
              />
              <Field label="Address" value={formData.step1.address} />
              <Field label="City" value={formData.step1.city} />
              <Field label="State" value={formData.step1.state} />
              <Field label="Country" value={formData.step1.country} />
            </Section>
          )}

          {/* Beneficiaries */}
          {formData.step2 && formData.step2.length > 0 && (
            <Section title="Beneficiaries">
              {formData.step2.map((b, i) => (
                <div
                  key={b.name ? `ben-${b.name}-${i}` : `ben-${i}`}
                  className="glass rounded-md p-3 space-y-1"
                >
                  <p className="font-medium text-foreground/90">{b.name}</p>
                  <Field label="Relationship" value={b.relationship} />
                  <Field label="Share" value={b.share} />
                  <Field label="Contact" value={b.contact} />
                </div>
              ))}
            </Section>
          )}

          {/* Assets */}
          {formData.step3 && formData.step3.length > 0 && (
            <Section title="Assets">
              {formData.step3.map((a, i) => (
                <div
                  key={
                    a.description ? `asset-${a.description}-${i}` : `asset-${i}`
                  }
                  className="glass rounded-md p-3 space-y-1"
                >
                  <p className="font-medium text-foreground/90">
                    {a.description}
                  </p>
                  <Field label="Type" value={a.assetType} />
                  <Field label="Estimated Value" value={a.estimatedValue} />
                  <Field label="Beneficiary" value={a.beneficiaryName} />
                </div>
              ))}
            </Section>
          )}

          {/* Executor */}
          {formData.step4 && (
            <Section title="Executor & Guardian">
              <Field
                label="Executor Name"
                value={formData.step4.executorName}
              />
              <Field
                label="Relationship"
                value={formData.step4.executorRelationship}
              />
              <Field
                label="Executor Contact"
                value={formData.step4.executorContact}
              />
              <Field
                label="Guardian Name"
                value={formData.step4.guardianName}
              />
              <Field
                label="Guardian Relationship"
                value={formData.step4.guardianRelationship}
              />
              <Field
                label="Guardian Contact"
                value={formData.step4.guardianContact}
              />
            </Section>
          )}

          {/* Healthcare */}
          {formData.step5 && (
            <Section title="Healthcare Preferences">
              <Field
                label="Healthcare Proxy"
                value={formData.step5.healthcareProxy}
              />
              <Field
                label="Proxy Contact"
                value={formData.step5.proxyContact}
              />
              <Field label="Life Support" value={formData.step5.lifeSupport} />
              <Field
                label="Organ Donation"
                value={formData.step5.organDonation}
              />
              <Field
                label="Additional Wishes"
                value={formData.step5.additionalWishes}
              />
            </Section>
          )}
        </>
      )}
    </div>
  );
}
