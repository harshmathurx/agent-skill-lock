# Codex data worker

A fake data job repo with Codex guidance and a readonly reporting MCP server.

The point is env handling. The MCP config references secret-looking env names. The lockfile records names only, never values.

## Try it

From the repository root:

```bash
pnpm build
node dist/cli.js check --root examples/codex-data-worker
```

Edit one of the agent files in this example, then run the check again. It should fail until you update the example lockfile:

```bash
node dist/cli.js update --root examples/codex-data-worker
```
