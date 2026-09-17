# Kimak

Headless UI primitives. React-first. Framework-agnostic kernel.

Kimak owns behavior, keyboard, focus, and ARIA. You own CSS. There is no theme, no `variant="primary"`, and no design token package.

```tsx
import { Dialog } from "@kimak/react";

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Positioner>
      <Dialog.Content>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Description>Description</Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Portal>
</Dialog.Root>
```

Style parts with the anatomy contract:

```css
[data-scope="dialog"][data-slot="content"][data-state="open"] { }
```

## Packages

| Package | Role |
| --- | --- |
| `@kimak/spec` | Component contracts: parts, props, keyboard, ARIA |
| `@kimak/core` | Machines, `connect()`, platform primitives |
| `@kimak/react` | React 19 adapter (`ref` as a prop, `asChild`, compound parts) |

v1 publishes `@kimak/react` only. Vue and Svelte adapters wait until this kernel is boring.

## Golden pair

The catalog does not start until these two are proven:

- **Checkbox** — checked / indeterminate, label wiring, form input, keyboard
- **Dialog** — portal, focus trap, scroll lock, Escape, `asChild` on Trigger

## Scripts

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm --filter @kimak/playground dev
```

Playground CSS is an example, not a published preset.
