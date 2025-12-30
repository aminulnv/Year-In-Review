import React from "react";
import { cn } from "@/lib/utils";
import { Users, Lock } from "lucide-react";

export type Privacy = "public" | "private";

type PrivacyToggleProps = {
  value: Privacy;
  onChange: (value: Privacy) => void;
  className?: string;
};

const PrivacyToggle: React.FC<PrivacyToggleProps> = ({ value, onChange, className }) => {
  const isPublic = value === "public";

  return (
    <div className={cn("inline-flex items-center rounded-lg border bg-card p-1", className)} role="tablist" aria-label="Visibility">
      <button
        type="button"
        role="tab"
        aria-selected={isPublic}
        onClick={() => onChange("public")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          isPublic ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-accent"
        )}
      >
        <Users className="w-4 h-4" />
        <span>Public</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={!isPublic}
        onClick={() => onChange("private")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-md transition-colors",
          !isPublic ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:bg-accent"
        )}
      >
        <Lock className="w-4 h-4" />
        <span>Private</span>
      </button>
    </div>
  );
};

export default PrivacyToggle;
