---
"@kimak/spec": minor
"@kimak/core": minor
"@kimak/headless-react": minor
"@kimak/tailwind": minor
"@kimak/ui-react": minor
---

Add Popover, the first overlay component (React only for now).

- `@kimak/spec`: `popoverSpec` and `popoverAnatomy` (trigger, positioner, content, title, description, close).
- `@kimak/core`: `createPopoverMachine`, `connectPopover`, `trackPopover` (dismiss, focus, positioning), plus `computePosition` / `autoUpdate` in platform with flip and shift, no floating-ui dependency.
- `@kimak/headless-react`: compound `Popover` parts and `usePopover`.
- `@kimak/tailwind`: popover recipe targeting the anatomy selectors.
- `@kimak/ui-react`: `Popover` sugar where `Popover.Content` bundles portal, positioner and content; `popoverContentAttrs()`.
