import { DocumentStatus, DocumentType } from "@/backend";
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
import {
  useCreateDocument,
  useGenerateWillDocument,
  useUpdateDocument,
} from "@/hooks/useBackend";
import type { FormData } from "@/types";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FileText, HeartPulse, Loader2, Save, Scroll } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/generator")({
  component: GeneratorPage,
});

const DOC_TYPES: {
  id: DocumentType;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: DocumentType.lastWill,
    label: "Last Will & Testament",
    desc: "Distribute your assets and care for your loved ones.",
    icon: <Scroll className="w-6 h-6" />,
  },
  {
    id: DocumentType.powerOfAttorney,
    label: "Power of Attorney",
    desc: "Designate someone to act on your behalf.",
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: DocumentType.healthcareDirective,
    label: "Healthcare Directive",
    desc: "Specify your medical care preferences.",
    icon: <HeartPulse className="w-6 h-6" />,
  },
];

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

function GeneratorPage() {
  const navigate = useNavigate();
  const [docType, setDocType] = useState<DocumentType | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [docId, setDocId] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const createDocument = useCreateDocument();
  const updateDocument = useUpdateDocument();
  const generateWill = useGenerateWillDocument();

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

  function getStepData() {
    return (formData[`step${step}` as keyof FormData] ?? {}) as Record<
      string,
      string
    >;
  }

  function validateStep() {
    const data = getStepData();
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
    if (!docType) return;
    try {
      if (!docId) {
        const doc = await createDocument.mutateAsync({
          documentType: docType,
          formData,
          status: DocumentStatus.draft,
          title: DOC_TYPES.find((d) => d.id === docType)?.label ?? docType,
        });
        setDocId(typeof doc === "string" ? doc : (doc as { id: string }).id);
      } else {
        await updateDocument.mutateAsync({
          docId,
          req: { formData, status: "draft" as DocumentStatus },
        });
      }
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
    // Final submit
    if (!docType) return;
    try {
      let id = docId;
      if (!id) {
        const doc = await createDocument.mutateAsync({
          documentType: docType,
          formData,
          status: DocumentStatus.final_,
          title: DOC_TYPES.find((d) => d.id === docType)?.label ?? docType,
        });
        id = typeof doc === "string" ? doc : (doc as { id: string }).id;
        setDocId(id);
      } else {
        await updateDocument.mutateAsync({
          docId: id,
          req: { formData, status: "final_" as DocumentStatus },
        });
      }
      const content = await generateWill.mutateAsync(id);
      setGeneratedContent(
        typeof content === "string" ? content : JSON.stringify(content),
      );
      setShowPreview(true);
    } catch {
      toast.error("Generation failed. Please try again.");
    }
  }

  const isBusy =
    createDocument.isPending ||
    updateDocument.isPending ||
    generateWill.isPending;

  if (!docType) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
                Create a Document
              </h1>
              <p className="text-muted-foreground">
                Choose the type of legal document you'd like to create.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DOC_TYPES.map((dt) => (
                <button
                  key={dt.id}
                  type="button"
                  data-ocid={`generator.${dt.id}.card`}
                  onClick={() => setDocType(dt.id)}
                  className="group rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl p-8 text-left hover:border-primary/50 hover:bg-card/80 transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/20 transition-colors">
                    {dt.icon}
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
                    {dt.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">{dt.desc}</p>
                </button>
              ))}
            </div>
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
                docId
                  ? ({
                      id: docId,
                      documentType: docType,
                      generatedContent: generatedContent,
                      title:
                        DOC_TYPES.find((d) => d.id === docType)?.label ??
                        docType,
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
              {DOC_TYPES.find((d) => d.id === docType)?.label}
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
              data-ocid="generator.previous_button"
              disabled={step === 1 || isBusy}
              onClick={() => setStep((s) => s - 1)}
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              data-ocid="generator.save_draft_button"
              disabled={isBusy}
              onClick={saveDraft}
            >
              {updateDocument.isPending || createDocument.isPending ? (
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
              data-ocid="generator.next_button"
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
