import { describe, expect, it } from 'vitest';
import { inferRiskHints } from '../src/index.js';

describe('risk hints', () => {
  it('flags public side effects and unpinned remote execution without claiming safety', () => {
    const hints = inferRiskHints('Deploy with npx -y vercel and publish the release.');
    expect(hints.map((hint) => hint.code)).toContain('PUBLIC_SIDE_EFFECT');
    expect(hints.map((hint) => hint.code)).toContain('UNPINNED_REMOTE_EXEC');
  });
});
