import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Beneficiary } from "@/types";
import { Plus, Trash2 } from "lucide-react";

interface Step2BeneficiariesProps {
  data: Beneficiary[];
  errors: string[];
  onChange: (items: Beneficiary[]) => void;
}

const EMPTY_BENEFICIARY: Beneficiary = {
  name: "",
  relationship: "",
  share: "",
  contact: "",
};

function BeneficiaryRow({
  item,
  index,
  error,
  onChange,
  onRemove,
  canRemove,
}: {
  item: Beneficiary;
  index: number;
  error?: string;
  onChange: (idx: number, field: keyof Beneficiary, value: string) => void;
  onRemove: (idx: number) => void;
  canRemove: boolean;
}) {
  return (
    <div
      className="glass rounded-xl p-4 space-y-3"
      data-ocid={`generator.beneficiary.item.${index + 1}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-primary">
          Beneficiary {index + 1}
        </span>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            aria-label={`Remove beneficiary ${index + 1}`}
            className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
            data-ocid={`generator.beneficiary.delete_button.${index + 1}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`ben-name-${index}`}
            className="text-xs text-muted-foreground"
          >
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`ben-name-${index}`}
            value={item.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
            placeholder="e.g. Michael Smith"
            data-ocid={`step2.name_input.${index + 1}`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`ben-rel-${index}`}
            className="text-xs text-muted-foreground"
          >
            Relationship <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`ben-rel-${index}`}
            value={item.relationship}
            onChange={(e) => onChange(index, "relationship", e.target.value)}
            placeholder="e.g. Spouse, Child"
            data-ocid={`step2.relationship_input.${index + 1}`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`ben-share-${index}`}
            className="text-xs text-muted-foreground"
          >
            Share % <span className="text-destructive">*</span>
          </Label>
          <Input
            id={`ben-share-${index}`}
            value={item.share}
            onChange={(e) => onChange(index, "share", e.target.value)}
            placeholder="e.g. 50%"
            data-ocid={`step2.share_input.${index + 1}`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`ben-contact-${index}`}
            className="text-xs text-muted-foreground"
          >
            Contact (email/phone)
          </Label>
          <Input
            id={`ben-contact-${index}`}
            value={item.contact}
            onChange={(e) => onChange(index, "contact", e.target.value)}
            placeholder="e.g. michael@email.com"
            data-ocid={`step2.contact_input.${index + 1}`}
          />
        </div>
      </div>
      {error && (
        <p
          className="text-xs text-destructive"
          data-ocid={`step2.item_error.${index + 1}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function Step2Beneficiaries({
  data,
  errors,
  onChange,
}: Step2BeneficiariesProps) {
  function handleFieldChange(
    idx: number,
    field: keyof Beneficiary,
    value: string,
  ) {
    const updated = data.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item,
    );
    onChange(updated);
  }

  function handleAdd() {
    onChange([...data, { ...EMPTY_BENEFICIARY }]);
  }

  function handleRemove(idx: number) {
    onChange(data.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-5" data-ocid="generator.step2">
      <div>
        <h2 className="font-display text-xl font-semibold text-foreground mb-1">
          Beneficiaries
        </h2>
        <p className="text-sm text-muted-foreground">
          Add the people or entities who will inherit your estate. Shares should
          total 100%.
        </p>
      </div>

      <div className="space-y-3">
        {data.map((item, idx) => (
          <BeneficiaryRow
            key={item.name ? `${item.name}-${idx}` : `ben-row-${idx}`}
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
        data-ocid="generator.beneficiary.add_button"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Beneficiary
      </Button>
    </div>
  );
}
