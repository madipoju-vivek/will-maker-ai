import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAdminSetOpenAIApiKey,
  useIsOpenAIConfigured,
} from "@/hooks/useBackend";
import { AlertCircle, CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function OpenAISettings() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const { data: isConfigured, isLoading: configLoading } =
    useIsOpenAIConfigured();
  const setKey = useAdminSetOpenAIApiKey();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    try {
      await setKey.mutateAsync(apiKey.trim());
      toast.success("OpenAI API key saved successfully.");
      setApiKey("");
    } catch {
      toast.error("Failed to save API key. Please try again.");
    }
  };

  return (
    <div className="space-y-6" data-ocid="admin.settings.section">
      {/* Status card */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <KeyRound size={20} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground font-display">
                OpenAI API Key
              </p>
              <p className="text-sm text-muted-foreground">
                Required for AI document generation
              </p>
            </div>
          </div>
          {configLoading ? (
            <Skeleton className="h-6 w-28" />
          ) : isConfigured ? (
            <Badge
              data-ocid="admin.settings.configured_status"
              className="gap-1.5 bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            >
              <CheckCircle2 size={13} />
              Configured
            </Badge>
          ) : (
            <Badge
              data-ocid="admin.settings.configured_status"
              variant="destructive"
              className="gap-1.5"
            >
              <AlertCircle size={13} />
              Not Configured
            </Badge>
          )}
        </div>
      </div>

      {/* Key form */}
      <div className="glass rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">
          {isConfigured ? "Update API Key" : "Set API Key"}
        </h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openai-key" className="text-sm">
              API Key
            </Label>
            <div className="relative">
              <Input
                id="openai-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-…"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10 font-mono text-sm"
                autoComplete="off"
                data-ocid="admin.settings.api_key_input"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showKey ? "Hide key" : "Show key"}
                data-ocid="admin.settings.toggle_visibility"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Your API key is stored securely in the canister and never exposed
              to clients.
            </p>
          </div>

          <Button
            type="submit"
            disabled={!apiKey.trim() || setKey.isPending}
            data-ocid="admin.settings.save_button"
            className="w-full sm:w-auto"
          >
            {setKey.isPending ? "Saving…" : "Save API Key"}
          </Button>
        </form>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Disclaimer:</span>{" "}
          This platform does not replace licensed legal advice. All generated
          documents are AI-assisted templates and should be reviewed by a
          qualified attorney.
        </p>
      </div>
    </div>
  );
}
