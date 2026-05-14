import { DocumentViewer } from "@/components/document/DocumentViewer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetDocumentByShareToken } from "@/hooks/useBackend";
import type { Document } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Download } from "lucide-react";

export const Route = createFileRoute("/share/$token")({
  component: SharedDocumentPage,
});

function LegalDisclaimer() {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3 items-start">
      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <p className="text-sm text-amber-200/80">
        <strong className="text-amber-400">Legal Disclaimer:</strong> This
        platform does not replace licensed legal advice. Documents generated
        here are for informational purposes only and should be reviewed by a
        qualified attorney before use.
      </p>
    </div>
  );
}

function SharedDocumentPage() {
  const { token } = Route.useParams();
  const { data: doc, isLoading, isError } = useGetDocumentByShareToken(token);

  function handleDownload() {
    if (!doc) return;
    const content =
      (doc as { content?: string }).content ?? JSON.stringify(doc, null, 2);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "shared-document.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Shared Document
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              This document has been shared with you via Will Maker AI.
            </p>
          </div>
          {!isLoading && doc && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              data-ocid="share.download_button"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-1.5" /> Download
            </Button>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mb-6">
          <LegalDisclaimer />
        </div>

        {/* Content */}
        {isLoading ? (
          <div data-ocid="share.loading_state" className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        ) : isError || !doc ? (
          <div data-ocid="share.error_state" className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              Document Not Found
            </h2>
            <p className="text-muted-foreground">
              This share link may have expired or the document was removed.
            </p>
          </div>
        ) : (
          <DocumentViewer doc={doc as Document} />
        )}
      </div>
    </div>
  );
}
