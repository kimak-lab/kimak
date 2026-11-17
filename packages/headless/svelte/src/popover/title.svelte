<script lang="ts">
  import type { Snippet } from "svelte";
  import { applyCallbackRef, omitRef } from "../dom-props";
  import { mergeProps } from "../merge-props";
  import { usePopoverContext } from "./context";

  let {
    children,
    as = "h2",
    ...rest
  }: { children?: Snippet; as?: string } & Record<string, unknown> = $props();
  const { getApi } = usePopoverContext();

  let node = $state<HTMLElement | undefined>();
  const merged = $derived(mergeProps(getApi().getTitleProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });
</script>

<svelte:element this={as} bind:this={node} {...omitRef(merged)}>{@render children?.()}</svelte:element>
