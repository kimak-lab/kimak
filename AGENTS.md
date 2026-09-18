# Kimak agent notes

Headless, React-first, kernel plus thin adapter. Read this before adding a component.

## Locked product decisions

- Kimak is headless. If a className, hex color, or theme token lands in `@kimak/core` or `@kimak/headless-react`, it is a bug. The one exception is visually-hidden styles on form `hiddenInput`.
- Look lives only in `@kimak/tailwind` (optional plugin). Hex, CSS variables, and component recipes are allowed there. They must target anatomy selectors, never leak into machines.
- The public styling API is `data-scope`, `data-slot`, and `data-state`. Treat those as semver. Visual size is `data-size` on the host (`sm` | `md` | `lg`); button look is `data-variant`. Neither is a machine prop.
- React is the first adapter, not the source of behavior. State lives in `@kimak/core` machines. React hooks only bind `connect()`.
- Do not add Vue, Svelte, or HTML **component ports** until Checkbox and Dialog are boring on React 19. Adapter **scaffolding** (packages, `useMachine`, `normalizeProps`, playgrounds) may land earlier; full Button/Checkbox/Dialog ports stay gated.
- Do not start DatePicker, Command, or Toast until the form / disclosure / overlay / menu / selection families exist.

## Package graph

`@kimak/spec` → `@kimak/core` → adapters (`@kimak/headless-react` now; `@kimak/headless-vue`, `@kimak/headless-svelte` scaffolded) → product sugar (`@kimak/ui-react` now; `@kimak/ui-vue`, `@kimak/ui-svelte` scaffolded)

`@kimak/spec` → `@kimak/tailwind` (optional look; `@plugin` in the consumer CSS)

Directories state the layer first, then the framework:

```
packages/spec
packages/core
packages/tailwind
packages/headless/react   → @kimak/headless-react
packages/headless/vue     → @kimak/headless-vue
packages/headless/svelte  → @kimak/headless-svelte
packages/ui/react         → @kimak/ui-react
packages/ui/vue           → @kimak/ui-vue
packages/ui/svelte        → @kimak/ui-svelte
```

npm names use a hyphen (`@kimak/headless-react`) because a slash after the scope is a subpath, not a package. Future adapters sit beside React: `packages/headless/vue`, `packages/ui/svelte`.

- Spec is the source of truth for docs, types, and a11y tests. JSX is not.
- Core `connect(service, normalize)` yields props per part. Adapters pass a `NormalizeProps` map from `createNormalizer`.
- `connect()` emits a React-shaped DOM dialect (`onClick`, `htmlFor`, object `style`, callback `ref`). Remap in the adapter, not in the machine.
- React 19: `ref` is a prop. No `forwardRef`. Compound parts. `render` + `mergeProps` on Trigger and Root (Base UI composition, not Radix `asChild`). Composition APIs (`render`, `as`, snippets) are adapter-local and not a portable contract.
- `@kimak/tailwind` maps `anatomy.selector` to CSS. It must not depend on React.
- Product sugar (`<Checkbox>Label</Checkbox>`) lives in `@kimak/ui-react`, not `@kimak/core` or `@kimak/headless-react`. Vue/Svelte will get their own sugar packages later. Default check/dash glyphs are CSS in `@kimak/tailwind` (`:empty::after`) so every adapter inherits them.

## Adapter contract

The portable surface is `@kimak/spec` + `connect()`. A future Vue/Svelte adapter must:

1. Bind `createService` to the framework store (React: `useMachine` / `useSyncExternalStore`).
2. Pass `createNormalizer` (identity on React; remap keys on Vue/Svelte).
3. Render compound parts. Spec parts with `owner: "adapter"` (Dialog `portal`) are not emitted by `connect()`.
4. Keep look out of the adapter. No `className`, hex, or tokens except `visuallyHiddenStyle` on form `hiddenInput` (core).
5. Prove the adapter with spec keyboard / ARIA / `data-state` tests, not JSX snapshots.

Do not add Vue, Svelte, or HTML **component packages** in this pass. Copy `packages/headless/react` (`use-machine`, `normalize-props`, portal/presence) when porting Checkbox and Dialog to Vue/Svelte after they are boring on React 19.

## Adding a component

1. Write the spec and anatomy in `@kimak/spec`.
2. Write the machine + `connect()` in `@kimak/core`. Type `*Api<T extends PropTypes>` so adapters substitute vnode props.
3. Write a thin compound shell in `@kimak/headless-react`.
4. Add keyboard / ARIA / `data-state` tests. No pixel snapshots of look.
5. Add recipes in `@kimak/tailwind` that target the new anatomy selectors.
6. Playground chrome stays in `apps/playground`. Component look lives in the plugin.
7. Optional product sugar in `@kimak/ui-react`. Do not put default trees in core.

## Exhaustive events

Switch over machine events with a `never` default so a new event fails typecheck until handled.
