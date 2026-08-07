export type EntryKind = 'skill' | 'mcpServer' | 'instructionFile' | 'unparsedConfig';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Capability {
  type: string;
  name?: string;
  scope?: string;
  source?: string;
}

export interface RiskHint {
  level: RiskLevel;
  code: string;
  message: string;
}

export interface LockEntry {
  id: string;
  kind: EntryKind;
  platform: string;
  name: string;
  path: string;
  contentHash: string;
  metadata: Record<string, unknown>;
  capabilities: Capability[];
  riskHints: RiskHint[];
}

export interface Lockfile {
  lockfileVersion: 1;
  generatedBy: string;
  root: '.';
  entries: LockEntry[];
}

export interface ScanOptions {
  root: string;
}

export interface LockDiff {
  isClean: boolean;
  added: LockEntry[];
  removed: LockEntry[];
  changed: Array<{ before: LockEntry; after: LockEntry; changedFields: string[] }>;
}
