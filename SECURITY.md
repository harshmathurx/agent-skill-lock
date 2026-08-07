# Security policy

`agent-skill-lock` is security-adjacent software. Please report vulnerabilities privately.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting if available, or email the maintainer listed on the GitHub profile.

Please include:

- Affected version or commit.
- Reproduction steps.
- Expected and actual behavior.
- Whether the issue can leak secrets, hide capability drift, or cause unsafe CI behavior.

Do not include real tokens, private keys, or production secrets in a report.

## Scope

In scope:

- Secret values written into `agent-skills.lock.json`.
- Absolute local paths or usernames written into lockfile IDs or metadata.
- Nondeterministic output that hides meaningful drift.
- Parser crashes caused by ordinary malformed config.
- CI Action behavior that needs broader permissions than documented.
- CLI output that incorrectly claims a skill, server, or config is safe.

Out of scope:

- A locked malicious skill being malicious. This tool detects drift; it does not certify safety.
- Vulnerabilities in third-party scanners invoked outside the core CLI.
- Private repository configurations not shared in a reproducible report.

## Maintainer posture

Security fixes should lead with user impact, not branding. Patch releases should be small and direct.
