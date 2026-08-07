# Mixed agent monorepo

A fake team repo with multiple agent surfaces in the same codebase.

This is the most realistic example. Different tools read different files, but reviewers get one lockfile.

## Try it

From the repository root:

```bash
pnpm build
node dist/cli.js check --root examples/mixed-agent-monorepo
```

Edit one of the agent files in this example, then run the check again. It should fail until you update the example lockfile:

```bash
node dist/cli.js update --root examples/mixed-agent-monorepo
```
