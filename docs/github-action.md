# GitHub Action

The Action runs the same CLI check in CI.

## Workflow

After the first tagged release, use a pinned version:

```yaml
name: agent-skill-lock
on:
  pull_request:
  push:
    branches: [main]

jobs:
  check-agent-capabilities:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - uses: harshmathurx/agent-skill-lock@v0.1.0
```

Do not use a floating branch such as `main` for a security-adjacent CI check.

## Inputs

| Input | Default | Meaning |
| --- | --- | --- |
| `root` | `.` | Repository path to scan, relative to `GITHUB_WORKSPACE` |

Example:

```yaml
- uses: harshmathurx/agent-skill-lock@v0.1.0
  with:
    root: packages/web
```

## Permissions

The Action needs only:

```yaml
permissions:
  contents: read
```

It does not comment on PRs, write files, upload artifacts, or call a hosted service.

## Root containment

The Action passes the root through an environment variable and enables workspace containment:

```yaml
env:
  AGENT_SKILL_LOCK_ROOT: ${{ inputs.root }}
  AGENT_SKILL_LOCK_ENFORCE_WORKSPACE: "1"
```

That avoids direct expression interpolation into the shell command and prevents scanning outside `GITHUB_WORKSPACE`.

## Failure behavior

A stale lockfile fails the job with exit code `1` and prints the drift.

The fix is deliberate:

```bash
agent-skill-lock update
git add agent-skills.lock.json
git commit -m "chore: update agent capability lock"
```

Review the lockfile diff before committing it. Updating the lockfile without understanding the change defeats the point.
