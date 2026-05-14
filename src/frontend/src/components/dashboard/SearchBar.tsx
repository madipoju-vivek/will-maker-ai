import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

export type SortOption = "newest" | "oldest" | "type";
export type FilterType =
  | "all"
  | "lastWill"
  | "powerOfAttorney"
  | "healthcareDirective";

interface SearchBarProps {
  query: string;
  onQueryChange: (v: string) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  filterType: FilterType;
  onFilterTypeChange: (v: FilterType) => void;
}

export function SearchBar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  filterType,
  onFilterTypeChange,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search by title or type…"
          className="pl-9 bg-card/60 border-border/60 focus:border-primary/50"
          data-ocid="dashboard.search_input"
        />
      </div>
      <Select
        value={filterType}
        onValueChange={(v) => onFilterTypeChange(v as FilterType)}
      >
        <SelectTrigger
          className="w-full sm:w-48 bg-card/60 border-border/60"
          data-ocid="dashboard.type_filter.select"
        >
          <SelectValue placeholder="All types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="lastWill">Last Will</SelectItem>
          <SelectItem value="powerOfAttorney">Power of Attorney</SelectItem>
          <SelectItem value="healthcareDirective">
            Healthcare Directive
          </SelectItem>
        </SelectContent>
      </Select>
      <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
        <SelectTrigger
          className="w-full sm:w-40 bg-card/60 border-border/60"
          data-ocid="dashboard.sort.select"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="type">By Type</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
