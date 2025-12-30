import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type RatingPillsProps = {
  value?: number;
  onChange: (val: number) => void;
  count?: number; // default 7
  levelDescriptions: readonly string[]; // length should match count
  leftLabel?: string;
  rightLabel?: string;
  leftTone?: "positive" | "destructive";
  rightTone?: "positive" | "destructive";
  className?: string;
};

const RatingPills: React.FC<RatingPillsProps> = ({
  value,
  onChange,
  count = 7,
  levelDescriptions,
  leftLabel,
  rightLabel,
  leftTone,
  rightTone,
  className,
}) => {
  const numbers = Array.from({ length: count }, (_, i) => String(i + 1));
  const selectedIdx = (value ?? 0) - 1;
  const description = levelDescriptions[selectedIdx] ?? "";

  return (
    <div className={className}>
      {(leftLabel || rightLabel) && (
        <div className="mb-2 flex items-center justify-between text-[11px]">
          <span className={leftTone === "destructive" ? "px-2 py-0.5 rounded bg-destructive/15 text-destructive" : leftTone === "positive" ? "px-2 py-0.5 rounded bg-positive/15 text-positive" : "text-muted-foreground"}>
            {leftLabel}
          </span>
          <span className={rightTone === "destructive" ? "px-2 py-0.5 rounded bg-destructive/15 text-destructive" : rightTone === "positive" ? "px-2 py-0.5 rounded bg-positive/15 text-positive" : "text-muted-foreground"}>
            {rightLabel}
          </span>
        </div>
      )}
      <ToggleGroup
        type="single"
        value={value ? String(value) : undefined}
        onValueChange={(val) => {
          if (!val) return;
          const num = Number(val);
          if (!Number.isNaN(num)) onChange(num);
        }}
        className="flex flex-wrap gap-1"
      >
        {numbers.map((n, idx) => (
          <ToggleGroupItem
            key={n}
            value={n}
            aria-label={`Select ${n}`}
            className="rounded-full px-2 py-0.5 text-xs bg-accent text-foreground/80 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground transition-colors min-w-[2rem] h-7"
            title={levelDescriptions[idx]}
          >
            {n}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      {description && (
        <p className="mt-2 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default RatingPills;
