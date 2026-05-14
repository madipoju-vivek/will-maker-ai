import { DocumentViewer } from "@/components/document/DocumentViewer";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGenerateShareLink, useGetDocument } from "@/hooks/useBackend";
import type { Document } from "@/types";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCheck,
  Copy,
  Download,
  Edit,
  Loader2,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/document/$id")({
  component: DocumentDetailPage,
});

const DOC_TYPE_LABELS: Record<string, string> = {
  lastWill: "Last Will & Testament",
  powerOfAttorney: "Power of Attorney",
  healthcareDirective: "Healthcare Directive",
};

function DocumentDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: doc, isLoading } = useGetDocument(id);
  const generateShareLink = useGenerateShareLink();
  const [copied, setCopied] = useState(false);

  function handleDownload() {
    if (!doc) return;
    const content =
      (doc as { content?: string }).content ?? JSON.stringify(doc, null, 2);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(doc as Document).documentType ?? "document"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    try {
      const token = await generateShareLink.mutateAsync(id);
      const shareUrl = `${window.location.origin}/share/${token}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Share link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error("Failed to generate share link.");
    }
  }

  const docType = (doc as Document | undefined)?.documentType;
  const docStatus = (doc as Document | undefined)?.status;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Back + title */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                data-ocid="document_detail.back_button"
                onClick={() => navigate({ to: "/dashboard" })}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                {isLoading ? (
                  <Skeleton className="h-7 w-48" />
                ) : (
                  <h1 className="text-xl font-display font-bold text-foreground">
                    {DOC_TYPE_LABELS[docType ?? ""] ?? docType ?? "Document"}
                  </h1>
                )}
                {!isLoading && docStatus && (
                  <Badge
                    variant={
                      docStatus === ("final_" as string)
                        ? "default"
                        : "secondary"
                    }
                    className="mt-1 text-xs"
                  >
                    {docStatus === ("final_" as string) ? "Final" : "Draft"}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid="document_detail.edit_button"
                disabled={isLoading}
                onClick={() =>
                  navigate({ to: "/generator/$id", params: { id } })
                }
              >
                <Edit className="w-4 h-4 mr-1.5" /> Edit
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid="document_detail.download_button"
                disabled={isLoading}
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-1.5" /> Download
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-ocid="document_detail.share_button"
                disabled={isLoading || generateShareLink.isPending}
                onClick={handleShare}
              >
                {generateShareLink.isPending ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : copied ? (
                  <CheckCheck className="w-4 h-4 mr-1.5 text-green-500" />
                ) : (
                  <Share2 className="w-4 h-4 mr-1.5" />
                )}
                {copied ? "Copied!" : "Share"}
              </Button>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div
              data-ocid="document_detail.loading_state"
              className="space-y-3"
            >
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-96 w-full rounded-2xl" />
            </div>
          ) : doc ? (
            <DocumentViewer doc={doc as Document} />
          ) : (
            <div
              data-ocid="document_detail.error_state"
              className="text-center py-20"
            >
              <p className="text-muted-foreground">
                Document not found or you don't have access.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate({ to: "/dashboard" })}
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
