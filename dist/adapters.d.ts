import type { LockEntry } from './types.js';
export interface DiscoveredFile {
    relativePath: string;
    bytes: Buffer;
    contentHash: string;
}
export declare function parseFile(file: DiscoveredFile): LockEntry[];
