# Contributing

Thanks for helping improve `agent-skill-lock`.

The project is intentionally narrow: make agent capability drift visible in git and CI. Changes that turn it into a general security scanner, dashboard, or policy service should start as an issue first.

## Local setup

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## Development rules

- Add or update tests for every behavior change.
- Keep lockfile output deterministic.
- Do not store absolute paths, usernames, home directories, temp directories, or timestamps in lockfile entries.
- Do not store secret values. Env var names are acceptable; values are not.
- Keep CLI failure output short and actionable.
- Do not claim a skill/server is safe. The tool detects drift.

## Parser changes

When adding a new parser or config path:

1. Add a fixture or focused test first.
2. Confirm the test fails for the expected reason.
3. Implement the smallest parser behavior that passes.
4. Add malformed-input coverage.
5. Check that output ordering is stable.

## Pull request shape

A good PR includes:

- Summary of observable behavior.
- Why the behavior belongs in v0.
- Tests run.
- Any lockfile format implications.

Keep public PR text free of private context, local paths, or command transcripts.
