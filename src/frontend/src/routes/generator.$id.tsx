import { DocumentStatus } from "@/backend";
import { DocumentPreview } from "@/components/generator/DocumentPreview";
import { Step1Personal } from "@/components/generator/Step1Personal";
import { Step2Beneficiaries } from "@/components/generator/Step2Beneficiaries";
import { Step3Assets } from "@/components/generator/Step3Assets";
import { Step4Executor } from "@/components/generator/Step4Executor";
import { Step5Healthcare } from "@/components/generator/Step5Healthcare";
import { StepIndicator } from "@/components/generator/StepIndicator";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGenerateWillDocument,
  useGetDocument,
  useUpdateDocument,
} from "@/hooks/useBackend";
import type { DocumentType, FormData } from "@/types";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, HeartPulse, Loader2, Save, Scroll } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/generator/$id")({
  component: EditGeneratorPage,
});

const DOC_TYPE_LABELS: Record<string, string> = {
  lastWill: "Last Will & Testament",
  powerOfAttorney: "Power of Attorney",
  healthcareDirective: "Healthcare Directive",
};

const _STEPS = [
  "Personal",
  "Beneficiaries",
  "Assets",
  "Executor",
  "Healthcare",
];
const EMPTY_FORM: FormData = {
  step1: undefined,
  step2: undefined,
  step3: undefined,
  step4: undefined,
  step5: undefined,
};

function EditGeneratorPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: doc, isLoading } = useGetDocument(id);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const updateDocument = useUpdateDocument();
  const generateWill = useGenerateWillDocument();

  useEffect(() => {
    if (doc) {
      setFormData((doc as { formData?: FormData }).formData ?? EMPTY_FORM);
    }
  }, [doc]);

  const handleChange = useCallback(
    (field: string, value: unknown) => {
      const stepKey = `step${step}` as keyof FormData;
      setFormData((prev) => ({
        ...prev,
        [stepKey]: {
          ...((prev[stepKey] as unknown as Record<string, unknown>) ?? {}),
          [field]: value,
        },
      }));
      setErrors((prev) => {
        const n = { ...prev };
        delete n[field];
        return n;
      });
    },
    [step],
  );

  function validateStep() {
    const data = (formData[`step${step}` as keyof FormData] ?? {}) as Record<
      string,
      string
    >;
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!data.fullName?.trim()) errs.fullName = "Full name is required.";
      if (!data.dateOfBirth?.trim())
        errs.dateOfBirth = "Date of birth is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function saveDraft() {
    try {
      await updateDocument.mutateAsync({
        docId: id,
        req: { formData, status: DocumentStatus.draft },
      });
      toast.success("Draft saved.");
    } catch {
      toast.error("Failed to save draft.");
    }
  }

  async function handleNext() {
    if (!validateStep()) return;
    if (step < 5) {
      setStep((s) => s + 1);
      return;
    }
    try {
      await updateDocument.mutateAsync({
        docId: id,
        req: { formData, status: DocumentStatus.final_ },
      });
      const content = await generateWill.mutateAsync(id);
      setGeneratedContent(
        typeof content === "string" ? content : JSON.stringify(content),
      );
      setShowPreview(true);
    } catch {
      toast.error("Generation failed. Please try again.");
    }
  }

  const isBusy = updateDocument.isPending || generateWill.isPending;
  const docType =
    (doc as { documentType?: DocumentType } | undefined)?.documentType ??
    "lastWill";

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-full max-w-3xl px-4 py-12 space-y-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (showPreview) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <DocumentPreview
              document={
                id
                  ? ({
                      id,
                      documentType: docType,
                      generatedContent: generatedContent,
                      title: DOC_TYPE_LABELS[docType] ?? docType,
                    } as never)
                  : null
              }
              isGenerating={generateWill.isPending}
              onEdit={() => setShowPreview(false)}
            />
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={() => navigate({ to: "/dashboard" })}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const stepErrors: Record<string, string> = errors;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            <Badge variant="secondary" className="text-xs">
              {DOC_TYPE_LABELS[docType] ?? docType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Editing
            </Badge>
          </div>

          <StepIndicator currentStep={step} totalSteps={5} />

          <div className="mt-8 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 md:p-8">
            {step === 1 && (
              <Step1Personal
                data={formData.step1 ?? {}}
                errors={stepErrors}
                onChange={(field, value) => handleChange(field, value)}
              />
            )}
            {step === 2 && (
              <Step2Beneficiaries
                data={formData.step2 ?? []}
                errors={[]}
                onChange={(items) =>
                  setFormData((prev) => ({ ...prev, step2: items }))
                }
              />
            )}
            {step === 3 && (
              <Step3Assets
                data={formData.step3 ?? []}
                errors={[]}
                onChange={(items) =>
                  setFormData((prev) => ({ ...prev, step3: items }))
                }
              />
            )}
            {step === 4 && (
              <Step4Executor
                data={formData.step4 ?? {}}
                errors={stepErrors}
                onChange={(field, value) => handleChange(field, value)}
              />
            )}
            {step === 5 && (
              <Step5Healthcare
                data={formData.step5 ?? {}}
                errors={stepErrors}
                onChange={(field, value) => handleChange(field, value)}
              />
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              data-ocid="generator_edit.previous_button"
              disabled={step === 1 || isBusy}
              onClick={() => setStep((s) => s - 1)}
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-ocid="generator_edit.save_draft_button"
              disabled={isBusy}
              onClick={saveDraft}
            >
              {updateDocument.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" /> Save Draft
                </>
              )}
            </Button>

            <Button
              type="button"
              data-ocid="generator_edit.next_button"
              disabled={isBusy}
              onClick={handleNext}
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                  {step === 5 ? "Generating..." : "Saving..."}
                </>
              ) : step === 5 ? (
                "Generate Document"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
