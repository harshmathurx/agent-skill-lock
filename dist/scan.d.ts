import type { Lockfile, ScanOptions } from './types.js';
export declare const DEFAULT_PATTERNS: string[];
export declare function scanRepository(options: ScanOptions): Promise<Lockfile>;
