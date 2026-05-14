import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Document, DocumentType } from "@/types";
import {
  Calendar,
  Download,
  Edit,
  Eye,
  FileText,
  Gavel,
  Heart,
  Trash2,
} from "lucide-react";

const DOC_TYPE_META: Record<
  DocumentType,
  { label: string; icon: React.ElementType; color: string }
> = {
  lastWill: {
    label: "Last Will & Testament",
    icon: Gavel,
    color: "text-primary",
  },
  powerOfAttorney: {
    label: "Power of Attorney",
    icon: FileText,
    color: "text-chart-2",
  },
  healthcareDirective: {
    label: "Healthcare Directive",
    icon: Heart,
    color: "text-destructive",
  },
};

const STATUS_META: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" }
> = {
  draft: { label: "Draft", variant: "secondary" },
  final_: { label: "Final", variant: "default" },
};

function formatDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface DocumentCardProps {
  doc: Document;
  index: number;
  onDelete: (docId: string) => void;
  isDeleting?: boolean;
  onDownload: (doc: Document) => void;
}

export function DocumentCard({
  doc,
  index,
  onDelete,
  isDeleting,
  onDownload,
}: DocumentCardProps) {
  const typeMeta = DOC_TYPE_META[doc.documentType];
  const statusMeta = STATUS_META[doc.status as string] ?? STATUS_META.draft;
  const Icon = typeMeta.icon;

  return (
    <Card
      className="glass flex flex-col transition-smooth hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10 group"
      data-ocid={`dashboard.item.${index}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-smooth">
              <Icon className={`h-4 w-4 ${typeMeta.color}`} />
            </div>
            <div className="min-w-0">
              <p
                className="font-display font-semibold text-sm text-foreground truncate"
                title={doc.title}
              >
                {doc.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {typeMeta.label}
              </p>
            </div>
          </div>
          <Badge
            variant={statusMeta.variant}
            className="shrink-0 text-[10px] uppercase tracking-wide"
            data-ocid={`dashboard.status_badge.${index}`}
          >
            {statusMeta.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-3 flex-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>Created {formatDate(doc.createdAt)}</span>
        </div>
        {doc.updatedAt !== doc.createdAt && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>Updated {formatDate(doc.updatedAt)}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2 flex-wrap">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 min-w-0"
          data-ocid={`dashboard.view_button.${index}`}
        >
          <a href={`/document/${doc.id}`}>
            <Eye className="h-3.5 w-3.5" />
            <span>View</span>
          </a>
        </Button>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 min-w-0"
          data-ocid={`dashboard.edit_button.${index}`}
        >
          <a href={`/generator/${doc.id}`}>
            <Edit className="h-3.5 w-3.5" />
            <span>Edit</span>
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 gap-1.5 min-w-0"
          onClick={() => onDownload(doc)}
          data-ocid={`dashboard.download_button.${index}`}
        >
          <Download className="h-3.5 w-3.5" />
          <span>PDF</span>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 gap-1.5 min-w-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              data-ocid={`dashboard.delete_button.${index}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent data-ocid={`dashboard.delete_dialog.${index}`}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Document?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <strong>&ldquo;{doc.title}&rdquo;</strong>? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel data-ocid={`dashboard.cancel_button.${index}`}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(doc.id)}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                data-ocid={`dashboard.confirm_button.${index}`}
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
