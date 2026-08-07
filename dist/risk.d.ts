import type { RiskHint } from './types.js';
export declare function inferRiskHints(text: string): RiskHint[];
export declare function hintForSecretEnvNames(names: string[]): RiskHint[];
