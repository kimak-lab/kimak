<script lang="ts">
  import { shouldMount } from "@kimak/core";
  import type { Snippet } from "svelte";
  import { applyCallbackRef, omitRef } from "../dom-props";
  import { mergeProps } from "../merge-props";
  import { usePopoverContext } from "./context";

  let {
    children,
    as = "div",
    forceMount = false,
    ...rest
  }: { children?: Snippet; as?: string; forceMount?: boolean } & Record<string, unknown> =
    $props();
  const { getApi } = usePopoverContext();

  let node = $state<HTMLElement | undefined>();
  const api = $derived(getApi());
  const merged = $derived(mergeProps(api.getContentProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });
</script>

{#if shouldMount({ present: api.open, forceMount })}
  <svelte:element this={as} bind:this={node} {...omitRef(merged)}>{@render children?.()}</svelte:element>
{/if}
