<script lang="ts">
  import { Checkbox, type CheckboxRootProps } from "@kimak/headless-svelte";
  import type { Snippet } from "svelte";

  let {
    children,
    indicator,
    ...props
  }: CheckboxRootProps & { children?: Snippet; indicator?: Snippet } = $props();
</script>

<Checkbox.Root {...props}>
  <Checkbox.Control>
    <Checkbox.Indicator>{@render indicator?.()}</Checkbox.Indicator>
  </Checkbox.Control>
  {#if children}
    <Checkbox.Label>{@render children()}</Checkbox.Label>
  {/if}
  <Checkbox.HiddenInput />
</Checkbox.Root>
