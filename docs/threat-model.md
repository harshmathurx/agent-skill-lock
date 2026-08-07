# Threat model

`agent-skill-lock` protects a narrow boundary: repo-visible agent capability drift.

It is useful when a team already reviews code in git and wants agent instructions, skills, MCP servers, and permission-like config to go through the same review habit.

## Assets

The assets are:

- agent instruction files that steer code changes
- skill files that describe workflows and allowed tools
- MCP config that can grant filesystem, browser, database, network, or API access
- environment variable bindings and command surfaces
- the reviewer's attention

The last one matters. Most failures here are not dramatic exploits. They are quiet diffs nobody read closely.

## Attacker model

The interesting attacker is a contributor who can open a PR or change repo files. They may try to:

- add an MCP server that reads more than expected
- change a skill so it can publish, deploy, comment, or merge
- add a secret-looking env binding to an agent config
- hide agent behavior inside a file that looks like documentation
- update the lockfile without reviewers understanding what changed

`agent-skill-lock` cannot stop a malicious maintainer who controls the repo and CI. It also cannot stop a runtime compromise outside git.

## What the tool does

It scans known repo paths, normalizes the result, and writes a deterministic lockfile. CI compares the committed lockfile with the current repo state.

If the surface changed and the lockfile did not, CI fails.

If the lockfile changed too, the reviewer has a concentrated diff to inspect.

## What the tool does not do

It does not:

- execute agent skills
- validate that a skill is benign
- sandbox MCP servers
- inspect third-party package code
- prove that an env var is safe
- replace human review

A dangerous config can be accurately locked. That is still a dangerous config.

## Design constraints

The default posture is conservative:

- no secret values in the lockfile
- no absolute local paths
- deterministic ordering
- malformed MCP JSON becomes an unparsed entry instead of crashing the scan
- GitHub Action permissions stay at `contents: read`
- action input is passed through an environment variable instead of interpolated directly into shell
- when running in GitHub Actions, the root must stay inside `GITHUB_WORKSPACE`

## Known gaps in v0

The first version is intentionally small.

Known gaps:

- shallow parsing for most vendor-specific files
- no policy language beyond lockfile drift
- no PR annotations
- no deep scanner integration
- no semantic diff for every config format
- no guarantee that every agent tool's latest config path is covered

The right next step is more real fixtures, not a grand security model.
