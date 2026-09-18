<script lang="ts">
  import type { Snippet } from "svelte";
  import { getContext } from "svelte";
  import { applyCallbackRef, omitRef } from "../dom-props";
  import { mergeProps } from "../merge-props";
  import { DIALOG_KEY, type DialogContextValue } from "./context";

  let { children, ...rest }: { children?: Snippet } & Record<string, unknown> = $props();
  const ctx = getContext<DialogContextValue>(DIALOG_KEY);
  if (!ctx) {
    throw new Error("[kimak] Dialog parts must be wrapped in Dialog.Root");
  }

  let node = $state<HTMLHeadingElement | undefined>();
  const merged = $derived(mergeProps(ctx.getApi().getTitleProps(), rest));
  $effect(() => {
    applyCallbackRef(node ?? null, merged);
  });
</script>

<h2 bind:this={node} {...omitRef(merged)}>{@render children?.()}</h2>
