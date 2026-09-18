# Kimak

Headless UI primitives. React-first. Framework-agnostic kernel.

Kimak owns behavior, keyboard, focus, and ARIA. You own CSS — or opt into the Tailwind plugin. There is no `variant="primary"` and no token package in the kernel.

```tsx
import { Button, Checkbox, Dialog } from "@kimak/ui-react";

<Button data-size="sm" className="rounded-full">Save</Button>

<Checkbox data-size="sm">I agree</Checkbox>

<Dialog.Root>
  <Dialog.Trigger render={<button type="button" />}>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Title</Dialog.Title>
    <Dialog.Description>Description</Dialog.Description>
    <Dialog.Close>Close</Dialog.Close>
  </Dialog.Content>
</Dialog.Root>
```

`@kimak/ui-react` is React product sugar over the headless parts. Compound anatomy stays on `@kimak/headless-react` (`Checkbox.Root`, `Dialog.Portal`, …). Look is still the Tailwind plugin — empty checkbox indicators paint a check/dash via CSS, so Vue/Svelte will inherit the same glyphs.

`render` replaces the default DOM node (Base UI composition). Children stay children. Pass `className` on any part — it is a host DOM prop, not a machine prop, and `mergeProps` concatenates it with any class from `render`. Style parts with the anatomy contract:

```css
[data-scope="dialog"][data-slot="content"][data-state="open"] { }
```

## Optional look: `@kimak/tailwind`

The plugin targets the same `data-scope` / `data-slot` / `data-state` attributes, so any adapter that emits them is styled. It does not wrap React components. Requires Tailwind CSS v4.

```css
@import "tailwindcss";
@import "@kimak/tailwind/theme.css";
@plugin "@kimak/tailwind";
```

`theme.css` is the shadcn token contract: raw values on `:root` / `.dark`, mapped through `@theme inline` to utilities (`bg-primary`, `text-muted-foreground`, `rounded-md`). Override **raw** tokens after the import — not `--color-*`:

```css
:root {
  --primary: oklch(0.55 0.2 264);
  --radius: 0.5rem;
}
```

Visual size and variant are host attributes, not machine props:

```tsx
<Button data-size="sm" data-variant="outline">Save</Button>
<Checkbox data-size="sm">Small</Checkbox>
<Dialog.Content data-size="lg">…</Dialog.Content>
```

`data-size` is `sm` | `md` | `lg`. Omit it for the `md` default. Button `data-variant` is `default` | `secondary` | `outline` | `ghost` | `destructive`.

## Packages

| Directory | Package | Role |
| --- | --- | --- |
| `packages/spec` | `@kimak/spec` | Component contracts: parts, props, keyboard, ARIA |
| `packages/core` | `@kimak/core` | Machines, `connect()`, platform primitives |
| `packages/headless/react` | `@kimak/headless-react` | React 19 adapter (`ref` as a prop, `render`, compound parts) |
| `packages/headless/vue` | `@kimak/headless-vue` | Vue 3 adapter scaffold (`useMachine`, `normalizeProps`, portal/presence stubs) |
| `packages/headless/svelte` | `@kimak/headless-svelte` | Svelte 5 adapter scaffold (`useMachine`, `normalizeProps`, portal/presence stubs) |
| `packages/ui/react` | `@kimak/ui-react` | React product sugar over the adapter. Not a kernel. |
| `packages/ui/vue` | `@kimak/ui-vue` | Vue product sugar shell (re-exports headless until components land) |
| `packages/ui/svelte` | `@kimak/ui-svelte` | Svelte product sugar shell (re-exports headless until components land) |
| `packages/tailwind` | `@kimak/tailwind` | Optional Tailwind v4 plugin + shadcn `theme.css` |

Folders are layer then framework (`headless/react`, `ui/react`). Published names use a hyphen because `@kimak/headless/react` would be a subpath of `@kimak/headless`, not a package.

v1 publishes `@kimak/headless-react` and `@kimak/ui-react`. Vue and Svelte packages are scaffolded in-repo (`@kimak/headless-vue`, `@kimak/headless-svelte`, `@kimak/ui-vue`, `@kimak/ui-svelte`) but not published until Button, Checkbox, and Dialog are ported. `@kimak/tailwind` is already adapter-agnostic.

The portable contract is `connect(service, normalize)`, not JSX. `connect()` emits a React-shaped DOM dialect (`onClick`, `htmlFor`, callback `ref`). A future adapter remaps those keys with `createNormalizer` and binds the service with the equivalent of `useMachine`. Compound `render` / portal / context stay in the adapter. Product sugar is per adapter, never in `@kimak/core`.

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
pnpm dev:vue
pnpm dev:svelte
```
