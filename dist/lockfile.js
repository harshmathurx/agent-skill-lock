import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { stableStringify } from './stable.js';
import { scanRepository } from './scan.js';
export const LOCKFILE_NAME = 'agent-skills.lock.json';
export async function updateLockfile(options) {
    const lockfile = await scanRepository(options);
    await writeFile(path.join(options.root, LOCKFILE_NAME), stableStringify(lockfile));
    return lockfile;
}
export async function readLockfile(root) {
    const text = await readFile(path.join(root, LOCKFILE_NAME), 'utf8');
    return JSON.parse(text);
}
export function compareLockfiles(before, after) {
    const beforeById = new Map(before.entries.map((entry) => [entry.id, entry]));
    const afterById = new Map(after.entries.map((entry) => [entry.id, entry]));
    const added = after.entries.filter((entry) => !beforeById.has(entry.id));
    const removed = before.entries.filter((entry) => !afterById.has(entry.id));
    const changed = after.entries.flatMap((afterEntry) => {
        const beforeEntry = beforeById.get(afterEntry.id);
        if (!beforeEntry)
            return [];
        const changedFields = changedEntryFields(beforeEntry, afterEntry);
        return changedFields.length ? [{ before: beforeEntry, after: afterEntry, changedFields }] : [];
    });
    return { isClean: added.length === 0 && removed.length === 0 && changed.length === 0, added, removed, changed };
}
function changedEntryFields(before, after) {
    const fields = ['kind', 'platform', 'name', 'path', 'contentHash', 'metadata', 'capabilities', 'riskHints'];
    return fields.filter((field) => stableStringify(before[field]) !== stableStringify(after[field]));
}
export function formatDiff(diff) {
    if (diff.isClean)
        return 'Agent capability lock is current.\n';
    const lines = ['Agent capability lock is stale.', '', 'The repo\'s agent surface changed but agent-skills.lock.json was not updated.', ''];
    if (diff.added.length) {
        lines.push('Added:');
        for (const entry of diff.added)
            lines.push(`  + ${entry.id}`, `    path: ${entry.path}`, ...formatHints(entry));
        lines.push('');
    }
    if (diff.removed.length) {
        lines.push('Removed:');
        for (const entry of diff.removed)
            lines.push(`  - ${entry.id}`, `    path: ${entry.path}`);
        lines.push('');
    }
    if (diff.changed.length) {
        lines.push('Changed:');
        for (const change of diff.changed)
            lines.push(`  ~ ${change.after.id}`, `    path: ${change.after.path}`, `    fields: ${change.changedFields.join(', ')}`, ...formatHints(change.after));
        lines.push('');
    }
    lines.push('Fix:', '  Review the diff, then run:', '    npx agent-skill-lock update', '  Commit agent-skills.lock.json with the capability change.', '', 'Note: this detects drift. It does not certify that a locked skill or server is safe.');
    return `${lines.join('\n')}\n`;
}
function formatHints(entry) {
    return entry.riskHints.filter((hint) => hint.level === 'high').map((hint) => `    risk: ${hint.level} ${hint.code} - ${hint.message}`);
}
//# sourceMappingURL=lockfile.js.map