import type { EntryKind } from './types.js';
export declare function makeEntryId(entry: {
    kind: EntryKind;
    platform: string;
    name?: string;
    path: string;
}): string;
