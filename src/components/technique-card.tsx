"use client";

import { AttackTechnique } from "@/types/attack";
import { truncateDescription } from "@/lib/attack-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TACTIC_DISPLAY_NAMES } from "@/types/attack";

interface TechniqueCardProps {
  technique: AttackTechnique;
  onClick: () => void;
}

export function TechniqueCard({ technique, onClick }: TechniqueCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 group bg-card/50 backdrop-blur-xs"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Badge
              variant="cyber"
              className="mb-2 font-mono text-xs"
            >
              {technique.attackId}
            </Badge>
            <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
              {technique.name}
            </CardTitle>
          </div>
          {technique.subtechnique && (
            <Badge variant="outline" className="text-xs shrink-0">
              Sub
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {truncateDescription(technique.description, 150)}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {technique.tactics.slice(0, 3).map((tactic) => (
            <Badge
              key={tactic}
              variant="purple"
              className="text-xs"
            >
              {TACTIC_DISPLAY_NAMES[tactic] || tactic}
            </Badge>
          ))}
          {technique.tactics.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{technique.tactics.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
