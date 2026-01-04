
export interface SecurityAudit {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  vulnerabilities: {
    type: string;
    description: string;
    mitigation: string;
  }[];
  encryptionStrength: number;
  integrityScore: number;
}

export interface SuitUpgrade {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  benefitLabel: string;
  icon: string;
}

export interface SuitStats {
  auditDepth: number;
  synthesisSpeed: number;
}

export interface Invention {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'Experimental' | 'Prototype' | 'Stable' | 'Classified';
  quantumStability: number;
  energyOutput: number;
  cyberSync: number;
  tags: string[];
  notes?: string;
  resonance?: number;
  imageUrl?: string;
}

export interface IntelligenceReport {
  id: string;
  title: string;
  content: string;
  category: string;
  status: 'Draft' | 'Published';
  securityRating: number;
  resonance: number;
  tags: string[];
}
