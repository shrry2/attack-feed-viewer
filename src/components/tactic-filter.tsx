"use client";

import { AttackTactic } from "@/types/attack";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TacticFilterProps {
  tactics: AttackTactic[];
  selectedTactic: string | null;
  onTacticChange: (tactic: string | null) => void;
}

export function TacticFilter({
  tactics,
  selectedTactic,
  onTacticChange,
}: TacticFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedTactic === null ? "default" : "outline"}
        size="sm"
        onClick={() => onTacticChange(null)}
        className={cn(
          "transition-all duration-200",
          selectedTactic === null && "cyber-glow"
        )}
      >
        All
      </Button>
      {tactics.map((tactic) => (
        <Button
          key={tactic.shortName}
          variant={selectedTactic === tactic.shortName ? "default" : "outline"}
          size="sm"
          onClick={() => onTacticChange(tactic.shortName)}
          className={cn(
            "transition-all duration-200",
            selectedTactic === tactic.shortName && "cyber-glow"
          )}
        >
          {tactic.name}
        </Button>
      ))}
    </div>
  );
}
