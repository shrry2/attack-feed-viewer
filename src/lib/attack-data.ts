import {
  StixObject,
  AttackTechnique,
  AttackTactic,
  AttackData,
  TACTIC_ORDER,
  TACTIC_DISPLAY_NAMES,
} from "@/types/attack";

const ATTACK_DATA_URL =
  "https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json";

interface StixBundle {
  type: string;
  id: string;
  objects: StixObject[];
}

function extractAttackId(obj: StixObject): string {
  const ref = obj.external_references?.find(
    (r) => r.source_name === "mitre-attack"
  );
  return ref?.external_id || "";
}

function extractUrl(obj: StixObject): string {
  const ref = obj.external_references?.find(
    (r) => r.source_name === "mitre-attack"
  );
  return ref?.url || "";
}

function extractTactics(obj: StixObject): string[] {
  if (!obj.kill_chain_phases) return [];
  return obj.kill_chain_phases
    .filter((phase) => phase.kill_chain_name === "mitre-attack")
    .map((phase) => phase.phase_name);
}

function isSubtechnique(attackId: string): boolean {
  return attackId.includes(".");
}

function getParentId(attackId: string): string | undefined {
  if (!isSubtechnique(attackId)) return undefined;
  return attackId.split(".")[0];
}

export async function fetchAttackData(): Promise<AttackData> {
  const response = await fetch(ATTACK_DATA_URL, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ATT&CK data: ${response.statusText}`);
  }

  const bundle: StixBundle = await response.json();

  const techniques: AttackTechnique[] = [];
  const tacticsMap = new Map<string, AttackTactic>();

  for (const obj of bundle.objects) {
    // Parse attack-pattern (techniques)
    if (obj.type === "attack-pattern") {
      const attackId = extractAttackId(obj);
      if (!attackId) continue;

      // Skip deprecated and revoked techniques
      if (obj.x_mitre_deprecated || obj.revoked) continue;

      techniques.push({
        id: obj.id,
        attackId,
        name: obj.name || "",
        description: obj.description || "",
        tactics: extractTactics(obj),
        url: extractUrl(obj),
        deprecated: obj.x_mitre_deprecated || false,
        subtechnique: isSubtechnique(attackId),
        parentId: getParentId(attackId),
      });
    }

    // Parse x-mitre-tactic (tactics)
    if (obj.type === "x-mitre-tactic") {
      const ref = obj.external_references?.find(
        (r) => r.source_name === "mitre-attack"
      );
      const shortName = (obj as StixObject & { x_mitre_shortname?: string })
        .x_mitre_shortname;

      if (shortName) {
        tacticsMap.set(shortName, {
          id: obj.id,
          shortName,
          name: obj.name || TACTIC_DISPLAY_NAMES[shortName] || shortName,
          description: obj.description || "",
          order: TACTIC_ORDER[shortName] || 99,
        });
      }
    }
  }

  // Sort techniques by attack ID
  techniques.sort((a, b) => {
    const aNum = parseInt(a.attackId.replace(/[^0-9]/g, ""));
    const bNum = parseInt(b.attackId.replace(/[^0-9]/g, ""));
    return aNum - bNum;
  });

  // Convert tactics map to sorted array
  const tactics = Array.from(tacticsMap.values()).sort(
    (a, b) => a.order - b.order
  );

  return { techniques, tactics };
}

export function filterTechniques(
  techniques: AttackTechnique[],
  searchQuery: string,
  selectedTactic: string | null
): AttackTechnique[] {
  return techniques.filter((technique) => {
    // Filter by tactic
    if (selectedTactic && !technique.tactics.includes(selectedTactic)) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        technique.attackId.toLowerCase().includes(query) ||
        technique.name.toLowerCase().includes(query) ||
        technique.description.toLowerCase().includes(query)
      );
    }

    return true;
  });
}

export function truncateDescription(
  description: string,
  maxLength: number = 100
): string {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength).trim() + "...";
}
