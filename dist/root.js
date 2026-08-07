import path from 'node:path';
export function resolveRoot(root) {
    const resolved = path.resolve(root);
    const workspace = process.env.GITHUB_WORKSPACE;
    if (workspace && process.env.AGENT_SKILL_LOCK_ENFORCE_WORKSPACE === '1') {
        const resolvedWorkspace = path.resolve(workspace);
        const relative = path.relative(resolvedWorkspace, resolved);
        if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
            throw new Error(`Refusing to scan outside GITHUB_WORKSPACE: ${root}`);
        }
    }
    return resolved;
}
//# sourceMappingURL=root.js.map