# @kimak/ui-react

## 0.1.0

### Minor Changes

- [`3bd590b`](https://github.com/kimak-lab/kimak/commit/3bd590b8a2b61f5a424acd374339d0ef21065603) Thanks [@triadmoko](https://github.com/triadmoko)! - Complete Button Group: separator and text parts, `role="group"`, and joins for any direct child.
  
  - `@kimak/spec`: `buttonGroupAnatomy` adds `separator` and `text` parts.
  - `@kimak/tailwind`: the recipe joins every direct child (Button, `input`, popover trigger, text, nested group) with child combinators, so wrapped buttons and nested groups keep their own corners. Nested groups get a gap. Horizontal groups stretch children to one height. Adds separator and text looks.
  - `@kimak/ui-*`: `ButtonGroup` renders `role="group"`. New `ButtonGroupSeparator` (`role="separator"`, `aria-orientation`, default `vertical`) and `ButtonGroupText` (React `render`, Vue/Svelte `as`). New look helpers `buttonGroupSeparatorAttrs()` and `buttonGroupTextAttrs()`.

- [`8054914`](https://github.com/kimak-lab/kimak/commit/8054914776f754d745b2a0f8d3abf5ac4250722f) Thanks [@triadmoko](https://github.com/triadmoko)! - First public release of the Kimak Button catalog: spec, core, React/Vue/Svelte adapters, product sugar, and Tailwind plugin.

- [`0b47d66`](https://github.com/kimak-lab/kimak/commit/0b47d66460022e7b39d70ad9db35bba1a7de709f) Thanks [@triadmoko](https://github.com/triadmoko)! - Add Popover, the first overlay component (React only for now).
  
  - `@kimak/spec`: `popoverSpec` and `popoverAnatomy` (trigger, positioner, content, title, description, close).
  - `@kimak/core`: `createPopoverMachine`, `connectPopover`, `trackPopover` (dismiss, focus, positioning), plus `computePosition` / `autoUpdate` in platform with flip and shift, no floating-ui dependency.
  - `@kimak/headless-react`: compound `Popover` parts and `usePopover`.
  - `@kimak/tailwind`: popover recipe targeting the anatomy selectors.
  - `@kimak/ui-react`: `Popover` sugar where `Popover.Content` bundles portal, positioner and content; `popoverContentAttrs()`.

### Patch Changes

- Updated dependencies [[`8054914`](https://github.com/kimak-lab/kimak/commit/8054914776f754d745b2a0f8d3abf5ac4250722f), [`0b47d66`](https://github.com/kimak-lab/kimak/commit/0b47d66460022e7b39d70ad9db35bba1a7de709f)]:
  - @kimak/headless-react@0.1.0
