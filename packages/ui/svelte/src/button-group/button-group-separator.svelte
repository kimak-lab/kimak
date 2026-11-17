<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { buttonGroupSeparatorAttrs, type ButtonGroupOrientation } from "./button-group-attrs";

  // Orientation defaults to `vertical`, the divider for a horizontal group.
  let {
    orientation = "vertical",
    ...props
  }: HTMLAttributes<HTMLDivElement> & {
    orientation?: ButtonGroupOrientation;
  } = $props();

  const look = $derived(buttonGroupSeparatorAttrs({ orientation }));
</script>

<div {...look} role="separator" aria-orientation={orientation} {...props}></div>
