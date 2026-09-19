# Kimak

Headless UI primitives. React-first. Framework-agnostic kernel.

Kimak owns behavior, keyboard, focus, and ARIA. You own CSS — or opt into the Tailwind plugin. There is no `variant="primary"` and no token package in the kernel.

The catalog is Button first. Other components stay out until this one is proven across spec, core, adapters, product sugar, and look.

```tsx
import { Button } from "@kimak/ui-react";

<Button data-size="sm" className="rounded-full">Save</Button>
```

`@kimak/ui-react` is React product sugar over the headless parts. Compound anatomy stays on `@kimak/headless-react`. Look is still the Tailwind plugin.

`render` replaces the default DOM node (Base UI composition). Children stay children. Pass `className` on any part — it is a host DOM prop, not a machine prop, and `mergeProps` concatenates it with any class from `render`. Style parts with the anatomy contract:

```css
[data-scope="button"][data-slot="root"][data-variant="outline"] { }
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

Visual size and variant are host attributes, not machine props. Product sugar also accepts `variant` / `size` and writes the same `data-*`:

```tsx
<Button data-size="sm" data-variant="outline">Save</Button>
<Button variant="outline" size="sm">Save</Button>
```

`data-size` is `sm` | `md` | `lg`. Omit it for the `md` default. Button `data-variant` is `default` | `secondary` | `outline` | `ghost` | `destructive`. Style a link as a button with `buttonAttrs()`, never `<Button render={<a/>}>`.

Button `loading` keeps keyboard focus (`aria-disabled` + `aria-busy`). Use `focusableWhenDisabled` when a disabled button must stay in the tab order.

`@kimak/ui-*` Button lives in a per-component folder (`src/button/`) with `button-attrs.ts` (look data attributes) and `button-motion.ts` (GSAP bind). Look still comes from the Tailwind plugin.

## Packages

| Directory | Package | Role |
| --- | --- | --- |
| `packages/spec` | `@kimak/spec` | Component contracts: parts, props, keyboard, ARIA |
| `packages/core` | `@kimak/core` | Machines, `connect()`, platform primitives |
| `packages/headless/react` | `@kimak/headless-react` | React 19 adapter (`ref` as a prop, `render`, compound parts) |
| `packages/headless/vue` | `@kimak/headless-vue` | Vue 3 adapter (`useMachine`, `normalizeProps`, compound parts) |
| `packages/headless/svelte` | `@kimak/headless-svelte` | Svelte 5 adapter (`useMachine`, `normalizeProps`, compound parts) |
| `packages/ui/react` | `@kimak/ui-react` | React product sugar over the adapter. Not a kernel. |
| `packages/ui/vue` | `@kimak/ui-vue` | Vue product sugar over the adapter. Not a kernel. |
| `packages/ui/svelte` | `@kimak/ui-svelte` | Svelte product sugar over the adapter. Not a kernel. |
| `packages/tailwind` | `@kimak/tailwind` | Optional Tailwind v4 plugin + shadcn `theme.css` |
| `packages/motion/gsap` | `@kimak/motion-gsap` | Optional GSAP motion. Peer `gsap`. Targets anatomy `data-*`, not machines. |

Folders are layer then framework (`headless/react`, `ui/react`). Published names use a hyphen because `@kimak/headless/react` would be a subpath of `@kimak/headless`, not a package.

v1 publishes `@kimak/headless-react` and `@kimak/ui-react`. Vue and Svelte adapters have Button in-repo (`@kimak/headless-vue`, `@kimak/headless-svelte`, `@kimak/ui-vue`, `@kimak/ui-svelte`) but are not on npm yet. `@kimak/tailwind` is already adapter-agnostic. `@kimak/ui-*` Button binds press motion from `@kimak/motion-gsap`. Do not put `gsap` in core or headless. Headless consumers can still call `animateButton(scope)` themselves.

The portable contract is `connect(service, normalize)`, not JSX. `connect()` emits a React-shaped DOM dialect (`onClick`, `htmlFor`, callback `ref`). A future adapter remaps those keys with `createNormalizer` and binds the service with the equivalent of `useMachine`. Compound `render` / portal / context stay in the adapter. Product sugar is per adapter, never in `@kimak/core`.

## Current catalog

- **Button** — press, disabled, loading, `data-size` / `data-variant`, optional GSAP press motion

Do not add Checkbox, Dialog, DatePicker, Command, or Toast until Button is proven and the form / disclosure / overlay / menu / selection families exist.

## Scripts

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm --filter @kimak/playground dev
pnpm dev:vue
pnpm dev:svelte
```
