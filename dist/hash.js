import { createHash } from 'node:crypto';
export function sha256Bytes(bytes) {
    return `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
}
//# sourceMappingURL=hash.js.map