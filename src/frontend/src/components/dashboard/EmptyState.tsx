import { Button } from "@/components/ui/button";
import { FilePlus2, ScrollText } from "lucide-react";

export function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-24 px-6 text-center"
      data-ocid="dashboard.empty_state"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
        <ScrollText className="h-9 w-9 text-primary" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground mb-2">
        No Documents Yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        Start by creating your first legal document — a will, power of attorney,
        or healthcare directive. It only takes a few minutes.
      </p>
      <Button
        asChild
        className="gap-2 gradient-primary text-foreground font-semibold shadow-lg"
        data-ocid="dashboard.create_first_button"
      >
        <a href="/generator">
          <FilePlus2 className="h-4 w-4" />
          Create Your First Document
        </a>
      </Button>
    </div>
  );
}
