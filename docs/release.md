# Release process

This repo should avoid laptop-only releases. The package is security-adjacent, so releases need a boring trail.

## Before a release

Run:

```bash
pnpm install --frozen-lockfile
pnpm check
node dist/cli.js check
```

Check public copy for overclaiming:

- no "safe agents"
- no "prevents prompt injection"
- no "sandbox"
- no "firewall"
- no claims that a locked config is trustworthy

Check examples:

```bash
for repo in examples/*; do
  node dist/cli.js check --root "$repo"
done
```

## Versioning

Use semver.

Until `1.0`, lockfile schema changes may happen, but they should be obvious in release notes. If a release changes lockfile output for existing repos, say so plainly.

## Tags

Use immutable version tags such as `v0.1.0`.

A moving `v0` tag can point to the latest v0 release for the GitHub Action, but it should move only after CI passes.

## npm

Preferred publish path:

```bash
npm publish --provenance
```

Longer term, use GitHub trusted publishing so releases do not depend on a local npm token.

## Release notes

Keep notes short. Users need to know:

- what changed
- whether lockfile output changes
- whether CI behavior changes
- how to upgrade
- any known limitations
