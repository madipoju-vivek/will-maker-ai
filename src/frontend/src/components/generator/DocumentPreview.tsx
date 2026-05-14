import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Document } from "@/types";
import { CheckCircle2, Download, Edit2, FileText } from "lucide-react";
import type React from "react";

interface DocumentPreviewProps {
  document: Document | null;
  isGenerating: boolean;
  onEdit?: () => void;
  className?: string;
}

function GeneratingState() {
  return (
    <div className="space-y-4" data-ocid="generator.preview.loading_state">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="h-10 w-10 rounded-full gradient-primary animate-pulse" />
          <div className="absolute inset-0 rounded-full glow-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            AI is generating your document…
          </p>
          <p className="text-xs text-muted-foreground">
            This may take 15–30 seconds
          </p>
        </div>
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-8 w-1/2 mt-4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

function formatContent(content: string): React.ReactNode[] {
  const lines = content.split("\n");
  const result: React.ReactNode[] = [];
  for (const [idx, line] of lines.entries()) {
    const trimmed = line.trim();
    const key = `${idx}-${trimmed.slice(0, 16)}`;
    if (!trimmed) {
      result.push(<div key={key} className="h-3" />);
      continue;
    }
    if (/^[A-Z][A-Z\s&,.-]{4,}$/.test(trimmed) || /^#+\s/.test(trimmed)) {
      const text = trimmed.replace(/^#+\s/, "");
      result.push(
        <h3
          key={key}
          className="font-display text-base font-bold text-foreground mt-5 mb-2 border-b border-border pb-1"
        >
          {text}
        </h3>,
      );
      continue;
    }
    if (/^\d+\./.test(trimmed)) {
      result.push(
        <p
          key={key}
          className="text-sm text-foreground/90 pl-4 leading-relaxed"
        >
          {trimmed}
        </p>,
      );
      continue;
    }
    if (trimmed.startsWith("-") || trimmed.startsWith("•")) {
      result.push(
        <p
          key={key}
          className="text-sm text-foreground/90 pl-4 flex gap-2 leading-relaxed"
        >
          <span className="text-primary mt-1 shrink-0">•</span>
          <span>{trimmed.replace(/^[-•]\s*/, "")}</span>
        </p>,
      );
      continue;
    }
    result.push(
      <p key={key} className="text-sm text-foreground/90 leading-relaxed">
        {trimmed}
      </p>,
    );
  }
  return result;
}

function handleDownload(document: Document) {
  const title = document.title || "document";
  const content = document.generatedContent ?? "No content available.";
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = window.document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "-").toLowerCase()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DocumentPreview({
  document,
  isGenerating,
  onEdit,
  className,
}: DocumentPreviewProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl border border-primary/20 overflow-hidden",
        className,
      )}
      data-ocid="generator.preview.panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-card/40">
        <div className="flex items-center gap-2.5">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">
              {document?.title ?? "Generated Document"}
            </p>
            <p className="text-xs text-muted-foreground">
              {document?.documentType?.replace(/([A-Z])/g, " $1").trim()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isGenerating && document?.generatedContent && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(document)}
                className="h-8 gap-1.5 text-xs"
                data-ocid="generator.preview.download_button"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
              {onEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  className="h-8 gap-1.5 text-xs"
                  data-ocid="generator.preview.edit_button"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 max-h-[60vh] overflow-y-auto">
        {isGenerating ? (
          <GeneratingState />
        ) : document?.generatedContent ? (
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-4 text-xs text-primary">
              <CheckCircle2 className="h-4 w-4" />
              Document generated successfully
            </div>
            {formatContent(document.generatedContent)}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-12 text-center"
            data-ocid="generator.preview.empty_state"
          >
            <FileText className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              Your document will appear here after generation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
