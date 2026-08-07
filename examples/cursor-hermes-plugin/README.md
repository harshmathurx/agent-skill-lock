# Cursor Hermes plugin repo

A small plugin repo with Cursor rules and a Hermes skill.

This example shows how ordinary-looking docs can contain agent workflow permissions. The release-notes skill mentions public posting, so the lockfile records a public side-effect hint.

## Try it

From the repository root:

```bash
pnpm build
node dist/cli.js check --root examples/cursor-hermes-plugin
```

Edit one of the agent files in this example, then run the check again. It should fail until you update the example lockfile:

```bash
node dist/cli.js update --root examples/cursor-hermes-plugin
```
