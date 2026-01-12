"use client";

import { useState, useMemo, useCallback } from "react";
import { AttackTechnique, AttackTactic } from "@/types/attack";
import { filterTechniques } from "@/lib/attack-data";
import { TechniqueCard } from "@/components/technique-card";
import { TacticFilter } from "@/components/tactic-filter";
import { SearchBar } from "@/components/search-bar";
import { TechniqueDetailModal } from "@/components/technique-detail-modal";
import { Shield } from "lucide-react";

interface AttackBrowserProps {
  techniques: AttackTechnique[];
  tactics: AttackTactic[];
}

export function AttackBrowser({ techniques, tactics }: AttackBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] =
    useState<AttackTechnique | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredTechniques = useMemo(() => {
    return filterTechniques(techniques, searchQuery, selectedTactic);
  }, [techniques, searchQuery, selectedTactic]);

  const handleTechniqueClick = useCallback((technique: AttackTechnique) => {
    setSelectedTechnique(technique);
    setModalOpen(true);
  }, []);

  const handleTacticChange = useCallback((tactic: string | null) => {
    setSelectedTactic(tactic);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                MITRE ATT&CK Browser
              </h1>
              <p className="text-xs text-muted-foreground">
                Enterprise Matrix Techniques
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <SearchBar value={searchQuery} onChange={handleSearchChange} />
          </div>

          {/* Tactic Filter */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <TacticFilter
              tactics={tactics}
              selectedTactic={selectedTactic}
              onTacticChange={handleTacticChange}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Results count */}
        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredTechniques.length} of {techniques.length} techniques
          {selectedTactic && (
            <span className="text-primary ml-1">
              in{" "}
              {tactics.find((t) => t.shortName === selectedTactic)?.name ||
                selectedTactic}
            </span>
          )}
          {searchQuery && (
            <span className="text-primary ml-1">
              matching &quot;{searchQuery}&quot;
            </span>
          )}
        </div>

        {/* Techniques Grid */}
        {filteredTechniques.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTechniques.map((technique) => (
              <TechniqueCard
                key={technique.id}
                technique={technique}
                onClick={() => handleTechniqueClick(technique)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Shield className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">
              No techniques found
            </h3>
            <p className="text-sm text-muted-foreground/70 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <TechniqueDetailModal
        technique={selectedTechnique}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
