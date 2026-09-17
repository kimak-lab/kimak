# Kimak agent notes

Headless, React-first, kernel plus thin adapter. Read this before adding a component.

## Locked product decisions

- Kimak is headless. If a className, hex color, or theme token lands in `@kimak/core` or `@kimak/react`, it is a bug. The one exception is visually-hidden styles on form `hiddenInput`.
- Look lives only in `@kimak/tailwind` (optional plugin). Hex, CSS variables, and component recipes are allowed there. They must target anatomy selectors, never leak into machines.
- The public styling API is `data-scope`, `data-slot`, and `data-state`. Treat those as semver. Visual size is `data-size` on the host (`sm` | `md` | `lg`); it is not a machine prop.
- React is the first adapter, not the source of behavior. State lives in `@kimak/core` machines. React hooks only bind `connect()`.
- Do not add Vue, Svelte, or HTML adapters until Checkbox and Dialog are boring on React 19. The Tailwind look plugin is allowed now because it is adapter-agnostic.
- Do not start DatePicker, Command, or Toast until the form / disclosure / overlay / menu / selection families exist.

## Package graph

`@kimak/spec` → `@kimak/core` → adapters (`@kimak/react` now; Vue/Svelte later)

`@kimak/spec` → `@kimak/tailwind` (optional look; `@plugin` in the consumer CSS)

- Spec is the source of truth for docs, types, and a11y tests. JSX is not.
- Core `connect(service, normalize)` yields props per part. Adapters pass a `normalize` map.
- React 19: `ref` is a prop. No `forwardRef`. Compound parts. `render` + `mergeProps` on Trigger and Root (Base UI composition, not Radix `asChild`).
- `@kimak/tailwind` maps `anatomy.selector` to CSS. It must not depend on React.

## Adding a component

1. Write the spec and anatomy in `@kimak/spec`.
2. Write the machine + `connect()` in `@kimak/core`.
3. Write a thin compound shell in `@kimak/react`.
4. Add keyboard / ARIA / `data-state` tests. No pixel snapshots of look.
5. Add recipes in `@kimak/tailwind` that target the new anatomy selectors.
6. Playground chrome stays in `apps/playground`. Component look lives in the plugin.

## Exhaustive events

Switch over machine events with a `never` default so a new event fails typecheck until handled.
