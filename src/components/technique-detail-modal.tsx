"use client";

import { AttackTechnique, TACTIC_DISPLAY_NAMES } from "@/types/attack";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface TechniqueDetailModalProps {
  technique: AttackTechnique | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TechniqueDetailModal({
  technique,
  open,
  onOpenChange,
}: TechniqueDetailModalProps) {
  if (!technique) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto bg-card/95 backdrop-blur-md border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant="cyber" className="font-mono">
              {technique.attackId}
            </Badge>
            {technique.subtechnique && (
              <Badge variant="outline">Sub-technique</Badge>
            )}
          </div>
          <DialogTitle className="text-xl text-foreground">
            {technique.name}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Details for {technique.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Tactics */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              Tactics
            </h4>
            <div className="flex flex-wrap gap-2">
              {technique.tactics.map((tactic) => (
                <Badge key={tactic} variant="purple">
                  {TACTIC_DISPLAY_NAMES[tactic] || tactic}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-2">
              Description
            </h4>
            <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed bg-muted/30 rounded-lg p-4 max-h-[300px] overflow-y-auto">
              {technique.description}
            </div>
          </div>

          {/* Parent technique */}
          {technique.parentId && (
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-2">
                Parent Technique
              </h4>
              <Badge variant="outline" className="font-mono">
                {technique.parentId}
              </Badge>
            </div>
          )}

          {/* External Link */}
          {technique.url && (
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:border-primary/50 hover:text-primary"
                asChild
              >
                <a
                  href={technique.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on MITRE ATT&CK
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
