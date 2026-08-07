import type { EntryKind } from './types.js';

export function makeEntryId(entry: { kind: EntryKind; platform: string; name?: string; path: string }): string {
  const logicalName = entry.name || entry.path;
  return `${entry.kind}:${entry.platform}:${logicalName}`
    .toLowerCase()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/[^a-z0-9._/@:-]+/g, '-');
}
