import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { label: "Personal", short: "1" },
  { label: "Beneficiaries", short: "2" },
  { label: "Assets", short: "3" },
  { label: "Executor", short: "4" },
  { label: "Healthcare", short: "5" },
];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps?: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full" data-ocid="generator.step_indicator">
      {/* Progress bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">
          Step {currentStep} of {STEPS.length}
        </span>
        <span className="text-xs text-muted-foreground">
          {STEPS[currentStep - 1]?.label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mb-6">
        <div
          className="h-full gradient-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step bubbles — hidden on mobile, visible sm+ */}
      <div className="hidden sm:flex items-center justify-between mb-6 relative">
        <div className="absolute inset-x-0 top-4 h-px bg-border -z-0" />
        {STEPS.map((step, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          return (
            <div
              key={step.label}
              className="flex flex-col items-center gap-1.5 z-10"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-smooth",
                  isDone &&
                    "gradient-primary border-transparent text-primary-foreground",
                  isActive &&
                    "border-primary bg-primary/20 text-primary glow-primary",
                  !isDone &&
                    !isActive &&
                    "border-border bg-card text-muted-foreground",
                )}
                aria-label={`Step ${stepNum}: ${step.label}`}
              >
                {isDone ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  isActive && "text-primary",
                  isDone && "text-foreground",
                  !isDone && !isActive && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
