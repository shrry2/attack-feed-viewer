// STIX 2.1 format types for MITRE ATT&CK

export interface StixObject {
  type: string;
  id: string;
  created: string;
  modified: string;
  name?: string;
  description?: string;
  external_references?: ExternalReference[];
  kill_chain_phases?: KillChainPhase[];
  x_mitre_deprecated?: boolean;
  x_mitre_version?: string;
  revoked?: boolean;
}

export interface ExternalReference {
  source_name: string;
  external_id?: string;
  url?: string;
  description?: string;
}

export interface KillChainPhase {
  kill_chain_name: string;
  phase_name: string;
}

export interface AttackTechnique {
  id: string;
  attackId: string;
  name: string;
  description: string;
  tactics: string[];
  url: string;
  deprecated: boolean;
  subtechnique: boolean;
  parentId?: string;
}

export interface AttackTactic {
  id: string;
  shortName: string;
  name: string;
  description: string;
  order: number;
}

export interface AttackData {
  techniques: AttackTechnique[];
  tactics: AttackTactic[];
}

// Tactic order in the ATT&CK matrix
export const TACTIC_ORDER: Record<string, number> = {
  reconnaissance: 1,
  "resource-development": 2,
  "initial-access": 3,
  execution: 4,
  persistence: 5,
  "privilege-escalation": 6,
  "defense-evasion": 7,
  "credential-access": 8,
  discovery: 9,
  "lateral-movement": 10,
  collection: 11,
  "command-and-control": 12,
  exfiltration: 13,
  impact: 14,
};

// Display names for tactics
export const TACTIC_DISPLAY_NAMES: Record<string, string> = {
  reconnaissance: "Reconnaissance",
  "resource-development": "Resource Development",
  "initial-access": "Initial Access",
  execution: "Execution",
  persistence: "Persistence",
  "privilege-escalation": "Privilege Escalation",
  "defense-evasion": "Defense Evasion",
  "credential-access": "Credential Access",
  discovery: "Discovery",
  "lateral-movement": "Lateral Movement",
  collection: "Collection",
  "command-and-control": "Command and Control",
  exfiltration: "Exfiltration",
  impact: "Impact",
};
