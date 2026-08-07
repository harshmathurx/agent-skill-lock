export type { Capability, EntryKind, LockDiff, LockEntry, Lockfile, RiskHint, ScanOptions } from './types.js';
export { makeEntryId } from './identity.js';
export { inferRiskHints } from './risk.js';
export { stableStringify } from './stable.js';
export { scanRepository } from './scan.js';
export { LOCKFILE_NAME, compareLockfiles, formatDiff, readLockfile, updateLockfile } from './lockfile.js';
