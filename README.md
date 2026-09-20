# Kimak

Headless UI primitives. React-first. Framework-agnostic kernel.

Kimak owns behavior, keyboard, focus, and ARIA. You own CSS — or opt into the Tailwind plugin. There is no `variant="primary"` and no token package in the kernel.

The catalog is Button first. Other primitives stay out until this one is proven across spec, core, adapters, product sugar, and look. Spinner and Button Group are look-only sugar in that catalog, not new machines.

## Installation

React:

```bash
pnpm add @kimak/ui-react @kimak/tailwind
```

Vue or Svelte:

```bash
pnpm add @kimak/ui-vue @kimak/tailwind
pnpm add @kimak/ui-svelte @kimak/tailwind
```

```css
@import "tailwindcss";
@import "@kimak/tailwind/theme.css";
@plugin "@kimak/tailwind";
```

## Usage

```tsx
import { Button } from "@kimak/ui-react"

<Button variant="outline">Button</Button>
```

`@kimak/ui-react` is React product sugar over the headless parts. Compound anatomy stays on `@kimak/headless-react`. Look is still the Tailwind plugin.

`render` replaces the default DOM node (Base UI composition). Children stay children. Pass `className` on any part — it is a host DOM prop, not a machine prop, and `mergeProps` concatenates it with any class from `render`. Style parts with the anatomy contract:

```css
[data-scope="button"][data-slot="root"][data-variant="outline"] { }
```

## Optional look: `@kimak/tailwind`

The plugin targets the same `data-scope` / `data-slot` / `data-state` attributes, so any adapter that emits them is styled. It does not wrap React components. Requires Tailwind CSS v4.

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

Put `data-icon="inline-start"` or `data-icon="inline-end"` on an icon (or `Spinner`) for spacing. Icons are children — Kimak does not ship an icon library.

Button `loading` keeps keyboard focus (`aria-disabled` + `aria-busy`). Use `focusableWhenDisabled` when a disabled button must stay in the tab order.

`@kimak/ui-*` Button lives in a per-component folder (`src/button/`) with `button-attrs.ts` (look data attributes) and `button-motion.ts` (GSAP bind). Look still comes from the Tailwind plugin.

## Cursor

Tailwind v4 uses `cursor: default` for buttons. The Kimak recipe matches that. To keep `cursor: pointer`, add:

```css
@layer base {
  button:not(:disabled),
  [role="button"]:not(:disabled) {
    cursor: pointer;
  }
}
```

## Link

Two patterns:

```tsx
<a href="/docs" {...buttonAttrs({ variant: "outline" })}>Docs</a>

<Button render={<a href="/docs" />}>Docs</Button>
```

`buttonAttrs()` is look-only. `render` / Vue-Svelte `as="a"` keep the button machine (`loading`, `disabled`, `onPress`). Native button attrs (`type`, `name`, `value`, `form`, `disabled`) are omitted on the `<a>`.

## Spinner

`loading` shows the anatomy indicator (CSS keyframes). Render `<Spinner data-icon="inline-start" />` inside the button when you want an explicit glyph. Spinner is look-only — no machine.

## Button Group

```tsx
<ButtonGroup>
  <Button variant="outline">Left</Button>
  <Button variant="outline">Right</Button>
</ButtonGroup>
```

Look-only attached buttons via `data-scope="button-group"`. `orientation` is `"horizontal"` (default) or `"vertical"`.

## API Reference

### Look (not machine props)

| Prop / attr | Type | Default |
| --- | --- | --- |
| `variant` / `data-variant` | `"default" \| "secondary" \| "outline" \| "ghost" \| "destructive" \| "link"` | `"default"` |
| `size` / `data-size` | `"xs" \| "sm" \| "md" \| "lg" \| "icon-xs" \| "icon-sm" \| "icon" \| "icon-lg"` | `"md"` |
| `data-icon` | `"inline-start" \| "inline-end"` | — |

### Button

| Prop | Type | Default |
| --- | --- | --- |
| `disabled` | `boolean` | `false` |
| `loading` | `boolean` | `false` |
| `focusableWhenDisabled` | `boolean` | `false` |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` |
| `onPress` | `() => void` | — |
| `render` (React) | `ReactElement \| function` | — |
| `as` (Vue / Svelte) | `"button" \| "a"` | `"button"` |

### ButtonGroup

| Prop | Type | Default |
| --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` |

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

All of those names publish to npm. `@kimak/tailwind` is adapter-agnostic. `@kimak/ui-*` Button binds press motion from `@kimak/motion-gsap`. Do not put `gsap` in core or headless. Headless consumers can still call `animateButton(scope)` themselves.

The portable contract is `connect(service, normalize)`, not JSX. `connect()` emits a React-shaped DOM dialect (`onClick`, `htmlFor`, callback `ref`). A future adapter remaps those keys with `createNormalizer` and binds the service with the equivalent of `useMachine`. Compound `render` / portal / context stay in the adapter. Product sugar is per adapter, never in `@kimak/core`.

## Current catalog

- **Button** — press, disabled, loading, `data-size` / `data-variant`, optional GSAP press motion
- **Spinner** — look-only busy glyph (Tailwind keyframes)
- **Button Group** — look-only attached buttons

Do not add Checkbox, Dialog, DatePicker, Command, or Toast until Button is proven and the form / disclosure / overlay / menu / selection families exist.

## Scripts

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm dev
pnpm changeset
```

## Publishing

`@kimak/*` packages publish to the public npm registry from GitHub Actions (`.github/workflows/release.yml`) with Changesets and [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/).

1. Record the change: `pnpm changeset`
2. Merge to `main`. The Release workflow opens a Version Packages PR.
3. Merge that PR. CI packs and publishes, then creates GitHub releases.

In the repo: Settings → Actions → General → enable **Allow GitHub Actions to create and approve pull requests**. The `kimak-lab` org currently blocks that for `github-actions[bot]`; an org admin must allow it, or add a repo secret `CHANGESETS_TOKEN` (classic PAT with `repo` scope) so the Version Packages PR still opens.

### First publish

Trusted publishers attach to packages that already exist. After the Version Packages PR lands on `main` (versions become `0.1.0`), bootstrap once with an npm owner login — do not publish `0.0.0`:

```bash
npm login
pnpm release
```

Then on each package at npmjs.com → Package settings → Trusted Publisher:

- Organization or user: `kimak-lab`
- Repository: `kimak`
- Workflow filename: `release.yml`
- Allowed action: `npm publish`

Later releases use OIDC from `release.yml`. No `NPM_TOKEN` secret.
