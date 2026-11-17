---
"@kimak/spec": minor
"@kimak/tailwind": minor
"@kimak/ui-react": minor
"@kimak/ui-vue": minor
"@kimak/ui-svelte": minor
---

Complete Button Group: separator and text parts, `role="group"`, and joins for any direct child.

- `@kimak/spec`: `buttonGroupAnatomy` adds `separator` and `text` parts.
- `@kimak/tailwind`: the recipe joins every direct child (Button, `input`, popover trigger, text, nested group) with child combinators, so wrapped buttons and nested groups keep their own corners. Nested groups get a gap. Horizontal groups stretch children to one height. Adds separator and text looks.
- `@kimak/ui-*`: `ButtonGroup` renders `role="group"`. New `ButtonGroupSeparator` (`role="separator"`, `aria-orientation`, default `vertical`) and `ButtonGroupText` (React `render`, Vue/Svelte `as`). New look helpers `buttonGroupSeparatorAttrs()` and `buttonGroupTextAttrs()`.
