import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Asset } from "@/types";
import { Plus, Trash2 } from "lucide-react";

interface Step3AssetsProps {
  data: Asset[];
  errors: string[];
  onChange: (items: Asset[]) => void;
}

const EMPTY_ASSET: Asset = {
  assetType: "",
  description: "",
  estimatedValue: "",
  beneficiaryName: "",
};

const ASSET_TYPES = [
  "Real Estate",
  "Bank Account",
  "Investment / Stocks",
  "Vehicle",
  "Jewelry / Valuables",
  "Business Interest",
  "Retirement Account",
  "Life Insurance",
  "Digital Assets",
  "Other",
];

function AssetRow({
  item,
  index,
  error,
  onChange,
  onRemove,
  canRemove,
}: {
  item: Asset;
  index: number;
  error?: string;
  onChange: (idx: number, field: keyof Asset, value: string) => void;
  onRemove: (idx: number) => void;
  canRemove: boolean;
}) {
  return (
    <div
      className="glass rounded-xl p-4 space-y-3"
      data-ocid={`generator.asset.item.${index + 1}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-primary">
          Asset {index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            aria-label={`Remove asset ${index + 1}`}
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            data-ocid={`generator.asset.delete_button.${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`asset-type-${index}`}
            className="text-xs text-muted-foreground"
          >
            Asset Type <span className="text-destructive">*</span>
          </Label>
          <Select
            value={item.assetType}
            onValueChange={(v) => onChange(index, "assetType", v)}
          >
            <SelectTrigger
              id={`asset-type-${index}`}
              data-ocid={`step3.assetType_select.${index + 1}`}
            >
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {ASSET_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`asset-value-${index}`}
            className="text-xs text-muted-foreground"
          >
            Estimated Value <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`asset-value-${index}`}
            value={item.estimatedValue}
            onChange={(e) => onChange(index, "estimatedValue", e.target.value)}
            placeholder="e.g. $250,000"
            data-ocid={`step3.estimatedValue_input.${index + 1}`}
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-1">
          <Label
            htmlFor={`asset-desc-${index}`}
            className="text-xs text-muted-foreground"
          >
            Description <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`asset-desc-${index}`}
            value={item.description}
            onChange={(e) => onChange(index, "description", e.target.value)}
            placeholder="e.g. Primary residence at 123 Maple St"
            data-ocid={`step3.description_input.${index + 1}`}
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-1">
          <Label
            htmlFor={`asset-ben-${index}`}
            className="text-xs text-muted-foreground"
          >
            Designated Beneficiary
          </Label>
          <Input
            id={`asset-ben-${index}`}
            value={item.beneficiaryName}
            onChange={(e) => onChange(index, "beneficiaryName", e.target.value)}
            placeholder="e.g. Michael Smith (or 'Equal split')"
            data-ocid={`step3.beneficiaryName_input.${index + 1}`}
          />
        </div>
      </div>
      {error && (
        <p
          className="text-xs text-destructive"
          data-ocid={`step3.item_error.${index + 1}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function Step3Assets({ data, errors, onChange }: Step3AssetsProps) {
  function handleFieldChange(idx: number, field: keyof Asset, value: string) {
    const updated = data.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item,
    );
    onChange(updated);
  }

  function handleAdd() {
    onChange([...data, { ...EMPTY_ASSET }]);
  }

  function handleRemove(idx: number) {
    onChange(data.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-5" data-ocid="generator.step3">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-1">
          Assets
        </h2>
        <p className="text-sm text-muted-foreground">
          List the assets you want included in your estate plan.
        </p>
      </div>

      <div className="space-y-3">
        {data.map((item, idx) => (
          <AssetRow
            key={
              item.description
                ? `${item.description}-${idx}`
                : `asset-row-${idx}`
            }
            item={item}
            index={idx}
            error={errors[idx]}
            onChange={handleFieldChange}
            onRemove={handleRemove}
            canRemove={data.length > 1}
          />
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        className="w-full border-dashed border-primary/40 text-primary hover:bg-primary/10"
        data-ocid="generator.asset.add_button"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Asset
      </Button>
    </div>
  );
}
