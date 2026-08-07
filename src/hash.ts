import { createHash } from 'node:crypto';

export function sha256Bytes(bytes: Buffer | string): string {
  return `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
}
