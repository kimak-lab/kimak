<script lang="ts">
  import { getContext } from "svelte";
  import { applyCallbackRef, omitRef } from "../dom-props";
  import { mergeProps } from "../merge-props";
  import { DIALOG_KEY, type DialogContextValue } from "./context";

  let { ...rest }: Record<string, unknown> = $props();
  const ctx = getContext<DialogContextValue>(DIALOG_KEY);
  if (!ctx) {
    throw new Error("[kimak] Dialog parts must be wrapped in Dialog.Root");
  }

  let node = $state<HTMLDivElement | undefined>();
  const merged = $derived(mergeProps(ctx.getApi().getBackdropProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });
</script>

<div bind:this={node} {...omitRef(merged)}></div>
