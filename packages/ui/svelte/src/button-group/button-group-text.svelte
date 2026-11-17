<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes, HTMLLabelAttributes } from "svelte/elements";
  import { buttonGroupTextAttrs } from "./button-group-attrs";

  // `as="label"` with `for` labels an input in the group.
  let {
    children,
    as = "div",
    ...props
  }: HTMLAttributes<HTMLElement> &
    Pick<HTMLLabelAttributes, "for"> & {
      children?: Snippet;
      as?: string;
    } = $props();

  const look = buttonGroupTextAttrs();
</script>

<svelte:element this={as} {...look} {...props}>{@render children?.()}</svelte:element>
