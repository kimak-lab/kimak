<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";
  import { buttonGroupAttrs, type ButtonGroupOrientation } from "./button-group-attrs";

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

<div {...look} {...props}>{@render children?.()}</div>
