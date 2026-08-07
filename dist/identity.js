export function makeEntryId(entry) {
    const logicalName = entry.name || entry.path;
    return `${entry.kind}:${entry.platform}:${logicalName}`
        .toLowerCase()
        .replace(/\\/g, '/')
        .replace(/^\.\//, '')
        .replace(/[^a-z0-9._/@:-]+/g, '-');
}
//# sourceMappingURL=identity.js.map