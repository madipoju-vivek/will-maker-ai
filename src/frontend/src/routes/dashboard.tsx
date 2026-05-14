import { DocumentCard } from "@/components/dashboard/DocumentCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  type FilterType,
  SearchBar,
  type SortOption,
} from "@/components/dashboard/SearchBar";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { useDeleteDocument, useListMyDocuments } from "@/hooks/useBackend";
import type { Document } from "@/types";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

type FilterTypeLocal =
  | "all"
  | "lastWill"
  | "powerOfAttorney"
  | "healthcareDirective";
type SortOptionLocal = "newest" | "oldest" | "type";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"] as const;

function DashboardPage() {
  const { data: documents = [], isLoading } = useListMyDocuments();
  const deleteDocument = useDeleteDocument();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTypeLocal>("all");
  const [sort, setSort] = useState<SortOptionLocal>("newest");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = (documents as Document[]).slice();
    if (filter !== "all") list = list.filter((d) => d.documentType === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.documentType?.toLowerCase().includes(q) ||
          (d as { title?: string }).title?.toLowerCase().includes(q),
      );
    }
    if (sort === "newest")
      list.sort((a, b) => Number(b.createdAt ?? 0) - Number(a.createdAt ?? 0));
    else if (sort === "oldest")
      list.sort((a, b) => Number(a.createdAt ?? 0) - Number(b.createdAt ?? 0));
    else
      list.sort((a, b) =>
        (a.documentType ?? "").localeCompare(b.documentType ?? ""),
      );
    return list;
  }, [documents, filter, sort, search]);

  async function handleDelete(docId: string) {
    setDeletingId(docId);
    try {
      await deleteDocument.mutateAsync(docId);
      toast.success("Document deleted.");
    } catch {
      toast.error("Failed to delete document.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleDownload(doc: Document) {
    const content =
      (doc as { content?: string }).content ?? JSON.stringify(doc, null, 2);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.documentType ?? "document"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                My Documents
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isLoading
                  ? "Loading..."
                  : `${filtered.length} document${filtered.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <Button asChild data-ocid="dashboard.create_button">
              <Link to="/generator">
                <Plus className="w-4 h-4 mr-2" /> New Document
              </Link>
            </Button>
          </div>

          {/* Search & Filter */}
          <SearchBar
            query={search}
            onQueryChange={setSearch}
            filterType={filter as FilterType}
            onFilterTypeChange={(v) => setFilter(v as FilterTypeLocal)}
            sort={sort as SortOption}
            onSortChange={(v) => setSort(v as SortOptionLocal)}
          />

          {/* Content */}
          {isLoading ? (
            <div
              data-ocid="dashboard.loading_state"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6"
            >
              {SKELETON_IDS.map((id) => (
                <div
                  key={id}
                  className="h-52 rounded-2xl bg-muted/40 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div data-ocid="dashboard.empty_state" className="mt-8">
              <EmptyState />
            </div>
          ) : (
            <div
              data-ocid="dashboard.list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6"
            >
              {filtered.map((doc, i) => (
                <div
                  key={(doc as { id?: string }).id ?? i}
                  data-ocid={`dashboard.item.${i + 1}`}
                >
                  <DocumentCard
                    doc={doc}
                    index={i}
                    onDelete={handleDelete}
                    isDeleting={deletingId === (doc as { id?: string }).id}
                    onDownload={handleDownload}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
