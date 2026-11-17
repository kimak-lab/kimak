<script lang="ts">
  import { shouldMount, trackPopover } from "@kimak/core";
  import type { Snippet } from "svelte";
  import { tick } from "svelte";
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
  const { getApi, service } = usePopoverContext();

  let node = $state<HTMLElement | undefined>();
  const api = $derived(getApi());
  const open = $derived(api.open);
  const merged = $derived(mergeProps(api.getPositionerProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });

  // Child ref effects (content) are not guaranteed to run before this one when
  // the popover reopens, so wait a tick before `trackPopover` reads the refs.
  $effect(() => {
    if (!open) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    void tick().then(() => {
      if (!cancelled) cleanup = trackPopover(service);
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  });
</script>

{#if shouldMount({ present: open, forceMount })}
  <svelte:element this={as} bind:this={node} {...omitRef(merged)}>{@render children?.()}</svelte:element>
{/if}
