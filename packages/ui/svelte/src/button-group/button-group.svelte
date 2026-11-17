<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { buttonGroupAttrs, type ButtonGroupOrientation } from "./button-group-attrs";

  // Groups related action buttons. Label it with `aria-label` or `aria-labelledby`.
  let {
    children,
    orientation,
    ...props
  }: HTMLAttributes<HTMLDivElement> & {
    children?: Snippet;
    orientation?: ButtonGroupOrientation;
  } = $props();

  const look = $derived(buttonGroupAttrs({ orientation }));
</script>

<div {...look} role="group" {...props}>{@render children?.()}</div>
