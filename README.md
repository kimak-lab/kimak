# Kimak

Headless UI primitives. React-first. Framework-agnostic kernel.

Kimak owns behavior, keyboard, focus, and ARIA. You own CSS — or opt into the Tailwind plugin. There is no `variant="primary"` and no token package in the kernel.

```tsx
import { Dialog } from "@kimak/react";

<Dialog.Root>
  <Dialog.Trigger render={<button type="button" className="my-trigger" />}>
    Open
  </Dialog.Trigger>
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

`render` replaces the default DOM node (Base UI composition). Children stay children. Style parts with the anatomy contract:

```css
[data-scope="dialog"][data-slot="content"][data-state="open"] { }
```

## Optional look: `@kimak/tailwind`

The plugin targets the same `data-scope` / `data-slot` / `data-state` attributes, so any adapter that emits them is styled. It does not wrap React components. Requires Tailwind CSS v4.

```css
@import "tailwindcss";
@plugin "@kimak/tailwind";
```

Visual size is a host attribute, not a machine prop:

```tsx
<Checkbox.Root data-size="sm">…</Checkbox.Root>
<Dialog.Content data-size="lg">…</Dialog.Content>
```

`data-size` is `sm` | `md` | `lg`. Omit it for the `md` default.

## Packages

| Package | Role |
| --- | --- |
| `@kimak/spec` | Component contracts: parts, props, keyboard, ARIA |
| `@kimak/core` | Machines, `connect()`, platform primitives |
| `@kimak/react` | React 19 adapter (`ref` as a prop, `render`, compound parts) |
| `@kimak/tailwind` | Optional Tailwind v4 plugin for anatomy selectors |

v1 publishes `@kimak/react`. Vue and Svelte adapters are not in this repo yet. `@kimak/tailwind` is already adapter-agnostic.

## Golden pair

The catalog does not start until these two are proven:

- **Checkbox** — checked / indeterminate, label wiring, form input, keyboard
- **Dialog** — portal, focus trap, scroll lock, Escape, `render` on Trigger

## Scripts

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm --filter @kimak/playground dev
```
