# Kimak agent notes

Headless, React-first, kernel plus thin adapter. Read this before adding a component.

## Locked product decisions

- Kimak is headless. If a className, hex color, or theme token lands in `@kimak/core`, it is a bug. The one exception is visually-hidden styles on form `hiddenInput`.
- The public styling API is `data-scope`, `data-slot`, and `data-state`. Treat those as semver.
- React is the first adapter, not the source of behavior. State lives in `@kimak/core` machines. React hooks only bind `connect()`.
- Do not add Vue, Svelte, HTML, or a styled preset until Checkbox and Dialog are boring on React 19.
- Do not start DatePicker, Command, or Toast until the form / disclosure / overlay / menu / selection families exist.

## Package graph

`@kimak/spec` → `@kimak/core` → `@kimak/react`

- Spec is the source of truth for docs, types, and a11y tests. JSX is not.
- Core `connect(service, normalize)` yields props per part. Adapters pass a `normalize` map.
- React 19: `ref` is a prop. No `forwardRef`. Compound parts. `asChild` + `mergeProps` on Trigger and Root.

## Adding a component

1. Write the spec and anatomy in `@kimak/spec`.
2. Write the machine + `connect()` in `@kimak/core`.
3. Write a thin compound shell in `@kimak/react`.
4. Add keyboard / ARIA / `data-state` tests. No pixel snapshots of look.
5. Add a playground example whose CSS stays in `apps/playground`.

## Exhaustive events

Switch over machine events with a `never` default so a new event fails typecheck until handled.
