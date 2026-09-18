<script lang="ts">
  import { Checkbox as Parts, type CheckboxRootProps } from "@kimak/headless-svelte";
  import type { Snippet } from "svelte";

  let {
    children,
    indicator,
    ...props
  }: CheckboxRootProps & { children?: Snippet; indicator?: Snippet } = $props();
</script>

<Parts.Root {...props}>
  <Parts.Control>
    <Parts.Indicator>{@render indicator?.()}</Parts.Indicator>
  </Parts.Control>
  {#if children}
    <Parts.Label>{@render children()}</Parts.Label>
  {/if}
  <Parts.HiddenInput />
</Parts.Root>
