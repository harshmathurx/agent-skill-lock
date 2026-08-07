import type { LockDiff, Lockfile, ScanOptions } from './types.js';
export declare const LOCKFILE_NAME = "agent-skills.lock.json";
export declare function updateLockfile(options: ScanOptions): Promise<Lockfile>;
export declare function readLockfile(root: string): Promise<Lockfile>;
export declare function compareLockfiles(before: Lockfile, after: Lockfile): LockDiff;
export declare function formatDiff(diff: LockDiff): string;
